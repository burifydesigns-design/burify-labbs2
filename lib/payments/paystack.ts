import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPaymentReceipt } from "@/lib/payments/receipt";

export type PaystackTransaction = {
  id: number | string; status: string; reference: string; amount: number; currency: string;
  domain?: "live" | "test" | string; channel?: string; paid_at?: string | null;
};
type PaystackResponse = { status: boolean; message?: string; data?: PaystackTransaction };

export class PaystackVerificationError extends Error {
  constructor(message: string, readonly statusCode: number) { super(message); this.name = "PaystackVerificationError"; }
}

export function getPaystackMode(): "live" | "test" {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const mode = secret.startsWith("sk_live_") ? "live" : secret.startsWith("sk_test_") ? "test" : null;
  if (!mode) throw new Error("Paystack secret key must be a valid live or test secret key.");
  if ((process.env.PAYSTACK_EXPECTED_DOMAIN || mode) !== mode) throw new Error("Paystack key mode does not match PAYSTACK_EXPECTED_DOMAIN.");
  if (process.env.VERCEL_ENV === "production" && mode !== "live") throw new Error("Production must use Paystack Live Mode credentials.");
  if (process.env.VERCEL_ENV === "preview" && mode !== "test") throw new Error("Preview deployments must use Paystack Test Mode credentials.");
  return mode;
}

export function getPaystackCallbackUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com";
  let url: URL;
  try { url = new URL(configured); } catch { throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL."); }
  if (url.protocol !== "https:") throw new Error("Paystack callback URLs must use HTTPS.");
  if (process.env.VERCEL_ENV === "production" && !["burifylabs.com", "www.burifylabs.com"].includes(url.hostname.toLowerCase())) {
    throw new Error("Production Paystack callback URL must use the verified Burify domain.");
  }
  return new URL("/payment/success", url).toString();
}

export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");
  const expectedDomain = getPaystackMode();
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(12000),
  });
  const payload = await response.json().catch(() => ({})) as PaystackResponse;
  if (!response.ok || !payload.status || !payload.data) throw new PaystackVerificationError(payload.message || "Could not verify this payment.", response.status);
  if (payload.data.domain !== expectedDomain) throw new Error(`Paystack transaction domain mismatch: expected ${expectedDomain}.`);
  if (payload.data.reference !== reference) throw new Error("Paystack returned a different transaction reference.");
  return payload.data;
}

export async function reconcilePaystackTransaction(transaction: PaystackTransaction) {
  const expectedDomain = getPaystackMode();
  if (transaction.domain !== expectedDomain) throw new Error("Transaction belongs to a different Paystack environment.");
  if (transaction.status !== "success") {
    const admin = createAdminClient();
    const mappedStatus = ["abandoned", "failed", "reversed"].includes(transaction.status) ? transaction.status : "processing";
    const { error } = await admin.from("payments").update({
      status: mappedStatus, updated_at: new Date().toISOString(),
      failure_reason: ["failed", "reversed", "abandoned"].includes(mappedStatus) ? transaction.status : null,
    }).eq("reference", transaction.reference).eq("provider", "paystack").neq("status", "success");
    if (error) throw new Error("Could not update payment recovery status.");
    return { success: false, status: transaction.status };
  }

  const admin = createAdminClient();
  const { data: payment, error: lookupError } = await admin.from("payments")
    .select("id,amount,currency,invoice_id").eq("reference", transaction.reference).eq("provider", "paystack").maybeSingle();
  if (lookupError || !payment) throw new Error("Payment reference is not recognised.");
  if (Number(payment.amount) !== Number(transaction.amount) || payment.currency !== transaction.currency) {
    throw new Error("Verified payment amount or currency does not match the invoice.");
  }
  const { error } = await admin.rpc("finalize_paystack_payment", {
    p_reference: transaction.reference, p_transaction_id: String(transaction.id), p_amount: transaction.amount,
    p_currency: transaction.currency, p_channel: transaction.channel ?? null,
    p_paid_at: transaction.paid_at ?? new Date().toISOString(),
  });
  if (error) throw new Error("Payment was verified but invoice reconciliation failed.");
  const receipt = await sendPaymentReceipt(transaction.reference);
  if (!receipt.sent && !receipt.alreadySent) console.error("Payment confirmed; receipt delivery needs attention:", receipt.error || "Receipt was not sent.");
  return { success: true, status: "success", receiptSent: Boolean(receipt.sent) };
}
