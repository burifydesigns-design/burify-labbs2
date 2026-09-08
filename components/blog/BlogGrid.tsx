import type { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
  emptyMessage?: string;
}

export function BlogGrid({ posts, emptyMessage = "No articles found." }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="blog-grid__empty" role="status">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
