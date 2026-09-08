import { pageArchitecture } from "@/config/page-architecture";

const publicPages = Object.values(pageArchitecture).filter(
  (page) => page.indexable,
);

export const sitemapArchitecture = publicPages.map((page) => ({
  path: page.path,
  dynamic: Boolean(page.dynamic),
  parentId: page.parentId ?? null,
}));

export const seoMap = publicPages.map((page) => ({
  url: page.path,
  primaryTopic: page.seo.primaryTopic,
  secondaryTopics: page.seo.secondaryKeywords,
  intent: page.seo.intent,
}));

export const internalLinkingMap = publicPages.map((page) => ({
  from: page.path,
  to: page.internalLinks.map((pageId) => pageArchitecture[pageId].path),
}));
