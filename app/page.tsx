import { StructuredData } from "@/components/seo/StructuredData";
import { createStructuredDataForPage } from "@/lib/structured-data";
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
import { HomeTestimonials } from "@/app/home/HomeTestimonials";
import { HomeFAQ } from "@/app/home/HomeFAQ";
import { HomeCTA } from "@/app/home/HomeCTA";
import { HomeFooter } from "@/app/home/HomeFooter";
import "./home/home.css";

const page = pageArchitecture.home;

export const metadata = createPageMetadata(page);

export default function HomePage() {
  return (
    <>
      <StructuredData data={createStructuredDataForPage(page)} />
      <HomeNavigation />
      <main>
        <HomeHero />
        <HomeTrust />
        <HomeProblem />
        <HomeServices />
        <HomeWhy />
        <HomeProcess />
        <HomeWork />
        <HomeAutomation />
        <HomeTestimonials />
        <HomeFAQ />
        <HomeCTA />
      </main>
      <HomeFooter />
    </>
  );
}
