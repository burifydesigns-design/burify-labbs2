import { WorkflowAutomationPageClient } from "./WorkflowAutomationPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createPageMetadata } from "@/lib/seo";
import { createServiceJsonLd, createPageBreadcrumbJsonLd } from "@/lib/structured-data";

const page = pageArchitecture["workflow-automation"];

export const metadata = createPageMetadata(page);

export default function WorkflowAutomationPage() {
  return (
    <>
      <StructuredData data={[
        createServiceJsonLd(page),
        createPageBreadcrumbJsonLd(page),
      ]} />
      <WorkflowAutomationPageClient />
    </>
  );
}
