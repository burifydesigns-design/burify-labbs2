import Link from "next/link";
import { Logo } from "../ui/Logo";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  variant?: "default" | "dark";
}

const services: FooterLink[] = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "AI Agents", href: "/services/ai-agents" },
  { label: "Workflow Automation", href: "/services/workflow-automation" },
];

const company: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const legal: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Editorial Policy", href: "/editorial-policy" },
];

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/burify.designs?stkn=MXhxYmg1ZWswajRuMQ==",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export function Footer({ variant = "dark" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const bgClass = variant === "dark" ? "bg-background-dark" : "bg-background-secondary";
  const textClass = variant === "dark" ? "text-white/70" : "text-primary-dark/70";
  const headingClass = variant === "dark" ? "text-white" : "text-text-primary";
  const linkHoverClass = variant === "dark" ? "hover:text-primary-light" : "hover:text-primary";
  const borderClass = variant === "dark" ? "border-border-dark" : "border-border";

  return (
    <footer className={`${bgClass} border-t ${borderClass}`}>
      <div className="container">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            <div className="lg:col-span-2">
              <Logo variant="light" size="md" showText={true} />
              <p className={`mt-4 text-body ${textClass} max-w-sm`}>
                We design exceptional digital experiences and build intelligent automation systems that drive growth.
              </p>
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2 rounded-lg
                      transition-colors duration-200
                      ${textClass} ${linkHoverClass}
                      hover:bg-white/5
                    `}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-body-sm font-semibold uppercase tracking-wider mb-4 ${headingClass}`}>
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-body ${textClass} ${linkHoverClass} transition-colors duration-200`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={`text-body-sm font-semibold uppercase tracking-wider mb-4 ${headingClass}`}>
                Company
              </h3>
              <ul className="space-y-3">
                {company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-body ${textClass} ${linkHoverClass} transition-colors duration-200`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={`text-body-sm font-semibold uppercase tracking-wider mb-4 ${headingClass}`}>
                Legal
              </h3>
              <ul className="space-y-3">
                {legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-body ${textClass} ${linkHoverClass} transition-colors duration-200`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`mt-16 pt-8 border-t ${borderClass} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className={`text-body-sm ${textClass}`}>
              &copy; {currentYear} Burify Labs. All rights reserved.
            </p>
            <p className={`text-body-sm ${textClass}`}>
              Design that inspires. Code that performs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
