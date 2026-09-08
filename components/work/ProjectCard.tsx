import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";

interface WorkProjectCardProps {
  project: Project;
}

export function WorkProjectCard({ project }: WorkProjectCardProps) {
  const isAutomation = project.category === "AI Automation";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-card group ${isAutomation ? "project-card--automation" : ""}`}
    >
      <div className="project-card__media">
        <div className="project-card__media-inner">
          {project.featuredImage ? (
            <Image
              src={project.featuredImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover"
            />
          ) : (
            <span className="project-card__placeholder">{project.title}</span>
          )}
        </div>
      </div>
      <div className="project-card__body">
        <span className="project-card__category">{project.category}</span>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.shortDescription}</p>
        <span className="project-card__link">
          View Case Study
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
