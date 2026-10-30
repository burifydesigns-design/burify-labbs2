"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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
  return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 200);
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
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const categoryName = String(formData.get("category") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const seoTitle = String(formData.get("seo_title") ?? "").trim();
  const seoDescription = String(formData.get("seo_description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const validUrl = (value: string) => !value || (value.length <= 2048 && /^https?:\/\//i.test(value));
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


export async function saveCaseStudy(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title).slice(0, 180);
  const category = String(formData.get("category") ?? "Web Design").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const challenge = String(formData.get("challenge") ?? "").trim();
  const solution = String(formData.get("solution") ?? "").trim();
  const approach = String(formData.get("approach") ?? "").trim();
  const outcomes = String(formData.get("outcomes") ?? "").trim();
  const coverImage = String(formData.get("cover_image_url") ?? "").trim();
  const beforeUrl = String(formData.get("before_url") ?? "").trim();
  const afterUrl = String(formData.get("after_url") ?? "").trim();
  const originalUrl = String(formData.get("original_url") ?? "").trim();
  const redesignedUrl = String(formData.get("redesigned_url") ?? "").trim();
  const canonicalPath = String(formData.get("canonical_path") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const galleryUrls = String(formData.get("gallery_urls") ?? "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  const isPublished = String(formData.get("is_published") ?? "") === "on";
  const displayOrder = Number.parseInt(String(formData.get("display_order") ?? "0"), 10);
  const validUrl = (value: string) => !value || (value.length <= 2048 && (/^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//"))));
  if (!title || title.length > 200 || !slug || slug.length > 180 || category.length > 120 ||
      clientName.length > 180 || industry.length > 120 || summary.length > 1000 ||
      description.length > 10000 || challenge.length > 10000 || solution.length > 10000 ||
      approach.length > 10000 || outcomes.length > 10000 || year.length > 10 ||
      !Number.isInteger(displayOrder) || displayOrder < 0 ||
      ![coverImage, beforeUrl, afterUrl, originalUrl, redesignedUrl, ...galleryUrls].every(validUrl) ||
      galleryUrls.length > 30 || canonicalPath.length > 500 ||
      (canonicalPath && !canonicalPath.startsWith("/work/"))) {
    redirect("/admin/work?error=invalid");
  }
  const { data: existing } = id
    ? await supabase.from("case_studies").select("published_at").eq("id", id).maybeSingle()
    : { data: null };
  const values = {
    title, slug, category: category || null, client_name: clientName || null,
    industry: industry || null, summary: summary || null, description: description || null,
    challenge: challenge || null, solution: solution || null, approach: approach || null,
    outcomes: outcomes || null, cover_image_url: coverImage || null,
    before_url: beforeUrl || null, after_url: afterUrl || null,
    original_url: originalUrl || null, redesigned_url: redesignedUrl || null,
    canonical_path: canonicalPath || `/work/${slug}`, year: year || null,
    gallery_urls: galleryUrls, is_published: isPublished, display_order: displayOrder,
    published_at: isPublished ? (existing?.published_at ?? new Date().toISOString()) : null,
    updated_at: new Date().toISOString(),
  };
  const result = id
    ? await supabase.from("case_studies").update(values).eq("id", id)
    : await supabase.from("case_studies").insert(values);
  if (result.error) redirect("/admin/work?error=save");
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/" + slug);
  redirect("/admin/work?saved=1");
}

export async function deleteCaseStudy(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id || String(formData.get("confirmation") ?? "") !== "DELETE") redirect("/admin/work?error=confirm-delete");
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) redirect("/admin/work?error=delete");
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath("/");
  revalidatePath("/work");
  redirect("/admin/work?deleted=1");
}


export async function inviteDashboardUser(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "member");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || fullName.length > 120 || !["admin", "member"].includes(role)) redirect("/admin?usersError=invalid");

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
  if (error || !data.user) redirect("/admin?usersError=invite-failed");

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id, full_name: fullName, role, updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    redirect("/admin?usersError=profile-failed");
  }
  revalidatePath("/admin");
  redirect("/admin?userAdded=1");
}

export async function removeDashboardUser(formData: FormData) {
  const supabase = await requireAdmin();
  const { data: { user: actor } } = await supabase.auth.getUser();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId || !actor || userId === actor.id) redirect("/admin?usersError=invalid-removal");

  const admin = createAdminClient();
  const { data: target, error: lookupError } = await admin.from("profiles").select("id,role").eq("id", userId).maybeSingle();
  if (lookupError || !target) redirect("/admin?usersError=user-not-found");
  if (target.role === "admin") {
    const { count, error: countError } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if (countError || (count ?? 0) <= 1) redirect("/admin?usersError=last-admin");
  }
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) redirect("/admin?usersError=remove-failed");
  revalidatePath("/admin");
  redirect("/admin?userRemoved=1");
}


export async function saveTestimonial(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const clientRole = String(formData.get("client_role") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const rawRating = String(formData.get("rating") ?? "").trim();
  const rating = rawRating ? Number(rawRating) : null;
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const isApproved = String(formData.get("is_approved") ?? "") === "on";
  if (!clientName || clientName.length > 160 || clientRole.length > 160 || company.length > 180 ||
      !quote || quote.length > 3000 || (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) ||
      !Number.isInteger(displayOrder) || displayOrder < 0) {
    redirect("/admin/testimonials?error=invalid");
  }
  const values = {
    client_name: clientName,
    client_role: clientRole || null,
    company: company || null,
    quote,
    rating,
    display_order: displayOrder,
    is_approved: isApproved,
    updated_at: new Date().toISOString(),
  };
  const result = id
    ? await supabase.from("testimonials").update(values).eq("id", id)
    : await supabase.from("testimonials").insert(values);
  if (result.error) redirect("/admin/testimonials?error=save");
  revalidatePath("/admin");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id || String(formData.get("confirmation") ?? "") !== "DELETE") {
    redirect("/admin/testimonials?error=confirm-delete");
  }
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) redirect("/admin/testimonials?error=delete");
  revalidatePath("/admin");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials?deleted=1");
}
