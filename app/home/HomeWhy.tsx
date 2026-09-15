const reasons = [
  {
    title: "Strategy before technology",
    description:
      "We define the business outcome before writing a line of code or configuring an automation. This means your website or system is built around results, not features.",
  },
  {
    title: "Custom solutions",
    description:
      "No rigid packages. Every website and automation system is built around your specific goals, audience, and operational context. No templates, no one-size-fits-all approaches.",
  },
  {
    title: "Design and automation under one roof",
    description:
      "You work with a single team for both web design and AI automation. That eliminates the handoff friction that happens when multiple agencies or freelancers are involved.",
  },
  {
    title: "Business-focused implementation",
    description:
      "We build for how your business actually operates, not for demo reels or feature checklists. Practical, maintainable systems that your team can understand and trust.",
  },
  {
    title: "Modern technology",
    description:
      "Current frameworks, platforms, and AI tools so your systems stay viable as the landscape changes. We select technology for reliability and fit, not novelty.",
  },
  {
    title: "Long-term scalability",
    description:
      "Websites and automations designed to grow with your traffic, data, and team. Clean architecture that can be extended rather than replaced as your needs evolve.",
  },
];

export function HomeWhy() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background-secondary" id="why">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            Why Burify Labs
          </h2>
          <p className="text-body-lg text-text-secondary">
            A different approach to digital agency work — built around business outcomes, not deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-3">{reason.title}</h3>
              <p className="text-body text-text-secondary leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-body text-text-secondary text-center leading-relaxed">
            The result is a partnership rather than a transaction. Projects delivered with clarity,
            systems built to last, and a team that understands the difference between a website that looks polished
            and one that actually moves the metrics that matter to your business.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomeWhy;
