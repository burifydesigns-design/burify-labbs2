"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface FaqItem {
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "What does Burify Labs do?",
    answer:
      "Burify Labs builds high-converting websites and intelligent AI-powered automation systems for modern businesses. We combine web design, AI automation, AI agents, and workflow automation under one roof.",
  },
  {
    question: "What types of websites do you build?",
    answer:
      "We design modern, conversion-focused websites including custom business sites, redesigns, and landing pages. Each build is tailored to the client's goals and audience.",
  },
  {
    question: "What is AI automation?",
    answer:
      "AI automation uses intelligent systems to handle repetitive business processes, from lead capture and qualification to customer follow-up, data entry, and internal workflows.",
  },
  {
    question: "Can you automate existing business processes?",
    answer:
      "Yes. We analyze current workflows, identify automation opportunities, and implement systems that connect your tools and reduce manual work.",
  },
  {
    question: "Do you build AI agents?",
    answer:
      "Yes. We build AI agents designed to handle specific business tasks such as lead qualification, customer support, and operational research.",
  },
  {
    question: "How does a project work?",
    answer:
      "Every project follows a structured process: Discover, Design, Build, and Optimize. We start with strategy, move through design and development, then refine based on results.",
  },
  {
    question: "How can someone start a project?",
    answer:
      "Use the Start a Project button on this page or visit the contact page to tell us about your needs. We'll respond with next steps.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = defaultFaqs;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="faq">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 text-text-primary mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-body-lg text-text-secondary text-center mb-12">
            Common questions about working with Burify Labs.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-background"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-body font-medium text-text-primary pr-4">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 text-primary transition-transform duration-200">
                      <ChevronDownIcon
                        size={20}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-body text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFAQ;
