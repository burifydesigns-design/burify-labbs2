"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type InvoiceActionResult = {
  ok: boolean;
  link?: string;
  invoiceNumber?: string;
  emailStatus?: "sent" | "failed";
  emailMessage?: string;
  error?: string;
};

type AdminClient = ReturnType<typeof createAdminClient>;

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] as string);
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100);
}

async function sendInvoiceEmail(admin: AdminClient, invoiceId: string, token: string) {
  const { data: invoice, error: invoiceError } = await admin.from("invoices")
    .select("id,invoice_number,currency,total_amount,amount_paid,balance_due,description,due_at,customers(name,email,company_name),invoice_items(description,quantity,total_amount)")
    .eq("id", invoiceId).maybeSingle();
  if (invoiceError || !invoice) return { ok: false as const, error: "Invoice could not be loaded for email delivery." };

  const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
  const recipient = String(customer?.email ?? "").trim().toLowerCase();
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { ok: false as const, error: "The customer does not have a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com").replace(/\/$/, "");
  const invoiceUrl = `${base}/invoice/${token}`;
  const amount = formatMoney(Number(invoice.total_amount), invoice.currency);
  const balance = formatMoney(Number(invoice.balance_due), invoice.currency);
  const dueDate = invoice.due_at ? new Date(invoice.due_at).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" }) : "As agreed";
  const items = Array.isArray(invoice.invoice_items) ? invoice.invoice_items : [];
  const itemRows = items.map((item: { description: string; quantity: number; total_amount: number }) =>
    `<tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#334155;">${escapeHtml(item.description)}${Number(item.quantity) > 1 ? ` × ${Number(item.quantity)}` : ""}</td><td align="right" style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:600;">${escapeHtml(formatMoney(Number(item.total_amount), invoice.currency))}</td></tr>`
  ).join("");
  const customerName = escapeHtml(customer?.name || "there");
  const subject = `Your Burify invoice ${invoice.invoice_number}`;
  const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;"><div style="max-width:600px;margin:32px auto;padding:32px 24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;"><div style="font-size:20px;font-weight:800;letter-spacing:2px;color:#0f172a;">BURIFY</div><p style="margin:28px 0 8px;color:#64748b;font-size:12px;letter-spacing:1.5px;font-weight:700;">INVOICE ${escapeHtml(invoice.invoice_number)}</p><h1 style="font-size:24px;margin:0 0 16px;">Your invoice is ready</h1><p style="line-height:1.6;color:#475569;">Hello ${customerName},</p><p style="line-height:1.6;color:#475569;">Thank you for choosing Burify. Your invoice is ready to view. Use the secure link below to review the details and make a payment if a balance is due.</p><table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;">${itemRows}<tr><td style="padding:16px 0;color:#64748b;">Invoice total</td><td align="right" style="padding:16px 0;font-weight:700;">${escapeHtml(amount)}</td></tr><tr><td style="padding:0 0 16px;color:#64748b;">Balance due</td><td align="right" style="padding:0 0 16px;font-size:20px;font-weight:800;">${escapeHtml(balance)}</td></tr></table><p style="color:#64748b;font-size:13px;">Due date: ${escapeHtml(dueDate)}</p><p style="margin:28px 0;"><a href="${escapeHtml(invoiceUrl)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700;">View invoice & payment details</a></p><p style="font-size:13px;line-height:1.6;color:#64748b;">If the button does not work, copy this link into your browser:<br><a style="color:#4f46e5;word-break:break-all;" href="${escapeHtml(invoiceUrl)}">${escapeHtml(invoiceUrl)}</a></p><p style="margin-top:28px;line-height:1.6;color:#475569;">Regards,<br><strong>Burify Solutions</strong><br><a href="https://burifylabs.com" style="color:#4f46e5;">burifylabs.com</a></p></div></body></html>`;
  const text = `Hello ${customer?.name || "there"},\n\nYour Burify invoice ${invoice.invoice_number} is ready.\nInvoice total: ${amount}\nBalance due: ${balance}\nDue date: ${dueDate}\n\nView invoice and payment details: ${invoiceUrl}\n\nRegards,\nBurify Solutions\nhttps://burifylabs.com`;

  const { data: log, error: logError } = await admin.from("invoice_email_logs").insert({
    invoice_id: invoice.id, recipient_email: recipient, status: "pending",
  }).select("id").single();
  if (logError || !log) return { ok: false as const, error: "Could not record the invoice email attempt." };
  if (!apiKey || !from) {
    const message = "Email is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL in Vercel.";
    await admin.from("invoice_email_logs").update({ status: "failed", error_message: message }).eq("id", log.id);
    return { ok: false as const, error: message };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `invoice-${log.id}`,
      },
      body: JSON.stringify({ from, to: [recipient], subject, html, text }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => ({})) as { id?: string; message?: string; name?: string };
    if (!response.ok || !payload.id) {
      const safeError = response.status === 401 || response.status === 403
        ? "Email provider rejected the API credentials or sender address."
        : (payload.message || "Email provider could not accept the message.").slice(0, 500);
      await admin.from("invoice_email_logs").update({ status: "failed", error_message: safeError }).eq("id", log.id);
      return { ok: false as const, error: safeError };
    }
    const sentAt = new Date().toISOString();
    await admin.from("invoice_email_logs").update({
      status: "sent", provider_message_id: payload.id, sent_at: sentAt, error_message: null,
    }).eq("id", log.id);
    await admin.from("invoices").update({ status: "sent", sent_at: sentAt, updated_at: sentAt }).eq("id", invoice.id);
    return { ok: true as const, recipient };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 400) : "Unknown email delivery error.";
    await admin.from("invoice_email_logs").update({ status: "failed", error_message: message }).eq("id", log.id);
    return { ok: false as const, error: "Email delivery failed. The invoice is saved; you can retry sending it." };
  }
}

