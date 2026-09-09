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
    featuredImage: "/images/projects/caavari.png",
    gallery: [
      "/images/projects/caavari.png",
    ],
    year: "2026",
    canonicalPath: "/work/cavari-group",
  },
  {
    id: "2",
    slug: "hillview-physiotherapy-group",
    title: "Hillview Physiotherapy Group",
    category: "Web Design",
    shortDescription:
      "A modern digital presence for a physiotherapy clinic in Dromana, Victoria.",
    description:
      "Hillview Physiotherapy Group is a modern physiotherapy clinic based in Dromana, Victoria. The existing business provides physiotherapy assessments, running assessments, group functional strength classes, tailored exercise programs, post-surgical rehabilitation and other physiotherapy services.",
    services: ["web-design"],
    challenge:
      "Hillview Physiotherapy Group needed a professional digital presence that clearly communicated who they were, what services they offered, and why prospective patients should choose the clinic. The website needed to make healthcare information easy to understand while creating a modern, welcoming impression.",
    approach:
      "The website was structured around clarity, trust and conversion. The design focuses on clear communication, professional presentation, easy service discovery, strong calls to action, local business positioning, mobile-friendly browsing, clear pathways toward booking an appointment, and introducing the team and clinic.",
    outcome:
      "A modern digital presence designed to make Hillview Physiotherapy Group's services easier to understand and make the path from discovering the clinic to booking an appointment clearer.",
    status: "published",
    featuredImage: "/images/projects/hillview.png",
    gallery: [
      "/images/projects/hillview.png",
    ],
    year: "2026",
    canonicalPath: "/work/hillview-physiotherapy-group",
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
    featuredImage: "/images/projects/precision-auto.png",
    gallery: [
      "/images/projects/precision-auto.png",
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
    featuredImage: "/images/projects/real-estate.png",
    gallery: [
      "/images/projects/real-estate.png",
    ],
    year: "2026",
    canonicalPath: "/work/real-estate-n8n-automation",
  },
];

export const publishedProjects = projects.filter(
  (project) => project.status === "published",
);
