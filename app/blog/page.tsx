import { BlogPageClient } from "./BlogPageClient";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import "./blog.css";

const page = pageArchitecture.blog;

export const metadata = createPageMetadata(page);

export default function BlogPage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <BlogPageClient />
    </>
  );
}
