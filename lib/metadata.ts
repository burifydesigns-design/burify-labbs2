import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  description: siteConfig.description,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
