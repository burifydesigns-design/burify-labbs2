import { createAdminClient } from "@/lib/supabase/admin";
import { validUnsubToken } from "@/lib/growth/template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

async function handle(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("e") || "").trim().toLowerCase();
  const token = url.searchParams.get("t") || "";
  if (!email || email.length > 254 || !validUnsubToken(email, token)) return new Response("This unsubscribe link is not valid.", { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.rpc("growth_unsubscribe_api", { p_email: email });
  if (error) return new Response("We could not process this unsubscribe request. Please contact Burify.", { status: 503 });
  await admin.from("notion_crm_leads").update({ outreach_suppressed: true }).ilike("email", email);
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Unsubscribed</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;background:#f7f6f1;color:#292a26"><main style="max-width:420px;text-align:center"><h1 style="font-size:22px">You’re unsubscribed</h1><p style="color:#5d5b55;line-height:1.6">${escapeHtml(email)} won’t receive further emails from Burify.</p></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
}

export const GET = handle;
export const POST = handle;
