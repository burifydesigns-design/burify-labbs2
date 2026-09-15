import { NextResponse } from "next/server";

const MAX_REQUEST_BYTES = 10_000;
const REQUEST_TIMEOUT_MS = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactSubmission = {
  name: string;
  email: string;
};

type ValidationResult =
  | { success: true; data: ContactSubmission }
  | { success: false; error: string };

function failure(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function validateSubmission(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, error: "Please provide your contact details." };
  }

  const body = value as Record<string, unknown>;

  // A filled honeypot is treated as accepted so automated senders get no signal.
  if (typeof body.websiteUrl === "string" && body.websiteUrl.trim()) {
    return { success: true, data: { name: "", email: "" } };
  }

  if (typeof body.name !== "string" || typeof body.email !== "string") {
    return { success: false, error: "Please provide your name and email address." };
  }

  const name = body.name.trim().replace(/\s+/g, " ");
  const email = body.email.trim().toLowerCase();

  if (!name) {
    return { success: false, error: "Please provide your name." };
  }

  if (name.length > 100) {
    return { success: false, error: "Name must be 100 characters or fewer." };
  }

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  return { success: true, data: { name, email } };
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
    return failure(rawBody ? "The submitted form is too large." : "Please provide your contact details.", rawBody ? 413 : 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return failure("The submitted form is not valid JSON.", 400);
  }

  const validation = validateSubmission(body);
  if (!validation.success) {
    return failure(validation.error, 400);
  }

  // Silently accept honeypot submissions without forwarding them.
  if (!validation.data.name) {
    return NextResponse.json({
      success: true,
      message: "Your project inquiry has been received.",
    });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return failure("Unable to submit your message right now.", 503);
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return failure("Unable to submit your message right now.", 502);
  }

  if (!upstreamResponse.ok) {
    return failure("Unable to submit your message right now.", 502);
  }

  let upstreamBody: unknown;
  try {
    upstreamBody = await upstreamResponse.json();
  } catch {
    return failure("Unable to submit your message right now.", 502);
  }

  if (
    !upstreamBody ||
    typeof upstreamBody !== "object" ||
    (upstreamBody as { success?: unknown }).success !== true
  ) {
    return failure("Unable to submit your message right now.", 502);
  }

  return NextResponse.json({
    success: true,
    message: "Your project inquiry has been received.",
  });
}

