import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HomeHero() {
  return (
    <section className="relative min-h-[88svh] flex items-center overflow-hidden pt-24 pb-16" id="hero">
      <Image src="/images/burify-labs-hero.webp" alt="" fill sizes="100vw" className="object-cover -z-10" priority fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,249,245,.96)_0%,rgba(250,249,245,.88)_52%,rgba(250,249,245,.30)_100%)]" aria-hidden="true" />
      <div className="max-w-container mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <p className="text-caption font-semibold text-primary uppercase tracking-widest mb-5">Digital growth systems for ambitious practices</p>
          <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight max-w-4xl">
            Turn more patient searches into meaningful enquiries.
          </h1>
          <p className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl">
            Burify connects high-performing websites, local search, enquiry journeys and responsible automation to help dental and private healthcare practices grow with clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" href="/contact">Book a Growth Strategy Call</Button>
            <Button variant="outline" size="lg" href="/patient-growth">Explore Patient Growth Systems</Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
            <span>Websites built around conversion</span><span>•</span><span>Practical automation</span><span>•</span><span>Clear performance reporting</span>
          </div>
          <p className="mt-5 text-sm text-text-secondary"><Link className="underline underline-offset-4 hover:text-primary" href="/growth-assessment">Not sure where to start? Take the free website growth assessment.</Link></p>
        </div>
      </div>
    </section>
  );
}
export default HomeHero;
