import type { Project } from "@/types/project";
import Image from "next/image";

interface ProjectComparisonProps {
  project: Project;
}

export function ProjectComparison({ project }: ProjectComparisonProps) {
  const isHillview = project.slug === "hillview-physiotherapy";

  if (!isHillview) {
    return null;
  }

  const originalUrl = project.originalUrl;
  const redesignedUrl = project.redesignedUrl;

  return (
    <section className="case-study-section case-study-section--secondary">
      <div className="container">
        <span className="case-study-label">Before & After</span>
        <h2 className="case-study-heading">Website transformation</h2>
        <div className="case-study-body mb-8">
          <p>
            The redesign transformed Hillview Physiotherapy Group's digital presence from a cluttered,
            text-heavy website into a clean, patient-focused experience with clear service presentation
            and accessible design.
          </p>
        </div>

        {/* Desktop Comparison */}
        <div className="comparison-section mb-12">
          <h3 className="text-h4 mb-6 text-center">Desktop View</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="comparison-card">
              <div className="comparison-card__label">BEFORE — Original Website</div>
              <div className="comparison-card__image-wrapper">
                <Image
                  src="/images/projects/hillview-physiotherapy/before-desktop.webp"
                  alt="Original Hillview Physiotherapy Group website desktop screenshot"
                  width={1920}
                  height={4599}
                  className="comparison-card__image"
                  loading="lazy"
                />
              </div>
              {originalUrl && (
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comparison-card__link"
                >
                  View Original Website
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <div className="comparison-card">
              <div className="comparison-card__label">AFTER — Redesigned Website</div>
              <div className="comparison-card__image-wrapper">
                <Image
                  src="/images/projects/hillview-physiotherapy/after-desktop.webp"
                  alt="Redesigned Hillview Physiotherapy Group website desktop screenshot"
                  width={1920}
                  height={1080}
                  className="comparison-card__image"
                  loading="lazy"
                />
              </div>
              {redesignedUrl && (
                <a
                  href={redesignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comparison-card__link"
                >
                  View Redesigned Website
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Comparison */}
        <div className="comparison-section">
          <h3 className="text-h4 mb-6 text-center">Mobile View</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="comparison-card">
              <div className="comparison-card__label">BEFORE — Original Website</div>
              <div className="comparison-card__image-wrapper comparison-card__image-wrapper--mobile">
                <Image
                  src="/images/projects/hillview-physiotherapy/before-mobile.webp"
                  alt="Original Hillview Physiotherapy Group website mobile screenshot"
                  width={994}
                  height={4599}
                  className="comparison-card__image"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="comparison-card">
              <div className="comparison-card__label">AFTER — Redesigned Website</div>
              <div className="comparison-card__image-wrapper comparison-card__image-wrapper--mobile">
                <Image
                  src="/images/projects/hillview-physiotherapy/after-mobile.webp"
                  alt="Redesigned Hillview Physiotherapy Group website mobile screenshot"
                  width={375}
                  height={812}
                  className="comparison-card__image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}