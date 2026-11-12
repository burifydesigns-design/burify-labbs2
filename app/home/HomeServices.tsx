import Link from "next/link";

const services = [
  { name: "Patient Growth Systems", description: "A connected approach to practice websites, local visibility, patient enquiries, follow-up workflows and performance reporting.", href: "/patient-growth" },
  { name: "Website Design & Development", description: "Accessible, conversion-focused websites built around your audience, services and business goals.", href: "/services/web-design" },
  { name: "Workflow & AI Automation", description: "Connect your tools and reduce repetitive administration with carefully scoped, human-supervised workflows.", href: "/services/workflow-automation" },
  { name: "AI Agents & Integrations", description: "Practical assistants and integrations for information retrieval, internal processes and approved customer-service tasks.", href: "/services/ai-agents" },
];

export function HomeServices() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="services">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-caption font-semibold text-primary uppercase tracking-widest mb-3">What we build</p>
          <h2 className="text-h2 text-text-primary mb-4">The digital systems behind sustainable growth.</h2>
          <p className="text-body-lg text-text-secondary">Start with the business outcome. We bring the website, technology and workflows together around it.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => <Link key={service.href} href={service.href} className="group p-6 rounded-lg border border-border bg-background transition-all duration-200 hover:border-primary hover:shadow-md"><h3 className="text-h5 text-text-primary mb-3 group-hover:text-primary transition-colors">{service.name}</h3><p className="text-body text-text-secondary leading-relaxed">{service.description}</p><span className="inline-block mt-5 text-sm font-semibold text-primary">Explore solution →</span></Link>)}
        </div>
        <div className="mt-12 text-center"><Link href="/industries/dental-practices" className="text-primary font-semibold underline underline-offset-4">Explore solutions for dental practices</Link></div>
      </div>
    </section>
  );
}
export default HomeServices;
