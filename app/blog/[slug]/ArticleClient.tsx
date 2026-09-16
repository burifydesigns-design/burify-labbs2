"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { ArticleShare } from "@/components/blog/ArticleShare";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getRelatedPosts } from "@/lib/blog";
import { Button } from "@/components/ui/Button";

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

          <div className="article-cta">
            <span className="article-cta__label">Work with us</span>
            <h3 className="article-cta__title">
              Ready to build a website that works for your business?
            </h3>
            <p className="article-cta__description">
              Let&apos;s build it.
            </p>
            <Button href="/contact">Start a Project</Button>
          </div>

          <RelatedPosts posts={relatedPosts} />
        </div>
        <aside className="toc" aria-label="Table of contents">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </article>
  );
}
