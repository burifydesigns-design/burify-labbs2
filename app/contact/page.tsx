import { ContactPageClient } from "./ContactPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";

const page = pageArchitecture.contact;

export const metadata = createPageMetadata(page);

export default function ContactPage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <ContactPageClient />
    </>
  );
}
