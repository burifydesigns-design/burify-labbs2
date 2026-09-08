import { useEffect, useRef } from "react";

interface WorkflowDiagramProps {
  steps: string[];
}

export function WorkflowDiagram({ steps }: WorkflowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const items = [];
  for (let i = 0; i < steps.length; i++) {
    items.push(
      <div key={`step-${i}`} className="workflow__step">
        <span className="workflow__step-number">{i + 1}</span>
        <span className="workflow__step-text">{steps[i]}</span>
      </div>,
    );
    if (i < steps.length - 1) {
      items.push(
        <svg
          key={`arrow-${i}`}
          className="workflow__arrow"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>,
      );
    }
  }

  return (
    <div ref={containerRef} data-reveal>
      <div className="workflow">
        {items}
      </div>
    </div>
  );
}

export const defaultAutomationWorkflow = [
  "Trigger",
  "Data Received",
  "Validation / Processing",
  "Business Logic",
  "Automated Actions",
  "Notifications / CRM / Database",
  "Team Follow-Up",
];
