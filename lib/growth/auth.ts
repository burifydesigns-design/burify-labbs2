import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Growth tools can send email to prospects, so they are limited to administrators.
export async function requireGrowthAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = profile?.role ?? "";
  if (!["admin", "marketing"].includes(role)) { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }
  if (role !== "admin") redirect("/admin");
  return { supabase, user };
}
