import type { Project } from "@/types/project";
import Image from "next/image";

interface ProjectGalleryProps {
  project: Project;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const images = project.gallery;

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="case-study-section">
      <div className="container">
        <span className="case-study-label">Visual Showcase</span>
        <h2 className="case-study-heading">Project visuals</h2>
        <div className="gallery-grid">
          {images.map((src, index) => (
            <div
              key={index}
              className={`gallery-item ${index === 0 ? "gallery-item--featured" : ""}`}
            >
              <Image
                src={src}
                alt={`${project.title} — ${getGalleryLabel(project.slug, index)}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getGalleryLabel(slug: string, index: number): string {
  if (slug === "real-estate-n8n-automation") {
    return index === 0 ? "Workflow Overview" : "n8n Canvas";
  }
  const labels: Record<string, string[]> = {
    "cavari-group": ["Homepage", "About", "Services"],
    "hillview-physiotherapy-group": ["Homepage", "Services", "Team"],
    "precision-auto-centre": ["Homepage", "Services", "Contact"],
  };
  return labels[slug]?.[index] ?? `Project Visual ${index + 1}`;
}
