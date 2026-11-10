import type { Metadata } from "next";
import { AuditLandingPage, type AuditLandingConfig } from "@/components/audit/AuditLandingPage";

// Outreach landing page: reached from email links, so it stays out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Free Website Review",
  description: "Request a free, no-obligation review of your website from Burify Labs.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/website-audit" },
};

const config: AuditLandingConfig = {
  track: "web_design",
  eyebrow: "Free website review",
  headline: "See what your website is costing you in enquiries.",
  intro:
    "Send us your website address and we will review it the way a first-time visitor sees it, then tell you what is getting in the way of enquiries and what we would change first.",
  deliverables: [
    {
      title: "A clear read of your first impression",
      body: "How quickly a new visitor understands what you do, who it is for, and what to do next.",
    },
    {
      title: "The specific gaps we spot",
      body: "Concrete issues on your own pages across messaging, structure, speed and calls to action, not a generic checklist.",
    },
    {
      title: "What we would fix first",
      body: "A short, prioritised list of changes, with the reason behind each one.",
    },
  ],
  steps: [
    {
      title: "Share your website",
      body: "Fill in the short form with your site address and a few details about your business.",
    },
    {
      title: "We review it",
      body: "We go through your site as a visitor would and note what helps and what holds enquiries back.",
    },
    {
      title: "You get a written review",
      body: "We reply within one business day with next steps. If it is useful, we can talk through it on a call.",
    },
  ],
  focusLabel: "Your website address",
  focusPlaceholder: "https://yourcompany.com",
  focusInputType: "url",
  focusMessagePrefix: "Free website review requested for",
  submitLabel: "Request my free review",
};

export default function WebsiteAuditPage() {
  return <AuditLandingPage config={config} />;
}
