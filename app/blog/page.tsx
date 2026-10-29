import { BlogPageClient } from "./BlogPageClient";
import { getCmsPublishedPostsResult } from "@/lib/blog-supabase";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageArchitecture } from "@/config/page-architecture";
import { createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import "./blog.css";

const page = pageArchitecture.blog;

export const metadata = createPageMetadata(page);

export default async function BlogPage() {
  const cmsResult = await getCmsPublishedPostsResult();
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <BlogPageClient databasePosts={cmsResult.posts} databaseAvailable={cmsResult.databaseAvailable} />
    </>
  );
}
