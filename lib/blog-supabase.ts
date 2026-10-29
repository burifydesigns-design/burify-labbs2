import type { BlogPost } from "@/types/blog";
import { createClient } from "@/lib/supabase/server";

type CmsRow = {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image_url: string | null; seo_title: string | null; seo_description: string | null;
  status: "draft" | "published" | "archived"; published_at: string | null; updated_at: string;
  category: { name: string } | { name: string }[] | null;
};

export type CmsPostsResult = { posts: BlogPost[]; databaseAvailable: boolean };

function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|svg|math|link|meta|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|svg|math|link|meta|base)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src|xlink:href)\s*=\s*("|')\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s+style\s*=\s*("|')[\s\S]*?\1/gi, "");
}

export function mapCmsPost(row: CmsRow): BlogPost {
  const category = Array.isArray(row.category) ? row.category[0]?.name : row.category?.name;
  const safeContent = sanitizeArticleHtml(row.content || "");
  const plainText = safeContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.seo_description ?? row.excerpt ?? "",
    excerpt: row.excerpt ?? "",
    content: safeContent,
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

export async function getCmsPublishedPostsResult(): Promise<CmsPostsResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,content,cover_image_url,seo_title,seo_description,status,published_at,updated_at,category:blog_categories(name)")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error || !data) return { posts: [], databaseAvailable: false };
    return { posts: data.map((row) => mapCmsPost(row as unknown as CmsRow)), databaseAvailable: true };
  } catch {
    return { posts: [], databaseAvailable: false };
  }
}

export async function getCmsPublishedPosts(): Promise<BlogPost[]> {
  return (await getCmsPublishedPostsResult()).posts;
}

export async function getCmsPostBySlugResult(slug: string): Promise<{ post?: BlogPost; databaseAvailable: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,content,cover_image_url,seo_title,seo_description,status,published_at,updated_at,category:blog_categories(name)")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) return { databaseAvailable: false };
    return { post: data ? mapCmsPost(data as unknown as CmsRow) : undefined, databaseAvailable: true };
  } catch {
    return { databaseAvailable: false };
  }
}

export async function getCmsPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return (await getCmsPostBySlugResult(slug)).post;
}
