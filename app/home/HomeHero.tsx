import { Button } from "@/components/ui/Button";

export function HomeHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden" id="hero">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <p className="text-caption font-medium text-primary uppercase tracking-widest mb-4">
          Web Design &amp; AI Automation
        </p>
        <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
          We build websites that convert and automation that scales.
        </h1>
        <p className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl">
          Burify Labs designs modern, conversion-focused websites and builds intelligent AI automation systems for businesses that want to grow without hitting operational ceilings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" href="/contact">
            Start a Project
          </Button>
          <Button variant="outline" size="lg" href="/work">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
