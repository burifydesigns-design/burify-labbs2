import type { Project } from "@/types/project";

interface ProjectDeliverablesProps {
  project: Project;
}

export function ProjectDeliverables({ project }: ProjectDeliverablesProps) {
  return (
    <section className="case-study-section case-study-section--dark">
      <div className="container">
        <span className="case-study-label">What We Built</span>
        <h2 className="case-study-heading">Deliverables</h2>
        <div className="deliverables-grid">
          {project.deliverables.map((deliverable, index) => (
            <div key={index} className="deliverable-item">
              <svg
                className="deliverable-item__icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="deliverable-item__text">{deliverable}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
