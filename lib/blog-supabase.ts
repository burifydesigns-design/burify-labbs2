import type { BlogPost } from "@/types/blog";
import { createClient } from "@/lib/supabase/server";

type CmsRow = {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image_url: string | null; seo_title: string | null; seo_description: string | null;
  status: "draft" | "published" | "archived"; published_at: string | null; updated_at: string;
  category: { name: string } | { name: string }[] | null;
};

export function mapCmsPost(row: CmsRow): BlogPost {
  const category = Array.isArray(row.category) ? row.category[0]?.name : row.category?.name;
  const plainText = row.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.seo_description ?? row.excerpt ?? "",
    excerpt: row.excerpt ?? "",
    content: row.content,
    author: { name: "Burify" },
    publishedAt: row.published_at ?? undefined,
    updatedAt: row.updated_at,
    category: category ?? "Healthcare Insights",
    tags: [],
    featuredImage: row.cover_image_url ?? undefined,
    featuredImageAlt: row.title,
    readingTime: Math.max(1, Math.ceil(plainText.split(/\s+/).filter(Boolean).length / 200)),
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    status: row.status,
  };
}

export async function getCmsPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,content,cover_image_url,seo_title,seo_description,status,published_at,updated_at,category:blog_categories(name)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => mapCmsPost(row as unknown as CmsRow));
}

export async function getCmsPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,content,cover_image_url,seo_title,seo_description,status,published_at,updated_at,category:blog_categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCmsPost(data as unknown as CmsRow);
}
