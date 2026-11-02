import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reconcilePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaystackWebhook = { event?: string; data?: { id?: number | string; reference?: string; domain?: string } };

function validSignature(rawBody: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature") || "";
  if (!secret || !signature) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const rawBody = await request.text();
  if (!validSignature(rawBody, signature, secret)) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });

  const admin = createAdminClient();
  let event: PaystackWebhook;
  try { event = JSON.parse(rawBody) as PaystackWebhook; }
  catch { return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 }); }

  const eventType = String(event.event || "unknown").slice(0, 120);
  const data = event.data || {};
  const transactionId = data.id ? String(data.id) : "";
  const reference = typeof data.reference === "string" ? data.reference : "";
  const eventIdentity = transactionId || reference || createHash("sha256").update(rawBody).digest("hex");
  const eventId = `${eventType}:${eventIdentity}`.slice(0, 255);
  const { data: payment } = reference
    ? await admin.from("payments").select("id").eq("reference", reference).eq("provider", "paystack").maybeSingle()
    : { data: null };

  const { data: inserted, error: insertError } = await admin.from("payment_events").insert({
    payment_id: payment?.id ?? null, provider: "paystack", provider_event_id: eventId,
    event_type: eventType,
    payload: { event: eventType, transaction_id: transactionId || null, reference: reference || null, domain: data.domain || null },
    attempt_count: 1, last_attempt_at: new Date().toISOString(),
  }).select("id").maybeSingle();

  let eventRowId = inserted?.id;
  if (insertError || !eventRowId) {
    const { data: existing } = await admin.from("payment_events")
      .select("id,processed_at,attempt_count").eq("provider_event_id", eventId).maybeSingle();
    if (!existing) return NextResponse.json({ error: "Could not record webhook event." }, { status: 500 });
    if (existing.processed_at) return NextResponse.json({ received: true, duplicate: true });
    eventRowId = existing.id;
    await admin.from("payment_events").update({
      attempt_count: Number(existing.attempt_count || 0) + 1,
      last_attempt_at: new Date().toISOString(), last_error: null,
    }).eq("id", eventRowId);
  }

  try {
    if (eventType === "charge.success") {
      if (!reference || !transactionId) throw new Error("Successful charge event is missing its transaction reference or ID.");
      const transaction = await verifyPaystackTransaction(reference);
      if (String(transaction.id) !== transactionId) throw new Error("Transaction identity mismatch.");
      await reconcilePaystackTransaction(transaction);
    }
    const { error: completeError } = await admin.from("payment_events")
      .update({ processed_at: new Date().toISOString(), last_error: null }).eq("id", eventRowId);
    if (completeError) throw new Error("Could not mark webhook event as processed.");
    return NextResponse.json({ received: true, processed: true });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message.slice(0, 400) : "Unknown webhook processing error.";
    await admin.from("payment_events").update({ last_error: message, last_attempt_at: new Date().toISOString() }).eq("id", eventRowId);
    console.error("Paystack webhook processing failed:", { event: eventType, reference: reference || null, message });
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
