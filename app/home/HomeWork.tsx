import Link from "next/link";
import Image from "next/image";
import { publishedProjects } from "@/data/projects";

const projects = publishedProjects.slice(0, 3).map((project) => ({
  title: project.title,
  tags: [project.category],
  description: project.shortDescription,
  slug: project.slug,
  featuredImage: project.featuredImage,
}));

export function HomeWork() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background-secondary" id="work">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            Selected work
          </h2>
          <p className="text-body-lg text-text-secondary">
            Projects where design meets function and performance.
          </p>
          <p className="text-body text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Each project below was built around a specific business challenge. The approach, design decisions,
            and outcomes reflect what happens when strategy leads and technology follows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="group rounded-xl border border-border bg-background overflow-hidden transition-all duration-200 hover:border-primary-light hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-background-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-pink/5 group-hover:from-primary/10 group-hover:to-accent-pink/10 transition-all duration-300" />
                {project.featuredImage ? (
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-body-sm text-text-muted font-medium">{project.title}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
                <h3 className="text-h5 text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-body text-text-secondary mb-4">{project.description}</p>
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-2 text-body-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  View Case Study
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-nav font-medium text-primary hover:text-primary-dark transition-colors duration-200"
          >
            View all work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeWork;
