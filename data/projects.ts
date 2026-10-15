import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    slug: "cavari-group",
    title: "Cavari Group",
    category: "Web Design",
    shortDescription:
      "A premium digital platform for an integrated Australian advisory and investment organisation.",
    description:
      "Cavari Group is an Australian advisory, capital and investment organisation with an integrated model spanning advisory, capital, partners and technology/platform capabilities. The website positions the organisation around consequential transactions, capital and institutional-grade solutions.",
    services: ["web-design"],
    challenge:
      "Cavari operates across sophisticated financial and investment-related services. The website needed to communicate complexity without making the user experience complicated. The challenge was creating a digital presence that felt premium, institutional, credible, modern, structured and technology-forward, while still making the organisation's different divisions easy to understand.",
    approach:
      "The design approach focused on strong visual hierarchy, premium corporate positioning, clear division architecture, strategic content structure, sophisticated typography, strong information hierarchy, clear calls to action, and a technology-led presentation. The website communicates Cavari's integrated model rather than treating every division as a completely separate business.",
    outcome:
      "A sophisticated digital platform designed to communicate Cavari Group's integrated model and position the organisation with a modern, institutional-quality online presence.",
    status: "published",
    featuredImage: "/images/projects/burify-labs-cavari-group.webp",
    gallery: [
      "/images/projects/burify-labs-cavari-group.webp",
    ],
    year: "2026",
    canonicalPath: "/work/cavari-group",
  },
  {
    id: "3",
    slug: "precision-auto-centre",
    title: "Precision Auto Centre",
    category: "Web Design",
    shortDescription:
      "A professional website for a local automotive repair business in Cranbourne West, Victoria.",
    description:
      "Precision Auto Centre is a local automotive repair and servicing business in Cranbourne West, Victoria. The business offers services including logbook servicing, brake and clutch repairs, diagnostics and auto electrical services, air conditioning and heating, transmission work and engine servicing.",
    services: ["web-design"],
    challenge:
      "Precision Auto Centre needed a website that could communicate its experience, services and local positioning while making it simple for potential customers to take the next step and book a service. The challenge was to present a large range of automotive services without overwhelming visitors.",
    approach:
      "The website was designed around trust, local credibility, service clarity, strong calls to action, simple navigation, professional presentation and mobile usability. Important business strengths such as experience, customer-focused service and convenient appointment options were presented clearly.",
    outcome:
      "A professional website that organizes Precision Auto Centre's services into a clearer digital experience and gives prospective customers a straightforward path toward requesting or booking automotive services.",
    status: "published",
    featuredImage: "/images/projects/burify-labs-precision-auto.webp",
    gallery: [
      "/images/projects/burify-labs-precision-auto.webp",
    ],
    year: "2026",
    canonicalPath: "/work/precision-auto-centre",
  },
  {
    id: "4",
    slug: "real-estate-n8n-automation",
    title: "Real Estate Workflow Automation",
    category: "AI Automation",
    shortDescription:
      "An n8n-powered workflow designed to automate repetitive real estate business processes.",
    description:
      "A real estate business had repetitive operational processes that could be improved through workflow automation. The goal was to reduce manual administrative work, connect different tools and create a more reliable flow of information between business processes.",
    services: ["ai-automation", "workflow-automation"],
    challenge:
      "The real estate business had repetitive operational processes that could be improved through workflow automation. The goal was to reduce manual administrative work, connect different tools and create a more reliable flow of information between business processes.",
    approach:
      "Burify Labs designed an automated workflow using n8n. The workflow was structured to receive data from a trigger, validate and process it through business logic, execute automated actions, and route results to notifications, CRM, database or team follow-up. Conditional branches were used to handle different process paths.",
    outcome:
      "A more structured operational workflow designed to reduce repetitive manual tasks, improve consistency and help the real estate team move information through their processes more efficiently.",
    status: "published",
    featuredImage: "/images/projects/burify-labs-real-estate-workflow.webp",
    gallery: [
      "/images/projects/burify-labs-real-estate-workflow.webp",
    ],
    year: "2026",
    canonicalPath: "/work/real-estate-n8n-automation",
  },
  {
    id: "5",
    slug: "hillview-physiotherapy",
    title: "Hillview Physiotherapy Group",
    category: "Web Design",
    shortDescription:
      "A website redesign transforming a physiotherapy practice's digital presence with clear service presentation, improved patient experience, and accessible design.",
    description:
      "Hillview Physiotherapy Group is a physiotherapy practice providing musculoskeletal, sports, and rehabilitation services. The original website presented information in a dense, text-heavy format that made it difficult for patients to quickly find services, understand treatment options, or book appointments. The redesign focused on creating a clear visual hierarchy, improving service discoverability, ensuring mobile responsiveness, meeting accessibility standards, and adding prominent appointment-related calls to action.",
    services: ["web-design"],
    challenge:
      "The original website had a cluttered layout with dense text blocks, unclear navigation, and no clear path for patients to book appointments. Services were buried in long paragraphs, the visual hierarchy was flat, and the mobile experience was poor. Patients struggled to understand what treatments were offered and how to take the next step.",
    approach:
      "The redesign introduced a clean, professional layout with strong visual hierarchy. Services were reorganized into clear, scannable cards with concise descriptions. Navigation was simplified with a sticky header and clear CTAs. The color palette was refined for healthcare-appropriate trust signals. Typography was improved for readability. Mobile layouts were built mobile-first. Accessibility improvements included proper heading structure, color contrast, focus states, and semantic HTML. Appointment booking CTAs were placed prominently throughout the user journey.",
    outcome:
      "A patient-friendly website that clearly presents Hillview Physiotherapy Group's services, improves mobile usability, meets WCAG AA accessibility standards, and provides clear conversion paths for appointment booking.",
    status: "published",
    featuredImage: "/images/projects/hillview-physiotherapy/after-desktop.webp",
    gallery: [
      "/images/projects/hillview-physiotherapy/after-desktop.webp",
      "/images/projects/hillview-physiotherapy/before-desktop.webp",
      "/images/projects/hillview-physiotherapy/after-mobile.webp",
      "/images/projects/hillview-physiotherapy/before-mobile.webp",
    ],
    year: "2026",
    canonicalPath: "/work/hillview-physiotherapy",
    originalUrl: "https://www.hillviewphysiogroup.com.au/",
    redesignedUrl: "https://hillview-git-main-burify.vercel.app/",
  },
];

export const publishedProjects = projects.filter(
  (project) => project.status === "published",
);
