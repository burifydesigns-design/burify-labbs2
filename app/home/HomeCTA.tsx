import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="contact">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-caption font-semibold text-primary uppercase tracking-widest mb-3">Your next step</p>
          <h2 className="text-h2 text-text-primary mb-4">Find the highest-impact opportunity in your digital journey.</h2>
          <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">Tell us what you want to improve. We will help you identify a practical scope across your website, enquiries and workflows — with no obligation to proceed.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/contact">Book a Growth Strategy Call</Button>
            <Link href="/growth-assessment" className="text-primary font-semibold underline underline-offset-4">Take the free assessment</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HomeCTA;
