import type { Project } from "@/types/project";

interface ProjectOutcomeProps {
  project: Project;
}

export function ProjectOutcome({ project }: ProjectOutcomeProps) {
  return (
    <section className="case-study-section case-study-section--secondary">
      <div className="container">
        <span className="case-study-label">Outcome</span>
        <h2 className="case-study-heading">The result</h2>
        <div className="case-study-body">
          <p>{project.outcome}</p>
        </div>
      </div>
    </section>
  );
}