export async function createInvoice(formData: FormData): Promise<InvoiceActionResult> {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { ok: false, error: "Administrator access is required." };

  const name = String(formData.get("customer_name") || "").trim().slice(0, 160);
  const email = String(formData.get("customer_email") || "").trim().toLowerCase();
  const company = String(formData.get("company_name") || "").trim().slice(0, 180);
  const description = String(formData.get("description") || "").trim().slice(0, 500);
  const currency = String(formData.get("currency") || "KES");
  const amountText = String(formData.get("amount") || "").trim();
  const dueDate = String(formData.get("due_at") || "").trim();
  const parsedDueDate = dueDate ? new Date(`${dueDate}T23:59:59.000Z`) : null;
  const amountMajor = Number(amountText);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !description || !["KES", "USD"].includes(currency) || !Number.isFinite(amountMajor) || amountMajor <= 0 || amountMajor > 100000000 || (parsedDueDate && Number.isNaN(parsedDueDate.getTime()))) {
    return { ok: false, error: "Check the customer, description, currency and amount." };
  }
  const amount = Math.round(amountMajor * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const admin = createAdminClient();
  let { data: customer } = await admin.from("customers").select("id").eq("email", email).maybeSingle();
  if (!customer) {
    const { data, error } = await admin.from("customers").insert({ name, email, company_name: company || null }).select("id").single();
    if (error || !data) return { ok: false, error: "Could not create the customer record." };
    customer = data;
  } else {
    const { error } = await admin.from("customers").update({ name, email, company_name: company || null, updated_at: new Date().toISOString() }).eq("id", customer.id);
    if (error) return { ok: false, error: "Could not update the customer record." };
  }

  const token = randomBytes(32).toString("hex");
  const invoiceNumber = `BUR-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const { data: invoice, error: invoiceError } = await admin.from("invoices").insert({
    customer_id: customer.id,
    invoice_number: invoiceNumber,
    public_token_hash: createHash("sha256").update(token).digest("hex"),
    currency,
    subtotal_amount: amount,
    total_amount: amount,
    status: "sent",
    description,
    due_at: parsedDueDate ? parsedDueDate.toISOString() : null,
  }).select("id").single();
  if (invoiceError || !invoice) return { ok: false, error: "Could not create the invoice." };

  const { error: itemError } = await admin.from("invoice_items").insert({
    invoice_id: invoice.id, description, quantity: 1, unit_amount: amount,
  });
  if (itemError) {
    await admin.from("invoices").delete().eq("id", invoice.id);
    return { ok: false, error: "Could not add the invoice line item." };
  }

  const emailResult = await sendInvoiceEmail(admin, invoice.id, token);
  revalidatePath("/admin/payments");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com").replace(/\/$/, "");
  return {
    ok: true,
    invoiceNumber,
    link: `${base}/invoice/${token}`,
    emailStatus: emailResult.ok ? "sent" : "failed",
    emailMessage: emailResult.ok
      ? `Invoice emailed to ${emailResult.recipient}.`
      : `Invoice created, but email was not sent: ${emailResult.error}`,
  };
}

export async function resendInvoiceEmail(formData: FormData): Promise<void> {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin/login?error=unauthorized");

  const invoiceId = String(formData.get("invoice_id") || "");
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId)) redirect("/admin/payments?emailFailed=1");
  const admin = createAdminClient();
  const { data: invoice } = await admin.from("invoices").select("id,public_token_hash").eq("id", invoiceId).maybeSingle();
  if (!invoice) redirect("/admin/payments?emailFailed=1");

  const token = randomBytes(32).toString("hex");
  const nextHash = createHash("sha256").update(token).digest("hex");
  const { error: rotateError } = await admin.from("invoices").update({ public_token_hash: nextHash, updated_at: new Date().toISOString() }).eq("id", invoiceId);
  if (rotateError) redirect("/admin/payments?emailFailed=1");

  const result = await sendInvoiceEmail(admin, invoiceId, token);
  if (!result.ok) {
    await admin.from("invoices").update({ public_token_hash: invoice.public_token_hash, updated_at: new Date().toISOString() }).eq("id", invoiceId);
    revalidatePath("/admin/payments");
    redirect("/admin/payments?emailFailed=1");
  }
  revalidatePath("/admin/payments");
  redirect("/admin/payments?emailSent=1");
}

export async function recordManualPayment(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { ok: false, error: "Administrator access is required." };

  const invoiceId = String(formData.get("invoice_id") || "");
  const amountMajor = Number(String(formData.get("amount") || ""));
  const channel = String(formData.get("channel") || "manual").slice(0, 80);
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId) || !Number.isFinite(amountMajor) || amountMajor <= 0 || amountMajor > 100000000) {
    return { ok: false, error: "Enter a valid invoice and payment amount." };
  }
  const amount = Math.round(amountMajor * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const admin = createAdminClient();
  const { data: invoice, error: invoiceError } = await admin.from("invoices")
    .select("id,balance_due,status").eq("id", invoiceId).maybeSingle();
  if (invoiceError || !invoice) return { ok: false, error: "Invoice not found." };
  if (["draft", "cancelled", "paid"].includes(invoice.status) || amount > Number(invoice.balance_due)) {
    return { ok: false, error: "The amount exceeds the invoice balance or the invoice is not payable." };
  }
  const { error } = await admin.rpc("record_manual_invoice_payment", {
    p_invoice_id: invoiceId,
    p_amount: amount,
    p_channel: channel,
    p_recorded_by: user.id,
    p_reference: `MANUAL-${randomUUID().replace(/-/g, "")}`,
  });
  if (error) return { ok: false, error: "Could not record the payment. Refresh the invoice and try again." };
  revalidatePath("/admin/payments");
  return { ok: true };
}
