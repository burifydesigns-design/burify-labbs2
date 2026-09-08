import type { BlogPost } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="blog-card">
      <Link href={href} className="blog-card__link">
        <div className="blog-card__image">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="blog-card__image-placeholder" aria-hidden="true">
              <span>{post.category}</span>
            </div>
          )}
        </div>
        <div className="blog-card__body">
          <div className="blog-card__meta">
            <span className="blog-card__category">{post.category}</span>
            {post.readingTime != null && (
              <span className="blog-card__reading-time">{post.readingTime} min read</span>
            )}
          </div>
          <h3 className="blog-card__title">{post.title}</h3>
          <p className="blog-card__excerpt">{post.excerpt}</p>
          <span className="blog-card__read-more">
            Read Article
            <svg
              className="blog-card__arrow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
