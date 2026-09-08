import type { Project } from "@/types/project";

interface ProjectChallengeProps {
  project: Project;
}

export function ProjectChallenge({ project }: ProjectChallengeProps) {
  return (
    <section className="case-study-section case-study-section--secondary">
      <div className="container">
        <span className="case-study-label">The Challenge</span>
        <h2 className="case-study-heading">The problem we solved</h2>
        <div className="case-study-body">
          <p>{project.challenge}</p>
        </div>
      </div>
    </section>
  );
}
