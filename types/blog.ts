import type { PublicationStatus } from "./architecture";

export interface Author {
  name: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: AuthorSocialLinks;
}

export interface AuthorSocialLinks {
  linkedin?: string;
  x?: string;
  website?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt?: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  readingTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  relatedServicePaths?: string[];
  status: PublicationStatus;
}

export interface BlogTopicCluster {
  id: string;
  label: string;
  topics: string[];
  relatedServicePaths: string[];
}

export interface BlogSearchState {
  query: string;
  results: BlogPost[];
  isSearching: boolean;
}

export interface BlogPaginationState {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
}

export interface BlogIndexState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTag: string | null;
  pagination: BlogPaginationState;
  search: BlogSearchState;
}

export type SortOrder = "newest" | "oldest";
