import type { Project } from "@/types/project";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const isAutomation = project.category === "AI Automation";

  return (
    <section
      className="case-study-hero"
      style={{
        backgroundImage: `url(${project.featuredImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" aria-hidden="true" />
      <div className="case-study-hero__glow" aria-hidden="true" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: project.title }]} />
          <span className="case-study-label">{project.category}</span>
          <h1 className="text-h1 md:text-display text-text-primary mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {project.shortDescription}
          </p>
        </div>

        <div className="case-study-hero__meta text-center">
          <div className="case-study-hero__meta-item">
            <span className="case-study-hero__meta-label">Service</span>
            <span className="case-study-hero__meta-value">
              {isAutomation ? "AI Automation" : "Web Design"}
            </span>
          </div>
          {isAutomation && (
            <div className="case-study-hero__meta-item">
              <span className="case-study-hero__meta-label">Technology</span>
              <span className="case-study-hero__meta-value">n8n</span>
            </div>
          )}
          <div className="case-study-hero__meta-item">
            <span className="case-study-hero__meta-label">Industry</span>
            <span className="case-study-hero__meta-value">
              {isAutomation ? "Real Estate" : getIndustry(project.slug)}
            </span>
          </div>
          <div className="case-study-hero__meta-item">
            <span className="case-study-hero__meta-label">Year</span>
            <span className="case-study-hero__meta-value">{project.year}</span>
          </div>
          <div className="case-study-hero__meta-item">
            <span className="case-study-hero__meta-label">Status</span>
            <span className="case-study-hero__meta-value">Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function getIndustry(slug: string): string {
  switch (slug) {
    case "precision-auto-centre":
      return "Automotive";
    case "cavari-group":
      return "Finance & Investment";
    default:
      return "General";
  }
}
