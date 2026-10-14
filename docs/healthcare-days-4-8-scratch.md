# Healthcare Blog Articles 16–40 (Days 4–8) — Scratch Ledger

Scratch file. Not published, not imported by the site. Records research sources and the
cross-article distinctness outline used while drafting.

Date of research: 2026-10-13.

---

## 1. Source ledger

Every claim in the articles that cites a source is listed here with the publisher, URL, date
accessed, and the articles it supports. Only pages that were actually opened are listed.

### S1 — Google: Creating helpful, reliable, people-first content
- Publisher: Google Search Central
- URL: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Accessed: 2026-10-13
- Page states: last updated 2026-10-05
- Key verified statements:
  - Google's automated ranking systems prioritize helpful, reliable content created to benefit people, not to manipulate rankings.
  - E-E-A-T = experience, expertise, authoritativeness, trustworthiness. "Trust is most important." E-E-A-T itself is **not a specific ranking factor**; it is a mix of factors.
  - Health, financial stability, safety, and welfare topics are described as "Your Money or Your Life" (YMYL); systems give more weight to strong E-E-A-T for these.
  - "Ask Who, How, and Why about your content."
  - Fabricating creator profiles (AI-generated headshots, made-up names, false credentials) is described as a form of deception and a signal of a low-quality page.
  - Using automation to produce content for the primary purpose of manipulating search rankings is described as a violation of the spam policies (links to spam policies).
  - "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"
  - Changing page dates to seem fresh without substantial change is flagged as a warning sign.
  - Search quality raters have no control over how pages rank; rater data is not used directly in ranking algorithms.
  - Main content assessed on Effort, Originality, Talent or skill, Accuracy.
- Supports: Articles 17, 20, 22, 27, 32, 37, 39.

### S2 — W3C WAI: WCAG 2 Overview
- Publisher: World Wide Web Consortium, Web Accessibility Initiative
- URL: https://www.w3.org/WAI/standards-guidelines/wcag/
- Accessed: 2026-10-13
- Page states: Updated 17 September 2026
- Key verified statements:
  - WCAG 2.2 published 5 October 2023; an update published 12 December 2024. W3C encourages use of the latest version.
  - WCAG 2.2 has 13 guidelines under 4 principles (perceivable, operable, understandable, robust). Testable success criteria at levels A, AA, AAA.
  - WCAG 2.2 adds 9 success criteria over 2.1; does not change existing criteria. 4.1.1 Parsing is obsolete in 2.2.
  - WCAG 2.0/2.1/2.2 are backwards compatible — content conforming to 2.2 also conforms to 2.1 and 2.0.
  - WCAG 3 exists as an early draft and is not a stable referenceable standard. WCAG 2.2 does not deprecate earlier versions.
  - WCAG 2.2 is ISO/IEC 40500:2025.
  - For the European Accessibility Act, most organizations use WCAG and EN 301 549; the 2026 version of EN 301 549 uses WCAG 2.2.
- Supports: Articles 19, 29, 34 (and cross-references in 30, 31).

### S3 — web.dev (Chrome): Web Vitals / Core Web Vitals
- Publisher: Google Chrome / web.dev, authored by Philip Walton
- URL: https://web.dev/articles/vitals
- Accessed: 2026-10-13
- Page states: Published May 4 2020, last updated October 31 2024
- Key verified statements:
  - Core Web Vitals are the subset of Web Vitals that apply to all web pages, should be measured by all site owners, and are surfaced across all Google tools.
  - Current Core Web Vitals: **LCP** (loading, ≤ 2.5 s), **INP** (interactivity, ≤ 200 ms), **CLS** (visual stability, ≤ 0.1). All three are Stable.
  - Recommended measurement target is the **75th percentile** of page loads, segmented across mobile and desktop.
  - **FID was retired and replaced by INP**, which became a stable Core Web Vital in 2024. FID is therefore NOT currently a Core Web Vital.
  - Core Web Vitals are, first and foremost, **field** metrics. Lab measurement (Lighthouse, Chrome DevTools) is "not a substitute for field measurement."
  - Lighthouse cannot measure INP because there is no user input in a simulated load; **Total Blocking Time (TBT)** is the lab proxy for INP.
  - Field tools: Chrome User Experience Report (CrUX), Chrome DevTools, PageSpeed Insights, Search Console's Core Web Vitals report.
  - Lab tools: Chrome DevTools, Lighthouse.
  - Performance varies substantially with the user's device capabilities, network conditions, and other running processes; only field measurement captures the complete picture.
  - Other (non-core) Web Vitals such as TTFB, FCP and TBT help diagnose issues.
  - Google "strongly recommends" setting up your own real-user monitoring because CrUX does not provide per-pageview telemetry.
- Supports: Articles 21, 25, 30, 32.

