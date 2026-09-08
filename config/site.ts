export const siteConfig = {
  name: "Burify Labs",
  domain: "burifylabs.com",
  url: "https://burifylabs.com",
  description:
    "Burify Labs is a web design and AI automation agency focused on websites, AI agents, and workflow automation.",
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
