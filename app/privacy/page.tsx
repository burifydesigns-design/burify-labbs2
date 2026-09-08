import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata();

export default function PrivacyPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Privacy
              </p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                This privacy policy explains how Burify Labs handles information collected through this website.
                This page is a placeholder and should be reviewed by legal counsel before publication.
              </p>
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p>
                  We collect information you provide directly through our contact form, including your name,
                  email address, company name, and project details. This information is used solely to respond
                  to your enquiry and provide the services you request.
                </p>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties
                  except as necessary to provide our services or as required by law.
                </p>
                <p>
                  You may request access to, correction of, or deletion of your personal data by contacting
                  us at hello@burifylabs.com.
                </p>
                <p>
                  For questions about this policy, contact us at hello@burifylabs.com.
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