"use server";

import { revalidatePath } from "next/cache";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { firstName, render } from "@/lib/growth/template";
import { ICP_FITS, type ActionResult, type TaskStatus } from "@/lib/growth/types";

const refresh = () => revalidatePath("/admin/growth", "layout");
const fail = (error: string): ActionResult => ({ ok: false, error });

export async function setTaskStatus(id: number, status: TaskStatus): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  if (!Number.isInteger(id) || !["todo", "in_progress", "done", "skipped"].includes(status)) return fail("Invalid task update.");
  const { error } = await supabase.from("growth_plan_tasks")
    .update({ status, completed_at: status === "done" ? new Date().toISOString() : null }).eq("id", id);
  if (error) return fail("Could not save this task.");
  refresh();
  return { ok: true };
}

export async function setKpiValue(metric: string, value: number): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  if (!metric || !Number.isFinite(value) || value < 0 || value > 1_000_000) return fail("Enter a valid number.");
  const { data } = await supabase.from("growth_settings").select("value").eq("key", "kpi_current").maybeSingle();
  const current = (data?.value && typeof data.value === "object" ? data.value : {}) as Record<string, number>;
  const { error } = await supabase.from("growth_settings")
    .upsert({ key: "kpi_current", value: { ...current, [metric]: value }, updated_at: new Date().toISOString() });
  if (error) return fail("Could not save the scorecard value.");
  refresh();
  return { ok: true };
}

// Turns eligible CRM prospects into step-1 drafts. Nothing is sent from here.
export async function generateDrafts(): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const { data: seq } = await supabase.from("growth_sequences").select("id").eq("active", true).order("id").limit(1).maybeSingle();
  if (!seq) return fail("No active email sequence found.");
  const { data: step } = await supabase.from("growth_sequence_steps")
    .select("subject_template,body_template").eq("sequence_id", seq.id).eq("step_number", 1).maybeSingle();
  if (!step) return fail("The sequence has no first step.");
  const { data: settings } = await supabase.from("growth_settings").select("key,value").in("key", ["sender_name"]);
  const senderName = String(settings?.find(s => s.key === "sender_name")?.value ?? "");

  const { data: leads, error } = await supabase.from("notion_crm_leads")
    .select("id,company,email,decision_maker,personalization")
    .eq("market_scope", "international").in("icp_fit", [...ICP_FITS])
    .eq("outreach_suppressed", false).eq("email_draft_status", "not drafted")
    .not("email", "is", null).neq("email", "").limit(50);
  if (error) return fail("Could not read prospects. Check CRM permissions.");
  if (!leads?.length) return { ok: true, count: 0 };

  const emails = leads.map(l => String(l.email).toLowerCase());
  const { data: suppressed } = await supabase.from("growth_suppression").select("email").in("email", emails);
  const blocked = new Set((suppressed ?? []).map(s => s.email));

  let created = 0;
  for (const lead of leads) {
    const email = String(lead.email).toLowerCase();
    if (blocked.has(email)) continue;
    const vars = { first_name: firstName(lead.decision_maker), clinic_name: lead.company, personalization: lead.personalization ?? "", sender_name: senderName };
    const subject = render(step.subject_template, vars);
    const body = render(step.body_template, vars).replace(/\n{3,}/g, "\n\n");
    const { error: insertError } = await supabase.from("growth_outreach_messages")
      .insert({ lead_id: lead.id, sequence_id: seq.id, step_number: 1, to_email: email, subject, body });
    if (insertError) continue;
    await supabase.from("notion_crm_leads").update({
      email_subject: subject, email_draft: body, email_draft_status: "drafted", email_drafted_at: new Date().toISOString(),
    }).eq("id", lead.id);
    created++;
  }
  await supabase.from("growth_activity_log").insert({ actor: "admin", action: "drafts_generated", detail: { created } });
  refresh();
  return { ok: true, count: created };
}

