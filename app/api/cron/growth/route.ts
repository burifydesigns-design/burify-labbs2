import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resendConfigured, unsubUrl } from "@/lib/growth/template";

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

async function sendViaResend(id: string, to: string, subject: string, text: string, unsubscribe: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) throw new Error("Email service is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `burify-growth-${id}` },
    body: JSON.stringify({
      from, to: [to], subject, text,
      headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : `Email provider error ${response.status}`);
  return String(body.id ?? "");
}

type QueueMessage = { id: string; email: string; clinic_name: string; subject: string; body: string };
type QueueResponse = { settings: Record<string, unknown>; sent_today: number; messages: QueueMessage[]; skipped?: string };

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!resendConfigured()) return NextResponse.json({ skipped: "Resend or cron configuration is incomplete." }, { status: 503 });

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("growth_cron_api", { p_action: "queue", p_payload: {} });
  if (error) return NextResponse.json({ error: "The secure Growth Engine queue could not be loaded." }, { status: 500 });
  const queue = data as QueueResponse;
  if (queue.skipped) return NextResponse.json({ sent: 0, failed: 0, skipped: queue.skipped });
  const settings = queue.settings ?? {};
  const senderName = String(settings.sender_name ?? "").trim();
  const postalAddress = String(settings.postal_address ?? "").trim();
  if (settings.sending_enabled !== true || !senderName || !postalAddress) {
    return NextResponse.json({ sent: 0, failed: 0, skipped: "Sending is disabled or sender details are incomplete." });
  }

  let sent = 0;
  let failed = 0;
  for (const message of queue.messages ?? []) {
    const email = String(message.email ?? "").trim().toLowerCase();
    if (!email || !message.id || !message.subject?.trim() || !message.body?.trim()) {
      await admin.rpc("growth_cron_api", { p_action: "mark_cancelled", p_payload: { id: message.id } });
      continue;
    }
    const { data: claimData, error: claimError } = await admin.rpc("growth_cron_api", {
      p_action: "claim", p_payload: { id: message.id },
    });
    const claim = claimData as { claimed?: boolean; reason?: string } | null;
    if (claimError) {
      failed++;
      continue;
    }
    if (!claim?.claimed) {
      if (claim?.reason === "daily_cap") break;
      continue;
    }
    try {
      const unsubscribe = unsubUrl(email);
      const text = `${message.body}\n\n--\n${senderName}, Burify Solutions\n${postalAddress}\nNot relevant? Unsubscribe: ${unsubscribe}`;
      const providerId = await sendViaResend(message.id, email, message.subject, text, unsubscribe);
      const { error: markError } = await admin.rpc("growth_cron_api", {
        p_action: "mark_sent", p_payload: { id: message.id, provider_message_id: providerId },
      });
      if (markError) throw new Error("Email sent, but delivery status could not be recorded. Reconcile the provider message before retrying.");
      sent++;
    } catch (sendError) {
      await admin.rpc("growth_cron_api", {
        p_action: "mark_failed",
        p_payload: { id: message.id, error: sendError instanceof Error ? sendError.message : "Delivery failed" },
      });
      failed++;
    }
  }
  await admin.rpc("growth_cron_api", {
    p_action: "activity",
    p_payload: { sent, failed, sent_today_before_run: queue.sent_today ?? 0 },
  });
  return NextResponse.json({ sent, failed, sentTodayBeforeRun: queue.sent_today ?? 0 });
}
