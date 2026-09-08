import { Button } from "@/components/ui/Button";

const problems = [
  {
    title: "Outdated websites",
    description: "Sites that no longer represent your brand or convert visitors effectively.",
  },
  {
    title: "Poor conversion",
    description: "Traffic that does not translate into leads, sales, or meaningful actions.",
  },
  {
    title: "Manual repetitive work",
    description: "Team members spending hours on tasks that can and should be automated.",
  },
  {
    title: "Disconnected business tools",
    description: "Software and systems that do not communicate, creating data silos and friction.",
  },
  {
    title: "Slow lead response",
    description: "Delays in follow-up that cause qualified leads to lose interest or go elsewhere.",
  },
  {
    title: "Inefficient workflows",
    description: "Processes that scale poorly and create bottlenecks as the business grows.",
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
            Most businesses hit the same ceiling. The issue is rarely a lack of effort — it is systems, tools, and digital presence that have not kept pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <h3 className="text-h5 text-text-primary mb-2">{problem.title}</h3>
              <p className="text-body text-text-secondary">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-body text-text-secondary mb-6">
            Burify Labs fixes these problems with modern websites and intelligent automation.
          </p>
          <Button variant="primary" size="lg" href="/contact">
            Start a Project
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HomeProblem;
