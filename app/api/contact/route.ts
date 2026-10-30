import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_REQUEST_BYTES = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactSubmission = {
  name: string;
  email: string;
  company: string | null;
  service_interest: string | null;
  message: string;
  consent: true;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

type ValidationResult =
  | { success: true; data: ContactSubmission; honeypot: boolean }
  | { success: false; error: string };

function failure(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function optionalText(value: unknown, maxLength: number): string | null | false {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  if (normalized.length > maxLength) return false;
  return normalized || null;
}

function validateSubmission(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, error: "Please provide your contact details." };
  }

  const body = value as Record<string, unknown>;

  // Silently accept honeypot submissions to avoid giving automated senders a signal.
  if (typeof body.websiteUrl === "string" && body.websiteUrl.trim()) {
    return {
      success: true,
      data: {
        name: "", email: "", company: null, service_interest: null, message: "",
        consent: true, landing_page: null, referrer: null,
        utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null,
      },
      honeypot: true,
    };
  }

  if (typeof body.name !== "string" || typeof body.email !== "string") {
    return { success: false, error: "Please provide your name and email address." };
  }

  const name = body.name.trim().replace(/\s+/g, " ");
  const email = body.email.trim().toLowerCase();
  const company = optionalText(body.company, 180);
  const serviceInterest = optionalText(body.service_interest ?? body.service, 160);
  const message = optionalText(body.message ?? body.projectDetails, 5_000);
  const landingPage = optionalText(body.landing_page, 2_048);
  const referrer = optionalText(body.referrer, 2_048);
  const utmSource = optionalText(body.utm_source, 200);
  const utmMedium = optionalText(body.utm_medium, 200);
  const utmCampaign = optionalText(body.utm_campaign, 200);
  const utmTerm = optionalText(body.utm_term, 200);
  const utmContent = optionalText(body.utm_content, 200);

  if (!name) return { success: false, error: "Please provide your name." };
  if (name.length > 100) return { success: false, error: "Name must be 100 characters or fewer." };
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (company === false) return { success: false, error: "Company name must be 180 characters or fewer." };
  if (serviceInterest === false) return { success: false, error: "Service selection is too long." };
  if (message === false) return { success: false, error: "Message must be 5,000 characters or fewer." };
  if (landingPage === false || referrer === false) return { success: false, error: "Page attribution is too long." };
  if ([utmSource, utmMedium, utmCampaign, utmTerm, utmContent].some((item) => item === false)) {
    return { success: false, error: "Campaign attribution is too long." };
  }
  if (body.consent !== true) {
    return { success: false, error: "Consent is required before submitting this enquiry." };
  }

  return {
    success: true,
    data: {
      name,
      email,
      company: company || null,
      service_interest: serviceInterest || null,
      message: message || "Discovery call request submitted through the Burify website.",
      consent: true,
      landing_page: landingPage || null,
      referrer: referrer || null,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
    },
    honeypot: false,
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return failure("Please send the form as JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return failure("The submitted form is too large.", 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return failure("Unable to read the submitted form.", 400);
  }

  if (!rawBody || new TextEncoder().encode(rawBody).length > MAX_REQUEST_BYTES) {
    return failure(
      rawBody ? "The submitted form is too large." : "Please provide your contact details.",
      rawBody ? 413 : 400,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return failure("The submitted form is not valid JSON.", 400);
  }

  const validation = validateSubmission(body);
  if (!validation.success) return failure(validation.error, 400);

  // Keep honeypot responses indistinguishable from successful submissions.
  if (validation.honeypot) {
    return NextResponse.json({ success: true, message: "Your project inquiry has been received." });
  }

  try {
    const admin = createAdminClient();
    const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) return failure("Contact submission is temporarily unavailable.", 503);

    // Hash the visitor IP before storing it; raw IP addresses are never written to the database.
    const ipAddress =
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = createHash("sha256").update(secret + ":" + ipAddress).digest("hex");

    const { data: allowed, error: rateLimitError } = await admin.rpc("consume_contact_rate_limit", {
      p_ip_hash: ipHash,
      p_limit: 5,
      p_window_seconds: 600,
    });
    if (rateLimitError) {
      console.error("Contact rate-limit check failed:", rateLimitError.message);
      return failure("Unable to submit your message right now.", 503);
    }
    if (allowed !== true) {
      return failure("Too many enquiries were submitted. Please wait a few minutes and try again.", 429);
    }

    // One database function writes the inbox record and linked sales lead atomically.
    const { error } = await admin.rpc("create_website_contact_and_lead", {
      p_submission: validation.data,
    });
    if (error) {
      console.error("Contact and lead creation failed:", error.message);
      return failure("Unable to submit your message right now.", 503);
    }
  } catch (error) {
    console.error(
      "Contact submission could not connect to Supabase:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return failure("Unable to submit your message right now.", 503);
  }

  return NextResponse.json({
    success: true,
    message: "Your enquiry has been saved to the contact inbox and sales pipeline.",
  });
}
