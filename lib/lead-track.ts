export type LeadTrack = "web_design" | "ai_automation";

export const LEAD_TRACKS: readonly LeadTrack[] = ["web_design", "ai_automation"];

const PROSPECT_REF_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export function parseLeadTrack(value: unknown): LeadTrack | null {
  return typeof value === "string" && (LEAD_TRACKS as readonly string[]).includes(value)
    ? (value as LeadTrack)
    : null;
}

/** Prospect refs come from outreach links; anything that is not a short safe token is dropped. */
export function parseProspectRef(value: unknown): string | null {
  return typeof value === "string" && PROSPECT_REF_PATTERN.test(value.trim()) ? value.trim() : null;
}

/** Explicit track wins; otherwise infer it from the service dropdown text. */
export function deriveLeadTrack(explicit: unknown, serviceInterest: string | null): LeadTrack | null {
  const parsed = parseLeadTrack(explicit);
  if (parsed) return parsed;
  const service = (serviceInterest ?? "").toLowerCase();
  if (service.includes("automation")) return "ai_automation";
  if (service.includes("website") || service.includes("web design")) return "web_design";
  return null;
}

export const SERVICE_FOR_TRACK: Record<LeadTrack, string> = {
  web_design: "Website design and development",
  ai_automation: "AI automation",
};
