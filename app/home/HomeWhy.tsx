const reasons = [
  {
    title: "Strategy before technology",
    description:
      "We define the business outcome before writing a line of code or configuring an automation.",
  },
  {
    title: "Custom solutions",
    description:
      "No rigid packages. Every website and automation system is built around your specific goals.",
  },
  {
    title: "Design and automation under one roof",
    description:
      "You work with a single team for both web design and AI automation, reducing handoff friction.",
  },
  {
    title: "Business-focused implementation",
    description:
      "We build for how your business actually operates, not for demo reels or feature checklists.",
  },
  {
    title: "Modern technology",
    description:
      "Current frameworks, platforms, and AI tools so your systems stay viable as the landscape changes.",
  },
  {
    title: "Long-term scalability",
    description:
      "Websites and automations designed to grow with your traffic, data, and team.",
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
            A different approach to digital agency work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-2">{reason.title}</h3>
              <p className="text-body text-text-secondary">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWhy;
