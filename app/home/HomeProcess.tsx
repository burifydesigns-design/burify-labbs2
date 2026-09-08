import { ProcessCard } from "@/components/ui/cards";

const steps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Understand your business, audience, goals, and the operational workflows that need attention.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Map the website structure and automation logic before any development begins.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Develop the website and implement automation systems with clear milestones and reviews.",
  },
  {
    step: "04",
    title: "Optimize",
    description:
      "Refine performance, conversions, and automation efficiency based on real-world results.",
  },
];

export function HomeProcess() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="process">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            How a project works
          </h2>
          <p className="text-body-lg text-text-secondary">
            A repeatable process that keeps projects on track and aligned with your goals.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {steps.map((item, index) => (
              <ProcessCard
                key={item.step}
                step={parseInt(item.step)}
                title={item.title}
                description={item.description}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeProcess;
