import type { Project } from "@/types/project";
import Image from "next/image";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const isAutomation = project.category === "AI Automation";

  return (
    <section className="case-study-hero">
      <div className="case-study-hero__glow" aria-hidden="true" />
      <div className="container relative">
        <div className="max-w-3xl">
          <span className="case-study-label">{project.category}</span>
          <h1 className="text-h1 md:text-display text-text-primary mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>
        </div>

        <div className="case-study-hero__meta">
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

        <div className="mt-8 md:mt-12">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl border border-border bg-background-secondary overflow-hidden">
            {project.featuredImage ? (
              <Image
                src={project.featuredImage}
                alt={`${project.title} — ${isAutomation ? "Workflow Preview" : "Website Preview"}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
                priority
                className="object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-pink/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-caption font-medium uppercase tracking-widest text-text-muted">
                    {project.title} — {isAutomation ? "Workflow Preview" : "Website Preview"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getIndustry(slug: string): string {
  switch (slug) {
    case "hillview-physiotherapy-group":
      return "Healthcare";
    case "precision-auto-centre":
      return "Automotive";
    case "cavari-group":
      return "Finance & Investment";
    default:
      return "General";
  }
}
