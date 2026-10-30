import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) throw new Error("User management requires SUPABASE_SECRET_KEY to be configured on the server.");
  return createSupabaseClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
}
