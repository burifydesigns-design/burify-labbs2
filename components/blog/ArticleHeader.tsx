import type { BlogPost } from "@/types/blog";
import Link from "next/link";

interface ArticleHeaderProps {
  post: BlogPost;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <div className="article-header__inner">
        <nav className="article-header__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span>{post.title}</span>
            </li>
          </ol>
        </nav>

        <div className="article-header__category">
          <span className="article-header__category-badge">{post.category}</span>
        </div>

        <h1 className="article-header__title">{post.title}</h1>

        {post.excerpt && <p className="article-header__excerpt">{post.excerpt}</p>}
      </div>
    </header>
  );
}
