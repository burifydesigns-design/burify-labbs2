import Link from "next/link";

export type IndustryPageConfig = {
  eyebrow: string;
  title: string;
  intro: string;
  problems: string[];
  solutions: { title: string; description: string }[];
  process: string[];
  faqs: { question: string; answer: string }[];
};

export function IndustryLanding({ page }: { page: IndustryPageConfig }) {
  return (
    <main id="main-content">
      <section className="growth-hero">
        <div className="growth-container">
          <p className="growth-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="growth-intro">{page.intro}</p>
          <div className="growth-actions">
            <Link className="growth-button growth-button-primary" href="/contact">Book a growth strategy call</Link>
            <Link className="growth-button growth-button-secondary" href="/work">Explore our work</Link>
          </div>
          <p className="growth-note">Practical digital systems, built around your business and the people you serve.</p>
        </div>
      </section>
      <section className="growth-section">
        <div className="growth-container">
          <p className="growth-eyebrow">Where growth gets stuck</p>
          <h2>Common challenges we help address</h2>
          <div className="growth-grid growth-grid-three">
            {page.problems.map((problem) => <article className="growth-card" key={problem}><p>{problem}</p></article>)}
          </div>
        </div>
      </section>
      <section className="growth-section growth-section-muted">
        <div className="growth-container">
          <p className="growth-eyebrow">Connected solutions</p>
          <h2>One joined-up growth system</h2>
          <div className="growth-grid growth-grid-two">
            {page.solutions.map((solution) => <article className="growth-card" key={solution.title}><h3>{solution.title}</h3><p>{solution.description}</p></article>)}
          </div>
        </div>
      </section>
      <section className="growth-section">
        <div className="growth-container">
          <p className="growth-eyebrow">How we work</p>
          <h2>Clear steps, measurable priorities</h2>
          <ol className="growth-steps">{page.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
        </div>
      </section>
      <section className="growth-section growth-section-muted">
        <div className="growth-container growth-narrow">
          <p className="growth-eyebrow">Questions</p>
          <h2>Frequently asked questions</h2>
          {page.faqs.map((faq) => <details className="growth-faq" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </div>
      </section>
      <section className="growth-final-cta">
        <div className="growth-container">
          <h2>Ready to make your digital presence work harder?</h2>
          <p>Tell us where you want to improve. We will help identify a sensible first step.</p>
          <Link className="growth-button growth-button-light" href="/contact">Talk to Burify</Link>
        </div>
      </section>
    </main>
  );
}
