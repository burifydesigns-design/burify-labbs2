"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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


export async function portalRespondToProposal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  const proposalId = String(formData.get("proposal_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(proposalId) || !["accepted","declined"].includes(status)) {
    redirect("/portal?proposal=invalid");
  }
  const { error } = await createAdminClient().rpc("growth_client_proposal_response_api", {
    p_user_id: user.id, p_proposal_id: proposalId, p_status: status,
  });
  if (error) redirect("/portal?proposal=error");
  revalidatePath("/portal");
  revalidatePath("/admin/growth/proposals");
  redirect("/portal?proposal=" + status);
}
