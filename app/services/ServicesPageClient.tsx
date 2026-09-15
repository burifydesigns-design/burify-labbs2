"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const services = [
  {
    name: "Web Design",
    description:
      "Modern, conversion-focused websites built to represent your brand and drive results.",
    href: "/services/web-design",
    features: [
      "Custom design",
      "Mobile-first",
      "Conversion-focused layouts",
      "Fast loading",
      "SEO-optimized structure",
    ],
  },
  {
    name: "AI Automation",
    description:
      "Automate repetitive business processes and reduce manual work across your operations.",
    href: "/services/ai-automation",
    features: [
      "Process automation",
      "Document handling",
      "Data processing",
      "Intelligent routing",
      "Continuous improvement",
    ],
  },
  {
    name: "AI Agents",
    description:
      "Build intelligent systems that handle specific business tasks with minimal human input.",
    href: "/services/ai-agents",
    features: [
      "Customer service agents",
      "Sales qualification agents",
      "Research assistants",
      "Scheduling agents",
      "Custom agent development",
    ],
  },
  {
    name: "Workflow Automation",
    description:
      "Connect your tools and streamline your processes into efficient automated workflows.",
    href: "/services/workflow-automation",
    features: [
      "Tool integrations",
      "Process streamlining",
      "Trigger-based actions",
      "Approval workflows",
      "Notification systems",
    ],
  },
];

export function ServicesPageClient() {
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
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/burify-labs-services-background.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
                className="text-caption font-medium uppercase tracking-widest text-primary mb-4"
              >
                Services
              </p>
              <h1
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className="text-h1 md:text-display text-text-primary mb-6 leading-tight"
              >
                Web design and AI automation, under one roof.
              </h1>
              <p
                ref={(el) => { if (el) revealRefs.current[2] = el; }}
                className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                Four core capabilities designed to help modern businesses grow.
                From websites that convert to automation systems that save time.
              </p>
              <div
                ref={(el) => { if (el) revealRefs.current[3] = el; }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button variant="outline" size="lg" href="/work">
                  View Our Work
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES GRID ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service, i) => (
                <Link
                  key={service.href}
                  href={service.href}
                  ref={(el) => { if (el) revealRefs.current[i + 4] = el; }}
                  className="group p-8 rounded-2xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-h4 text-text-primary group-hover:text-primary transition-colors duration-200">
                      {service.name}
                    </h3>
                    <svg
                      className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <p className="text-body text-text-secondary mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-body-sm text-text-secondary">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section className="section bg-background-secondary">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[8] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Process
              </p>
              <h2 className="text-h2 text-text-primary mb-4">
                How we work
              </h2>
              <p className="text-body-lg text-text-secondary">
                A repeatable process that keeps projects on track and aligned with your goals.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {[
                  { step: "01", title: "Discover", description: "Learn about your business, goals, challenges, and current systems. Understanding comes before any design or development." },
                  { step: "02", title: "Strategize", description: "Define the approach, prioritize features, and create a roadmap. Clear direction prevents costly changes later." },
                  { step: "03", title: "Build", description: "Design and development happen together, with regular check-ins. You will see progress throughout the project." },
                  { step: "04", title: "Launch & Support", description: "We launch, verify everything works, and provide ongoing support. Your system continues working after we leave." },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    ref={(el) => { if (el) revealRefs.current[index + 9] = el; }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-body-sm font-semibold text-primary">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-h5 text-text-primary mb-2">{item.title}</h3>
                      <p className="text-body text-text-secondary leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section bg-background">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[13] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-pink/20" aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Ready to get started?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about your project. We will respond within one business day with initial thoughts on how we can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" size="lg" href="/contact" className="!border-white/30 !text-white hover:!bg-white/10">
                    Contact Us
                  </Button>
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

export default ServicesPageClient;
