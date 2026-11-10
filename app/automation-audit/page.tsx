import type { Metadata } from "next";
import { AuditLandingPage, type AuditLandingConfig } from "@/components/audit/AuditLandingPage";

// Outreach landing page: reached from email links, so it stays out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Free Workflow Review",
  description: "Request a free, no-obligation review of the manual work in your business that could be automated.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/automation-audit" },
};

const config: AuditLandingConfig = {
  track: "ai_automation",
  eyebrow: "Free workflow review",
  headline: "Find the manual work your team should not be doing.",
  intro:
    "Tell us about one repetitive task or process in your business. We will review how it works today and show you where automation could save time, reduce errors and speed up follow-up.",
  deliverables: [
    {
      title: "Where the time is going",
      body: "A plain-language look at the process you describe: the steps, the hand-offs and the delays.",
    },
    {
      title: "What can be automated",
      body: "Which parts are good candidates for automation or an AI agent, and which are better left to your team.",
    },
    {
      title: "A practical first step",
      body: "One recommended place to start, connected to the tools you already use.",
    },
  ],
  steps: [
    {
      title: "Describe one process",
      body: "Fill in the short form with the task that takes up the most time, for example lead follow-up or data entry.",
    },
    {
      title: "We map it",
      body: "We look at how the work moves between your tools and people, and where automation would help.",
    },
    {
      title: "You get a written review",
      body: "We reply within one business day with next steps. If it is useful, we can talk through it on a call.",
    },
  ],
  focusLabel: "Which task or process takes the most manual effort?",
  focusPlaceholder: "e.g. following up new enquiries, entering orders into our CRM",
  focusInputType: "text",
  focusMessagePrefix: "Free workflow review requested for",
  submitLabel: "Request my free review",
};

export default function AutomationAuditPage() {
  return <AuditLandingPage config={config} />;
}
