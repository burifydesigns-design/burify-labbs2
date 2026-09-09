import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="contact">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-h2 text-text-primary mb-4">
            Ready to build something better?
          </h2>
          <p className="text-body-lg text-text-secondary mb-8">
            Tell us about your website or automation needs. We will respond with clear next steps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" size="lg" href="/contact">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCTA;
