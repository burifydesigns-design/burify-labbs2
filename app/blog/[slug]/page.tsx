import type { BlogPost } from "@/types/blog";
import { getPostBySlug } from "@/lib/blog";
import { getCmsPostBySlug } from "@/lib/blog-supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StructuredData } from "@/components/seo/StructuredData";
import { createArticleJsonLd, createBlogPostBreadcrumbJsonLd } from "@/lib/structured-data";
import { createResourceMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> | { slug: string } };

async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  return (await getCmsPostBySlug(slug)) ?? getPostBySlug(slug);
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  return createResourceMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraphImage: post.featuredImage,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    path: `/blog/${post.slug}`,
    type: "article",
    appendSiteName: true,
  });
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  return (
    <>
      <StructuredData data={[createArticleJsonLd(post), createBlogPostBreadcrumbJsonLd(post)]} />
      <article className="blog-post container mx-auto py-16 px-4 lg:px-8">
        <header className="mb-8">
          {post.featuredImage && (
            <div className="relative mb-6">
              <Image src={post.featuredImage} alt={post.featuredImageAlt ?? post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" className="object-cover rounded-lg" />
              <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded">{post.category}</div>
            </div>
          )}
          <div className="space-x-3 text-sm text-muted-foreground flex flex-wrap items-center">
            <span className="blog-post__category">{post.category}</span>
            {post.readingTime != null && <span className="blog-post__reading-time">{post.readingTime} min read</span>}
            {post.publishedAt && <time className="blog-post__date" dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">{post.title}</h1>
        </header>
        <div className="blog-post-content"><div dangerouslySetInnerHTML={{ __html: post.content }} /></div>
      </article>
    </>
  );
}
