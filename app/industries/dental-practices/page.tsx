import { IndustryLanding, type IndustryPageConfig } from "@/components/growth/IndustryLanding";
import { createResourceMetadata } from "@/lib/seo";

const page: IndustryPageConfig = {
  eyebrow: "Dental practice growth",
  title: "Turn more dental website visits into meaningful patient enquiries.",
  intro: "Burify helps independent dental practices and groups connect their website, local visibility, enquiry journeys and follow-up processes into a clearer patient acquisition system.",
  problems: ["High-value treatments are difficult to find or understand online.", "Website visitors cannot quickly see the next step to enquire or request an appointment.", "Local search visibility and service-page coverage are inconsistent.", "Enquiries arrive across channels without a consistent follow-up process.", "Marketing activity is difficult to connect to qualified enquiries."],
  solutions: [
    { title: "Dental website experiences", description: "Clear treatment pages for implants, orthodontics, clear aligners, cosmetic and general dentistry, with accessible mobile-first enquiry paths." },
    { title: "Local search foundations", description: "Technical SEO, useful location and treatment content, structured data and consistent business information." },
    { title: "Enquiry conversion", description: "Well-designed enquiry forms, booking pathways and clear calls to action that help prospective patients take the next step." },
    { title: "Follow-up automation", description: "Consent-aware acknowledgements, reminders and internal routing that help teams respond consistently without making clinical decisions." },
    { title: "Measurement", description: "Practical reporting on traffic, enquiry sources and conversion activity, using agreed definitions and verified data." },
    { title: "Continuous improvement", description: "Prioritised testing and website updates based on actual user behaviour and practice goals." },
  ],
  process: ["Understand your practice, priority treatments and current patient journey.", "Review the website, local visibility, enquiry process and available analytics.", "Agree on the highest-impact changes and a realistic delivery plan.", "Build, integrate and test the agreed website and growth workflows.", "Review performance and refine the system over time."],
  faqs: [
    { question: "Does Burify provide clinical or medical advice?", answer: "No. Burify provides digital strategy, website, marketing technology and workflow services. Clinical information and treatment claims must be supplied and approved by qualified practice professionals." },
    { question: "Can you work with our existing booking or practice software?", answer: "We can assess available integrations and propose a safe workflow. Compatibility depends on the software, its access controls and supported interfaces." },
    { question: "Can you guarantee more patients?", answer: "No responsible agency can guarantee patient numbers. We focus on improving measurable parts of the digital journey and reporting on verified outcomes." },
    { question: "Do you work with single-location practices and groups?", answer: "The approach can be adapted to independent practices and multi-location groups, with scope based on the locations, services and systems involved." },
  ],
};

export const metadata = createResourceMetadata({ title: "Dental Practice Growth Systems", description: "Dental website design, local SEO, patient enquiry conversion and follow-up automation for independent dental practices and groups.", path: "/industries/dental-practices" });

export default function DentalPracticesPage() { return <IndustryLanding page={page} />; }
