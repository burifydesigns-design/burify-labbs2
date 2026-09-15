"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const values = [
  {
    title: "Strategy first",
    description: "Every project starts with business goals, not aesthetics. Decisions are tied to measurable outcomes.",
  },
  {
    title: "Design meets technology",
    description: "We combine strategic design with technical implementation under one roof, so nothing gets lost between teams.",
  },
  {
    title: "Automation that helps",
    description: "We focus on automations that save meaningful time. No unnecessary complexity — just systems that work.",
  },
  {
    title: "Built to scale",
    description: "Websites and automation systems designed to grow with your business. We build for today and tomorrow.",
  },
  {
    title: "Direct communication",
    description: "You work directly with the team building your project. No account managers, no layers.",
  },
  {
    title: "Long-term partnership",
    description: "Launch is just the start. We support, monitor, and refine so your systems keep improving.",
  },
];

const services = [
  { title: "Web Design", desc: "Conversion-focused websites built for business results, not just visual appeal." },
  { title: "AI Automation", desc: "Intelligent systems that handle repetitive tasks across your business operations." },
  { title: "AI Agents", desc: "Autonomous systems for customer support, lead qualification, and data tasks." },
  { title: "Workflow Automation", desc: "Connected tools that communicate and route data automatically across your stack." },
];

const stats = [
  { value: "4+", label: "Core services" },
  { value: "100%", label: "In-house delivery" },
  { value: "Strategy", label: "First approach" },
];

export function AboutPageClient() {
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
      <main id="main-content">
        {/* ===== HERO ===== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
                className="text-caption font-medium uppercase tracking-widest text-primary mb-4"
              >
                About Burify Labs
              </p>
              <h1
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className="text-h1 md:text-display text-text-primary mb-6 leading-tight"
              >
                A studio that thinks like a business partner.
              </h1>
              <p
                ref={(el) => { if (el) revealRefs.current[2] = el; }}
                className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                Burify Labs is a technology studio focused on two things: building websites that convert,
                and implementing automation systems that save meaningful time. We combine web design, AI automation,
                AI agents, and workflow automation under one roof for businesses that want to grow without hitting operational ceilings.
              </p>
            </div>
          </div>
        </section>

        {/* ===== WHAT WE DO ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                What We Do
              </p>
              <h2 className="text-h2 text-text-primary mb-4">
                Four capabilities. One team.
              </h2>
              <p className="text-body-lg text-text-secondary">
                We offer web design, AI automation, AI agents, and workflow automation services.
                Together, they form a complete capability for businesses that want to improve their digital presence and operational efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
                >
                  <h3 className="text-h5 text-text-primary mb-3">{service.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MISSION ===== */}
        <section className="section bg-background-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={(el) => { if (el) revealRefs.current[5] = el; }}
              >
                <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                  Mission
                </p>
                <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                  Help businesses grow without hitting operational ceilings.
                </h2>
                <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">
                  Most businesses have untapped potential. Their website could convert better.
                  Their team could spend less time on repetitive work.
                  Their tools could work together instead of in silos.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  Burify Labs exists to close those gaps.
                  We design digital experiences that attract customers and build automation systems
                  that free your team to focus on higher-value work.
                  Every project starts with a clear business goal — then we work backwards to the technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" size="md" href="/services">
                    Explore Services
                  </Button>
                </div>
              </div>
              <div
                ref={(el) => { if (el) revealRefs.current[6] = el; }}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="p-6 rounded-xl border border-border bg-background text-center">
                    <div className="text-h3 text-text-primary mb-2">{stat.value}</div>
                    <div className="text-body-sm text-text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== APPROACH ===== */}
        <section className="section bg-background">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[7] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Approach
              </p>
              <h2 className="text-h2 text-text-primary mb-4">
                How we work
              </h2>
              <p className="text-body-lg text-text-secondary">
                A repeatable process that keeps projects on track and aligned with your goals.
              </p>
              <p className="text-body text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
                Whether we are building a website or an automation system, the same four stages apply.
                Clear milestones, regular check-ins, and a focus on outcomes over outputs.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {[
                  { step: "01", title: "Discover", description: "Understand your business, audience, goals, and current systems. This shapes every decision that follows." },
                  { step: "02", title: "Strategize", description: "Define structure, priorities, and roadmap. A clear plan prevents costly changes later." },
                  { step: "03", title: "Build", description: "Design and develop with regular check-ins. You see progress throughout the project." },
                  { step: "04", title: "Optimize", description: "Refine performance, conversions, and automation efficiency based on real-world results." },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    ref={(el) => { if (el) revealRefs.current[index + 8] = el; }}
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

        {/* ===== VALUES ===== */}
        <section className="section bg-background-secondary">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[12] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Values
              </p>
              <h2 className="text-h2 text-text-primary mb-4">
                What guides every decision
              </h2>
              <p className="text-body-lg text-text-secondary">
                These values shape how we work with clients, approach problems, and build systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <div
                  key={value.title}
                  ref={(el) => { if (el) revealRefs.current[i + 13] = el; }}
                  className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg"
                >
                  <h3 className="text-h5 text-text-primary mb-3">{value.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EXPERTISE ===== */}
        <section className="section bg-background">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[19] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className="text-caption font-medium uppercase tracking-widest text-primary mb-4">
                Expertise
              </p>
              <h2 className="text-h2 text-text-primary mb-4">
                Where our focus lies
              </h2>
              <p className="text-body-lg text-text-secondary">
                We specialise in digital experiences and automation systems for small and medium businesses.
                Our expertise covers the full stack: strategy, design, development, and ongoing optimisation.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-h5 text-text-primary mb-3">Web Design and Development</h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  From business websites to custom platforms, every build is structured around your audience and goals.
                  We use modern frameworks and clean architecture to deliver fast, accessible, and maintainable websites.
                  Every project includes performance testing, responsive design, and SEO foundations from the start.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-h5 text-text-primary mb-3">AI Automation and Intelligent Systems</h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  We design and implement automation systems using established platforms.
                  These systems handle lead qualification, data processing, customer follow-up,
                  internal notifications, and more. The goal is always to reduce manual work and improve consistency.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-h5 text-text-primary mb-3">Integration and Tooling</h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  We connect the tools your business already uses — CRMs, email platforms, calendars, forms, databases —
                  so data flows automatically between them. No rip-and-replace approach. Just smarter connections
                  that extend the value of your existing technology stack.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section bg-background-secondary">
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[23] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-pink/20" aria-hidden="true" />
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-h2 md:text-h3 text-white mb-6">
                    Want to work together?
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

export default AboutPageClient;
