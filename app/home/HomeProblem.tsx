const problems = [
  {
    title: "Outdated websites",
    description: "Sites that no longer represent your brand or convert visitors effectively. A website that looks fine but fails to communicate your value clearly is costing you leads.",
  },
  {
    title: "Poor conversion",
    description: "Traffic that does not translate into leads, sales, or meaningful actions. Without clear paths and strong messaging, visitors leave without taking the next step.",
  },
  {
    title: "Manual repetitive work",
    description: "Team members spending hours on tasks that can and should be automated. Data entry, follow-ups, notifications, and reporting are all candidates for intelligent automation.",
  },
  {
    title: "Disconnected business tools",
    description: "Software and systems that do not communicate, creating data silos and friction. When your CRM, forms, email, and calendar operate separately, information gets stuck.",
  },
  {
    title: "Slow lead response",
    description: "Delays in follow-up that cause qualified leads to lose interest or go elsewhere. The window for a meaningful response is often much shorter than most teams realize.",
  },
  {
    title: "Inefficient workflows",
    description: "Processes that scale poorly and create bottlenecks as the business grows. Without automation in place, every new customer or transaction adds more manual work.",
  },
];

export function HomeProblem() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background-secondary" id="problems">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            The problems slowing your business down
          </h2>
          <p className="text-body-lg text-text-secondary">
            Most businesses hit the same ceiling. The issue is rarely effort — it is systems, tools, and digital presence that have not kept pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-2">{problem.title}</h3>
              <p className="text-body text-text-secondary leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-body text-text-secondary text-center leading-relaxed">
            These problems share a common cause: digital systems designed without a clear understanding of how the business actually operates.
            Burify Labs approaches every project with that context at the centre. Strategy comes first.
            Technology comes second. That order is what makes the difference between a website that looks good and one that performs.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomeProblem;
