import type { MetadataRoute } from "next";
import { indexablePages } from "@/config/page-architecture";
import { publishedBlogPosts } from "@/data/blog";
import { publishedProjects } from "@/data/projects";
import { canonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = indexablePages.map((page) => ({
    url: canonicalUrl(page.path),
  }));

  const projectRoutes = publishedProjects.map((project) => {
    const lastModified = project.updatedAt ?? project.publishedAt;

    return {
      url: canonicalUrl(`/work/${project.slug}`),
      ...(lastModified ? { lastModified } : {}),
    };
  });

  const blogRoutes = publishedBlogPosts.map((post) => {
    const lastModified = post.updatedAt ?? post.publishedAt;

    return {
      url: canonicalUrl(`/blog/${post.slug}`),
      ...(lastModified ? { lastModified } : {}),
    };
  });

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
