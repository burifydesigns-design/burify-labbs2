import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface ArticleNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function ArticleNavigation({ previous, next }: ArticleNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="article-navigation" aria-label="Article navigation">
      {previous ? (
        <Link href={`/blog/${previous.slug}`} className="article-navigation__link article-navigation__link--previous">
          <span className="article-navigation__direction">
            <svg
              className="article-navigation__arrow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous article
          </span>
          <span className="article-navigation__category">{previous.category}</span>
          <span className="article-navigation__title">{previous.title}</span>
        </Link>
      ) : (
        <span className="article-navigation__link article-navigation__link--previous article-navigation__link--empty" aria-hidden="true" />
      )}

      {next ? (
        <Link href={`/blog/${next.slug}`} className="article-navigation__link article-navigation__link--next">
          <span className="article-navigation__direction">
            Next article
            <svg
              className="article-navigation__arrow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="article-navigation__category">{next.category}</span>
          <span className="article-navigation__title">{next.title}</span>
        </Link>
      ) : (
        <span className="article-navigation__link article-navigation__link--next article-navigation__link--empty" aria-hidden="true" />
      )}
    </nav>
  );
}
