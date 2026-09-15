import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";
import { pageArchitecture } from "@/config/page-architecture";

const page = pageArchitecture.terms;

export const metadata = createPageMetadata(page);

export default function TermsPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main id="main-content">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Legal
              </p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
                Terms of Service
              </h1>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                These terms govern your use of the Burify Labs website and the services we provide.
              </p>
              <div className="space-y-6">
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Agreement to terms</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    By accessing or using this website, you agree to be bound by these terms. If you do not agree, please do not use this website.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Services</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Burify Labs provides web design, AI automation, AI agent development, and workflow automation services. Service scope, pricing, and timelines are agreed individually for each project.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Intellectual property</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Unless otherwise agreed in writing, completed work is transferred to the client upon full payment. Burify Labs retains the right to display completed work in its portfolio.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Content and accuracy</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Content on this website is provided for general information purposes. It is not intended as legal, financial, or professional advice. We aim to keep information accurate and current but make no guarantees about completeness or suitability.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Limitation of liability</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    Burify Labs is not liable for any loss or damage arising from reliance on information published on this website or from the use of services provided. Our total liability is limited to fees paid for the specific service in question.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Changes to terms</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    We may update these terms from time to time. Changes take effect when published on this page. Continued use of the website following any changes indicates your acceptance of the updated terms.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-3">Contact</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    For questions about these terms, contact us at hello@burifylabs.com.
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
