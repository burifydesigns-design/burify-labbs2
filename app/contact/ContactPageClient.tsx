"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";

const contactOptions = [
  {
    title: "Email",
    description: "hello@burifylabs.com",
    href: "mailto:hello@burifylabs.com",
  },
  {
    title: "Response Time",
    description: "Within one business day",
    href: null,
  },
  {
    title: "Availability",
    description: "Remote, worldwide",
    href: null,
  },
];

export function ContactPageClient() {
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
                className="text-caption font-medium uppercase tracking-widest text-primary mb-4"
              >
                Contact
              </p>
              <h1
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className="text-h1 md:text-display text-text-primary mb-6 leading-tight"
              >
                Start a project
              </h1>
              <p
                ref={(el) => { if (el) revealRefs.current[2] = el; }}
                className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                Tell us about your website or automation needs. We will respond with clear next steps.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Contact Info */}
              <div
                ref={(el) => { if (el) revealRefs.current[3] = el; }}
                className="lg:col-span-1"
              >
                <h2 className="text-h3 text-text-primary mb-6">
                  Contact options
                </h2>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  Fill out the form and we will get back to you within one business day.
                  You can also reach us directly via email.
                </p>

                <div className="space-y-6">
                  {contactOptions.map((option) => (
                    <div key={option.title} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-body font-medium text-text-primary mb-1">{option.title}</h3>
                        {option.href ? (
                          <Link href={option.href} className="text-body text-primary hover:text-primary-dark transition-colors duration-200">
                            {option.description}
                          </Link>
                        ) : (
                          <p className="text-body text-text-secondary">{option.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 rounded-xl border border-border bg-background-secondary">
                  <h3 className="text-h5 text-text-primary mb-3">What happens next?</h3>
                  <ol className="space-y-3">
                    {[
                      "You submit the form with your project details",
                      "We review and respond within one business day",
                      "We schedule a discovery call if it makes sense",
                      "You receive a clear proposal with scope and pricing",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-body text-text-secondary">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-body-sm font-medium text-primary">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Contact Form */}
              <div
                ref={(el) => { if (el) revealRefs.current[4] = el; }}
                className="lg:col-span-2"
              >
                <div className="p-8 rounded-2xl border border-border bg-background">
                  <h2 className="text-h3 text-text-primary mb-2">
                    Tell us about your project
                  </h2>
                  <p className="text-body text-text-secondary mb-8">
                    The more detail you provide, the better we can understand your needs.
                  </p>
                  <ContactForm />
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

export default ContactPageClient;
