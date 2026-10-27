import { BlogPageClient } from "./BlogPageClient";
import { getCmsPublishedPosts } from "@/lib/blog-supabase";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import "./blog.css";

const page = pageArchitecture.blog;

export const metadata = createPageMetadata(page);

export default async function BlogPage() {
  const cmsPosts = await getCmsPublishedPosts();
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <BlogPageClient databasePosts={cmsPosts} />
    </>
  );
}
