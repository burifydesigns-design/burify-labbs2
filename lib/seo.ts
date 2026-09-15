import type { Metadata } from "next";
import type { PageArchitecture } from "@/types/architecture";
import { siteConfig } from "@/config/site";

const defaultOpenGraphImage = {
  url: "/images/og-image.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} - Web Design and AI Automation Agency`,
  type: "image/png",
};

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
      images: image ? [{ url: image, alt: `${page.label} Open Graph image` }] : [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : ["/images/og-image.png"],
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
  const brandSuffix = ` | ${siteConfig.name}`;
  const displayTitle = title.endsWith(brandSuffix) ? title : `${title}${brandSuffix}`;
  const image = openGraphImage ? { url: openGraphImage, alt: `${title} Open Graph image` } : defaultOpenGraphImage;
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
          images: [image],
        }
      : {
          title: displayTitle,
          description,
          url,
          siteName: siteConfig.name,
          type: "website" as const,
          images: [image],
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
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [openGraphImage ?? "/images/og-image.png"],
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
