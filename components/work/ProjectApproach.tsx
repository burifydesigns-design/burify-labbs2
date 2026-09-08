import type { Project } from "@/types/project";

interface ProjectApproachProps {
  project: Project;
}

export function ProjectApproach({ project }: ProjectApproachProps) {
  const isAutomation = project.category === "AI Automation";

  const approachPoints = project.approach
    .split(".")
    .map((point) => point.trim())
    .filter((point) => point.length > 0);

  return (
    <section className="case-study-section">
      <div className="container">
        <span className="case-study-label">Our Approach</span>
        <h2 className="case-study-heading">How we built it</h2>

        {isAutomation ? (
          <div className="case-study-body mb-8">
            <p>{project.approach}</p>
          </div>
        ) : (
          <div className="approach-list">
            {approachPoints.map((point, index) => (
              <div key={index} className="approach-list__item">
                <span className="approach-list__bullet">{index + 1}</span>
                <span className="approach-list__text">{point}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
