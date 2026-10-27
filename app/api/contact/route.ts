import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_REQUEST_BYTES = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Submission = {
  name: string;
  email: string;
  company: string | null;
  service_interest: string | null;
  message: string;
  consent: boolean;
};

function failure(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function validate(value: unknown): { success: true; data: Submission } | { success: false; error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, error: "Please provide your contact details." };
  }
  const body = value as Record<string, unknown>;
  if (typeof body.websiteUrl === "string" && body.websiteUrl.trim()) {
    return { success: true, data: { name: "", email: "", company: null, service_interest: null, message: "", consent: false } };
  }
  if (typeof body.name !== "string" || typeof body.email !== "string") {
    return { success: false, error: "Please provide your name and email address." };
  }
  const name = body.name.trim().replace(/\s+/g, " ");
  const email = body.email.trim().toLowerCase();
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const service = typeof body.service_interest === "string" ? body.service_interest.trim() :
    typeof body.service === "string" ? body.service.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() :
    typeof body.projectDetails === "string" ? body.projectDetails.trim() : "";
  const consent = body.consent === true || body.consent === "true";
  if (!name || name.length > 100) return { success: false, error: "Please enter a name of 1–100 characters." };
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return { success: false, error: "Please provide a valid email address." };
  if (company.length > 160 || service.length > 120 || message.length > 5000) return { success: false, error: "One or more fields exceed the allowed length." };
  return { success: true, data: { name, email, company: company || null, service_interest: service || null, message, consent } };
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return failure("Please send the form as JSON.", 415);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) return failure("The submitted form is too large.", 413);
  let raw: string;
  try { raw = await request.text(); } catch { return failure("Unable to read the submitted form.", 400); }
  if (!raw || new TextEncoder().encode(raw).length > MAX_REQUEST_BYTES) {
    return failure(raw ? "The submitted form is too large." : "Please provide your contact details.", raw ? 413 : 400);
  }
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return failure("The submitted form is not valid JSON.", 400); }
  const parsed = validate(body);
  if (!parsed.success) return failure(parsed.error, 400);
  // Honeypot bots receive a generic success response but are not stored.
  if (!parsed.data.name) return NextResponse.json({ success: true, message: "Your project inquiry has been received." });

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      service_interest: parsed.data.service_interest,
      message: parsed.data.message,
      consent: parsed.data.consent,
      status: "new",
    });
    if (error) {
      console.error("Contact submission insert failed:", error.code);
      return failure("Unable to submit your message right now.", 503);
    }
    return NextResponse.json({ success: true, message: "Your project inquiry has been received." });
  } catch {
    return failure("Unable to submit your message right now.", 503);
  }
}
