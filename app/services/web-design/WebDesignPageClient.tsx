"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import styles from "./web-design.module.css";

const faqs = [
  {
    question: "How long does a website project take?",
    answer:
      "Most website projects take 4–12 weeks depending on scope. We provide a clear timeline after our discovery conversation.",
  },
  {
    question: "Can you redesign our existing website?",
    answer:
      "Yes. We regularly improve existing websites. We start by understanding what works and what doesn't, then propose changes with measurable impact.",
  },
  {
    question: "Will our website work on mobile?",
    answer:
      "Every website we build is mobile-first. We design and test across screen sizes to ensure a consistent experience everywhere.",
  },
  {
    question: "Do you handle hosting and maintenance?",
    answer:
      "We can recommend hosting platforms and offer maintenance packages after launch. The goal is a site that stays fast, secure, and current.",
  },
  {
    question: "What does SEO-friendly mean?",
    answer:
      "We build with clean markup, fast loading, proper heading structure, and metadata from the start—foundations that help search engines understand your content.",
  },
];

export const webDesignFaqs = faqs;

export function WebDesignPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main className={styles.main}>
        {/* ===== HERO ===== */}
        <section className={`${styles.hero} ${scrolled ? styles.heroScrolled : ""}`}>
          <div className={styles.heroBg} aria-hidden="true">
            <div className={styles.heroGrid} />
            <div className={styles.heroGlow} />
          </div>
          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroText}>
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4 ${styles.heroEyebrow}`}>
                Web Design
              </p>
              <h1 className={`text-h1 md:text-display text-text-primary mb-6 ${styles.heroTitle}`}>
                Websites built to <span className={styles.titleAccent}>turn attention into action.</span>
              </h1>
              <p className={`text-body-lg text-text-secondary mb-8 max-w-2xl ${styles.heroSub}`}>
                Burify Labs designs and builds modern, fast, responsive websites structured around your business goals.
                Every page, interaction, and flow is built to help visitors understand what you do and take the next step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" href="/contact">
                  Start a Project
                </Button>
                <Button variant="outline" size="lg" href="/work">
                  View Our Work
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.browserFrame}>
                <div className={styles.browserDots}>
                  <span /><span /><span />
                </div>
                <div className={styles.browserBody}>
                  <div className={styles.mockNav} />
                  <div className={styles.mockHero}>
                    <div className={styles.mockLine} style={{ width: "60%" }} />
                    <div className={styles.mockLine} style={{ width: "80%" }} />
                    <div className={styles.mockLine} style={{ width: "45%" }} />
                    <div className={styles.mockButton} />
                  </div>
                  <div className={styles.mockGrid}>
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEM ===== */}
        <section className={`section ${styles.problemSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[0] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>The Problem</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Your website shouldn&apos;t just exist.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Most business websites look fine on the surface but fail where it matters.
                Visitors leave without understanding the offer, without trust, and without taking action.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Visitors don't understand what the business offers within seconds.",
                "The site looks outdated or inconsistent with the actual business.",
                "Mobile experience is slow, broken, or hard to use.",
                "There is no clear next step — no contact path, no CTA.",
                "Page speed is poor and search visibility suffers.",
                "Forms don't work, and leads fall through the cracks.",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 1] = el; }}
                  className={`card card-hover ${styles.problemCard}`}
                >
                  <div className={styles.problemNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <p className="text-body text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SOLUTION ===== */}
        <section className={`section bg-background-secondary ${styles.solutionSection}`}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={(el) => { if (el) revealRefs.current[7] = el; }}
              >
                <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>The Solution</p>
                <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                  Built around your business, not a template.
                </h2>
                <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">
                  We start with strategy — understanding your audience, your goals, and what success looks like.
                  Then we design and build a website that communicates clearly, performs well, and turns visitors into enquiries.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  Every decision ties back to measurable outcomes: faster load times, clearer messaging,
                  better mobile experiences, and conversion paths that actually work.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="md" href="/contact">
                    Start a Project
                  </Button>
                  <Button variant="ghost" size="md" href="/services/ai-automation">
                    Explore AI Automation
                  </Button>
                </div>
              </div>
              <div
                ref={(el) => { if (el) revealRefs.current[8] = el; }}
                className={styles.solutionVisual}
              >
                <div className={styles.flowDiagram}>
                  <div className={styles.flowStep}>
                    <span className={styles.flowStepNumber}>01</span>
                    <span className={styles.flowStepLabel}>Strategy</span>
                  </div>
                  <div className={styles.flowLine} />
                  <div className={styles.flowStep}>
                    <span className={styles.flowStepNumber}>02</span>
                    <span className={styles.flowStepLabel}>Design</span>
                  </div>
                  <div className={styles.flowLine} />
                  <div className={styles.flowStep}>
                    <span className={styles.flowStepNumber}>03</span>
                    <span className={styles.flowStepLabel}>Build</span>
                  </div>
                  <div className={styles.flowLine} />
                  <div className={styles.flowStep}>
                    <span className={styles.flowStepNumber}>04</span>
                    <span className={styles.flowStepLabel}>Launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT WE BUILD ===== */}
        <section className={`section ${styles.buildSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[9] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What We Build</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Capabilities built for real business results.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Every project is different, but these are the core capabilities we bring to every website build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Strategy & UX Structure", desc: "We map user journeys, define information architecture, and structure the site around what your audience actually needs to do." },
                { title: "Responsive Design", desc: "Interfaces that work on every screen size. Touch targets, readable typography, and layouts that adapt without breaking." },
                { title: "Conversion-Focused Layouts", desc: "Clear CTAs, logical flow, and minimal friction between landing and enquiry. We design for action, not just appearance." },
                { title: "Performance", desc: "Optimized assets, clean code, and measured performance. Fast sites keep visitors engaged and rank better in search." },
                { title: "SEO Foundations", desc: "Semantic markup, metadata, heading structure, and clean URLs — built from the start, not added afterward." },
                { title: "Forms & Integrations", desc: "Lead capture, contact paths, CRM connections, and third-party tools wired up and tested before launch." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 10] = el; }}
                  className={`card card-hover ${styles.buildCard}`}
                >
                  <div className={styles.cardNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="text-h5 text-text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section className={`section bg-background-secondary ${styles.processSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[16] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Process</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                How we build your website.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                A clear, collaborative process designed to deliver the right outcome without wasted time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discover", desc: "Understand your business, audience, goals, and current systems. This shapes every decision that follows." },
                { step: "02", title: "Strategize", desc: "Define structure, user journeys, and priorities. A clear plan prevents costly changes later." },
                { step: "03", title: "Design & Build", desc: "Create the experience, then develop it. Regular check-ins keep you informed and aligned." },
                { step: "04", title: "Launch & Improve", desc: "Deploy, verify, and monitor. We refine based on real usage and measurable outcomes." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 17] = el; }}
                  className={`text-center ${styles.processCard}`}
                >
                  <div className={styles.processStepNumber}>{item.step}</div>
                  <h3 className="text-h5 text-text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{item.desc}</p>
                  {i < 3 && <div className={styles.processConnector} aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== USE CASES ===== */}
        <section className={`section ${styles.useCasesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[21] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Use Cases</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Built for real business needs.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Business websites",
                "Landing pages",
                "Corporate websites",
                "Service websites",
                "Portfolio websites",
                "E-commerce experiences",
                "Website redesigns",
                "Multi-page platforms",
                "MVP web applications",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 22] = el; }}
                  className={`flex items-start gap-3 p-5 card card-hover ${styles.useCaseItem}`}
                >
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-body text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TECHNOLOGY ===== */}
        <section className={`section bg-background-secondary ${styles.techSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[31] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Integrations</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Technology is the tool. The outcome is the goal.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                We select and connect the right platforms for your needs. No unnecessary complexity — just systems that support your business.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Modern frameworks", "Headless CMS", "Analytics", "CRM tools", "Form systems", "Email platforms", "Hosting", "CDN & performance"].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 32] = el; }}
                  className={`card text-center py-5 px-4 ${styles.techItem}`}
                >
                  <span className="text-body text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DELIVERABLES ===== */}
        <section className={`section ${styles.deliverablesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[40] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What You Get</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                A complete website package, not just design files.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Strategy and project scope",
                "UX structure and sitemap",
                "Responsive UI design",
                "Full development and testing",
                "SEO foundations",
                "Contact and lead forms",
                "Analytics setup",
                "Deployment and launch support",
                "Documentation for your team",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 41] = el; }}
                  className={`flex items-start gap-3 p-5 card card-hover ${styles.deliverableItem}`}
                >
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-body text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY BURIFY LABS ===== */}
        <section className={`section bg-background-secondary ${styles.whySection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[50] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Why Burify Labs</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                A partner that thinks like a business, not just a studio.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Strategy First", desc: "Every project starts with business goals, not aesthetics. Decisions are tied to measurable outcomes." },
                { title: "Design Meets Technology", desc: "We combine strategic design with technical implementation under one roof, so nothing gets lost between teams." },
                { title: "Built to Scale", desc: "Websites designed to grow with your business. Clean code, solid architecture, room to expand." },
                { title: "Direct Communication", desc: "You work with the team building your project. No account managers, no layers, no miscommunication." },
                { title: "Performance Focused", desc: "Fast loading, clean markup, and strong foundations. A fast site keeps visitors and ranks better." },
                { title: "Ongoing Partnership", desc: "Launch is just the start. We support, monitor, and refine so your site keeps improving." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 51] = el; }}
                  className={`card card-hover ${styles.whyCard}`}
                >
                  <h3 className="text-h5 text-text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== RELATED WORK ===== */}
        <section className={`section ${styles.workSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[57] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Related Work</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Selected website projects.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Projects where design meets function and performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Cavari Group", tags: ["Web Design", "Business"], desc: "A premium digital platform for an integrated Australian advisory and investment organisation.", slug: "cavari-group" },
                { title: "Hillview Physiotherapy Group", tags: ["Web Design", "Healthcare"], desc: "A modern digital presence for a physiotherapy clinic in Dromana, Victoria.", slug: "hillview-physiotherapy-group" },
                { title: "Precision Auto Centre", tags: ["Web Design", "Automotive"], desc: "A professional website for a local automotive repair business in Cranbourne West, Victoria.", slug: "precision-auto-centre" },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 58] = el; }}
                  className={`card card-hover overflow-hidden ${styles.workCard}`}
                >
                  <div className={styles.workCardImage}>
                    <div className={styles.workCardPlaceholder} />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, j) => (
                        <span key={j} className="badge badge-primary">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-h5 text-text-primary mb-2">{item.title}</h3>
                    <p className="text-body text-text-secondary mb-4">{item.desc}</p>
                    <Link href={`/work/${item.slug}`} className="text-body-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-2">
                      View Case Study
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="md" href="/work">
                View All Projects
              </Button>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className={`section bg-background-secondary ${styles.faqSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[61] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>FAQ</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Common questions about web design.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 62] = el; }}
                  className={`border-b border-border ${styles.faqItem}`}
                >
                  <button
                    className={`w-full flex items-center justify-between py-5 text-left ${styles.faqQuestion}`}
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-body text-text-primary font-medium pr-8">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    hidden={openFaq !== i}
                    className={styles.faqAnswer}
                  >
                    <p className="text-body text-text-secondary leading-relaxed pb-5">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className={`section ${styles.finalCta}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[67] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <p className={`text-caption font-medium uppercase tracking-widest text-primary-light mb-4`}>Start a Project</p>
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Have a problem worth solving?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about your project. We&apos;ll respond within one business day with initial thoughts on how we can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="lg" href="/contact">
                    Start a Project
                  </Button>
                  <Button variant="outline" size="lg" href="/contact" className="!border-white/30 !text-white hover:!bg-white/10">
                    Talk to Burify Labs
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
