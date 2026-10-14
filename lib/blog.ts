import type { BlogPost, BlogTopicCluster } from "@/types/blog";
import { blogPosts, blogTopicClusters } from "@/data/blog";

export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.status === "published");
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug && post.status === "published");
}

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id && post.status === "published");
}

export function getAllCategories(): string[] {
  const published = getPublishedPosts();
  const categories = new Set(published.map((post) => post.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const published = getPublishedPosts();
  const tags = new Set(published.flatMap((post) => post.tags));
  return Array.from(tags).sort();
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getPublishedPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
}

export function searchPosts(query: string): BlogPost[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return getPublishedPosts();
  }

  return getPublishedPosts().filter((post) => {
    const searchableText = [
      post.title,
      post.excerpt,
      post.category,
      ...post.tags,
      post.author.name,
      post.content ? stripHtml(post.content) : "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const published = getPublishedPosts().filter((p) => p.id !== post.id);

  const scored = published.map((candidate) => {
    let score = 0;

    if (candidate.category === post.category) {
      score += 3;
    }

    const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag));
    score += sharedTags.length * 2;

    return { post: candidate, score };
  });

  const related = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  if (related.length >= limit) {
    return related;
  }

  const fallback = published
    .filter((candidate) => !related.some((item) => item.id === candidate.id))
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit - related.length);

  return [...related, ...fallback];
}

export function paginatePosts<T extends BlogPost>(
  posts: BlogPost[],
  page: number,
  postsPerPage: number,
): { posts: T[]; totalPages: number; totalPosts: number } {
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * postsPerPage;
  const end = start + postsPerPage;

  return {
    posts: posts.slice(start, end) as T[],
    totalPages,
    totalPosts,
  };
}

export function sortPosts(posts: BlogPost[], order: "newest" | "oldest"): BlogPost[] {
  const sorted = [...posts].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
    const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);

    return order === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  return sorted;
}

export function getTopicClusters(): BlogTopicCluster[] {
  return blogTopicClusters;
}

export function getTopicClusterById(id: string): BlogTopicCluster | undefined {
  return blogTopicClusters.find((cluster) => cluster.id === id);
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function getAdjacentPosts(post: BlogPost): { prev: BlogPost | null; next: BlogPost | null } {
  const published = getPublishedPosts();
  const sorted = sortPosts(published, "newest");
  const index = sorted.findIndex((p) => p.id === post.id);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;

  return { prev, next };
}
