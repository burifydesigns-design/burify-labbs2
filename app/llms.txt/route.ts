import { siteConfig } from "@/config/site";
import { publishedProjects } from "@/data/projects";

export const runtime = "nodejs";

export async function GET() {
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    `- Website: ${siteConfig.url}`,
    `- Contact: hello@burifylabs.com`,
    "",
    "## Services",
    "",
    "- Web Design — Conversion-focused websites built for business results",
    "- AI Automation — Intelligent systems for lead handling, data processing, and business workflows",
    "- AI Agents — Autonomous systems for customer support, lead qualification, and internal operations",
    "- Workflow Automation — Connected tools and trigger/action workflows for business teams",
    "",
    "## Key Pages",
    "",
    "- Home: /",
    "- Services: /services",
    "- Web Design: /services/web-design",
    "- AI Automation: /services/ai-automation",
    "- AI Agents: /services/ai-agents",
    "- Workflow Automation: /services/workflow-automation",
    "- Work / Portfolio: /work",
    "- About: /about",
    "- Blog: /blog",
    "- Contact: /contact",
    "- Privacy Policy: /privacy",
    "- Terms of Service: /terms",
    "",
    "## Approach",
    "",
    "Burify Labs works with a Discover, Strategize, Build, and Optimize process. Strategy is defined before technology is selected. Each project is built around measurable business outcomes rather than feature checklists.",
    "",
    "Technology is selected for reliability and fit — not novelty. Websites and automation systems are designed to scale with the business.",
    "",
    "## Selected Work",
    "",
  ];

  for (const project of publishedProjects.slice(0, 6)) {
    lines.push(`- ${project.title} (${project.category}) — ${project.shortDescription} [${project.canonicalPath}]`);
  }

  lines.push(
    "",
    "## Technologies & Platforms",
    "",
    "- Next.js, React, TypeScript",
    "- Tailwind CSS",
    "- n8n (workflow automation)",
    "- Vercel (hosting and deployment)",
    "- Various CRM, email, calendar, and database platforms via integrations",
    "",
    "## Content Philosophy",
    "",
    "Content on this website is written for business owners and decision-makers. Articles and service pages cover practical topics in web design, AI automation, workflow automation, and AI agents. All content is reviewed for accuracy before publication.",
    "",
    `## Company Information`,
    "",
    `- Legal name: Burify Labs`,
    `- Website: ${siteConfig.url}`,
    `- Contact: hello@burifylabs.com`,
    "",
    "---",
    "",
    `For the latest updates, visit ${siteConfig.url}`,
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
