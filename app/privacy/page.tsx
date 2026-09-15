import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";
import { pageArchitecture } from "@/config/page-architecture";

const page = pageArchitecture.privacy;

export const metadata = createPageMetadata(page);

export default function PrivacyPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main id="main-content">
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
                This privacy policy explains how Burify Labs collects, uses, and protects personal information submitted through this website.
              </p>
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p>
                  <strong>Information we collect.</strong> When you contact us through our form, we collect your name, email address, company name, and project details. This information is used solely to respond to your enquiry and provide the services you request.
                </p>
                <p>
                  <strong>How we use your information.</strong> Your details are used to communicate about your enquiry, prepare proposals, and deliver the services you engage us for. We do not use your information for marketing purposes unless you explicitly consent.
                </p>
                <p>
                  <strong>Data sharing.</strong> We do not sell, trade, or transfer your personal information to third parties except as necessary to provide our services or as required by law. Service providers such as hosting and email platforms may process data on our behalf under strict confidentiality obligations.
                </p>
                <p>
                  <strong>Data retention.</strong> We retain enquiry data for as long as is necessary to respond to your request and manage any resulting project relationship. You may request deletion of your data at any time.
                </p>
                <p>
                  <strong>Your rights.</strong> You may request access to, correction of, or deletion of your personal data by contacting us at hello@burifylabs.com.
                </p>
                <p>
                  <strong>Cookies.</strong> This website uses essential cookies for functionality. Analytics tools may collect anonymized usage data. See our Cookie Policy for details.
                </p>
                <p>
                  <strong>Contact.</strong> For questions about this policy, contact us at hello@burifylabs.com.
                </p>
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
