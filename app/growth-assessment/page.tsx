import { GrowthAssessment } from "@/components/growth/GrowthAssessment";
import { createResourceMetadata } from "@/lib/seo";

export const metadata = createResourceMetadata({ title: "Free Website Growth Assessment", description: "A short self-assessment covering website clarity, enquiries, local visibility, follow-up and measurement.", path: "/growth-assessment" });

export default function GrowthAssessmentPage() { return <GrowthAssessment />; }
