"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import styles from "./ai-agents.module.css";

const faqs = [
  {
    question: "What is an AI agent?",
    answer:
      "An AI agent is a system that understands requests, retrieves information, performs defined tasks, and connects with your business tools. Unlike a simple chatbot, it can take action — updating records, triggering workflows, and more.",
  },
  {
    question: "How is this different from a chatbot?",
    answer:
      "A basic chatbot matches questions to pre-written answers. An AI agent can understand intent, access your data, execute tasks, and integrate with your systems to deliver outcomes, not just responses.",
  },
  {
    question: "What can an AI agent actually do?",
    answer:
      "Common tasks include answering customer questions, qualifying leads, scheduling appointments, retrieving internal information, processing support requests, and triggering follow-up actions.",
  },
  {
    question: "Does it need technical knowledge to manage?",
    answer:
      "No. We build and configure the agent, then provide a clear interface and documentation. Your team manages it like any other business tool.",
  },
  {
    question: "Can it work with our existing systems?",
    answer:
      "Yes. AI agents connect with CRMs, calendars, email, databases, and other platforms you already use. The goal is to extend your existing tools, not replace them.",
  },
];

export const aiAgentsFaqs = faqs;

export function AiAgentsPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  const agentSteps = [
    { label: "Input", desc: "Receives a request from a customer, team member, or system trigger." },
    { label: "Reasoning", desc: "Understands intent, retrieves relevant data, and determines the right action." },
    { label: "Tools", desc: "Connects to your CRM, calendar, email, or other systems to execute the task." },
    { label: "Action", desc: "Performs the task — updating records, sending responses, scheduling, or routing." },
    { label: "Result", desc: "Delivers the outcome and logs the interaction for visibility and improvement." },
  ];

  const useCases = [
    {
      title: "Customer Support",
      desc: "Handles common enquiries, retrieves account information, and routes complex issues to the right person.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.686-2.009a1.125 1.125 0 01-.574-1.004V14.25m0 0h10.5m-10.5 0v3.75m0-3.75h10.5m0 0v3.75m0-3.75H9.75m10.5 0v3.75m0-3.75h-3.75m3.75 0v3.75m0-3.75h3.75" />
        </svg>
      ),
    },
    {
      title: "Lead Qualification",
      desc: "Evaluates incoming leads, asks qualifying questions, and routes high-intent prospects to your sales team.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.4-6.88 4.125 4.125 0 00-6.88 3.4 9.337 9.337 0 00-.952 4.121c0 1.066.17 2.09.488 3.05M15 19.128v.003" />
        </svg>
      ),
    },
    {
      title: "Internal Operations",
      desc: "Answers employee questions, retrieves internal documents, and automates routine internal workflows.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      title: "Sales Assistance",
      desc: "Guides prospects through product information, answers pricing questions, and schedules demos automatically.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m-1.5 0h-.375c-.621 0-1.125-.504-1.125-1.125V15m0 0h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h-.375c-.621 0-1.125-.504-1.125-1.125V15m0 0h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375" />
        </svg>
      ),
    },
    {
      title: "Research & Data",
      desc: "Retrieves information from documents and databases, summarizes findings, and presents relevant data on demand.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 15.375v-2.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-8.25zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      title: "Task Execution",
      desc: "Performs defined tasks across your systems — creating records, sending notifications, updating statuses, and more.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
  ];

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
                AI Agents
              </p>
              <h1 className={`text-h1 md:text-display text-white mb-6 ${styles.heroTitle}`}>
                Intelligent agents for <span className={styles.titleAccent}>real business tasks.</span>
              </h1>
              <p className={`text-body-lg text-white/70 mb-8 max-w-2xl ${styles.heroSub}`}>
                Burify Labs builds AI-powered agents that understand requests, retrieve information, and connect with your systems to handle defined tasks autonomously.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" href="/services/ai-automation" className="!border-white/30 !text-white hover:!bg-white/10">
                  Explore AI Automation
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.agentWorkspace}>
                <div className={styles.agentNode}>
                  <div className={styles.agentIcon}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <div className={styles.agentLabel}>AI Agent</div>
                </div>
                <div className={styles.agentConnectors}>
                  {agentSteps.slice(0, 3).map((step, i) => (
                    <div key={i} className={styles.agentConnector}>
                      <div className={styles.agentConnectorDot} />
                      <span className="text-body-sm text-white/60">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT AI AGENTS ARE ===== */}
        <section className={`section ${styles.whatSection}`}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
              >
                <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What AI Agents Are</p>
                <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                  More than a chatbot.
                </h2>
                <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">
                  A basic chatbot matches questions to pre-written answers. An AI agent understands intent, retrieves information, performs tasks, and integrates with your business systems.
                </p>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  It doesn&apos;t just respond — it acts. It can update a CRM record, schedule an appointment, trigger a workflow, or retrieve data from your internal systems.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="ghost" size="md" href="/services/workflow-automation">
                    Explore Workflow Automation
                  </Button>
                </div>
              </div>
              <div
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className={styles.comparisonVisual}
              >
                <div className={styles.comparisonCard}>
                  <div className={styles.comparisonHeader}>
                    <span className="text-body-sm font-medium text-text-muted">Basic Chatbot</span>
                  </div>
                  <ul className={styles.comparisonList}>
                    {["Pre-written responses", "No system access", "Cannot take actions", "Static knowledge", "Limited context"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-body text-text-secondary">
                        <svg className="w-4 h-4 text-accent-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.comparisonArrow}>
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className={`${styles.comparisonCard} ${styles.comparisonCardAccent}`}>
                  <div className={styles.comparisonHeader}>
                    <span className="text-body-sm font-medium text-primary">AI Agent</span>
                  </div>
                  <ul className={styles.comparisonList}>
                    {["Understands intent", "Accesses your data", "Takes real actions", "Learns from context", "Connects to systems"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-body text-text-primary font-medium">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== USE CASES ===== */}
        <section className={`section bg-background-secondary ${styles.useCasesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[2] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Use Cases</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Built for real business functions.
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                AI agents can be designed for specific business needs. Here are common use cases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 3] = el; }}
                  className={`card card-hover ${styles.useCaseCard}`}
                >
                  <div className={styles.useCaseIcon}>{item.icon}</div>
                  <h3 className="text-h5 text-text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className={`section ${styles.howSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[9] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>How It Works</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Input. Reasoning. Action. Result.
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className={styles.stepsContainer}>
                {agentSteps.map((step, i) => (
                  <div
                    key={i}
                    ref={(el) => { if (el) revealRefs.current[i + 10] = el; }}
                    className={`${styles.stepItem} ${activeStep === i ? styles.stepItemActive : ""}`}
                    onMouseEnter={() => setActiveStep(i)}
                  >
                    <div className={styles.stepConnector} aria-hidden="true" />
                    <div className={styles.stepNode}>{i + 1}</div>
                    <div className={styles.stepContent}>
                      <h3 className="text-h5 text-text-primary mb-2">{step.label}</h3>
                      <p className="text-body text-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== DELIVERABLES ===== */}
        <section className={`section bg-background-secondary ${styles.deliverablesSection}`}>
          <div className="container">
            <div
              ref={(el) => { if (el) revealRefs.current[15] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>What You Get</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                A complete AI agent implementation.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Agent architecture design",
                "Knowledge base setup",
                "System integrations",
                "Training and fine-tuning",
                "Testing and validation",
                "Documentation and guides",
                "Monitoring setup",
                "Team onboarding",
                "Ongoing support",
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 16] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[25] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>Why Burify Labs</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Agents built for business outcomes, not tech demos.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Practical Scope", desc: "We design agents for specific, high-impact use cases. No unnecessary complexity — just tasks that save meaningful time." },
                { title: "System Integration", desc: "Agents connect with your existing tools. Your CRM, email, calendar, and databases work together seamlessly." },
                { title: "Clear Boundaries", desc: "We define what the agent should and shouldn&apos;t do. Predictable behavior you can trust with customers and data." },
                { title: "Maintainable", desc: "Built on proven platforms with clear documentation. Your team can understand and manage the system long-term." },
                { title: "Measurable", desc: "We track performance, response quality, and task completion so you can see real impact, not just activity." },
                { title: "Iterative", desc: "We start with a focused use case, then expand based on results. No big-bang implementations that risk disruption." },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 26] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[32] = el; }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className={`text-caption font-medium uppercase tracking-widest text-primary mb-4`}>FAQ</p>
              <h2 className="text-h2 md:text-h3 text-text-primary mb-6">
                Common questions about AI agents.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) revealRefs.current[i + 33] = el; }}
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
              ref={(el) => { if (el) revealRefs.current[38] = el; }}
              className="relative overflow-hidden rounded-3xl bg-background-dark text-white px-8 py-16 md:px-16 md:py-24"
            >
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-6">
                  Ready to build an agent that works?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Tell us about the task. We&apos;ll respond within one business day with initial thoughts on how an AI agent could help.
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
