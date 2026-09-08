import { WebDesignPageClient } from "./WebDesignPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createPageMetadata } from "@/lib/seo";
import { createServiceJsonLd, createPageBreadcrumbJsonLd } from "@/lib/structured-data";

const page = pageArchitecture["web-design"];

export const metadata = createPageMetadata(page);

export default function WebDesignPage() {
  return (
    <>
      <StructuredData data={[
        createServiceJsonLd(page),
        createPageBreadcrumbJsonLd(page),
      ]} />
      <WebDesignPageClient />
    </>
  );
}
