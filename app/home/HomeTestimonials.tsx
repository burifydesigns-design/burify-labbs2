const testimonials = [
  {
    quote: "Burify Labs transformed our online presence. The new website has significantly improved our conversion rate and the automation tools have saved our team hours every week.",
    name: "Alex K",
    role: "Business Owner",
  },
  {
    quote: "The team understood our goals from the start. The result was a website that truly represents our brand and an automation system that works seamlessly with our existing tools.",
    name: "Holly Moore",
    role: "Marketing Director",
  },
  {
    quote: "Professional, responsive, and technically excellent. Burify Labs delivered a website that performs and an automation setup that we rely on every day.",
    name: "Linda McKirdy",
    role: "Operations Manager",
  },
];

export function HomeTestimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background-secondary" id="testimonials">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-h2 text-text-primary mb-4">
            What clients say
          </h2>
          <p className="text-body-lg text-text-secondary">
            Real feedback from businesses we have worked with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary-light hover:shadow-lg flex flex-col"
            >
              <div className="flex-1">
                <p className="text-body text-text-secondary leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-body-sm font-semibold text-primary">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-body font-medium text-text-primary">{testimonial.name}</p>
                  <p className="text-body-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTestimonials;
