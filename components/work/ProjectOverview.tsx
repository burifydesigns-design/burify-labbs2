import type { Project } from "@/types/project";

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section className="case-study-section">
      <div className="container">
        <span className="case-study-label">Overview</span>
        <div className="case-study-body">
          <p>{project.description}</p>
        </div>
      </div>
    </section>
  );
}
