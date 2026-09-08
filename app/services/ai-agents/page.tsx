import { AiAgentsPageClient } from "./AiAgentsPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createPageMetadata } from "@/lib/seo";
import { createServiceJsonLd, createPageBreadcrumbJsonLd } from "@/lib/structured-data";

const page = pageArchitecture["ai-agents"];

export const metadata = createPageMetadata(page);

export default function AiAgentsPage() {
  return (
    <>
      <StructuredData data={[
        createServiceJsonLd(page),
        createPageBreadcrumbJsonLd(page),
      ]} />
      <AiAgentsPageClient />
    </>
  );
}
