import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/StructuredData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { publishedBlogPosts } from "@/data/blog";
import {
  createArticleJsonLd,
  createBlogPostBreadcrumbJsonLd,
} from "@/lib/structured-data";
import { createNoIndexMetadata, createResourceMetadata } from "@/lib/seo";
import { ArticleClient } from "./ArticleClient";

import "./article.css";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = publishedBlogPosts.find((item) => item.slug === slug);

  if (!post) {
    return createNoIndexMetadata();
  }

  return createResourceMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: post.canonicalUrl ?? `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = publishedBlogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <StructuredData
        data={[createArticleJsonLd(post), createBlogPostBreadcrumbJsonLd(post)]}
      />
      <Navbar variant="light" showCta />
      <main>
        <ArticleClient post={post} />
      </main>
      <Footer />
    </>
  );
}
