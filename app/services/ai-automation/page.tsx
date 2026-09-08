import { AiAutomationPageClient } from "./AiAutomationPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createPageMetadata } from "@/lib/seo";
import { createServiceJsonLd, createPageBreadcrumbJsonLd } from "@/lib/structured-data";

const page = pageArchitecture["ai-automation"];

export const metadata = createPageMetadata(page);

export default function AiAutomationPage() {
  return (
    <>
      <StructuredData data={[
        createServiceJsonLd(page),
        createPageBreadcrumbJsonLd(page),
      ]} />
      <AiAutomationPageClient />
    </>
  );
}
