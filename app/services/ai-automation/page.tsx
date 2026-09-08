import { AiAutomationPageClient } from "./AiAutomationPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createFaqPageJsonLd, createPageBreadcrumbJsonLd, createServiceJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { aiAutomationFaqs } from "./AiAutomationPageClient";

const page = pageArchitecture["ai-automation"];

export const metadata = createPageMetadata(page);

export default function AiAutomationPage() {
  const faqSchema = createFaqPageJsonLd(aiAutomationFaqs);
  const structuredData = [
    createServiceJsonLd(page),
    createPageBreadcrumbJsonLd(page),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <AiAutomationPageClient />
    </>
  );
}
