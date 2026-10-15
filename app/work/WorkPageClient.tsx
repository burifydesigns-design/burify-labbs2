"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { WorkProjectCard } from "@/components/work";
import { publishedProjects } from "@/data/projects";
import "./work.css";

export function WorkPageClient() {
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const orderedProjects = [...publishedProjects].sort((a, b) => {
    const order = [
      "cavari-group",
      "precision-auto-centre",
      "real-estate-n8n-automation",
      "hillview-physiotherapy",
    ];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main id="main-content">
        {/* ===== HERO ===== */}
        <section className="work-hero">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/burify-labs-work-background.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
          <div className="work-hero__glow" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
                className="text-caption font-medium uppercase tracking-widest text-primary mb-4"
              >
                Work
              </p>
              <h1
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className="text-h1 md:text-display text-text-primary mb-6 leading-tight"
              >
                Selected Work
              </h1>
              <p
                ref={(el) => { if (el) revealRefs.current[2] = el; }}
                className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                 Websites, digital experiences and automation systems built to solve real business problems.
                 Each project reflects a business-first approach: strategy defined before design, and outcomes measured from day one.
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

        {/* ===== PROJECTS GRID ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {orderedProjects.map((project, i) => (
                <div
                  key={project.slug}
                  ref={(el) => { if (el) revealRefs.current[i + 4] = el; }}
                >
                  <WorkProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section bg-background">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[8] = el; }}
              className="work-cta px-8 py-16 md:px-16 md:py-24"
            >
              <div className="work-cta__glow" aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Have a project in mind?
                </h2>
                  <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Let&apos;s build something that works. Tell us about your project and we will respond within one business day with initial thoughts on how we can help.
                  Every engagement begins with understanding your goals and current setup — no templates, no generic proposals.
                </p>
                <Button variant="outline" size="lg" href="/contact">
                  Contact Us
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

export default WorkPageClient;
