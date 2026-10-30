import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PaystackVerificationError, reconcilePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET || "";
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!secret || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return NextResponse.json({ skipped: true, reason: "Payments are disabled." });
  }

  const admin = createAdminClient();
  const staleBefore = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: attempts, error } = await admin.from("payments")
    .select("id,reference,created_at")
    .eq("provider", "paystack")
    .in("status", ["pending", "processing"])
    .lt("created_at", staleBefore)
    .order("created_at", { ascending: true })
    .limit(40);

  if (error) {
    console.error("Paystack reconciliation query failed:", error.message);
    return NextResponse.json({ error: "Could not load pending payments." }, { status: 500 });
  }

  let checked = 0;
  let confirmed = 0;
  let terminal = 0;
  let errors = 0;
  for (const attempt of attempts ?? []) {
    try {
      const transaction = await verifyPaystackTransaction(attempt.reference);
      const result = await reconcilePaystackTransaction(transaction);
      checked += 1;
      if (result.success) confirmed += 1;
      else if (["failed", "abandoned", "reversed"].includes(result.status)) terminal += 1;
    } catch (cause) {
      errors += 1;
      const ageMs = Date.now() - new Date(attempt.created_at).getTime();
      if (cause instanceof PaystackVerificationError && cause.statusCode === 404 && ageMs > 30 * 60 * 1000) {
        const { error: updateError } = await admin.from("payments").update({
          status: "abandoned",
          failure_reason: "Paystack no longer recognises this checkout reference.",
          updated_at: new Date().toISOString(),
        }).eq("reference", attempt.reference).in("status", ["pending", "processing"]);
        if (!updateError) terminal += 1;
      }
      console.error("Paystack reconciliation attempt failed:", {
        reference: attempt.reference,
        message: cause instanceof Error ? cause.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ checked, confirmed, terminal, errors, scanned: attempts?.length ?? 0 });
}
