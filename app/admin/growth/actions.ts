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
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin/login?error=unauthorized");
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
