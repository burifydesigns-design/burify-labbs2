import type { Metadata } from "next";
import type { PageArchitecture } from "@/types/architecture";
import { siteConfig } from "@/config/site";

export function canonicalUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, siteConfig.url).toString();
}

export function createPageMetadata(page: PageArchitecture): Metadata {
  const url = canonicalUrl(page.seo.canonicalPath);
  const { description, title } = page.seo;
  const image = page.seo.openGraphImage;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
    },
    robots: page.seo.robots,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image ? { images: [{ url: image, alt: `${page.label} Open Graph image` }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function createResourceMetadata({
  description,
  modifiedTime,
  openGraphImage,
  publishedTime,
  robots = {
    index: true,
    follow: true,
  },
  title,
  path,
  type = "website",
}: {
  description: string;
  modifiedTime?: string;
  openGraphImage?: string;
  publishedTime?: string;
  robots?: {
    index: boolean;
    follow: boolean;
  };
  title: string;
  path: string;
  type?: "article" | "website";
}): Metadata {
  const url = canonicalUrl(path);
  const displayTitle = `${title} | ${siteConfig.name}`;
  const openGraph =
    type === "article"
      ? {
          title: displayTitle,
          description,
          url,
          siteName: siteConfig.name,
          type: "article" as const,
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(openGraphImage
            ? { images: [{ url: openGraphImage, alt: `${title} Open Graph image` }] }
            : {}),
        }
      : {
          title: displayTitle,
          description,
          url,
          siteName: siteConfig.name,
          type: "website" as const,
          ...(openGraphImage
            ? { images: [{ url: openGraphImage, alt: `${title} Open Graph image` }] }
            : {}),
        };

  return {
    title: {
      absolute: displayTitle,
    },
    description,
    alternates: {
      canonical: url,
    },
    robots,
    openGraph,
    twitter: {
      card: openGraphImage ? "summary_large_image" : "summary",
      title: displayTitle,
      description,
      ...(openGraphImage ? { images: [openGraphImage] } : {}),
    },
  };
}

export function createNoIndexMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}
