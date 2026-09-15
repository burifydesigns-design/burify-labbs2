import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";
import { pageArchitecture } from "@/config/page-architecture";

const page = pageArchitecture["editorial-policy"];

export const metadata = createPageMetadata(page);

export default function EditorialPolicyPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main id="main-content">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Editorial Policy
              </p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
                How we publish content
              </h1>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                This policy explains how Burify Labs creates, reviews, and maintains the content
                published on this website. It applies to service pages, the blog, and any editorial content.
              </p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Purpose</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Content on this website is written to inform business owners and decision-makers
                    about web design, AI automation, AI agents, and workflow automation topics.
                    Articles aim to be practical, accurate, and useful rather than promotional or generic.
                  </p>
                </div>

                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Research and accuracy</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Content is researched using established industry sources, platform documentation,
                    and practical project experience. Claims about technology, performance, or best practices
                    are based on verified information rather than speculation.
                  </p>
                </div>

                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Review process</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Published content is reviewed for accuracy, clarity, and relevance before it goes live.
                    Corrections and updates are made when information changes or when errors are identified.
                    Readers who spot inaccuracies are encouraged to contact us at hello@burifylabs.com.
                  </p>
                </div>

                <div>
                  <h2 className="text-h2 text-text-primary mb-3">No fabricated claims</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Burify Labs does not publish fabricated statistics, awards, client testimonials,
                    or other claims that cannot be verified. All case studies and project references
                    are based on actual work delivered to real clients.
                  </p>
                </div>

                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Updates</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Technology and industry practices evolve. Burify Labs reviews and updates relevant
                    content on a regular basis to ensure it remains accurate and useful.
                    Publication and last-updated dates are included where applicable.
                  </p>
                </div>

                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Contact</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    For questions about this policy or to report an inaccuracy in published content,
                    contact us at hello@burifylabs.com.
                  </p>
                </div>

                <p className="text-text-muted text-sm">
                  Last updated: September 2026
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
