import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_REQUEST_BYTES = 10_000;
const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

type ContactSubmission = {
  name: string;
  email: string;
  company: string | null;
  service_interest: string | null;
  message: string;
  consent: boolean;
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
      data: { name: "", email: "", company: null, service_interest: null, message: "", consent: false },
      honeypot: true,
    };
  }

  if (typeof body.name !== "string" || typeof body.email !== "string") {
    return { success: false, error: "Please provide your name and email address." };
  }

  const name = body.name.trim().replace(/\\s+/g, " ");
  const email = body.email.trim().toLowerCase();
  const company = optionalText(body.company, 200);
  const serviceInterest = optionalText(body.service_interest ?? body.service, 200);
  const message = optionalText(body.message ?? body.projectDetails, 5_000);
  const consent = body.consent === undefined ? false : body.consent;

  if (!name) return { success: false, error: "Please provide your name." };
  if (name.length > 100) return { success: false, error: "Name must be 100 characters or fewer." };
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (company === false) return { success: false, error: "Company name must be 200 characters or fewer." };
  if (serviceInterest === false) return { success: false, error: "Service selection is too long." };
  if (message === false) return { success: false, error: "Message must be 5,000 characters or fewer." };
  if (typeof consent !== "boolean") return { success: false, error: "Consent must be a true or false value." };

  return {
    success: true,
    data: {
      name,
      email,
      company,
      service_interest: serviceInterest,
      message: message ?? "",
      consent,
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

  // Do not persist spam honeypot submissions.
  if (validation.honeypot) {
    return NextResponse.json({
      success: true,
      message: "Your project inquiry has been received.",
    });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_submissions").insert(validation.data);

    if (error) {
      // Keep database details in server logs only; never expose them to the public client.
      console.error("Contact submission insert failed:", error.message);
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
    message: "Your project inquiry has been received.",
  });
}
