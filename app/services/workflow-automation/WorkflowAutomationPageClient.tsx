"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import styles from "./workflow-automation.module.css";

const faqs = [
  {
    question: "What is workflow automation?",
    answer:
      "Workflow automation connects the tools your business uses and sets up rules so tasks run without manual effort. A trigger starts the process, conditions are checked, and actions happen automatically.",
  },
  {
    question: "What can be automated?",
    answer:
      "Common workflows include lead routing, appointment scheduling, data synchronization between systems, approval chains, notifications, and report distribution.",
  },
  {
    question: "Do we need to change our existing tools?",
    answer:
      "No. We build connections between the tools you already use. The goal is to make your current stack work smarter together.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most workflow automation projects take 2–6 weeks. We scope the timeline after mapping your current processes and identifying priorities.",
  },
  {
    question: "Can workflows be expanded later?",
    answer:
      "Yes. We design workflows to be extendable. You can add new triggers, actions, and integrations as your business needs evolve.",
  },
  {
    question: "What happens if something breaks?",
    answer:
      "We set up monitoring and error handling so issues are caught early. We also provide documentation and support to help your team manage workflows confidently.",
  },
];

export const workflowAutomationFaqs = faqs;

export function WorkflowAutomationPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
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

  const workflows = [
    {
      title: "Lead Routing",
      steps: ["New lead submitted", "Source checked", "Qualified?", "Yes → Sales team", "No → Nurture sequence"],
    },
    {
      title: "Appointment Flow",
      steps: ["Request received", "Calendar checked", "Slot available?", "Yes → Book & confirm", "No → Suggest alternatives"],
    },
    {
      title: "Data Sync",
      steps: ["Update in Tool A", "Webhook triggered", "Transform data", "Update in Tool B", "Log & notify"],
    },
  ];

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main id="main-content" className={styles.main}>
        {/* ===== HERO ===== */}
        <section className={`${styles.hero} ${scrolled ? styles.heroScrolled : ""}`}>
          <div className={styles.heroBg} aria-hidden="true">
            <div className={styles.heroGrid} />
            <div className={styles.heroGlow} />
            <div className={styles.heroOrb} aria-hidden="true" />
          </div>
          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroText}>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Workflow Automation" }]} />
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>
                Workflow Automation
              </p>
              <h1 className={`text-h1 md:text-display text-text-primary mb-6 ${styles.heroTitle}`}>
                Connect your tools. <span className={styles.titleAccent}>Eliminate the manual work.</span>
              </h1>
              <p className={`text-body-lg text-text-secondary mb-8 max-w-2xl ${styles.heroSub}`}>
                Burify Labs connects the tools your business already uses and streamlines repetitive processes into efficient automated workflows that save time and reduce errors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" href="/services/ai-automation">
                  Explore AI Automation
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.workflowVisual}>
                <div className={styles.workflowNode}>
                  <div className={styles.workflowNodeLabel}>Trigger</div>
                </div>
                <div className={styles.workflowArrow} />
                <div className={`${styles.workflowNode} ${styles.workflowNodeAccent}`}>
                  <div className={styles.workflowNodeLabel}>Condition</div>
                </div>
                <div className={styles.workflowArrow} />
                <div className={styles.workflowNode}>
                  <div className={styles.workflowNodeLabel}>Action</div>
                </div>
                <div className={styles.workflowArrow} />
                <div className={styles.workflowNode}>
                  <div className={styles.workflowNodeLabel}>Notify</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEMS ===== */}
        <section className={`section bg-background-secondary ${styles.problemsSection}`}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
              >
                <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Workflow Problems</p>
                <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                  Your tools shouldn&apos;t work in silos.
                </h2>
                <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">
                  Most businesses use multiple tools that don&apos;t talk to each other. Data gets copied manually, notifications get missed, and teams spend hours on work that should happen automatically.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  The result is wasted time, human error, and a team that spends energy on admin instead of growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="ghost" size="md" href="/services/ai-automation">
                    Explore AI Automation
                  </Button>
                </div>
              </div>
              <div
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className={styles.problemsVisual}
              >
                <div className={styles.siloCard}>
                  <div className={styles.siloHeader}>CRM</div>
                  <div className={styles.siloBody} />
                </div>
                <div className={styles.siloCard}>
                  <div className={styles.siloHeader}>Email</div>
                  <div className={styles.siloBody} />
                </div>
                <div className={styles.siloCard}>
                  <div className={styles.siloHeader}>Calendar</div>
                  <div className={styles.siloBody} />
                </div>
                <div className={styles.siloCard}>
                  <div className={styles.siloHeader}>Forms</div>
                  <div className={styles.siloBody} />
                </div>
                <div className={styles.siloArrow} aria-hidden="true">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className={`${styles.siloCard} ${styles.siloCardConnected}`}>
                  <div className={styles.siloHeader}>Unified Workflow</div>
                  <div className={styles.siloBody} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EXAMPLE WORKFLOWS ===== */}
        <section className={`section ${styles.workflowsSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[2] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Example Workflows</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                See how workflows connect tools and save time.
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {workflows.map((wf, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveWorkflow(i)}
                    className={`px-5 py-2.5 rounded-full text-body-sm font-medium transition-all duration-200 ${
                      activeWorkflow === i
                        ? "bg-primary text-white shadow-md"
                        : "bg-background text-text-secondary border border-border hover:border-primary-light hover:text-primary"
                    }`}
                  >
                    {wf.title}
                  </button>
                ))}
              </div>

              <div
                ref={(el) => { if (el) revealRefs.current[3] = el; }}
                className={styles.activeWorkflow}
              >
                <div className={styles.workflowSteps}>
                  {workflows[activeWorkflow].steps.map((step, i) => (
                    <div key={i} className={styles.workflowStep}>
                      <div className={styles.workflowStepNode}>{i + 1}</div>
                      <span className="text-body text-text-secondary">{step}</span>
                      {i < workflows[activeWorkflow].steps.length - 1 && (
                        <div className={styles.workflowStepLine} aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SYSTEMS / INTEGRATIONS ===== */}
        <section className={`section bg-background-secondary ${styles.systemsSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[4] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Systems</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Integrates with your existing stack.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                We connect the platforms you already use. No rip-and-replace — just smarter workflows between your current tools.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["CRM systems", "Email platforms", "Forms & surveys", "Calendars", "Databases", "WhatsApp", "Payment systems", "Automation platforms"].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 5] = el; }}
                  className={`card text-center py-5 px-4 ${styles.systemItem}`}
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
              ref={(el) => { if (el) revealRefs.current[13] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Process</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                How we build your workflows.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Map", desc: "Document your current processes, identify bottlenecks, and prioritize the highest-impact workflows." },
                { step: "02", title: "Design", desc: "Architect the workflow logic — triggers, conditions, actions, and notifications — before any building begins." },
                { step: "03", title: "Build", desc: "Connect your tools, implement the workflow, and test every path for reliability and edge cases." },
                { step: "04", title: "Deploy & Optimize", desc: "Launch, monitor performance, and refine based on real usage data. Expand as needed." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 14] = el; }}
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

        {/* ===== DELIVERABLES ===== */}
        <section className={`section bg-background-secondary ${styles.deliverablesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[18] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What You Get</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                A complete workflow implementation.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Process mapping and analysis",
                "Workflow architecture design",
                "Tool integrations",
                "Trigger and condition setup",
                "Action configuration",
                "Notification systems",
                "Testing and validation",
                "Documentation and runbooks",
                "Monitoring recommendations",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 19] = el; }}
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
        <section className={`section ${styles.whySection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[28] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Why Burify Labs</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Workflows that are reliable, not experimental.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Process Understanding", desc: "We map your actual workflows before building. Clear understanding prevents fragile or over-complicated automations." },
                { title: "Reliability First", desc: "We test every workflow path and set up error handling so issues are caught early and handled gracefully." },
                { title: "Extendable Design", desc: "Workflows built to grow. Add new steps, tools, and conditions as your business evolves without rebuilding from scratch." },
                { title: "Clear Documentation", desc: "Every workflow is documented so your team can understand, manage, and extend it confidently." },
                { title: "Proven Platforms", desc: "We use established automation and integration platforms with strong track records, not experimental tools." },
                { title: "Ongoing Partnership", desc: "We monitor, refine, and help expand your workflows over time. Automation is a practice, not a one-time project." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 29] = el; }}
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
        <section className={`section bg-background-secondary ${styles.faqSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[35] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>FAQ</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Common questions about workflow automation.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 36] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[42] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Ready to connect your tools?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about your current processes. We&apos;ll respond within one business day with initial thoughts on how workflow automation can help.
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
