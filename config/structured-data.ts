import type { PageId, StructuredDataType } from "@/types/architecture";

export const structuredDataPlan = {
  Organization: {
    appliesTo: ["home"],
    status: "active",
    notes: "Emitted on the homepage for the Burify Labs entity.",
  },
  WebSite: {
    appliesTo: ["home"],
    status: "active",
    notes: "Emitted on the homepage for the canonical website entity.",
  },
  Service: {
    appliesTo: [
      "services",
      "web-design",
      "ai-automation",
      "ai-agents",
      "workflow-automation",
    ],
    status: "active",
    notes: "Generated from the service page architecture without ratings, reviews, or fabricated claims.",
  },
  Article: {
    appliesTo: ["blog-post"],
    status: "planned",
    notes: "Generated only for published blog posts with real article data.",
  },
  BreadcrumbList: {
    appliesTo: [
      "services",
      "web-design",
      "ai-automation",
      "ai-agents",
      "workflow-automation",
      "work",
      "work-detail",
      "about",
      "blog",
      "blog-post",
      "contact",
    ],
    status: "active",
    notes: "Generated from route hierarchy and dynamic resource titles.",
  },
  FAQPage: {
    appliesTo: ["home", "web-design", "ai-automation", "ai-agents", "workflow-automation"],
    status: "conditional",
    notes: "Generated only when real FAQ question-and-answer content exists on the page.",
  },
} satisfies Record<
  StructuredDataType,
  {
    appliesTo: PageId[];
    status: "active" | "planned" | "conditional";
    notes: string;
  }
>;
