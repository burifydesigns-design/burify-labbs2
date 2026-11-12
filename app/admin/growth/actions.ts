"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function growthRpc(action: string, payload: Record<string, unknown> = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "super_admin", "marketing"].includes(profile.role)) redirect("/admin/login?error=unauthorized");
  if (["approve_message", "reject_message"].includes(action) && !["admin", "super_admin"].includes(profile.role)) redirect("/admin/growth?error=approval-forbidden");
  const admin = createAdminClient();
  const { error } = await admin.rpc("growth_admin_api", { p_actor: user.id, p_action: action, p_payload: payload });
  if (error) redirect("/admin/growth?error=action-failed");
  revalidatePath("/admin/growth");
}

export async function addGrowthProspect(formData: FormData) {
  await growthRpc("add_prospect", {
    clinic_name: String(formData.get("clinic_name") ?? "").trim(),
    contact_name: String(formData.get("contact_name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    segment: String(formData.get("segment") ?? "high_value_dental"),
    lead_source: String(formData.get("lead_source") ?? "").trim(),
    personalization_note: String(formData.get("personalization_note") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  });
  redirect("/admin/growth?added=1");
}

export async function updateGrowthProspect(formData: FormData) {
  await growthRpc("update_prospect", {
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? ""),
    score: String(formData.get("score") ?? "") ? Number(formData.get("score")) : undefined,
    notes: String(formData.get("notes") ?? ""),
  });
  redirect("/admin/growth?updated=1");
}

export async function updateGrowthTask(formData: FormData) {
  await growthRpc("update_task", {
    id: Number(formData.get("id")),
    status: String(formData.get("status") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });
  redirect("/admin/growth?taskUpdated=1");
}

export async function reviewGrowthMessage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!id || !["approve_message", "reject_message"].includes(decision)) redirect("/admin/growth?error=invalid-action");
  await growthRpc(decision, { id });
  redirect("/admin/growth?reviewed=1");
}


type GrowthActionResult = { ok: boolean; error?: string };

async function requireGrowthAdminAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again." as const };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { error: "Only an administrator can change Growth Engine settings." as const };
  return { user, admin: createAdminClient() };
}

export async function setTaskStatus(id: number, status: "todo" | "in_progress" | "done" | "skipped"): Promise<GrowthActionResult> {
  if (!Number.isInteger(id) || id < 1 || !["todo", "in_progress", "done", "skipped"].includes(status)) {
    return { ok: false, error: "Invalid task update." };
  }
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_admin_api", {
    p_actor: context.user.id,
    p_action: "update_task",
    p_payload: { id, status },
  });
  if (error) return { ok: false, error: "The task could not be saved. Please try again." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/plan");
  return { ok: true };
}

export async function saveGrowthSettings(input: {
  senderName: string;
  postalAddress: string;
  dailyCap: number;
  sendingEnabled: boolean;
}): Promise<GrowthActionResult> {
  const senderName = String(input.senderName ?? "").trim();
  const postalAddress = String(input.postalAddress ?? "").trim();
  const dailyCap = Number(input.dailyCap);
  const sendingEnabled = Boolean(input.sendingEnabled);
  if (!senderName || senderName.length > 80 || !postalAddress || postalAddress.length > 240 || !Number.isInteger(dailyCap) || dailyCap < 1 || dailyCap > 100) {
    return { ok: false, error: "Check the sender name, postal address and daily sending limit." };
  }
  if (sendingEnabled && (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.CRON_SECRET)) {
    return { ok: false, error: "Scheduled sending cannot be enabled until the email provider and cron secrets are configured." };
  }
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_save_settings", {
    p_actor: context.user.id,
    p_sender_name: senderName,
    p_postal_address: postalAddress,
    p_daily_cap: dailyCap,
    p_sending_enabled: sendingEnabled,
  });
  if (error) return { ok: false, error: "Settings could not be saved. Please verify your administrator access." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/settings");
  return { ok: true };
}


export async function approveDraft(id: string, subject: string, body: string): Promise<GrowthActionResult> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !subject.trim() || !body.trim() || /\{\{[A-Za-z0-9_]+\}\}/.test(subject + body)) {
    return { ok: false, error: "Complete the subject and body and replace all placeholders." };
  }
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_review_message", {
    p_actor: context.user.id, p_message_id: id, p_decision: "approve", p_subject: subject, p_body: body,
  });
  if (error) return { ok: false, error: "Draft could not be approved. It may have already been reviewed." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/outreach");
  return { ok: true };
}

export async function rejectDraft(id: string): Promise<GrowthActionResult> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: "Invalid draft." };
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_review_message", {
    p_actor: context.user.id, p_message_id: id, p_decision: "reject",
  });
  if (error) return { ok: false, error: "Draft could not be rejected. It may have already been reviewed." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/outreach");
  return { ok: true };
}

export async function approveAllDrafts(): Promise<GrowthActionResult & { count?: number }> {
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { data, error } = await context.admin.rpc("growth_approve_ready_messages", { p_actor: context.user.id });
  if (error) return { ok: false, error: "Eligible drafts could not be approved." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/outreach");
  return { ok: true, count: Number((data as { count?: number } | null)?.count ?? 0) };
}


export async function generateDrafts(): Promise<GrowthActionResult & { count?: number }> {
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { data, error } = await context.admin.rpc("growth_generate_drafts", { p_actor: context.user.id });
  if (error) return { ok: false, error: "Draft generation failed. Check the prospect records and try again." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/outreach");
  return { ok: true, count: Number((data as { count?: number } | null)?.count ?? 0) };
}

export async function markReplied(id: string): Promise<GrowthActionResult> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: "Invalid message." };
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_mark_replied", { p_actor: context.user.id, p_message_id: id });
  if (error) return { ok: false, error: "Could not record this reply. Only sent messages can be marked as replied." };
  revalidatePath("/admin/growth");
  revalidatePath("/admin/growth/outreach");
  return { ok: true };
}


