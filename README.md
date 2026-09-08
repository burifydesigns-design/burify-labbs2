# Burify Labs

Architecture scaffold for the Burify Labs website.

No final website copy, visual design, case studies, testimonials, pricing, or integrations have been added.

## Final Sitemap

```text
/
/services
/services/web-design
/services/ai-automation
/services/ai-agents
/services/workflow-automation
/work
/work/[slug]
/about
/blog
/blog/[slug]
/contact
```

Primary navigation:

```text
Home
Services
Work
About
Blog
Contact
```

Primary CTA:

```text
Start a Project -> /contact
```

## Page-by-page SEO Targets

| Page | Route | Primary target | Secondary targets |
| --- | --- | --- | --- |
| Home | `/` | web design and AI automation agency | web design agency, website design, AI automation agency, AI automation services, AI website design, business automation, AI agents |
| Services | `/services` | web design agency, AI automation agency, AI automation services, website design services, business automation services | Planned after service content is written |
| Web Design | `/services/web-design` | web design agency | website design, web design services, custom website design, website redesign, responsive web design, business website design, website design for small business |
| AI Automation | `/services/ai-automation` | AI automation agency | AI automation services, business automation, AI business automation, AI workflow automation, process automation, automation for small business |
| AI Agents | `/services/ai-agents` | AI agents, AI agent development, AI automation agents, AI agents for business | Planned after service content is written |
| Workflow Automation | `/services/workflow-automation` | workflow automation, AI workflow automation, business workflow automation, automated workflows | Planned after service content is written |
| Work | `/work` | web design portfolio, website design examples, web design case studies, AI automation case studies | Planned after real projects exist |
| Case Study | `/work/[slug]` | web design case study, AI automation case study | Project-specific targets after real projects exist |
| About | `/about` | Burify Labs, web design and AI automation agency | digital agency, AI automation agency |
| Blog | `/blog` | web design blog, AI automation blog | website design, website redesign, conversion-focused websites, AI automation, business automation, workflow automation, AI agents |
| Article | `/blog/[slug]` | web design, AI automation, business automation | Article-specific targets after articles exist |
| Contact | `/contact` | contact Burify Labs, start a project | web design consultation, AI automation consultation |

## Page Hierarchy

```text
Home
├── Services
│   ├── Web Design
│   ├── AI Automation
│   ├── AI Agents
│   └── Workflow Automation
├── Work
│   └── Case Study
├── About
├── Blog
│   └── Article
└── Contact
```

## Planned Page Sections

Homepage:

```text
Hero
Problem / Opportunity
Services
Why Burify Labs
Process
Selected Work
AI Automation Explanation
Testimonials
FAQ
Final CTA
```

Service pages use their own planned section maps in `config/page-architecture.ts` and `data/services.ts`.

## Internal Linking Plan

```text
Homepage -> Services
Homepage -> Web Design
Homepage -> AI Automation
Homepage -> Work
Homepage -> Contact
Services -> Web Design
Services -> AI Automation
Services -> AI Agents
Services -> Workflow Automation
Web Design -> Work
Web Design -> AI Automation
AI Automation -> AI Agents
AI Automation -> Workflow Automation
Work -> relevant service pages
Blog -> relevant service pages
Case Studies -> relevant service pages
All major service pages -> Contact
```

## Conversion Funnel

```text
Entry: Home, service pages, work, blog, direct contact
Education: service overview, service detail pages, blog content
Proof: work index and future case studies
Decision: contact route
Primary conversion: Start a Project
Secondary conversions: View Our Work, Explore Services, Contact
```

## Recommended Structured Data

| Type | Use |
| --- | --- |
| `Organization` | Minimal global brand entity using only verified name and domain |
| `WebSite` | Global website entity |
| `Service` | Services index and individual service pages |
| `Article` | Future blog posts |
| `BreadcrumbList` | Nested routes and detail templates |
| `FAQPage` | Pages that later include real FAQ content |

Do not add review, rating, client, or pricing schema until real information exists.

## Architecture Files

| File | Purpose |
| --- | --- |
| `config/site.ts` | Canonical domain, brand name, and CTA routes |
| `config/navigation.ts` | Primary, desktop, and mobile navigation |
| `config/page-architecture.ts` | Sitemap, page purposes, SEO targets, planned sections, internal links, and conversion targets |
| `config/structured-data.ts` | Structured-data recommendations by page type |
| `lib/seo.ts` | Canonical URL and metadata helpers |
| `lib/structured-data.ts` | Minimal JSON-LD builders for verified global entities |
| `data/services.ts` | Service architecture data |
| `data/blog.ts` | Empty blog post collection and future topic clusters |

## Structural Decisions

- The existing workspace root is the Next.js project root.
- Dynamic project and blog routes use empty data arrays until real content exists.
- Static page metadata is wired with canonical URLs and social metadata basics.
- Meta descriptions and Open Graph images are marked as planned, not written.
- Sitemap generation reads from the shared architecture config and future content data.
