import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <aside className="related-posts" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="related-posts__heading">
        Keep Reading
      </h2>
      <ul className="related-posts__list">
        {posts.map((post) => (
          <li key={post.id} className="related-posts__item">
            <Link href={`/blog/${post.slug}`} className="related-posts__link">
              <span className="related-posts__category">{post.category}</span>
              <span className="related-posts__title">{post.title}</span>
              <div className="related-posts__meta" style={{ display: "flex", gap: "var(--space-3)", fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)" }}>
                {post.publishedAt && (
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                {post.readingTime != null && <span>{post.readingTime} min read</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
