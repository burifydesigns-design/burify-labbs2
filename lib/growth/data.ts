import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PLAN_START, type Draft, type Kpi, type SentMessage, type Task } from "./types";
import { createAdminClient } from "@/lib/supabase/admin";

export function todayInNairobi() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
}

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);
}

async function growthRead(supabase: SupabaseClient, action: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: true };
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("growth_read_api", { p_actor: user.id, p_action: action });
  return { data, error: Boolean(error) };
}

export async function loadTasks(supabase: SupabaseClient) {
  const { data, error } = await growthRead(supabase, "tasks");
  return { tasks: (Array.isArray(data) ? data : []) as Task[], error };
}

export async function loadSettings(supabase: SupabaseClient) {
  const { data } = await growthRead(supabase, "settings");
  const map = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const sender = (map.sender && typeof map.sender === "object" ? map.sender : {}) as Record<string, unknown>;
  return {
    sendingEnabled: map.sending_enabled === true,
    dailyCap: Number(map.daily_send_cap ?? 30) || 30,
    senderName: String(sender.name ?? map.sender_name ?? ""),
    postalAddress: String(sender.postal_address ?? map.postal_address ?? ""),
    kpiCurrent: (map.kpi_current && typeof map.kpi_current === "object" ? map.kpi_current : {}) as Record<string, number>,
  };
}

export async function loadPipeline(supabase: SupabaseClient) {
  const { data } = await growthRead(supabase, "pipeline");
  const row = (data && typeof data === "object" ? data : {}) as Record<string, number>;
  return {
    pool: row.pool ?? 0, ready: row.ready ?? 0, drafted: row.drafted ?? 0, approved: row.approved ?? 0,
    sent: row.sent ?? 0, replied: row.replied ?? 0, pending: row.pending ?? 0,
    conversations: row.conversations ?? 0, sentToday: row.sentToday ?? 0,
  };
}

export async function loadKpis(supabase: SupabaseClient, current: Record<string, number>, conversations: number): Promise<Kpi[]> {
  const { data } = await growthRead(supabase, "kpis");
  return (Array.isArray(data) ? data : []).map((item) => {
    const k = item as Omit<Kpi, "auto" | "current"> & { current_value?: number };
    const auto = k.metric === "Qualified conversations";
    return { ...k, auto, current: auto ? conversations : (current[k.metric] ?? k.current_value ?? null) } as Kpi;
  });
}

export async function loadDrafts(supabase: SupabaseClient): Promise<Draft[]> {
  const { data } = await growthRead(supabase, "drafts");
  return (Array.isArray(data) ? data : []) as Draft[];
}

export async function loadSent(supabase: SupabaseClient): Promise<SentMessage[]> {
  const { data } = await growthRead(supabase, "sent");
  return (Array.isArray(data) ? data : []) as SentMessage[];
}

export async function loadActivity(supabase: SupabaseClient) {
  const { data } = await growthRead(supabase, "activity");
  return Array.isArray(data) ? data : [];
}

export { PLAN_START };
