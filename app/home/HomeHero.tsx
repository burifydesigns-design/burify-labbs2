import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HomeHero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24"
      id="hero"
    >
      <Image
        src="/images/burify-labs-hero.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover -z-10"
        priority
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/60" aria-hidden="true" />
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
        <p className="text-caption font-medium text-primary uppercase tracking-widest mb-4">
          Web Design &amp; AI Automation
        </p>
        <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
          We build websites that convert and automation that scales.
        </h1>
        <p className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl">
          Burify Labs builds conversion-focused websites and intelligent automation systems for businesses ready to grow.
          From landing pages that turn attention into enquiries, to AI workflows that handle repetitive tasks — we build for measurable outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" href="/work">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
