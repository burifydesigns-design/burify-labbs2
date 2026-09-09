const workflowSteps = [
  { label: "Manual Task", description: "Repetitive entry, follow-up, data sync, and notification work done by hand." },
  { label: "AI + Automation", description: "Intelligent systems identify, qualify, route, and execute the same work without manual input." },
  { label: "Automated Workflow", description: "Connected tools run on triggers, conditions, and schedules across your stack." },
  { label: "Business Result", description: "Faster response, fewer errors, and more capacity for higher-value work." },
];

export function HomeAutomation() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="automation">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            AI Automation
          </h2>
          <p className="text-body-lg text-text-secondary">
            From manual tasks to automated workflows that run themselves.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="relative">
                <div className="p-6 rounded-xl border border-border bg-background h-full">
                  <p className="text-caption font-medium text-primary uppercase tracking-widest mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-h5 text-text-primary mb-2">{step.label}</h3>
                  <p className="text-body-sm text-text-secondary">{step.description}</p>
                </div>

                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full z-10">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Lead capture", "Lead qualification", "Customer follow-up", "Data entry", "Notifications", "Internal workflows", "Appointment workflows", "Reporting"].map((example) => (
              <div
                key={example}
                className="px-4 py-3 rounded-lg border border-border bg-background-secondary text-center"
              >
                <p className="text-body-sm text-text-secondary">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeAutomation;
