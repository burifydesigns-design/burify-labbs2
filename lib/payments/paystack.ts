import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type PaystackTransaction = {
  id: number | string;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
};

type PaystackResponse = { status: boolean; message?: string; data?: PaystackTransaction };

export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(12000) }
  );
  const payload = (await response.json()) as PaystackResponse;
  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Could not verify this payment.");
  }
  return payload.data;
}

export async function reconcilePaystackTransaction(transaction: PaystackTransaction) {
  if (transaction.status !== "success") return { success: false, status: transaction.status };
  const admin = createAdminClient();
  const { data: payment, error: lookupError } = await admin
    .from("payments")
    .select("id,amount,currency,invoice_id")
    .eq("reference", transaction.reference)
    .eq("provider", "paystack")
    .maybeSingle();
  if (lookupError || !payment) throw new Error("Payment reference is not recognised.");
  if (Number(payment.amount) !== Number(transaction.amount) || payment.currency !== transaction.currency) {
    throw new Error("Verified payment amount or currency does not match the invoice.");
  }
  const { error } = await admin.rpc("finalize_paystack_payment", {
    p_reference: transaction.reference,
    p_transaction_id: String(transaction.id),
    p_amount: transaction.amount,
    p_currency: transaction.currency,
    p_channel: transaction.channel ?? null,
    p_paid_at: transaction.paid_at ?? new Date().toISOString(),
  });
  if (error) throw new Error("Payment was verified but invoice reconciliation failed.");
  return { success: true, status: "success", invoiceId: payment.invoice_id };
}