export async function approveDraft(id: string, subject: string, body: string): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const cleanSubject = subject.trim().slice(0, 200);
  const cleanBody = body.trim().slice(0, 8000);
  if (!cleanSubject || !cleanBody) return fail("Subject and message cannot be empty.");
  if (/\{\{\w+\}\}/.test(cleanSubject + cleanBody)) return fail("Replace the {{placeholders}} before approving.");
  const { data, error } = await supabase.from("growth_outreach_messages")
    .update({ subject: cleanSubject, body: cleanBody, status: "approved", approved_at: new Date().toISOString() })
    .eq("id", id).eq("status", "draft").select("lead_id").maybeSingle();
  if (error || !data) return fail("This draft could not be approved. It may have changed already.");
  await supabase.from("notion_crm_leads").update({ email_subject: cleanSubject, email_draft: cleanBody, email_draft_status: "approved" }).eq("id", data.lead_id);
  refresh();
  return { ok: true };
}

export async function rejectDraft(id: string): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const { data, error } = await supabase.from("growth_outreach_messages")
    .update({ status: "rejected" }).eq("id", id).eq("status", "draft").select("lead_id").maybeSingle();
  if (error || !data) return fail("This draft could not be rejected.");
  await supabase.from("notion_crm_leads").update({ email_draft_status: "not drafted", email_draft: null, email_subject: null }).eq("id", data.lead_id);
  refresh();
  return { ok: true };
}

export async function approveAllDrafts(): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const { data: drafts } = await supabase.from("growth_outreach_messages").select("id,lead_id,subject,body").eq("status", "draft");
  const ready = (drafts ?? []).filter(d => !/\{\{\w+\}\}/.test(d.subject + d.body));
  if (!ready.length) return { ok: true, count: 0 };
  const ids = ready.map(d => d.id);
  const { error } = await supabase.from("growth_outreach_messages")
    .update({ status: "approved", approved_at: new Date().toISOString() }).in("id", ids).eq("status", "draft");
  if (error) return fail("Could not approve the drafts.");
  await supabase.from("notion_crm_leads").update({ email_draft_status: "approved" }).in("id", ready.map(d => d.lead_id));
  refresh();
  return { ok: true, count: ready.length };
}

export async function markReplied(messageId: string): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const now = new Date().toISOString();
  const { data, error } = await supabase.from("growth_outreach_messages")
    .update({ replied_at: now }).eq("id", messageId).eq("status", "sent").select("lead_id").maybeSingle();
  if (error || !data) return fail("Could not record this reply.");
  await supabase.from("notion_crm_leads").update({ status: "REPLIED", email_reply_at: now, reply: "Reply received" }).eq("id", data.lead_id);
  // A reply stops the sequence: cancel anything not yet sent.
  await supabase.from("growth_outreach_messages").update({ status: "cancelled" }).eq("lead_id", data.lead_id).in("status", ["draft", "approved"]);
  refresh();
  return { ok: true };
}

export async function saveGrowthSettings(input: { senderName: string; postalAddress: string; dailyCap: number; sendingEnabled: boolean }): Promise<ActionResult> {
  const { supabase } = await requireGrowthAdmin();
  const senderName = input.senderName.trim().slice(0, 80);
  const postalAddress = input.postalAddress.trim().slice(0, 240);
  const dailyCap = Math.max(1, Math.min(100, Math.round(Number(input.dailyCap) || 30)));
  const enabled = Boolean(input.sendingEnabled) && Boolean(senderName) && Boolean(postalAddress);
  const now = new Date().toISOString();
  const { error } = await supabase.from("growth_settings").upsert([
    { key: "sender_name", value: senderName, updated_at: now },
    { key: "postal_address", value: postalAddress, updated_at: now },
    { key: "daily_send_cap", value: dailyCap, updated_at: now },
    { key: "sending_enabled", value: enabled, updated_at: now },
  ]);
  if (error) return fail("Could not save settings.");
  await supabase.from("growth_activity_log").insert({ actor: "admin", action: "settings_saved", detail: { sending_enabled: enabled, daily_cap: dailyCap } });
  refresh();
  return { ok: true };
}
