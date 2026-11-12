import Link from "next/link";
import { createResourceMetadata } from "@/lib/seo";

export const metadata = createResourceMetadata({ title: "Patient Growth Systems", description: "A connected approach to healthcare website design, local search, enquiry conversion, workflow automation and performance reporting.", path: "/patient-growth" });

const stages = [
  ["01", "Attract", "Build strong foundations for local discovery through useful service pages, technical SEO and clear business information."],
  ["02", "Convert", "Make it easy for visitors to understand services, request information and take the next step."],
  ["03", "Respond", "Route enquiries to the right people and support consistent acknowledgements and follow-up."],
  ["04", "Measure", "Understand where enquiries originate and which parts of the journey need attention."],
  ["05", "Improve", "Use real data and feedback to prioritise ongoing website and workflow improvements."],
];

export default function PatientGrowthPage() {
  return <main id="main-content">
    <section className="growth-hero"><div className="growth-container"><p className="growth-eyebrow">Burify Patient Growth Systems</p><h1>A connected digital system for attracting, converting and managing patient enquiries.</h1><p className="growth-intro">Websites, local search, enquiry journeys, responsible automation and reporting — planned together instead of sold as disconnected tasks.</p><div className="growth-actions"><Link className="growth-button growth-button-primary" href="/contact">Discuss your growth system</Link><Link className="growth-button growth-button-secondary" href="/growth-assessment">Take the free growth check</Link></div></div></section>
    <section className="growth-section"><div className="growth-container"><p className="growth-eyebrow">The system</p><h2>Five connected stages</h2><div className="growth-grid growth-grid-five">{stages.map(([number,title,description])=><article className="growth-card" key={number}><span className="growth-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="growth-section growth-section-muted"><div className="growth-container"><p className="growth-eyebrow">Built for real practice workflows</p><h2>Useful for independent practices and growing groups</h2><div className="growth-grid growth-grid-three"><article className="growth-card"><h3>Dental practices</h3><p>Implant, orthodontic, clear aligner, cosmetic and general dentistry journeys.</p><Link href="/industries/dental-practices">Explore dental growth →</Link></article><article className="growth-card"><h3>Physiotherapy</h3><p>Service discovery, local visibility and appointment pathways.</p><Link href="/industries/physiotherapy">Explore physiotherapy →</Link></article><article className="growth-card"><h3>Private healthcare</h3><p>Clear service architecture, enquiry handling and operational workflows.</p><Link href="/industries/private-healthcare">Explore healthcare →</Link></article></div></div></section>
    <section className="growth-final-cta"><div className="growth-container"><h2>Start with the part of your patient journey that needs attention.</h2><p>We will help define a practical scope based on your practice, systems and goals.</p><Link className="growth-button growth-button-light" href="/contact">Book a strategy call</Link></div></section>
  </main>;
}
