# Burify Labs SEO implementation

## Implemented audit checklist

- [x] Audited App Router pages, dynamic routes, navigation, metadata, headings, images, structured data, robots, sitemap, legal pages, analytics, and conversion paths.
- [x] Preserved independent page structures and page-specific client code and styles.
- [x] Confirmed route-level titles, descriptions, canonicals, Open Graph fields, and X card fields.
- [x] Corrected duplicated brand suffixes on dynamic blog and case-study titles.
- [x] Kept one canonical host and one generated robots endpoint.
- [x] Confirmed the sitemap includes static pages, published articles, and published case studies while excluding API and system routes.
- [x] Added supported Organization, WebSite, Service, FAQPage, BlogPosting, BreadcrumbList, and CreativeWork JSON-LD.
- [x] Aligned service, article, and case-study breadcrumbs with their schema hierarchy.
- [x] Removed an unsupported performance statistic and disabled testimonials until verified quotes exist.
- [x] Confirmed referenced images exist; moved the homepage LCP image through `next/image` with responsive sizing and priority loading.
- [x] Removed the build-time Google Fonts request and broken favicon references.
- [x] Added a valid target for the global skip link on every rendered page.
- [x] Verified the production build, TypeScript checks, static generation, and ESLint.

## Search intent map

| Route | Primary intent |
| --- | --- |
| `/` | Web design and AI automation agency |
| `/services` | Web design and AI automation services |
| `/services/web-design` | Web design agency and services |
| `/services/ai-automation` | AI automation agency and services |
| `/services/ai-agents` | AI agent development for businesses |
| `/services/workflow-automation` | Business workflow automation |
| `/work` | Web design and automation portfolio |
| `/work/[slug]` | Project-specific case-study intent |
| `/about` | Burify Labs company and trust |
| `/blog` | Web design and AI automation learning hub |
| `/blog/[slug]` | Article-specific informational intent |
| `/contact` | Contact Burify Labs and start a project |

Location landing pages were not added because the project contains no verified Nairobi or Kenya service-area statement or physical address. Add them only after the business confirms the service area and can provide genuinely location-specific content.

## Post-launch Search Console plan

1. Verify the domain property, then submit `https://burifylabs.com/sitemap.xml`.
2. Inspect the homepage, each service page, one article, and one case study to confirm the selected canonical and rendered HTML.
3. Weekly for eight weeks: review indexed and excluded pages, crawl errors, structured-data enhancements, mobile usability, and Core Web Vitals.
4. Monthly: improve snippets for high-impression/low-CTR pages and strengthen content and internal links for relevant queries ranking 8–20.
5. Investigate ranking losses against intent, accuracy, crawl state, internal links, competing results, and freshness before rewriting.
6. Use relevant unexpected queries to improve an existing page first. Create a page only for distinct intent backed by original expertise.
7. Log material title, content, canonical, redirect, and schema changes with deployment dates.

## Inputs still required

- Verified service area and any legitimate public business address.
- Confirmed official social URLs before adding `sameAs` schema.
- Verified client quotes, publication consent, and measurable case-study outcomes.
- Search Console verification token or DNS access.
- Real data and methodology before publishing original research.
