import { WorkPageClient } from "./WorkPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { getPublishedWork } from "@/lib/case-studies";

const page = pageArchitecture.work;
export const metadata = createPageMetadata(page);

export default async function WorkPage() {
  const projects = await getPublishedWork();
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <WorkPageClient projects={projects} />
    </>
  );
}
