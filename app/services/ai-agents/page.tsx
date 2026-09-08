import { AiAgentsPageClient } from "./AiAgentsPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createFaqPageJsonLd, createPageBreadcrumbJsonLd, createServiceJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { aiAgentsFaqs } from "./AiAgentsPageClient";

const page = pageArchitecture["ai-agents"];

export const metadata = createPageMetadata(page);

export default function AiAgentsPage() {
  const faqSchema = createFaqPageJsonLd(aiAgentsFaqs);
  const structuredData = [
    createServiceJsonLd(page),
    createPageBreadcrumbJsonLd(page),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <AiAgentsPageClient />
    </>
  );
}
