"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error || profile?.role !== "admin") redirect("/admin/login?error=unauthorized");
  return supabase;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=invalid");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login?error=invalid");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "qualified", "proposal", "won", "lost", "nurture"].includes(status)) redirect("/admin?error=invalid-status");
  const { error } = await supabase.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  redirect(error ? "/admin?error=update-failed" : "/admin?updated=1");
}

export async function updateContactStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "read", "replied", "archived", "spam"].includes(status)) redirect("/admin?error=invalid-contact-status");
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
  redirect(error ? "/admin?error=contact-update-failed" : "/admin?contactUpdated=1");
}


export async function inviteDashboardUser(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "member");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || !["admin", "member"].includes(role)) {
    redirect("/admin?usersError=invalid");
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });
  if (error || !data.user) redirect("/admin?usersError=invite-failed");

  const now = new Date().toISOString();
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    role,
    created_at: now,
    updated_at: now,
  }, { onConflict: "id" });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    redirect("/admin?usersError=profile-failed");
  }

  revalidatePath("/admin");
  redirect("/admin?userAdded=1");
}

export async function removeDashboardUser(formData: FormData) {
  const supabase = await requireAdmin();
  const { data: { user: actor } } = await supabase.auth.getUser();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId || !actor || userId === actor.id) redirect("/admin?usersError=invalid-removal");

  const admin = createAdminClient();
  const { data: target, error: lookupError } = await admin
    .from("profiles").select("id,role").eq("id", userId).maybeSingle();
  if (lookupError || !target) redirect("/admin?usersError=user-not-found");

  if (target.role === "admin") {
    const { count, error: countError } = await admin
      .from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if (countError || (count ?? 0) <= 1) redirect("/admin?usersError=last-admin");
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) redirect("/admin?usersError=remove-failed");
  await admin.from("profiles").delete().eq("id", userId);

  revalidatePath("/admin");
  redirect("/admin?userRemoved=1");
}
