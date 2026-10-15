import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/StructuredData";
import { CaseStudyClient } from "./case-study-client";
import { publishedProjects } from "@/data/projects";
import { createNoIndexMetadata, createResourceMetadata } from "@/lib/seo";
import { createCaseStudyJsonLd, createProjectBreadcrumbJsonLd } from "@/lib/structured-data";

type WorkDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = publishedProjects.find((item) => item.slug === slug);

  if (!project) {
    return createNoIndexMetadata();
  }

  const titleMap: Record<string, string> = {
    "cavari-group": "Cavari Group Website Design Case Study",
    "precision-auto-centre": "Precision Auto Centre Website Design Case Study",
    "real-estate-n8n-automation": "Real Estate Workflow Automation Case Study",
    "hillview-physiotherapy": "Hillview Physiotherapy Group Website Redesign Case Study",
  };

  const baseTitle = titleMap[slug] ?? project.title;
  return createResourceMetadata({
    title: baseTitle,
    description: project.shortDescription,
    path: project.canonicalPath ?? `/work/${project.slug}`,
  });
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = publishedProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <StructuredData
        data={[createCaseStudyJsonLd(project), createProjectBreadcrumbJsonLd(project)]}
      />
      <CaseStudyClient project={project} />
    </>
  );
}
