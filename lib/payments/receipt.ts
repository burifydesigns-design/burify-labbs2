import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] as string);
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100);
}

export async function sendPaymentReceipt(reference: string, retryFailed = false) {
  const admin = createAdminClient();
  const { data: payment, error: paymentError } = await admin.from("payments")
    .select("id,reference,amount,currency,paid_at,channel,invoices(invoice_number),customers(name,email)")
    .eq("reference", reference).eq("provider", "paystack").eq("status", "success").maybeSingle();
  if (paymentError || !payment) return { sent: false, error: "Verified payment record could not be loaded." };

  const customer = Array.isArray(payment.customers) ? payment.customers[0] : payment.customers;
  const invoice = Array.isArray(payment.invoices) ? payment.invoices[0] : payment.invoices;
  const recipient = String(customer?.email ?? "").trim().toLowerCase();
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { sent: false, error: "Customer email address is missing or invalid." };
  }

  const { data: createdLog, error: insertError } = await admin.from("payment_receipt_logs")
    .insert({ payment_id: payment.id, recipient_email: recipient, status: "pending", attempt_count: 1 })
    .select("id").maybeSingle();

  let logId = createdLog?.id;
  if (insertError || !logId) {
    const { data: existing } = await admin.from("payment_receipt_logs")
      .select("id,status").eq("payment_id", payment.id).maybeSingle();
    if (!existing) return { sent: false, error: "Could not create the payment receipt log." };
    if (existing.status === "sent") return { sent: true, alreadySent: true };
    if (!retryFailed || existing.status !== "failed") {
      return { sent: false, skipped: true, error: "A receipt attempt is already recorded; no duplicate email was sent." };
    }
    const { data: claimed, error: claimError } = await admin.from("payment_receipt_logs")
      .update({ status: "pending", error_message: null, attempt_count: 2, updated_at: new Date().toISOString() })
      .eq("id", existing.id).eq("status", "failed").select("id").maybeSingle();
    if (claimError || !claimed) return { sent: false, skipped: true, error: "Receipt retry is already in progress." };
    logId = claimed.id;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    const message = "Payment is confirmed, but receipt email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.";
    await admin.from("payment_receipt_logs").update({ status: "failed", error_message: message, updated_at: new Date().toISOString() }).eq("id", logId);
    return { sent: false, error: message };
  }

  const currency = payment.currency;
  const amount = money(Number(payment.amount), currency);
  const customerName = escapeHtml(customer?.name || "there");
  const invoiceNumber = escapeHtml(invoice?.invoice_number || "your invoice");
  const paidAt = payment.paid_at ? new Date(payment.paid_at).toLocaleString("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC" : "Confirmed";
  const subject = `Payment received — Burify invoice ${invoice?.invoice_number || ""}`.trim();
  const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;"><div style="max-width:600px;margin:32px auto;padding:32px 24px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;"><div style="font-size:20px;font-weight:800;letter-spacing:2px;">BURIFY</div><h1 style="font-size:24px;margin:28px 0 12px;">Payment confirmed</h1><p style="line-height:1.6;color:#475569;">Hello ${customerName}, we have verified your payment. Thank you for choosing Burify.</p><table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;"><tr><td style="padding:12px 0;color:#64748b;">Invoice</td><td align="right" style="font-weight:700;">${invoiceNumber}</td></tr><tr><td style="padding:12px 0;color:#64748b;">Amount received</td><td align="right" style="font-size:20px;font-weight:800;">${escapeHtml(amount)}</td></tr><tr><td style="padding:12px 0;color:#64748b;">Payment reference</td><td align="right" style="font-size:12px;">${escapeHtml(payment.reference)}</td></tr><tr><td style="padding:12px 0;color:#64748b;">Date</td><td align="right">${escapeHtml(paidAt)}</td></tr></table><p style="color:#64748b;font-size:13px;">This receipt confirms a payment verified by Paystack. If you have questions, contact Burify through <a href="https://burifylabs.com/contact">burifylabs.com/contact</a>.</p><p style="margin-top:28px;">Regards,<br><strong>Burify Solutions</strong></p></div></body></html>`;
  const text = `Hello ${customer?.name || "there"},\n\nYour payment has been verified.\nInvoice: ${invoice?.invoice_number || "—"}\nAmount received: ${amount}\nReference: ${payment.reference}\nDate: ${paidAt}\n\nThank you for choosing Burify.\nBurify Solutions\nhttps://burifylabs.com`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `payment-receipt-${payment.id}` },
      body: JSON.stringify({ from, to: [recipient], subject, html, text }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => ({})) as { id?: string; message?: string };
    if (!response.ok || !payload.id) {
      const message = response.status === 401 || response.status === 403
        ? "Resend rejected the API credentials or sender address."
        : (payload.message || "Resend could not accept the receipt.").slice(0, 400);
      await admin.from("payment_receipt_logs").update({ status: "failed", error_message: message, updated_at: new Date().toISOString() }).eq("id", logId);
      return { sent: false, error: message };
    }
    await admin.from("payment_receipt_logs").update({
      status: "sent", provider_message_id: payload.id, sent_at: new Date().toISOString(),
      error_message: null, updated_at: new Date().toISOString(),
    }).eq("id", logId);
    return { sent: true, recipient };
  } catch {
    const message = "Receipt email delivery failed. Payment remains confirmed; retry from the admin dashboard.";
    await admin.from("payment_receipt_logs").update({ status: "failed", error_message: message, updated_at: new Date().toISOString() }).eq("id", logId);
    return { sent: false, error: message };
  }
}
