import { IndustryLanding, type IndustryPageConfig } from "@/components/growth/IndustryLanding";
import { createResourceMetadata } from "@/lib/seo";

const page: IndustryPageConfig = {
  eyebrow: "Private healthcare growth",
  title: "Build a clearer digital experience around the people you serve.",
  intro: "Burify connects professional website experiences, service discovery, enquiry conversion and responsible workflow automation for private healthcare providers.",
  problems: ["Service information is fragmented or difficult to navigate.", "Mobile visitors struggle to find contact and booking options.", "Digital enquiries are not consistently routed to the right team.", "Website performance and lead sources are not clearly measured."],
  solutions: [
    { title: "Professional digital presence", description: "Accessible, mobile-first websites with clear service architecture and trustworthy information." },
    { title: "Search foundations", description: "Technical SEO, structured service content and location information." },
    { title: "Enquiry management", description: "Clear forms, secure routing and internal notifications that support timely responses." },
    { title: "Operational automation", description: "Administrative workflows that reduce repetitive work while preserving human oversight." },
  ],
  process: ["Understand your services, audience and compliance environment.", "Review the current website and enquiry process.", "Agree on a scoped delivery plan.", "Build and test the experience and integrations.", "Measure results and maintain improvements."],
  faqs: [
    { question: "How do you approach sensitive information?", answer: "We design for data minimisation and avoid collecting clinical information unless there is a clear, approved need and suitable safeguards are in place." },
    { question: "Can you integrate with existing systems?", answer: "We assess each system's supported integrations, security model and technical constraints before recommending an implementation." },
    { question: "Can you guarantee growth outcomes?", answer: "No. We focus on improving the website and operational systems, then use agreed metrics to evaluate progress." },
  ],
};

export const metadata = createResourceMetadata({ title: "Private Healthcare Digital Growth", description: "Website design, local search, enquiry conversion and responsible automation for private healthcare providers.", path: "/industries/private-healthcare" });

export default function PrivateHealthcarePage() { return <IndustryLanding page={page} />; }
