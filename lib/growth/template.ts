import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export function render(tpl: string, vars: Record<string, string | null | undefined>) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key: string) => (vars[key] ?? "").toString());
}

export function firstName(full?: string | null) {
  const parts = (full ?? "").replace(/,.*$/, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "there";
  if (/^(dr|mr|ms|mrs|prof)\.?$/i.test(parts[0]) && parts[1]) return `${parts[0].replace(/\.?$/, "")} ${parts[1]}`;
  return parts[0];
}

function secret() {
  return process.env.CRON_SECRET || "";
}

export function unsubToken(email: string) {
  return createHmac("sha256", secret()).update(email.toLowerCase()).digest("hex").slice(0, 32);
}

export function validUnsubToken(email: string, token: string) {
  if (!secret() || !email || !token) return false;
  const a = Buffer.from(unsubToken(email));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unsubUrl(email: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com").replace(/\/$/, "");
  return `${base}/api/growth/unsubscribe?e=${encodeURIComponent(email.toLowerCase())}&t=${unsubToken(email)}`;
}

export function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.CRON_SECRET);
}
