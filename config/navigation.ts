import type { NavigationItem } from "@/types/architecture";
import { siteConfig } from "./site";

export const sitemapNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const desktopNavigation: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const mobileNavigation = sitemapNavigation;

export const primaryNavigationCta = siteConfig.primaryCta;
