export const siteConfig = {
  name: "Burify Labs",
  domain: "burifylabs.com",
  url: "https://burifylabs.com",
  description:
    "Burify connects websites, local visibility, enquiry journeys and responsible automation into practical growth systems for dental and private healthcare practices.",
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
