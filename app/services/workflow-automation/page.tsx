import { WorkflowAutomationPageClient } from "./WorkflowAutomationPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createFaqPageJsonLd, createPageBreadcrumbJsonLd, createServiceJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { workflowAutomationFaqs } from "./WorkflowAutomationPageClient";

const page = pageArchitecture["workflow-automation"];

export const metadata = createPageMetadata(page);

export default function WorkflowAutomationPage() {
  const faqSchema = createFaqPageJsonLd(workflowAutomationFaqs);
  const structuredData = [
    createServiceJsonLd(page),
    createPageBreadcrumbJsonLd(page),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <WorkflowAutomationPageClient />
    </>
  );
}
