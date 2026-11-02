import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaystackCallbackUrl, getPaystackMode, PaystackVerificationError, reconcilePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as { token?: unknown } | null;
    const token = typeof body?.token === "string" ? body.token : "";
    if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "Invalid invoice link." }, { status: 400 });
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (process.env.PAYMENTS_ENABLED !== "true") return NextResponse.json({ error: "Online payments are temporarily disabled. Please contact Burify." }, { status: 503 });
    if (!secret) return NextResponse.json({ error: "Online payments are not configured yet. Please contact Burify." }, { status: 503 });
    getPaystackMode();
    const callbackUrl = getPaystackCallbackUrl();

    const admin = createAdminClient();
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const { data: invoice, error } = await admin.from("invoices")
      .select("id,invoice_number,currency,balance_due,status,customer_id,customers(name,email)")
      .eq("public_token_hash", tokenHash).maybeSingle();
    if (error || !invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    if (["draft", "cancelled"].includes(invoice.status) || Number(invoice.balance_due) <= 0) {
      return NextResponse.json({ error: "This invoice is not payable." }, { status: 409 });
    }
    const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
    if (!customer?.email) return NextResponse.json({ error: "Invoice customer email is missing." }, { status: 400 });

    const { data: openAttempt } = await admin.from("payments")
      .select("reference,authorization_url,created_at").eq("invoice_id", invoice.id).eq("provider", "paystack")
      .in("status", ["pending", "processing"]).order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (openAttempt) {
      try {
        const oldTransaction = await verifyPaystackTransaction(openAttempt.reference);
        const oldResult = await reconcilePaystackTransaction(oldTransaction);
        if (oldResult.success) return NextResponse.json({ error: "This invoice has already been paid. Refresh the invoice to see the updated balance." }, { status: 409 });
        if (["failed", "abandoned", "reversed"].includes(oldTransaction.status)) {
          // Terminal remote state releases the partial unique index for a replacement checkout.
        } else if (openAttempt.authorization_url) {
          return NextResponse.json({ authorizationUrl: openAttempt.authorization_url, reused: true });
        } else {
          return NextResponse.json({ error: "A checkout session is still being prepared. Please try again shortly." }, { status: 409 });
        }
      } catch (cause) {
        const ageMs = Date.now() - new Date(openAttempt.created_at).getTime();
        if (cause instanceof PaystackVerificationError && cause.statusCode === 404 && ageMs > 30 * 60 * 1000) {
          await admin.from("payments").update({
            status: "abandoned", failure_reason: "Paystack no longer recognises this checkout reference.",
            updated_at: new Date().toISOString(),
          }).eq("reference", openAttempt.reference).in("status", ["pending", "processing"]);
        } else if (openAttempt.authorization_url) {
          return NextResponse.json({ authorizationUrl: openAttempt.authorization_url, reused: true });
        } else {
          return NextResponse.json({ error: "A checkout session is being recovered. Please retry in a moment." }, { status: 409 });
        }
      }
    }

    const reference = `BURIFY-${randomUUID().replace(/-/g, "")}`;
    const amount = Number(invoice.balance_due);
    const { error: insertError } = await admin.from("payments").insert({
      invoice_id: invoice.id, customer_id: invoice.customer_id, provider: "paystack",
      reference, amount, currency: invoice.currency, status: "pending",
    });
    if (insertError) return NextResponse.json({ error: "A payment attempt is already being prepared. Refresh and try again." }, { status: 409 });

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customer.email, amount: String(amount), currency: invoice.currency, reference,
        callback_url: callbackUrl, metadata: { invoice_id: invoice.id, invoice_number: invoice.invoice_number },
      }),
      cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json() as { status?: boolean; message?: string; data?: { authorization_url?: string } };
    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      await admin.from("payments").update({ status: "failed", failure_reason: "Checkout initialization failed", updated_at: new Date().toISOString() }).eq("reference", reference);
      throw new Error(payload.message || "Paystack could not initialize checkout.");
    }
    const { error: updateError } = await admin.from("payments").update({
      authorization_url: payload.data.authorization_url, updated_at: new Date().toISOString(),
    }).eq("reference", reference);
    if (updateError) throw new Error("Checkout was initialized but could not be saved. Contact Burify with your payment reference.");
    return NextResponse.json({ authorizationUrl: payload.data.authorization_url, reference });
  } catch (error) {
    console.error("Payment initialization failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start checkout." }, { status: 500 });
  }
}
