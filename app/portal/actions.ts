"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function portalSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/portal/login?error=missing");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/portal/login?error=invalid");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?error=invalid");
  const { error: accessError } = await createAdminClient().rpc("growth_client_portal_api", { p_user_id: user.id });
  if (accessError) {
    await supabase.auth.signOut();
    redirect("/portal/login?error=not-linked");
  }
  redirect("/portal");
}

export async function portalSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
