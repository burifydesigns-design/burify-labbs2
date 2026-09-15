import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const services = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "AI Agents", href: "/services/ai-agents" },
  { label: "Workflow Automation", href: "/services/workflow-automation" },
];

const navigation = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Editorial Policy", href: "/editorial-policy" },
];

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-dark border-t border-border-dark">
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Logo variant="light" size="md" showText={true} />
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-white/70 hover:text-primary-light transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-white/70 hover:text-primary-light transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-body text-white/70 hover:text-primary-light transition-colors duration-200">
                  Start a Project
                </Link>
              </li>
              <li>
                <span className="text-body text-white/50">hello@burifylabs.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm text-white/50 hover:text-white/70 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-body-sm text-white/50">
            &copy; {currentYear} Burify Labs. All rights reserved.
          </p>
          <p className="text-body-sm text-white/50">
            Design that inspires. Code that performs.
          </p>
        </div>
      </div>
    </footer>
  );
}
