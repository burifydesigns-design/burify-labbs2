import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata();

export default function NotFoundPage() {
  return (
    <>
      <Navbar variant="light" showCta={false} />
      <main id="main-content">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                404
              </p>
              <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
                Page Not Found
              </h1>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
                The page you are looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back to something useful.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" href="/">
                  Back to Home
                </Button>
                <Button variant="outline" size="lg" href="/services">
                  View Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
