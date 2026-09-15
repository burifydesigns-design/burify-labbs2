export type PageId =
  | "home"
  | "services"
  | "web-design"
  | "ai-automation"
  | "ai-agents"
  | "workflow-automation"
  | "work"
  | "work-detail"
  | "about"
  | "blog"
  | "blog-post"
  | "contact"
  | "privacy"
  | "terms"
  | "cookies"
  | "editorial-policy"
  | "not-found";

export type PageKind =
  | "home"
  | "service-index"
  | "service"
  | "case-study-index"
  | "case-study"
  | "content-index"
  | "article"
  | "company"
  | "conversion"
  | "legal"
  | "editorial"
  | "system";

export type StructuredDataType =
  | "Organization"
  | "WebSite"
  | "Service"
  | "Article"
  | "BreadcrumbList"
  | "FAQPage";

export type SearchIntent =
  | "Commercial"
  | "Commercial / Transactional"
  | "Commercial / Investigation"
  | "Informational"
  | "Brand Trust"
  | "Lead Generation"
  | "Legal"
  | "System";

export type PublicationStatus = "draft" | "published";

export type CtaId =
  | "start-project"
  | "view-work"
  | "explore-services"
  | "contact";

export interface SeoTarget {
  title: string;
  description: string;
  primaryTopic: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  intent: SearchIntent;
  canonicalPath: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  openGraphImage?: string;
  openGraphImageStatus: "planned";
}

export interface PageArchitecture {
  id: PageId;
  path: string;
  label: string;
  kind: PageKind;
  purpose: string;
  parentId?: PageId;
  indexable: boolean;
  seo: SeoTarget;
  h1: string;
  plannedSections: string[];
  structuredData: StructuredDataType[];
  internalLinks: PageId[];
  primaryCta?: CtaId;
  secondaryCtas?: CtaId[];
  dynamic?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ConversionCta {
  id: CtaId;
  label: string;
  href: string;
}
