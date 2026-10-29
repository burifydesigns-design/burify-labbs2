import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/StructuredData";
import { CaseStudyClient } from "./case-study-client";
import { getPublishedWork, getWorkBySlug } from "@/lib/case-studies";
import { createNoIndexMetadata, createResourceMetadata } from "@/lib/seo";
import { createCaseStudyJsonLd, createProjectBreadcrumbJsonLd } from "@/lib/structured-data";

type WorkDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const projects = await getPublishedWork();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = await getWorkBySlug(slug);
  if (!project) return createNoIndexMetadata();
  return createResourceMetadata({
    title: `${project.title} Case Study`,
    description: project.shortDescription,
    path: project.canonicalPath ?? `/work/${project.slug}`,
  });
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = await getWorkBySlug(slug);
  if (!project) notFound();
  return (
    <>
      <StructuredData data={[createCaseStudyJsonLd(project), createProjectBreadcrumbJsonLd(project)]} />
      <CaseStudyClient project={project} />
    </>
  );
}