### S4 — Google Search Central: Article structured data
- Publisher: Google Search Central
- URL: https://developers.google.com/search/docs/appearance/structured-data/article
- Accessed: 2026-10-13
- Page states: last updated 2026-09-08
- Key verified statements:
  - `Article`, `NewsArticle` and `BlogPosting` are the accepted types.
  - **There are no required properties**; recommended properties are `author`, `author.name`, `author.url`, `dateModified`, `datePublished`, `headline`, `image`.
  - `author` may be `Person` or `Organization`.
  - Only the author's name belongs in `author.name` — not the publisher name, job title, or honorifics.
  - Validate with the Rich Results Test; general structured data guidelines and Search Essentials apply.
  - Google does not guarantee that structured-data features will show in results.
- Supports: Article 32, and the integration of Article/BlogPosting JSON-LD already present in the site.

### S5 — Google Search Central: Spam policies for Google web search
- Publisher: Google Search Central
- URL: https://developers.google.com/search/docs/essentials/spam-policies
- Accessed: 2026-10-13
- Key verified statements:
  - **Link spam** is the practice of creating links to or from a site primarily for the purpose of manipulating search rankings. Listed examples include: buying or selling links for ranking purposes (money, goods/services, sending a product in exchange for a link); excessive link exchanges or partner pages exclusively for cross-linking; using automated programs or services to create links; requiring a link as part of a Terms of Service; text advertisements or text links that don't block ranking credit; advertorials or native advertising with ranking-credit links; **low-quality directory or bookmark site links**; widely distributed footer/template links.
  - A `rel="nofollow"` or `rel="sponsored"` value qualifies such links, and having them is not then a policy violation.
  - **Scaled content abuse**: generating many pages for the primary purpose of manipulating rankings and not helping users, "no matter how it's created," including using generative AI to generate many pages without adding value.
  - **Cloaking**: presenting different content to users and search engines with intent to manipulate.
  - **Doorway abuse**: creating pages to rank for specific similar queries that lead to intermediate pages less useful than the final destination; also "multiple domain names or pages targeted at specific regions or cities that funnel users to one page."
  - **Keyword stuffing**: filling a page with keywords or numbers in an attempt to manipulate rankings, including "blocks of text that list cities and regions that a web page is trying to rank for."
  - **Hidden text and link abuse**, **scraping** (republishing other sites' content without adding original value).
  - Detection is automated plus, as needed, human review; consequences can be lower ranking or not appearing in results.
- Supports: Articles 27, 37.

### S6 — Google Business Profile Help: Tips to improve your local ranking on Google
- Publisher: Google
- URL: https://support.google.com/business/answer/7091
- Accessed: 2026-10-13
- Key verified statements:
  - "Local results are mainly based on relevance, distance, and popularity" — the page uses **popularity** as the third factor in this version (older formulations say "prominence").
  - Relevance is how well a Business Profile matches what someone is searching for.
  - Distance is how far each business is from the searching customer.
  - Popularity/prominence is how well-known the business is, "based on info like how many websites link to your business and how many reviews you have."
  - "There's no way to request or pay for a better local ranking on Google."
  - Complete and accurate info makes a business more likely to show in local results.
  - Verification tells Google you are authorized to represent the business.
- Supports: Articles 17, 37.
- **Fact-check note:** the Day 3 article `local-seo-for-healthcare-practices-how-patients-find-clinics` states the three factors are "relevance, distance, and prominence." The live page currently says "relevance, distance, and popularity." I use "relevance, distance, and how well known the practice is" in the new articles to avoid restating a possibly-version-dependent label, and flag the existing article's wording in the final report rather than editing Day 1–3 bodies.

### S7 — W3C WAI: WCAG 2.2 at a Glance (secondary confirmation of criteria numbering)
- Publisher: W3C WAI
- URL: https://www.w3.org/WAI/standards-guidelines/wcag/glance/
- Accessed: 2026-10-13
- Supports confirming that specific numbered success criteria are cited only where the W3C page was actually read.
- **Fact-check note:** Where an existing Day 1–3 article asserts a specific criterion number (for example "WCAG 2.2 introduced new success criteria related to accessible authentication"), the number 3.3.8 Accessible Authentication is real in WCAG 2.2 but I verified only via the WCAG 2 Overview page listing new 2.2 criteria, not the glance page's individual numbers. In the new articles I avoid quoting criterion numbers I have not individually verified, and instead name the criterion by its subject.

---

## 2. Claims removed or softened during fact-checking

- "Core Web Vitals" set: removed FID from any current-Core-Vitals list; the current set is LCP, INP, CLS (S3).
- E-E-A-T: never presented as a score, a ranking factor, or something an audit tool can measure (S1 explicitly says it is not a specific ranking factor).
- Local ranking factors: avoided hard-committing to the labels "relevance, distance, prominence" and used neutral phrasing plus the Google page as the source (S6).
- Statistics: no bounce-rate percentages, no "as load time goes from 1s to 3s bounce probability increases by 32%" style figures appear in the new articles. (The Day 2 article `healthcare-website-audit-20-problems-we-find-again-and-again` and `local-seo-for-healthcare-practices...` contain "70-80% of prospective patients consult online reviews" and the 32% Google figure; those are pre-existing Day 1–3 content that I do not edit. Flagged in the final report.)
- No case studies, client counts, conversion rates, revenue or ROI figures anywhere in the new articles.
- No invented prices, salaries, or savings in the automation-vs-staffing comparison.

---

## 3. Cross-article distinctness outline (owns / does not own)

| # | Owns | Does not own (links instead) |
|---|---|---|
| 16 | Verifiable credibility vs decoration; a trust audit a practice manager can run | Accessibility checklist (29), conversion audit (25) |
| 17 | Diagnostic competitor gap investigation, one variable at a time | Content evaluation (22), local SEO detail |
| 18 | Human experience of automated enquiry handling; cold vs considerate messages | Appointment lifecycle (28), workflow mapping (38) |
| 19 | Age-related change and usability, without stereotyping | Full accessibility checklist (29) |
| 20 | Interpreting audit scores; score ≠ ranking ≠ enquiry ≠ booking | 25-check procedure (32), prioritization (40) |
| 21 | Diagnosing the cause of slowness; field vs lab data | Conversion audit (25) |
| 22 | Editorial process for credible health content | SEO audit checks (32), links (37) |
| 23 | Five workflows overviewed for oversight and failure modes | End-to-end appointment lifecycle (28), mapping (38) |
| 24 | Avoidable friction in finding services and contacting | Conversion audit (25), accessibility (29) |
| 25 | Conversion audit separating technical from messaging/traffic-quality | Score interpretation (20), prioritization (40) |
| 26 | Information architecture; structure around visitor questions | Service-page copy outline (27) |
| 27 | The single service page as a non-duplicated asset | IA (26), trust signals (16) |
| 28 | Appointment lifecycle end-to-end and its failure modes | Overview of 5 workflows (23) |
| 29 | Actionable accessibility checklist and test plan for non-specialists | Age-specific usability (19) |
| 30 | Retain/repair/rebuild decision before a redesign | Redesign checklist execution (31) |
| 31 | Phased redesign execution checklist | Pre-redesign audit (30) |
| 32 | 25-check repeatable procedure, one variable per check | Score interpretation (20) |
| 33 | Automation vs hiring decision matrix | Choosing a first workflow (23), mapping (38) |
| 34 | Appointment-request form design | Clinical intake/warning (29), accessibility basics |
| 35 | Teardown method separating evidence from assumption | 25-check (32), prioritization (40) |
| 36 | Matching CTA to page purpose and visitor readiness | Conversion audit (25) |
| 37 | Legitimate local references and relationship outreach | Service-page local relevance (27) |
| 38 | Mapping one workflow in detail before automating | Choosing among workflows (23), lifecycle (28) |
| 39 | Plain-language copy editing without changing meaning | Content credibility (22) |
| 40 | Turning findings into an ordered plan | Teardown report structure (35) |

Each article contains at least one table, checklist, framework, template or hypothetical
example not present in any other.

---

## 4. Internal routes available for linking

Pre-existing Day 1–3 healthcare routes (canonical paths):
- /blog/why-most-healthcare-websites-dont-convert-visitors-into-patients
- /blog/why-your-healthcare-practice-isnt-ranking-on-google
- /blog/10-healthcare-tasks-that-can-be-automated-with-ai
- /blog/the-patient-journey-starts-before-the-appointment
- /blog/the-10-minute-healthcare-website-audit
- /blog/anatomy-of-a-high-converting-healthcare-website
- /blog/local-seo-for-healthcare-practices-how-patients-find-clinics
- /blog/how-ai-can-reduce-administrative-work-for-healthcare-practices
- /blog/5-reasons-patients-leave-healthcare-websites-without-booking
- /blog/healthcare-website-audit-20-problems-we-find-again-and-again
- /blog/hipaa-pipeda-compliant-web-design-checklist
- /blog/ada-wcag-healthcare-accessibility-audit
- /blog/ehr-emr-website-integration-patient-booking
- /blog/designing-telehealth-portals-virtual-clinics
- /blog/private-surgical-clinics-custom-web-design
- /blog/multi-location-medical-groups-web-architecture
- /blog/b2b-healthcare-web-design-medical-device-healthtech
- /blog/healthcare-website-redesign-cost-2026
- /blog/international-medical-regulations-web-design
- /blog/medical-seo-website-redesign-specialists

Service routes: /services/web-design, /services/ai-automation, /services/ai-agents,
/services/workflow-automation, /services, /work, /contact.
