export interface SiteNavLink {
  label: string;
  href: string;
  children?: SiteNavLink[];
}

export const siteNavigation: SiteNavLink[] = [
  { label: "Patient Growth", href: "/patient-growth" },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "All industries", href: "/industries" },
      { label: "Dental practices", href: "/industries/dental-practices" },
      { label: "Physiotherapy", href: "/industries/physiotherapy" },
      { label: "Private healthcare", href: "/industries/private-healthcare" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All services", href: "/services" },
      { label: "Website design", href: "/services/web-design" },
      { label: "AI automation", href: "/services/ai-automation" },
      { label: "AI agents", href: "/services/ai-agents" },
      { label: "Workflow automation", href: "/services/workflow-automation" },
    ],
  },
  { label: "Work", href: "/work" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Resource centre", href: "/resources" },
      { label: "Growth assessment", href: "/growth-assessment" },
      { label: "Blog", href: "/blog" },
    ],
  },
  { label: "About", href: "/about" },
];