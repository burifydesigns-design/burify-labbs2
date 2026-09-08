"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { ArticleShare } from "@/components/blog/ArticleShare";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getRelatedPosts } from "@/lib/blog";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ArticleClientProps {
  post: BlogPost;
}

export function ArticleClient({ post }: ArticleClientProps) {
  const relatedPosts = useMemo(() => getRelatedPosts(post, 3), [post]);
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");

    const items = Array.from(elements)
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: (el.tagName === "H2" ? 2 : 3) as 2 | 3,
      }));

    setHeadings(items);
  }, [post.content]);

  const articleUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${post.slug}`
    : `/blog/${post.slug}`;

  const ctaPath = (() => {
    const category = post.category.toLowerCase();
    if (category.includes("web design")) return "/services/web-design";
    if (category.includes("ai automation")) return "/services/ai-automation";
    if (category.includes("ai agents")) return "/services/ai-agents";
    if (category.includes("workflow")) return "/services/workflow-automation";
    return "/contact";
  })();

  return (
    <article>
      <ArticleHeader post={post} />
      <ArticleMeta post={post} />

      {post.featuredImage && (
        <div className="article-featured-image">
          <div className="article-featured-image__wrapper">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt ?? post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 720px"
              loading="eager"
              priority
            />
          </div>
        </div>
      )}

      <div className="article-layout">
        <div className="article-content-wrapper">
          <ArticleContent post={post} />
          <ArticleShare url={articleUrl} title={post.title} />
          <RelatedPosts posts={relatedPosts} />

          <div className="article-cta">
            <span className="article-cta__label">Work with us</span>
            <h3 className="article-cta__title">
              Want to implement this for your business?
            </h3>
            <p className="article-cta__description">
              We design exceptional digital experiences and build intelligent automation systems. Let us help you turn these ideas into reality.
            </p>
            <Link href={ctaPath} className="article-cta__link">
              Learn more about our services
              <svg
                className="article-cta__arrow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        <aside className="toc" aria-label="Table of contents">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </article>
  );
}
