import { NextResponse } from "next/server";
import { verifyPaystackTransaction, reconcilePaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") || "";
  if (!/^BURIFY-[a-f0-9]{32}$/.test(reference)) return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  try {
    const transaction = await verifyPaystackTransaction(reference);
    if (transaction.reference !== reference) return NextResponse.json({ error: "Payment reference mismatch." }, { status: 400 });
    const result = await reconcilePaystackTransaction(transaction);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment verification failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment verification failed." }, { status: 400 });
  }
}
