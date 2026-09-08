import Link from "next/link";

const trustItems = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "AI Agents", href: "/services/ai-agents" },
  { label: "Workflow Automation", href: "/services/workflow-automation" },
];

export function HomeTrust() {
  return (
    <section className="py-6 border-b border-border bg-background" aria-label="Trust and capabilities">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <span className="text-caption font-medium text-text-muted uppercase tracking-widest">
            Capabilities
          </span>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Core capabilities">
            {trustItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-nav text-text-secondary hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

export default HomeTrust;
