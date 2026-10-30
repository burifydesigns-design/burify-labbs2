import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPaystackTransaction, reconcilePaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature") || "";
  if (!secret || !signature) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const rawBody = await request.text();
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as { event?: string; data?: { id?: number | string; reference?: string } };
    if (event.event !== "charge.success" || !event.data?.reference || !event.data.id) {
      return NextResponse.json({ received: true });
    }
    const transaction = await verifyPaystackTransaction(event.data.reference);
    if (String(transaction.id) !== String(event.data.id)) {
      return NextResponse.json({ error: "Transaction identity mismatch." }, { status: 400 });
    }
    const result = await reconcilePaystackTransaction(transaction);
    const admin = createAdminClient();
    const { data: payment } = await admin.from("payments").select("id").eq("reference", transaction.reference).maybeSingle();
    const eventId = `charge.success:${String(event.data.id)}`;
    const { error: eventError } = await admin.from("payment_events").upsert({
      payment_id: payment?.id ?? null,
      provider: "paystack",
      provider_event_id: eventId,
      event_type: "charge.success",
      payload: {
        event: "charge.success",
        transaction_id: String(transaction.id),
        reference: transaction.reference,
        amount: transaction.amount,
        currency: transaction.currency,
        channel: transaction.channel ?? null,
      },
      processed_at: new Date().toISOString(),
    }, { onConflict: "provider_event_id", ignoreDuplicates: true });
    if (eventError) throw new Error("Could not record payment event.");
    return NextResponse.json({ received: true, reconciled: result.success });
  } catch (error) {
    console.error("Paystack webhook processing failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
