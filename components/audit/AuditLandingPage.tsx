"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SERVICE_FOR_TRACK, type LeadTrack } from "@/lib/lead-track";

export type AuditLandingConfig = {
  track: LeadTrack;
  eyebrow: string;
  headline: string;
  intro: string;
  deliverables: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  focusLabel: string;
  focusPlaceholder: string;
  focusInputType: "url" | "text";
  focusMessagePrefix: string;
  submitLabel: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "focus", string>>;

const inputClass =
  "w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function AuditLandingPage({ config }: { config: AuditLandingConfig }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inProgress = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inProgress.current) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanFocus = focus.trim();
    const errors: FieldErrors = {};

    if (!cleanName) errors.name = "Please enter your name.";
    else if (cleanName.length > 100) errors.name = "Name must be 100 characters or fewer.";

    if (!cleanEmail) errors.email = "Please enter your email.";
    else if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!cleanFocus) errors.focus = "Please fill this in so we know what to review.";
    else if (cleanFocus.length > 1_000) errors.focus = "Please keep this under 1,000 characters.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const formData = new FormData(e.currentTarget);
    const consent = formData.get("consent") === "on";
    if (!consent) {
      setError("Please confirm that Burify may use your details to respond to your request.");
      return;
    }

    inProgress.current = true;
    setIsSending(true);
    try {
      const params = new URLSearchParams(window.location.search);
      let referrer = "";
      try {
        referrer = document.referrer ? new URL(document.referrer).origin : "";
      } catch {
        referrer = "";
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          company: company.trim(),
          service_interest: SERVICE_FOR_TRACK[config.track],
          message: `${config.focusMessagePrefix}: ${cleanFocus}`,
          consent,
          websiteUrl: formData.get("websiteUrl") ?? "",
          landing_page: window.location.pathname,
          referrer,
          utm_source: params.get("utm_source") ?? "",
          utm_medium: params.get("utm_medium") ?? "",
          utm_campaign: params.get("utm_campaign") ?? "",
          utm_term: params.get("utm_term") ?? "",
          utm_content: params.get("utm_content") ?? "",
          track: config.track,
          prospect_ref: params.get("pid") ?? "",
        }),
      });

      const result: unknown = await response.json().catch(() => null);
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        (result as { success?: unknown }).success !== true
      ) {
        throw new Error("Submission failed");
      }

      setName("");
      setEmail("");
      setCompany("");
      setFocus("");
      setFieldErrors({});
      setSuccess("Thanks, your request is in. We will reply with next steps within one business day.");
    } catch {
      setError("Something went wrong while sending your request. Please try again.");
    } finally {
      setIsSending(false);
      inProgress.current = false;
    }
  };

  return (
    <>
      <Navbar variant="light" showCta />
      <main id="main-content">
        {/* ===== HERO ===== */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">{config.eyebrow}</p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">{config.headline}</h1>
              <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">{config.intro}</p>
            </div>
          </div>
        </section>

        {/* ===== DELIVERABLES + FORM ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="text-h3 text-text-primary mb-6">What you get</h2>
                <ul className="space-y-6">
                  {config.deliverables.map((item) => (
                    <li key={item.title}>
                      <h3 className="text-body font-medium text-text-primary mb-1">{item.title}</h3>
                      <p className="text-body text-text-secondary leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="p-8 rounded-2xl border border-border bg-background">
                  <h2 className="text-h3 text-text-primary mb-2">Request your free review</h2>
                  <p className="text-body text-text-secondary mb-6">
                    No obligation. Share a few details and we will take it from there.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="audit-website-url">Leave this field empty</label>
                      <input id="audit-website-url" name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div>
                      <label htmlFor="audit-name" className="block text-body-sm font-medium text-text-primary mb-2">
                        Name <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="audit-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) setFieldErrors((errs) => ({ ...errs, name: undefined }));
                        }}
                        placeholder="Your name"
                        required
                        maxLength={100}
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? "audit-name-error" : undefined}
                        className={inputClass}
                      />
                      {fieldErrors.name && (
                        <p id="audit-name-error" className="mt-2 text-body-sm text-red-500" role="alert">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="audit-email" className="block text-body-sm font-medium text-text-primary mb-2">
                        Work email <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="audit-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) setFieldErrors((errs) => ({ ...errs, email: undefined }));
                        }}
                        placeholder="you@company.com"
                        required
                        maxLength={254}
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "audit-email-error" : undefined}
                        className={inputClass}
                      />
                      {fieldErrors.email && (
                        <p id="audit-email-error" className="mt-2 text-body-sm text-red-500" role="alert">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="audit-company" className="block text-body-sm font-medium text-text-primary mb-2">
                        Company <span className="text-text-secondary">(optional)</span>
                      </label>
                      <input
                        id="audit-company"
                        type="text"
                        autoComplete="organization"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company"
                        maxLength={180}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="audit-focus" className="block text-body-sm font-medium text-text-primary mb-2">
                        {config.focusLabel} <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="audit-focus"
                        name="focus"
                        type={config.focusInputType}
                        value={focus}
                        onChange={(e) => {
                          setFocus(e.target.value);
                          if (fieldErrors.focus) setFieldErrors((errs) => ({ ...errs, focus: undefined }));
                        }}
                        placeholder={config.focusPlaceholder}
                        required
                        maxLength={1000}
                        aria-invalid={!!fieldErrors.focus}
                        aria-describedby={fieldErrors.focus ? "audit-focus-error" : undefined}
                        className={inputClass}
                      />
                      {fieldErrors.focus && (
                        <p id="audit-focus-error" className="mt-2 text-body-sm text-red-500" role="alert">
                          {fieldErrors.focus}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="audit-consent" className="flex items-start gap-3 text-body-sm text-text-secondary">
                        <input
                          id="audit-consent"
                          name="consent"
                          type="checkbox"
                          required
                          className="mt-1 h-4 w-4 shrink-0 accent-primary"
                        />
                        <span>
                          I agree that Burify may use my name and email to respond to this request.
                          <span className="text-accent-pink ml-1">*</span>
                        </span>
                      </label>
                    </div>

                    {error && (
                      <p className="text-body-sm text-red-500" role="alert">
                        {error}
                      </p>
                    )}
                    {success && (
                      <p className="text-body-sm text-green-700" role="status" aria-live="polite">
                        {success}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSending}
                      aria-disabled={isSending}
                      className="w-full px-8 py-4 text-body-sm font-medium rounded-xl bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed transition-all duration-200 ease-out"
                    >
                      {isSending ? "Sending..." : config.submitLabel}
                    </button>

                    <p className="text-body-sm text-text-secondary">
                      Burify Labs sends one-to-one business emails about our own services. If you would rather not
                      hear from us, reply &quot;unsubscribe&quot; to any email and we will stop. See our{" "}
                      <Link href="/privacy" className="text-primary hover:text-primary-dark transition-colors duration-200">
                        privacy policy
                      </Link>
                      .
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="section bg-background">
          <div className="container">
            <h2 className="text-h3 text-text-primary mb-8 text-center">How it works</h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {config.steps.map((step, index) => (
                <li key={step.title} className="p-6 rounded-2xl border border-border">
                  <p className="text-caption font-medium uppercase tracking-widest text-primary mb-2">
                    Step {index + 1}
                  </p>
                  <h3 className="text-body font-medium text-text-primary mb-2">{step.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
