export const siteConfig = {
  name: "Burify Labs",
  domain: "burifylabs.com",
  url: "https://burifylabs.com",
  description:
    "Burify Labs builds high-converting websites, AI automation systems, AI agents and workflows that help businesses grow and operate smarter.",
  primaryCta: {
    id: "start-project",
    label: "Start a Project",
    href: "/contact",
  },
  secondaryCtas: {
    viewWork: {
      id: "view-work",
      label: "View Our Work",
      href: "/work",
    },
    exploreServices: {
      id: "explore-services",
      label: "Explore Services",
      href: "/services",
    },
    contact: {
      id: "contact",
      label: "Contact",
      href: "/contact",
    },
  },
} as const;
