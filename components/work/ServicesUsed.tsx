import Link from "next/link";
import type { Project } from "@/types/project";
import { services } from "@/data/services";

interface ServicesUsedProps {
  project: Project;
}

export function ServicesUsed({ project }: ServicesUsedProps) {
  const matchedServices = services.filter((service) =>
    project.services.includes(service.slug),
  );

  if (matchedServices.length === 0) {
    return null;
  }

  return (
    <section className="case-study-section">
      <div className="container">
        <span className="case-study-label">Services Used</span>
        <h2 className="case-study-heading">What we brought to this project</h2>
        <div className="services-list">
          {matchedServices.map((service) => (
            <Link key={service.slug} href={service.path} className="services-list__item">
              {service.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
