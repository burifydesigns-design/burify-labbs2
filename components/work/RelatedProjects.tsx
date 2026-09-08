import Link from "next/link";
import { publishedProjects } from "@/data/projects";

interface RelatedProjectsProps {
  currentSlug: string;
}

export function RelatedProjects({ currentSlug }: RelatedProjectsProps) {
  const currentIndex = publishedProjects.findIndex((p) => p.slug === currentSlug);
  const nextProject =
    currentIndex >= 0 && currentIndex < publishedProjects.length - 1
      ? publishedProjects[currentIndex + 1]
      : publishedProjects[0];

  if (!nextProject || nextProject.slug === currentSlug) {
    return null;
  }

  return (
    <section className="case-study-section">
      <div className="container">
        <span className="case-study-label">Next Project</span>
        <Link href={`/work/${nextProject.slug}`} className="next-project">
          <span className="next-project__label">Explore Case Study</span>
          <span className="next-project__title">{nextProject.title}</span>
        </Link>
      </div>
    </section>
  );
}
