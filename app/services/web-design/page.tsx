import { WebDesignPageClient } from "./WebDesignPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createFaqPageJsonLd, createPageBreadcrumbJsonLd, createServiceJsonLd } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { webDesignFaqs } from "./WebDesignPageClient";

const page = pageArchitecture["web-design"];

export const metadata = createPageMetadata(page);

export default function WebDesignPage() {
  const faqSchema = createFaqPageJsonLd(webDesignFaqs);
  const structuredData = [
    createServiceJsonLd(page),
    createPageBreadcrumbJsonLd(page),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <WebDesignPageClient />
    </>
  );
}
