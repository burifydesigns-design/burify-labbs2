import type { BlogPost } from "@/types/blog";
import type { PageArchitecture, PageId } from "@/types/architecture";
import type { Project } from "@/types/project";
import { pageArchitecture } from "@/config/page-architecture";
import { siteConfig } from "@/config/site";
import { canonicalUrl } from "@/lib/seo";

export type JsonLd = Record<string, unknown>;

type BreadcrumbInput = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const organizationIdentity = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo/logo.jpeg`,
  sameAs: [
    "https://twitter.com/burifylabs",
    "https://linkedin.com/company/burifylabs",
    "https://instagram.com/burifylabs",
    "https://dribbble.com/burifylabs",
  ],
};

export function createOrganizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    ...organizationIdentity,
  };
}

export function createWebsiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: organizationIdentity,
  };
}

export function createServiceJsonLd(page: PageArchitecture): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    serviceType: page.seo.primaryTopic,
    description: page.seo.description,
    url: canonicalUrl(page.path),
    provider: organizationIdentity,
  };
}

export function createArticleJsonLd(post: BlogPost): JsonLd {
  const path = post.canonicalUrl ?? `/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: canonicalUrl(path),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt ?? post.publishedAt,
    publisher: organizationIdentity,
  };
}

export function createBreadcrumbJsonLd(items: BreadcrumbInput[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function createFaqPageJsonLd(items: FaqItem[]): JsonLd | null {
  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createPageBreadcrumbJsonLd(page: PageArchitecture): JsonLd | null {
  if (page.id === "home") {
    return null;
  }

  return createBreadcrumbJsonLd(getPageBreadcrumbItems(page.id));
}

export function createProjectBreadcrumbJsonLd(project: Project): JsonLd {
  return createBreadcrumbJsonLd([
    { name: pageArchitecture.home.label, path: pageArchitecture.home.path },
    { name: pageArchitecture.work.label, path: pageArchitecture.work.path },
    { name: project.title, path: project.canonicalPath ?? `/work/${project.slug}` },
  ]);
}

export function createBlogPostBreadcrumbJsonLd(post: BlogPost): JsonLd {
  return createBreadcrumbJsonLd([
    { name: pageArchitecture.home.label, path: pageArchitecture.home.path },
    { name: pageArchitecture.blog.label, path: pageArchitecture.blog.path },
    { name: post.title, path: post.canonicalUrl ?? `/blog/${post.slug}` },
  ]);
}

export function createStructuredDataForPage(page: PageArchitecture): JsonLd[] {
  const schema: JsonLd[] = [];

  if (page.id === "home") {
    schema.push(createOrganizationJsonLd(), createWebsiteJsonLd());
  }

  if (page.kind === "service" || page.kind === "service-index") {
    schema.push(createServiceJsonLd(page));
  }

  const breadcrumb = createPageBreadcrumbJsonLd(page);

  if (breadcrumb) {
    schema.push(breadcrumb);
  }

  return schema;
}

function getPageBreadcrumbItems(pageId: PageId): BreadcrumbInput[] {
  const page = pageArchitecture[pageId];
  const ancestors: BreadcrumbInput[] = [];
  let current: PageArchitecture | undefined = page;

  while (current) {
    ancestors.unshift({
      name: current.id === "home" ? pageArchitecture.home.label : current.label,
      path: current.path,
    });

    current = current.parentId ? pageArchitecture[current.parentId] : undefined;
  }

  if (ancestors[0]?.path !== pageArchitecture.home.path) {
    ancestors.unshift({
      name: pageArchitecture.home.label,
      path: pageArchitecture.home.path,
    });
  }

  return ancestors;
}
