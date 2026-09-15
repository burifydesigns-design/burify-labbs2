import Link from "next/link";

const services = [
  {
    name: "Web Design",
    description:
      "Conversion-focused websites built to represent your brand and drive results. We design around your audience, your goals, and the actions you want visitors to take.",
    href: "/services/web-design",
  },
  {
    name: "AI Automation",
    description:
      "Intelligent automation that removes repetitive work from your team. We connect your tools and implement systems that handle leads, data, notifications, and follow-ups without manual input.",
    href: "/services/ai-automation",
  },
  {
    name: "AI Agents",
    description:
      "Autonomous systems that understand requests, retrieve information, and perform tasks across your business tools. Built for customer support, lead handling, and internal operations.",
    href: "/services/ai-agents",
  },
  {
    name: "Workflow Automation",
    description:
      "Connected tools running on triggers and conditions. We design workflows that move data, route leads, send notifications, and keep your business systems in sync.",
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
            Four core capabilities designed to help modern businesses grow — websites that convert,
            automation systems that save time, and intelligent agents that handle tasks autonomously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-3 group-hover:text-primary transition-colors duration-200">
                {service.name}
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">{service.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-body text-text-secondary text-center leading-relaxed">
            Every engagement starts with understanding your business. We map your goals, identify the highest-impact opportunities,
            and build solutions that integrate cleanly with the tools and workflows your team already uses.
            The result is a website and automation stack that work together — not a collection of disconnected parts.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
