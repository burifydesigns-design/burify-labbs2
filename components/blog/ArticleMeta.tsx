import type { BlogPost } from "@/types/blog";
import { estimateReadingTime } from "@/lib/blog";
import Image from "next/image";

interface ArticleMetaProps {
  post: BlogPost;
}

export function ArticleMeta({ post }: ArticleMetaProps) {
  const displayReadingTime =
    post.readingTime ?? (post.content ? estimateReadingTime(post.content) : null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const publishedDate = formatDate(post.publishedAt);
  const updatedDate = formatDate(post.updatedAt);

  return (
    <div className="article-meta">
      <div className="article-meta__author">
        <div className="article-meta__avatar" aria-hidden="true">
          {post.author.avatarUrl ? (
            <Image src={post.author.avatarUrl} alt="" fill sizes="40px" />
          ) : (
            <span>{post.author.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="article-meta__author-info">
          <span className="article-meta__author-name">{post.author.name}</span>
          {post.author.bio && <span className="article-meta__author-bio">{post.author.bio}</span>}
        </div>
      </div>

      <div className="article-meta__dates">
        {publishedDate && (
          <div className="article-meta__date">
            <span className="article-meta__date-label">Published</span>
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          </div>
        )}
        {updatedDate && updatedDate !== publishedDate && (
          <div className="article-meta__date">
            <span className="article-meta__date-label">Updated</span>
            <time dateTime={post.updatedAt}>{updatedDate}</time>
          </div>
        )}
        {displayReadingTime != null && (
          <div className="article-meta__reading-time">
            <span className="article-meta__reading-time-value">{displayReadingTime} min read</span>
          </div>
        )}
      </div>
    </div>
  );
}