export async function createGrowthClient(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/clients?error=unauthorized");
  const payload = {
    clinic_name: String(formData.get("clinic_name") ?? "").trim(),
    contact_name: String(formData.get("contact_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    website: String(formData.get("website") ?? "").trim(),
    package: String(formData.get("package") ?? "patient_growth_system"),
    value: String(formData.get("value") ?? "").trim(),
    start_date: String(formData.get("start_date") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
  if (!payload.clinic_name || payload.clinic_name.length > 180 || (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) || (payload.website && !/^https?:\/\//i.test(payload.website))) redirect("/admin/growth/clients?error=invalid");
  const { error } = await context.admin.rpc("growth_client_ops_api", { p_actor: context.user.id, p_action: "create_client", p_payload: payload });
  if (error) redirect("/admin/growth/clients?error=create");
  revalidatePath("/admin/growth/clients");
  redirect("/admin/growth/clients?created=1");
}

export async function createGrowthProposal(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/proposals?error=unauthorized");
  const scope = String(formData.get("scope") ?? "").split(/\r?\n/).map(v => v.trim()).filter(Boolean).slice(0,30);
  const payload = {
    client_id: String(formData.get("client_id") ?? ""),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    scope,
    amount: String(formData.get("amount") ?? ""),
    currency: String(formData.get("currency") ?? "KES"),
    valid_until: String(formData.get("valid_until") ?? ""),
  };
  if (!payload.client_id || !payload.title || !Number.isFinite(Number(payload.amount)) || Number(payload.amount) <= 0) redirect("/admin/growth/proposals?error=invalid");
  const { error } = await context.admin.rpc("growth_client_ops_api", { p_actor: context.user.id, p_action: "create_proposal", p_payload: payload });
  if (error) redirect("/admin/growth/proposals?error=create");
  revalidatePath("/admin/growth/proposals");
  revalidatePath("/portal");
  redirect("/admin/growth/proposals?created=1");
}

export async function updateGrowthOnboardingTask(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/clients?error=unauthorized");
  const { error } = await context.admin.rpc("growth_client_ops_api", {
    p_actor: context.user.id, p_action: "update_onboarding",
    p_payload: { id: String(formData.get("id") ?? ""), status: String(formData.get("status") ?? "") },
  });
  if (error) redirect("/admin/growth/clients?error=task");
  revalidatePath("/admin/growth/clients");
  revalidatePath("/portal");
  redirect("/admin/growth/clients?taskUpdated=1");
}

export async function recordGrowthMetrics(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/clients?error=unauthorized");
  const payload = Object.fromEntries(["client_id","period_start","enquiries","avg_response_minutes","bookings","no_shows","cancellations_recovered","workflow_runs","workflow_successes"].map(key => [key, String(formData.get(key) ?? "").trim()]));
  if (!payload.client_id || !payload.period_start) redirect("/admin/growth/clients?error=metrics");
  const { error } = await context.admin.rpc("growth_client_ops_api", { p_actor: context.user.id, p_action: "save_metrics", p_payload: payload });
  if (error) redirect("/admin/growth/clients?error=metrics");
  revalidatePath("/admin/growth/clients");
  revalidatePath("/portal");
  redirect("/admin/growth/clients?metricsSaved=1");
}

export async function inviteGrowthClientMember(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/clients?error=unauthorized");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const clientId = String(formData.get("client_id") ?? "");
  if (!clientId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/admin/growth/clients?error=invite");
  const { data, error } = await context.admin.auth.admin.inviteUserByEmail(email);
  if (error || !data.user) redirect("/admin/growth/clients?error=invite");
  const { error: linkError } = await context.admin.rpc("growth_client_ops_api", {
    p_actor: context.user.id, p_action: "link_member",
    p_payload: { client_id: clientId, user_id: data.user.id, member_role: "owner" },
  });
  if (linkError) redirect("/admin/growth/clients?error=invite-link");
  revalidatePath("/admin/growth/clients");
  redirect("/admin/growth/clients?invited=1");
}


export async function updateGrowthProposalStatus(formData: FormData) {
  const context = await requireGrowthAdminAction();
  if ("error" in context) redirect("/admin/growth/proposals?error=unauthorized");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["sent","accepted","declined","expired"].includes(status)) redirect("/admin/growth/proposals?error=invalid");
  const { error } = await context.admin.rpc("growth_update_proposal_status", { p_actor: context.user.id, p_proposal_id: id, p_status: status });
  if (error) redirect("/admin/growth/proposals?error=status");
  revalidatePath("/admin/growth/proposals");
  revalidatePath("/portal");
  redirect("/admin/growth/proposals?updated=1");
}


export async function setKpiValue(metric: string, value: number): Promise<GrowthActionResult> {
  const cleanMetric = String(metric ?? "").trim();
  if (!cleanMetric || cleanMetric.length > 120 || !Number.isFinite(value) || value < 0 || value > 1000000000) {
    return { ok: false, error: "Enter a valid KPI value." };
  }
  const context = await requireGrowthAdminAction();
  if ("error" in context) return { ok: false, error: context.error };
  const { error } = await context.admin.rpc("growth_update_kpi", {
    p_actor: context.user.id, p_metric: cleanMetric, p_current_value: value,
  });
  if (error) return { ok: false, error: "This KPI could not be updated. It may be calculated automatically." };
  revalidatePath("/admin/growth");
  return { ok: true };
}
