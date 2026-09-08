import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata();

export default function TermsPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main>
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
                These terms of service govern your use of the Burify Labs website.
                This page is a placeholder and should be reviewed by legal counsel before publication.
              </p>
              <div className="space-y-6">
                <p className="text-body text-text-secondary leading-relaxed">
                  By using this website, you agree to these terms. If you do not agree, please do not use this website.
                </p>
                <p className="text-body text-text-secondary leading-relaxed">
                  The content on this website is provided for general information purposes only.
                  It is not intended to constitute legal, financial, or professional advice.
                </p>
                <p className="text-body text-text-secondary leading-relaxed">
                  We reserve the right to modify these terms at any time. Your continued use of the website
                  following any changes indicates your acceptance of the new terms.
                </p>
                <p className="text-body text-text-secondary leading-relaxed">
                  For questions about these terms, contact us at hello@burifylabs.com.
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