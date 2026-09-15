"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types/project";
import {
  ProjectHero,
  ProjectOverview,
  ProjectChallenge,
  ProjectApproach,
  ProjectGallery,
  ProjectOutcome,
  ServicesUsed,
  RelatedProjects,
  WorkflowDiagram,
  defaultAutomationWorkflow,
} from "@/components/work";
import "./case-study.css";

interface CaseStudyClientProps {
  project: Project;
}

export function CaseStudyClient({ project }: CaseStudyClientProps) {
  const revealRefs = useRef<HTMLElement[]>([]);

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
  }, [project.slug]);

  const isAutomation = project.category === "AI Automation";

  return (
    <>
      <Navbar variant="light" showCta />
      <main id="main-content">
        <ProjectHero project={project} />

        <ProjectOverview project={project} />

        <div
          ref={(el) => { if (el) revealRefs.current[0] = el; }}
          data-reveal
        >
          <ProjectChallenge project={project} />
        </div>

        <div
          ref={(el) => { if (el) revealRefs.current[1] = el; }}
          data-reveal
        >
          <ProjectApproach project={project} />
        </div>

        {isAutomation && (
          <div
            ref={(el) => { if (el) revealRefs.current[2] = el; }}
            data-reveal
          >
            <section className="case-study-section case-study-section--secondary">
              <div className="container">
                <span className="case-study-label">Workflow</span>
                <h2 className="case-study-heading">How the automation works</h2>
                <WorkflowDiagram steps={defaultAutomationWorkflow} />
              </div>
            </section>
          </div>
        )}

        <div
          ref={(el) => { if (el) revealRefs.current[3] = el; }}
          data-reveal
        >
          <ProjectGallery project={project} />
        </div>

        <div
          ref={(el) => { if (el) revealRefs.current[4] = el; }}
          data-reveal
        >
          <ProjectOutcome project={project} />
        </div>

        <div
          ref={(el) => { if (el) revealRefs.current[5] = el; }}
          data-reveal
        >
          <ServicesUsed project={project} />
        </div>

        <div
          ref={(el) => { if (el) revealRefs.current[6] = el; }}
          data-reveal
        >
          <RelatedProjects currentSlug={project.slug} />
        </div>

        {/* ===== FINAL CTA ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="case-study-cta px-8 py-16 md:px-16 md:py-24">
              <div className="case-study-cta__glow" aria-hidden="true" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-h2 md:text-h3 text-white mb-4">
                  Have a project in mind?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 leading-relaxed">
                  Let&apos;s build something that works.
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
