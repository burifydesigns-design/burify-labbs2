import { StructuredData } from "@/components/seo/StructuredData";
import { createFaqPageJsonLd, createStructuredDataForPage } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/seo";
import { pageArchitecture } from "@/config/page-architecture";
import { HomeNavigation } from "@/app/home/HomeNavigation";
import { HomeHero } from "@/app/home/HomeHero";
import { HomeTrust } from "@/app/home/HomeTrust";
import { HomeProblem } from "@/app/home/HomeProblem";
import { HomeServices } from "@/app/home/HomeServices";
import { HomeWhy } from "@/app/home/HomeWhy";
import { HomeProcess } from "@/app/home/HomeProcess";
import { HomeWork } from "@/app/home/HomeWork";
import { HomeAutomation } from "@/app/home/HomeAutomation";
import { HomeFAQ } from "@/app/home/HomeFAQ";
import { HomeCTA } from "@/app/home/HomeCTA";
import { HomeFooter } from "@/app/home/HomeFooter";
import { homeFaqs } from "@/app/home/HomeFAQ";
import "./home/home.css";

const page = pageArchitecture.home;

export const metadata = createPageMetadata(page);

export default function HomePage() {
  const faqSchema = createFaqPageJsonLd(homeFaqs);
  const structuredData = [
    ...createStructuredDataForPage(page),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <HomeNavigation />
      <main id="main-content">
        <HomeHero />
        <HomeTrust />
        <HomeProblem />
        <HomeServices />
        <HomeWhy />
        <HomeProcess />
        <HomeWork />
        <HomeAutomation />
        <HomeFAQ />
        <HomeCTA />
      </main>
      <HomeFooter />
    </>
  );
}
