import type { BlogPost } from "@/types/blog";
import { sanitizeHtml } from "@/lib/sanitize";

interface ArticleContentProps {
  post: BlogPost;
}

export function ArticleContent({ post }: ArticleContentProps) {
  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
    />
  );
}
