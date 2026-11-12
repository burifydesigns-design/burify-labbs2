import Link from "next/link";
import { createResourceMetadata } from "@/lib/seo";

export const metadata = createResourceMetadata({ title: "Growth Resources", description: "Practical resources on dental practice growth, healthcare websites, local SEO, enquiry conversion and business automation.", path: "/resources" });

const resources = [
  { category: "Assessment", title: "Website Growth Assessment", description: "A six-question review of website clarity, booking journeys, visibility, follow-up and measurement.", href: "/growth-assessment", label: "Take the assessment" },
  { category: "Dental practices", title: "Dental Practice Digital Growth Checklist", description: "A practical checklist covering treatment pages, local visibility, trust, mobile usability and enquiry paths.", href: "/industries/dental-practices", label: "Explore dental growth" },
  { category: "Healthcare", title: "A Better Healthcare Website Enquiry Journey", description: "Learn what makes service information, contact options and follow-up easier for visitors and teams.", href: "/industries/private-healthcare", label: "Explore healthcare solutions" },
  { category: "Automation", title: "Responsible Enquiry Follow-up Automation", description: "Understand where acknowledgements, routing and reminders can support a team without replacing human judgement.", href: "/patient-growth", label: "Explore the growth system" },
];

export default function ResourcesPage() {
  return <main id="main-content">
    <section className="growth-hero"><div className="growth-container"><p className="growth-eyebrow">Burify resources</p><h1>Practical ideas for better digital growth.</h1><p className="growth-intro">Guides and tools to help practices and businesses improve their websites, enquiry journeys and everyday workflows.</p></div></section>
    <section className="growth-section"><div className="growth-container"><div className="growth-grid growth-grid-two">{resources.map((resource)=><article className="growth-card growth-resource-card" key={resource.title}><p className="growth-eyebrow">{resource.category}</p><h2>{resource.title}</h2><p>{resource.description}</p><Link href={resource.href}>{resource.label} →</Link></article>)}</div><p className="growth-disclaimer">Resources are general educational information, not clinical, legal or financial advice. Practice-specific claims and patient-facing clinical content should be reviewed by the relevant qualified professionals.</p></div></section>
  </main>;
}
