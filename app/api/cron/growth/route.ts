import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { firstName, render, unsubUrl } from "@/lib/growth/template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STOP_STATUSES = ["REPLIED", "POSITIVE REPLY", "SALES CONVERSATION", "PROPOSAL SENT", "NEGOTIATION", "WON", "LOST", "NOT A FIT"];

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET || "";
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!secret || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

async function sendViaResend(to: string, subject: string, text: string, unsub: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) throw new Error("Email service is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], subject, text,
      headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : `Email provider error ${response.status}`);
  return String(body.id ?? "");
}

// Step 1: draft the next follow-up for anyone who has not replied. Drafts still need approval.
async function createFollowUps(admin: ReturnType<typeof createAdminClient>, senderName: string) {
  const { data: sent } = await admin.from("growth_outreach_messages")
    .select("lead_id,sequence_id,step_number,sent_at").eq("status", "sent").order("step_number", { ascending: false }).limit(2000);
  const latest = new Map<string, { sequence_id: number; step_number: number; sent_at: string }>();
  for (const row of sent ?? []) if (row.sent_at && !latest.has(row.lead_id)) latest.set(row.lead_id, row);
  if (!latest.size) return 0;

  const { data: leads } = await admin.from("notion_crm_leads")
    .select("id,company,email,decision_maker,personalization,status,outreach_suppressed,email_reply_at")
    .in("id", [...latest.keys()]).eq("status", "CONTACTED").eq("outreach_suppressed", false).is("email_reply_at", null);
  let created = 0;
  for (const lead of leads ?? []) {
    const last = latest.get(lead.id);
    if (!last || !lead.email) continue;
    const { data: next } = await admin.from("growth_sequence_steps")
      .select("step_number,delay_days,subject_template,body_template").eq("sequence_id", last.sequence_id).eq("step_number", last.step_number + 1).maybeSingle();
    if (!next || Date.parse(last.sent_at) + next.delay_days * 86_400_000 > Date.now()) continue;
    const vars = { first_name: firstName(lead.decision_maker), clinic_name: lead.company, personalization: lead.personalization ?? "", sender_name: senderName };
    const subject = render(next.subject_template, vars);
    const body = render(next.body_template, vars);
    const { error } = await admin.from("growth_outreach_messages").insert({
      lead_id: lead.id, sequence_id: last.sequence_id, step_number: next.step_number, to_email: String(lead.email).toLowerCase(), subject, body,
    });
    if (error) continue;
    await admin.from("notion_crm_leads").update({ email_subject: subject, email_draft: body, email_draft_status: "drafted", email_drafted_at: new Date().toISOString() }).eq("id", lead.id);
    created++;
  }
  return created;
}

// Step 2: send approved messages, only when sending is switched on, within the daily cap.
async function sendApproved(admin: ReturnType<typeof createAdminClient>, settings: Map<string, unknown>) {
  if (settings.get("sending_enabled") !== true) return { skipped: "Sending is switched off in Growth settings." };
  const senderName = String(settings.get("sender_name") ?? "").trim();
  const postalAddress = String(settings.get("postal_address") ?? "").trim();
  if (!senderName || !postalAddress) return { skipped: "Sender name and postal address are required." };

  const cap = Math.max(1, Math.min(100, Number(settings.get("daily_send_cap") ?? 30) || 30));
  const startOfDay = new Date(); startOfDay.setUTCHours(0, 0, 0, 0);
  const { count: sentToday } = await admin.from("growth_outreach_messages").select("id", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", startOfDay.toISOString());
  const remaining = cap - (sentToday ?? 0);
  if (remaining <= 0) return { skipped: "Daily send cap reached." };

  const { data: queue } = await admin.from("growth_outreach_messages")
    .select("id,lead_id,to_email,subject,body,step_number,sequence_id").eq("status", "approved").order("approved_at").limit(remaining);
  let sent = 0, failed = 0, cancelled = 0;
  for (const message of queue ?? []) {
    const email = message.to_email.toLowerCase();
    const [{ data: lead }, { data: suppressed }] = await Promise.all([
      admin.from("notion_crm_leads").select("status,outreach_suppressed").eq("id", message.lead_id).maybeSingle(),
      admin.from("growth_suppression").select("email").eq("email", email).maybeSingle(),
    ]);
    if (!lead || lead.outreach_suppressed || suppressed || STOP_STATUSES.includes(lead.status ?? "")) {
      await admin.from("growth_outreach_messages").update({ status: "cancelled" }).eq("id", message.id);
      cancelled++;
      continue;
    }
    try {
      const unsub = unsubUrl(email);
      const text = `${message.body}\n\n--\n${senderName}, Burify Labs\n${postalAddress}\nNot relevant? Unsubscribe: ${unsub}`;
      const providerId = await sendViaResend(email, message.subject, text, unsub);
      const now = new Date();
      await admin.from("growth_outreach_messages").update({ status: "sent", sent_at: now.toISOString(), provider_message_id: providerId, error: null }).eq("id", message.id);
      const { data: following } = await admin.from("growth_sequence_steps").select("delay_days").eq("sequence_id", message.sequence_id).eq("step_number", message.step_number + 1).maybeSingle();
      const day = now.toISOString().slice(0, 10);
      await admin.from("notion_crm_leads").update({
        email_sent_at: now.toISOString(), email_draft_status: "sent", status: "CONTACTED", date_contacted: day, last_contact: day,
        next_follow_up: following ? new Date(now.getTime() + following.delay_days * 86_400_000).toISOString().slice(0, 10) : null,
      }).eq("id", message.lead_id);
      sent++;
    } catch (error) {
      await admin.from("growth_outreach_messages").update({ status: "failed", error: (error instanceof Error ? error.message : "Send failed").slice(0, 300) }).eq("id", message.id);
      failed++;
    }
  }
  return { sent, failed, cancelled };
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const admin = createAdminClient();
  const { data: rows, error } = await admin.from("growth_settings").select("key,value");
  if (error) return NextResponse.json({ skipped: "Growth tables are not set up yet." });
  const settings = new Map((rows ?? []).map(r => [r.key as string, r.value as unknown]));

  const followUps = await createFollowUps(admin, String(settings.get("sender_name") ?? ""));
  const result = await sendApproved(admin, settings);
  await admin.from("growth_activity_log").insert({ actor: "cron", action: "send", detail: { followUps, ...result } });
  return NextResponse.json({ followUps, ...result });
}
