"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import styles from "./ai-automation.module.css";

const faqs = [
  {
    question: "What exactly is AI automation?",
    answer:
      "AI automation uses artificial intelligence to handle repetitive business tasks — from processing documents and responding to enquiries to routing information and updating records — without manual effort for every step.",
  },
  {
    question: "What tasks can be automated?",
    answer:
      "Common tasks include lead follow-up, data entry, document processing, email routing, appointment scheduling, customer support responses, internal notifications, and report generation.",
  },
  {
    question: "Do we need technical knowledge to use the system?",
    answer:
      "No. We build and explain the system in plain language. Once deployed, your team uses it like any other business tool. We provide documentation and support.",
  },
  {
    question: "Can it integrate with our existing tools?",
    answer:
      "Yes. We implement connections between your existing platforms — CRM, email, calendars, forms, databases — so data flows automatically between them.",
  },
  {
      question: "How long does an implementation take?",
      answer:
        "Implementation timelines typically range from 2–8 weeks depending on complexity. We provide a scoped plan after our discovery conversation.",
  },
  {
      question: "What happens after launch?",
      answer:
        "We monitor the system, provide recommendations, and support iterations. The setup can be expanded over time as your business and tools evolve.",
  },
];

export const aiAutomationFaqs = faqs;

export function AiAutomationPageClient() {
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
            <div className={styles.heroOrb} aria-hidden="true" />
          </div>
          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroText}>
              <p className={`text-caption font-medium uppercase tracking-widest text-primary-light mb-4`}>
                AI Automation
              </p>
              <h1 className={`text-h1 md:text-display text-white mb-6 ${styles.heroTitle}`}>
                Manual process. <span className={styles.titleAccent}>Automated system.</span>
              </h1>
              <p className={`text-body-lg text-white/70 mb-8 max-w-2xl ${styles.heroSub}`}>
                Burify Labs helps businesses eliminate repetitive work using AI, integrations, and intelligent workflows.
                Less time spent on admin. More time spent on growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" href="/services/workflow-automation" className="!border-white/30 !text-white hover:!bg-white/10">
                  View Related Services
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.systemDiagram}>
                <div className={styles.systemNode}>Lead Arrives</div>
                <div className={styles.systemArrow} />
                <div className={`${styles.systemNode} ${styles.systemNodeAccent}`}>AI Qualifies</div>
                <div className={styles.systemArrow} />
                <div className={styles.systemNode}>CRM Updated</div>
                <div className={styles.systemArrow} />
                <div className={styles.systemNode}>Team Notified</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT AI AUTOMATION IS ===== */}
        <section className={`section ${styles.whatSection}`}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
              >
                <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What AI Automation Is</p>
                <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                  Automation that actually helps.
                </h2>
                <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">
                  AI automation isn&apos;t about replacing people. It&apos;s about removing the repetitive work that drains time and energy — tasks that follow predictable patterns and can be handled by intelligent systems.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  When a lead arrives, an AI can qualify it, update your CRM, and notify your team — instantly and consistently.
                  No delays. No missed steps. No one spending hours on tasks a system can handle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="ghost" size="md" href="/services/ai-agents">
                    Explore AI Agents
                  </Button>
                </div>
              </div>
              <div
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className={styles.transformationVisual}
              >
                <div className={styles.transformBox}>
                  <div className={styles.transformLabel}>Before</div>
                  <div className={styles.transformItems}>
                    {["Manual data entry", "Slow follow-ups", "Missed leads", "Repetitive tasks"].map((item, i) => (
                      <div key={i} className={styles.transformItem}>
                        <svg className="w-4 h-4 text-accent-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-body text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.transformArrow}>
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div className={`${styles.transformBox} ${styles.transformBoxAccent}`}>
                  <div className={styles.transformLabel}>After</div>
                  <div className={styles.transformItems}>
                    {["Automated entry", "Instant responses", "Qualified leads", "Time freed up"].map((item, i) => (
                      <div key={i} className={styles.transformItem}>
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-body text-text-primary font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEMS ===== */}
        <section className={`section bg-background-secondary ${styles.problemsSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[2] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Problems</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Common inefficiencies we help solve.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Repetitive work accumulates quietly. These are the patterns we see most often.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Leads arrive but aren't followed up quickly enough.",
                "Customer questions are answered manually, again and again.",
                "Teams spend hours on data entry and form processing.",
                "Information gets stuck between disconnected tools.",
                "Reports take longer to produce than they should.",
                "Internal notifications are delayed or missed.",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 3] = el; }}
                  className={`card card-hover ${styles.problemCard}`}
                >
                  <div className={styles.problemNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <p className="text-body text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== AUTOMATION EXAMPLES ===== */}
        <section className={`section ${styles.examplesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[9] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Examples</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                What an automated workflow looks like.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Lead Capture & Qualification",
                  steps: ["Lead arrives via form", "AI qualifies intent", "CRM record created", "Team notified instantly"],
                },
                {
                  title: "Customer Follow-Up",
                  steps: ["Enquiry received", "AI responds with info", "Data collected", "Follow-up triggered"],
                },
                {
                  title: "Document Processing",
                  steps: ["Document submitted", "Data extracted", "Record created", "Notification sent"],
                },
                {
                  title: "Internal Operations",
                  steps: ["Task initiated", "System validates", "Approval routed", "Status updated"],
                },
              ].map((example, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 10] = el; }}
                  className={`card card-hover ${styles.exampleCard}`}
                >
                  <h3 className="text-h5 text-text-primary mb-4">{example.title}</h3>
                  <div className={styles.exampleSteps}>
                    {example.steps.map((step, j) => (
                      <div key={j} className={styles.exampleStep}>
                        <div className={styles.exampleStepNode}>{j + 1}</div>
                        <span className="text-body text-text-secondary">{step}</span>
                        {j < example.steps.length - 1 && <div className={styles.exampleStepLine} aria-hidden="true" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INTEGRATIONS ===== */}
        <section className={`section bg-background-secondary ${styles.integrationsSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[14] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Integrations</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Connects with the tools you already use.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                We work with the platforms your business relies on. No rip-and-replace — just smarter connections.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["CRM systems", "Email platforms", "Forms & surveys", "Calendars", "Databases", "WhatsApp", "Payment systems", "Automation platforms"].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 15] = el; }}
                  className={`card text-center py-5 px-4 ${styles.integrationItem}`}
                >
                  <span className="text-body text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section className={`section ${styles.processSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[23] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Process</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                How we implement AI automation.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discover", desc: "Map your current workflows, identify bottlenecks, and understand which tasks have the biggest impact." },
                { step: "02", title: "Design", desc: "Architect the automation flow, define triggers and actions, and select the right AI and integration approach." },
                { step: "03", title: "Build", desc: "Implement, connect tools, train the AI where needed, and test every step for reliability." },
                { step: "04", title: "Launch & Improve", desc: "Deploy, monitor, and refine based on real usage. Expand automation as you discover new opportunities." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 24] = el; }}
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

        {/* ===== AI AGENTS LINK ===== */}
        <section className={`section bg-background-secondary ${styles.agentsSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[28] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className={styles.agentsGlow} aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <p className={`text-caption font-medium uppercase tracking-widest text-primary-light mb-4`}>AI Agents</p>
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Need something more autonomous?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  AI agents go beyond simple automation. They can understand requests, retrieve information, and perform tasks across your systems.
                </p>
                <Button variant="primary" size="lg" href="/services/ai-agents">
                  Explore AI Agents
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DELIVERABLES ===== */}
        <section className={`section ${styles.deliverablesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[29] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What You Get</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                A complete automation implementation.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Workflow mapping and analysis",
                "Automation architecture design",
                "AI implementation and training",
                "Tool integrations",
                "End-to-end testing",
                "Documentation and runbooks",
                "Monitoring recommendations",
                "Team training sessions",
                "Post-launch support",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 30] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[39] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Why Burify Labs</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Practical automation, not complexity for its own sake.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Business-First Thinking", desc: "We assess what actually saves meaningful time. No unnecessary automations — just the ones that move the needle." },
                { title: "Clean Implementation", desc: "We build systems that are reliable, maintainable, and easy for your team to understand and trust." },
                { title: "Scalable Architecture", desc: "Automations designed to grow. Add new triggers, actions, and integrations as your business evolves." },
                { title: "Clear Communication", desc: "No jargon. We explain how each part works, why it matters, and what to expect." },
                { title: "Proven Tools", desc: "We use established automation and AI platforms with strong track records, not experimental tech." },
                { title: "Ongoing Support", desc: "Launch is the start. We monitor, refine, and help you expand your automation over time." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 40] = el; }}
                  className={`card card-hover ${styles.whyCard}`}
                >
                  <h3 className="text-h5 text-text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className={`section ${styles.faqSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[46] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>FAQ</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Common questions about AI automation.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 47] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[53] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Ready to eliminate the repetitive work?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about your operations. We&apos;ll respond within one business day with initial thoughts on how automation can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
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
