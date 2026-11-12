import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ICP_FITS, PLAN_START, type Draft, type Kpi, type SentMessage, type Task } from "./types";

export function todayInNairobi() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
}

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);
}

export async function loadTasks(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("growth_plan_tasks")
    .select("id,week,day_index,day_name,title,description,category,automation,status,due_date").order("week").order("day_index");
  return { tasks: (data ?? []) as Task[], error: Boolean(error) };
}

export async function loadSettings(supabase: SupabaseClient) {
  const { data } = await supabase.from("growth_settings").select("key,value");
  const map = new Map((data ?? []).map(r => [r.key as string, r.value as unknown]));
  return {
    sendingEnabled: map.get("sending_enabled") === true,
    dailyCap: Number(map.get("daily_send_cap") ?? 30) || 30,
    senderName: String(map.get("sender_name") ?? ""),
    postalAddress: String(map.get("postal_address") ?? ""),
    kpiCurrent: (map.get("kpi_current") && typeof map.get("kpi_current") === "object" ? map.get("kpi_current") : {}) as Record<string, number>,
  };
}

const count = (r: { count: number | null }) => r.count ?? 0;

export async function loadPipeline(supabase: SupabaseClient) {
  const head = { count: "exact" as const, head: true };
  const icp = () => supabase.from("notion_crm_leads").select("id", head)
    .eq("market_scope", "international").in("icp_fit", [...ICP_FITS]).not("email", "is", null).neq("email", "");
  const msg = () => supabase.from("growth_outreach_messages").select("id", head).eq("step_number", 1);
  const [pool, ready, drafted, approved, sent, replied, pending, conversations, sentToday] = await Promise.all([
    icp(),
    icp().eq("outreach_suppressed", false).eq("email_draft_status", "not drafted"),
    msg().in("status", ["draft", "approved", "sent", "failed"]),
    msg().in("status", ["approved", "sent"]),
    msg().eq("status", "sent"),
    supabase.from("growth_outreach_messages").select("id", head).not("replied_at", "is", null),
    supabase.from("growth_outreach_messages").select("id", head).eq("status", "draft"),
    supabase.from("notion_crm_leads").select("id", head).in("status", ["POSITIVE REPLY", "SALES CONVERSATION", "PROPOSAL SENT", "NEGOTIATION", "WON"]),
    supabase.from("growth_outreach_messages").select("id", head).eq("status", "sent").gte("sent_at", new Date(Date.now() - 86_400_000).toISOString()),
  ]);
  return {
    pool: count(pool), ready: count(ready), drafted: count(drafted), approved: count(approved), sent: count(sent),
    replied: count(replied), pending: count(pending), conversations: count(conversations), sentToday: count(sentToday),
  };
}

export async function loadKpis(supabase: SupabaseClient, current: Record<string, number>, conversations: number): Promise<Kpi[]> {
  const { data } = await supabase.from("growth_kpis").select("id,category,metric,target_label,target_value,unit,higher_is_better").order("id");
  return (data ?? []).map(k => {
    const auto = k.metric === "Qualified conversations";
    return { ...k, auto, current: auto ? conversations : (current[k.metric] ?? null) } as Kpi;
  });
}

export async function loadDrafts(supabase: SupabaseClient): Promise<Draft[]> {
  const { data } = await supabase.from("growth_outreach_messages")
    .select("id,lead_id,step_number,to_email,subject,body").eq("status", "draft").order("created_at").limit(100);
  const rows = data ?? [];
  if (!rows.length) return [];
  const { data: leads } = await supabase.from("notion_crm_leads").select("id,company,decision_maker,icp_fit,personalization").in("id", rows.map(r => r.lead_id));
  const byId = new Map((leads ?? []).map(l => [l.id as string, l]));
  return rows.map(r => {
    const lead = byId.get(r.lead_id);
    return {
      ...r, company: lead?.company ?? "Unknown clinic", contact: lead?.decision_maker ?? null, fit: lead?.icp_fit ?? null,
      hasPersonalization: Boolean(lead?.personalization && String(lead.personalization).trim()),
    } as Draft;
  });
}

export async function loadSent(supabase: SupabaseClient): Promise<SentMessage[]> {
  const { data } = await supabase.from("growth_outreach_messages")
    .select("id,lead_id,step_number,to_email,subject,status,sent_at,replied_at,error,created_at").in("status", ["sent", "failed"])
    .order("created_at", { ascending: false }).limit(25);
  const rows = data ?? [];
  if (!rows.length) return [];
  const { data: leads } = await supabase.from("notion_crm_leads").select("id,company").in("id", rows.map(r => r.lead_id));
  const byId = new Map((leads ?? []).map(l => [l.id as string, l.company as string]));
  return rows.map(r => ({ ...r, company: byId.get(r.lead_id) ?? "Unknown clinic" })) as SentMessage[];
}

export async function loadActivity(supabase: SupabaseClient) {
  const { data } = await supabase.from("growth_activity_log").select("id,at,actor,action,detail").order("at", { ascending: false }).limit(8);
  return data ?? [];
}

export { PLAN_START };
