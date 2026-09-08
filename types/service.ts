import type { PageId, SearchIntent, StructuredDataType } from "./architecture";

export interface Service {
  pageId: PageId;
  slug: string;
  name: string;
  path: string;
  primaryTopic: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  intent: SearchIntent;
  plannedSections: string[];
  relatedRoutes: PageId[];
  structuredData: StructuredDataType[];
}
