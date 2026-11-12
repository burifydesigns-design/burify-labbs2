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
