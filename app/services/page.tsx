import { ServicesPageClient } from "./ServicesPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";

const page = pageArchitecture.services;

export const metadata = createPageMetadata(page);

export default function ServicesPage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <ServicesPageClient />
    </>
  );
}
