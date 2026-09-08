import { AboutPageClient } from "./AboutPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";

const page = pageArchitecture.about;

export const metadata = createPageMetadata(page);

export default function AboutPage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <AboutPageClient />
    </>
  );
}
