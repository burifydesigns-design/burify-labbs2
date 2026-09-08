import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata();

export default function CookiesPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Cookies
              </p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
                Cookie Policy
              </h1>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                This cookie policy explains how Burify Labs uses cookies and similar technologies on this website.
                This page is a placeholder and should be reviewed by legal counsel before publication.
              </p>
              <div className="space-y-8">
                <div>
                  <h2 className="text-h2 text-text-primary mb-4">Necessary Cookies</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    These cookies are required for the website to function and cannot be switched off.
                    They are usually set in response to actions you take, such as setting privacy preferences
                    or filling in forms.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-4">Analytics Cookies</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    These cookies help us understand how visitors interact with the website by collecting
                    anonymous information. Currently, no analytics cookies are loaded without consent.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-4">Preference Cookies</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    These cookies remember choices you make to provide a more personalized experience.
                    Currently, no preference cookies are loaded without consent.
                  </p>
                </div>
                <div>
                  <h2 className="text-h2 text-text-primary mb-4">Managing Cookies</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    You can manage your cookie preferences at any time through the cookie banner or
                    by contacting us at hello@burifylabs.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}