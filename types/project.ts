export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  services: string[];
  challenge: string;
  approach: string;
  outcome: string;
  status: string;
  featuredImage: string;
  gallery: string[];
  year: string;
  canonicalPath?: string;
  publishedAt?: string;
  updatedAt?: string;
  originalUrl?: string;
  redesignedUrl?: string;
}
