"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogPagination } from "@/components/blog/BlogPagination";
import {
  getPublishedPosts,
  getAllCategories,
  searchPosts,
  paginatePosts,
  sortPosts,
} from "@/lib/blog";

const POSTS_PER_PAGE = 9;

export function BlogPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = useMemo(() => sortPosts(getPublishedPosts(), "newest"), []);
  const categories = useMemo(() => getAllCategories(), []);

  const featuredPost = useMemo(() => {
    if (selectedCategory || searchQuery.trim()) return null;
    return allPosts[0] ?? null;
  }, [allPosts, selectedCategory, searchQuery]);

  const filteredPosts = useMemo(() => {
    let result = allPosts;

    if (searchQuery.trim()) {
      result = searchPosts(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory);
    }

    return result;
  }, [allPosts, searchQuery, selectedCategory]);

  const { posts: pagePosts, totalPages } = useMemo(
    () => paginatePosts(filteredPosts, currentPage, POSTS_PER_PAGE),
    [filteredPosts, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const gridPosts = featuredPost
    ? pagePosts.filter((post) => post.id !== featuredPost.id)
    : pagePosts;

  return (
    <>
      <Navbar variant="light" showCta />
      <main id="main-content">
        <BlogHeader
          title="Web design and AI automation insights"
          description="Practical guidance on building websites, implementing automation, and growing with intelligent systems."
        />

        {featuredPost && (
          <div className="section bg-background">
            <div className="container">
              <div className="featured-article">
                <article className="featured-article__card">
                  <Link href={`/blog/${featuredPost.slug}`} className="featured-article__image">
                    {featuredPost.featuredImage ? (
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.featuredImageAlt ?? featuredPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        loading="eager"
                        priority
                      />
                    ) : (
                      <div className="featured-article__image-placeholder" aria-hidden="true">
                        <span>{featuredPost.category}</span>
                      </div>
                    )}
                  </Link>
                  <div className="featured-article__body">
                    <span className="featured-article__label">{featuredPost.category}</span>
                    <h2 className="featured-article__title">
                      <Link href={`/blog/${featuredPost.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="featured-article__excerpt">{featuredPost.excerpt}</p>
                    <div className="featured-article__meta">
                      {featuredPost.publishedAt && (
                        <span className="featured-article__date">
                          {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {featuredPost.readingTime != null && (
                        <span className="featured-article__reading-time">
                          {featuredPost.readingTime} min read
                        </span>
                      )}
                    </div>
                    <span className="featured-article__read-more">
                      Read Article
                      <svg
                        className="featured-article__arrow"
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
                </article>
              </div>
            </div>
          </div>
        )}

        <div className="section bg-background">
          <div className="container">
            <div className="blog-toolbar">
              <BlogSearch value={searchQuery} onChange={handleSearch} />
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            </div>

            {filteredPosts.length === 0 ? (
              <div className="blog-empty" role="status">
                <svg className="blog-empty__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12m-3.75.75h9.75m-9.75 0V19.5m0 2.25h9.75m-9.75 0V19.5m0 2.25H12m-3.75.75h9.75" />
                </svg>
                <h3 className="blog-empty__title">
                  {searchQuery || selectedCategory ? "No results found" : "No articles yet"}
                </h3>
                <p className="blog-empty__description">
                  {(searchQuery || selectedCategory)
                    ? `We couldn't find anything matching your criteria. Try a different keyword or browse our categories.`
                    : "We're preparing something useful. Check back soon for new articles and insights."}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Link href="/blog" className="blog-empty__link">
                    View all articles
                    <svg className="blog-empty__arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            ) : (
              <BlogGrid posts={gridPosts} />
            )}

            {totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        <section className="section bg-background-secondary">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-pink/20" aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Ready to build something better?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about your project. We will respond within one business day with initial thoughts on how we can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" size="lg" href="/contact" className="!border-white/30 !text-white hover:!bg-white/10">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
