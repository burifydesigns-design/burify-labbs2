import { WorkPageClient } from "./WorkPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";

const page = pageArchitecture.work;

export const metadata = createPageMetadata(page);

export default function WorkPage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <WorkPageClient />
    </>
  );
}
