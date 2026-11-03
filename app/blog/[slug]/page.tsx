import type { BlogPost } from "@/types/blog";
import { getPostBySlug } from "@/lib/blog";
import { getCmsPostBySlugResult } from "@/lib/blog-supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StructuredData } from "@/components/seo/StructuredData";
import { createArticleJsonLd, createBlogPostBreadcrumbJsonLd } from "@/lib/structured-data";
import { createResourceMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> | { slug: string } };

async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  const result = await getCmsPostBySlugResult(slug);
  return result.databaseAvailable ? result.post : getPostBySlug(slug);
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
      <article className="blog-post container mx-auto px-4 lg:px-8">
        <header className="blog-post__header">
          {post.featuredImage && (
            <div className="blog-post__hero">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt ?? post.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1120px"
                className="object-cover"
              />
            </div>
          )}
          <div className="blog-post__meta">
            <span className="blog-post__category">{post.category}</span>
            {post.publishedAt && (
              <time className="blog-post__date" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.readingTime != null && (
              <span className="blog-post__reading-time">{post.readingTime} min read</span>
            )}
          </div>
          <h1 className="blog-post__title">{post.title}</h1>
        </header>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
