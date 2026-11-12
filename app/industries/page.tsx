import Link from "next/link";
import { createResourceMetadata } from "@/lib/seo";

export const metadata = createResourceMetadata({ title: "Industries We Support", description: "Digital growth systems for dental practices, physiotherapy clinics and private healthcare providers.", path: "/industries" });

const sectors = [
  { title: "Dental practices", description: "Treatment-led websites, local search foundations, patient enquiry conversion and follow-up workflows.", href: "/industries/dental-practices", focus: "Implants · Orthodontics · Clear aligners · Cosmetic dentistry" },
  { title: "Physiotherapy practices", description: "Accessible service pages, local visibility, appointment journeys and reliable enquiry handling.", href: "/industries/physiotherapy", focus: "Physiotherapy · Sports care · Rehabilitation" },
  { title: "Private healthcare", description: "Clear digital experiences, service discovery, secure enquiry routing and responsible automation.", href: "/industries/private-healthcare", focus: "Private clinics · Specialist providers · Healthcare groups" },
];

export default function IndustriesPage() {
  return <main id="main-content"><section className="growth-hero"><div className="growth-container"><p className="growth-eyebrow">Industries</p><h1>Digital systems shaped around the businesses you serve.</h1><p className="growth-intro">We focus on private healthcare and selected service businesses where better websites, clearer enquiry journeys and thoughtful automation can make everyday operations easier.</p></div></section><section className="growth-section"><div className="growth-container growth-grid growth-grid-three">{sectors.map((sector)=><article className="growth-card" key={sector.href}><p className="growth-eyebrow">{sector.focus}</p><h2>{sector.title}</h2><p>{sector.description}</p><Link href={sector.href}>Explore solutions →</Link></article>)}</div></section></main>;
}