import Link from "next/link";

const services = [
  {
    name: "Web Design",
    description: "Modern, conversion-focused websites built to represent your brand and drive results.",
    href: "/services/web-design",
  },
  {
    name: "AI Automation",
    description: "Automate repetitive business processes and reduce manual work across your operations.",
    href: "/services/ai-automation",
  },
  {
    name: "AI Agents",
    description: "Build intelligent systems that handle specific business tasks with minimal human input.",
    href: "/services/ai-agents",
  },
  {
    name: "Workflow Automation",
    description: "Connect tools and automate workflows so data and actions flow across your business.",
    href: "/services/workflow-automation",
  },
];

export function HomeServices() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="services">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            What we do
          </h2>
          <p className="text-body-lg text-text-secondary">
            Four core capabilities designed to help modern businesses grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
                {service.name}
              </h3>
              <p className="text-body text-text-secondary">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
