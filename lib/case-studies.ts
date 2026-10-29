import { createClient } from "@/lib/supabase/server";
import { publishedProjects } from "@/data/projects";
import type { Project } from "@/types/project";

type CaseStudyRow = {
  id: string; slug: string; title: string; client_name: string | null;
  industry: string | null; category: string | null; summary: string | null;
  description: string | null; challenge: string | null; solution: string | null;
  approach: string | null; outcomes: string | null; before_url: string | null;
  after_url: string | null; cover_image_url: string | null; gallery_urls: unknown;
  year: string | null; original_url: string | null; redesigned_url: string | null;
  canonical_path: string | null; is_published: boolean; display_order: number;
  published_at: string | null; updated_at: string | null;
};

function toProject(row: CaseStudyRow): Project {
  const gallery = Array.isArray(row.gallery_urls)
    ? row.gallery_urls.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
  const featuredImage = row.cover_image_url || row.after_url || gallery[0] || "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || row.industry || "Web Design",
    shortDescription: row.summary || "",
    description: row.description || row.summary || "",
    services: [row.category === "AI Automation" ? "ai-automation" : "web-design"],
    challenge: row.challenge || "",
    approach: row.approach || row.solution || "",
    outcome: row.outcomes || "",
    status: row.is_published ? "published" : "draft",
    featuredImage,
    gallery: gallery.length ? gallery : [featuredImage].filter(Boolean),
    year: row.year || (row.published_at ? new Date(row.published_at).getFullYear().toString() : ""),
    canonicalPath: row.canonical_path || `/work/${row.slug}`,
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at || undefined,
    originalUrl: row.original_url || undefined,
    redesignedUrl: row.redesigned_url || undefined,
  };
}

export async function getPublishedWork(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_studies")
      .select("id,slug,title,client_name,industry,category,summary,description,challenge,solution,approach,outcomes,before_url,after_url,cover_image_url,gallery_urls,year,original_url,redesigned_url,canonical_path,is_published,display_order,published_at,updated_at")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("published_at", { ascending: false });
    if (!error && data) return (data as CaseStudyRow[]).map(toProject);
  } catch {
    // During local development or a temporary database outage, keep the public portfolio available.
  }
  return publishedProjects;
}

export async function getWorkBySlug(slug: string): Promise<Project | null> {
  const projects = await getPublishedWork();
  return projects.find((project) => project.slug === slug) || null;
}
