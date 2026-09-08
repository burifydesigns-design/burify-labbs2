import type { ReactNode } from "react";
import Link from "next/link";
import type { PageArchitecture, PageId } from "@/types/architecture";
import { pageArchitecture } from "@/config/page-architecture";

type PageArchitectureScaffoldProps = {
  children?: ReactNode;
  page: PageArchitecture;
};

type ResourceArchitectureScaffoldProps = {
  linkPageIds: PageId[];
  sections: string[];
  title: string;
};

const nonSectionHeadings = new Set(["Hero", "CTA", "Final CTA"]);

const internalLinkText: Partial<Record<PageId, string>> = {
  home: "Home",
  services: "Services",
  "web-design": "Web Design Services",
  "ai-automation": "AI Automation Services",
  "ai-agents": "AI Agents for Business",
  "workflow-automation": "Workflow Automation Services",
  work: "Work and Case Studies",
  about: "About Burify Labs",
  blog: "Web Design and AI Automation Blog",
  contact: "Start a Project",
};

export function PageArchitectureScaffold({
  children,
  page,
}: PageArchitectureScaffoldProps) {
  const headingId = `${page.id}-heading`;
  const sections = page.plannedSections.filter(
    (section) => !nonSectionHeadings.has(section),
  );
  const links = page.internalLinks
    .map((pageId) => pageArchitecture[pageId])
    .filter((target) => target && !target.dynamic && target.indexable);

  return (
    <main aria-labelledby={headingId}>
      <header>
        <h1 id={headingId}>{page.h1}</h1>
        {links.length > 0 ? (
          <nav aria-label="Internal links">
            <ul>
              {links.map((target) => (
                <li key={target.id}>
                  <Link href={target.path}>
                    {internalLinkText[target.id] ?? target.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      {sections.map((section) => (
        <section aria-labelledby={`${page.id}-${slugify(section)}`} key={section}>
          <h2 id={`${page.id}-${slugify(section)}`}>{section}</h2>
        </section>
      ))}

      {children}
    </main>
  );
}

export function ResourceArchitectureScaffold({
  linkPageIds,
  sections,
  title,
}: ResourceArchitectureScaffoldProps) {
  const headingId = `${slugify(title)}-heading`;
  const visibleSections = sections.filter(
    (section) => !nonSectionHeadings.has(section),
  );
  const links = linkPageIds
    .map((pageId) => pageArchitecture[pageId])
    .filter((target) => target && !target.dynamic && target.indexable);

  return (
    <main aria-labelledby={headingId}>
      <header>
        <h1 id={headingId}>{title}</h1>
        {links.length > 0 ? (
          <nav aria-label="Related links">
            <ul>
              {links.map((target) => (
                <li key={target.id}>
                  <Link href={target.path}>
                    {internalLinkText[target.id] ?? target.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      {visibleSections.map((section) => (
        <section aria-labelledby={`${headingId}-${slugify(section)}`} key={section}>
          <h2 id={`${headingId}-${slugify(section)}`}>{section}</h2>
        </section>
      ))}
    </main>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default PageArchitectureScaffold;
