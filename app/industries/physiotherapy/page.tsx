import { IndustryLanding, type IndustryPageConfig } from "@/components/growth/IndustryLanding";
import { createResourceMetadata } from "@/lib/seo";

const page: IndustryPageConfig = {
  eyebrow: "Physiotherapy practice growth",
  title: "Make it easier for people to understand your services and book a visit.",
  intro: "Connect clear service information, local search foundations, accessible website journeys and reliable enquiry handling for physiotherapy and rehabilitation practices.",
  problems: ["Treatment information is hard to scan on a phone.", "Visitors are unsure which service is relevant to their needs.", "Appointment actions are buried or inconsistent.", "Local service pages do not reflect the practice's locations and focus areas.", "Enquiries and follow-ups are handled manually across multiple channels."],
  solutions: [
    { title: "Service-led website design", description: "Clear pages for physiotherapy, sports injury care, rehabilitation and other practice-approved services." },
    { title: "Local visibility", description: "Location-aware page structure, technical SEO and useful information that supports local discovery." },
    { title: "Appointment journeys", description: "Accessible calls to action and enquiry forms designed for mobile visitors." },
    { title: "Workflow automation", description: "Administrative acknowledgements, internal notifications and follow-up tasks with appropriate consent and oversight." },
  ],
  process: ["Map your services, locations and current patient journey.", "Identify content, accessibility and conversion gaps.", "Prioritise the website and workflow improvements.", "Implement and test across devices.", "Review performance and iterate."],
  faqs: [
    { question: "Can you work with an existing physiotherapy website?", answer: "Yes. We can review the existing site and recommend focused improvements or a full rebuild depending on its condition and goals." },
    { question: "Can forms collect patient symptoms or medical histories?", answer: "We recommend collecting only the minimum information needed for an enquiry. Sensitive clinical information should be handled through appropriately secured, practice-approved systems." },
    { question: "Do you guarantee search rankings?", answer: "No. SEO outcomes depend on competition, location, site quality and many external factors. We implement sound technical and content foundations and measure progress." },
  ],
};

export const metadata = createResourceMetadata({ title: "Physiotherapy Practice Growth", description: "Accessible physiotherapy websites, local SEO, appointment journeys and enquiry workflow automation.", path: "/industries/physiotherapy" });

export default function PhysiotherapyPage() { return <IndustryLanding page={page} />; }
