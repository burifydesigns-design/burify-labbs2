"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error || profile?.role !== "admin") redirect("/admin/login?error=unauthorized");
  return supabase;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=invalid");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login?error=invalid");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "qualified", "proposal", "won", "lost", "nurture"].includes(status)) redirect("/admin?error=invalid-status");
  const { error } = await supabase.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  redirect(error ? "/admin?error=update-failed" : "/admin?updated=1");
}

export async function updateContactStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "read", "replied", "archived", "spam"].includes(status)) redirect("/admin?error=invalid-contact-status");
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
  redirect(error ? "/admin?error=contact-update-failed" : "/admin?contactUpdated=1");
}

function slugify(value: string) {
  return value.toLowerCase().trim().normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 200);
}

async function resolveBlogCategory(supabase: Awaited<ReturnType<typeof createClient>>, name: string) {
  const cleanName = name.trim().slice(0, 100);
  if (!cleanName) return null;
  const slug = slugify(cleanName).slice(0, 120);
  if (!slug) throw new Error("Enter a valid category name.");
  const { data: existing, error: lookupError } = await supabase.from("blog_categories").select("id").eq("slug", slug).maybeSingle();
  if (lookupError) throw new Error("Could not check the blog category.");
  if (existing) return existing.id;
  const { data: created, error: insertError } = await supabase.from("blog_categories").insert({ name: cleanName, slug }).select("id").single();
  if (insertError || !created) throw new Error("Could not create the blog category.");
  return created.id;
}

export async function saveBlogPost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();\n  const slug = slugify(rawSlug || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const categoryName = String(formData.get("category") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const seoTitle = String(formData.get("seo_title") ?? "").trim();
  const seoDescription = String(formData.get("seo_description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const validUrl = (value: string) => !value || (value.length <= 2048 && /^https?:\\/\\//i.test(value));
  if (!title || title.length > 240 || !slug || slug.length > 200 || !["draft", "published", "archived"].includes(status) || excerpt.length > 1000 || content.length > 100000 || seoTitle.length > 70 || seoDescription.length > 180 || !validUrl(coverImageUrl)) {
    redirect("/admin/blog?error=invalid");
  }
  let categoryId: string | null;
  try {
    categoryId = await resolveBlogCategory(supabase, categoryName);
  } catch {
    redirect("/admin/blog?error=category");
  }
  const { data: { user } } = await supabase.auth.getUser();
  const { data: existing } = id ? await supabase.from("blog_posts").select("published_at").eq("id", id).maybeSingle() : { data: null };
  const publishedAt = status === "published" ? (existing?.published_at ?? new Date().toISOString()) : null;
  const values = {
    title, slug, excerpt: excerpt || null, content, category_id: categoryId,
    author_id: user?.id ?? null, cover_image_url: coverImageUrl || null,
    seo_title: seoTitle || null, seo_description: seoDescription || null,
    status, published_at: publishedAt, updated_at: new Date().toISOString(),
  };
  const result = id
    ? await supabase.from("blog_posts").update(values).eq("id", id)
    : await supabase.from("blog_posts").insert(values);
  if (result.error) redirect("/admin/blog?error=save");
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/blog/" + slug);
  redirect("/admin/blog?saved=1");
}

export async function deleteBlogPost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!id || confirmation !== "DELETE") redirect("/admin/blog?error=confirm-delete");
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) redirect("/admin/blog?error=delete");
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog?deleted=1");
}
