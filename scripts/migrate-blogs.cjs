#!/usr/bin/env node
/**
 * Idempotently migrates code-based blogPosts from data/blog.ts into Supabase.
 * Requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
 * Uses the service-role key only in this local server-side script; never expose it in NEXT_PUBLIC_*.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment.");
  process.exit(1);
}

async function loadCodebasePosts() {
  const sourcePath = path.join(process.cwd(), "data", "blog.ts");
  if (!fs.existsSync(sourcePath)) throw new Error("Could not find data/blog.ts. Run this from the repository root.");
  const source = fs.readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    reportDiagnostics: true,
  });
  const errors = (compiled.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: (f) => f,
    getNewLine: () => "\n",
  }));
  const module = { exports: {} };
  const sandbox = { exports: module.exports, module, require: () => { throw new Error("Unexpected runtime import in data/blog.ts"); } };
  vm.runInNewContext(compiled.outputText, sandbox, { filename: "data/blog.ts", timeout: 10000 });
  const posts = module.exports.blogPosts;
  if (!Array.isArray(posts) || posts.length === 0) throw new Error("No blogPosts array found in data/blog.ts; refusing to migrate zero posts.");
  return posts;
}

function slugify(value) {
  return String(value || "").toLowerCase().trim().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 200);
}

function asString(value) {
  return typeof value === "string" ? value : "";
}

async function main() {
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const posts = await loadCodebasePosts();
  let insertedOrUpdated = 0;
  let failed = 0;
  const errors = [];

  console.log("Found " + posts.length + " codebase blog posts. Starting idempotent upsert...");
  for (const post of posts) {
    try {
      const title = asString(post.title).trim();
      const slug = slugify(post.slug || title);
      const content = asString(post.content);
      if (!title || !slug) throw new Error("Post is missing a title or valid slug.");
      if (title.length > 240) throw new Error("Title exceeds the Supabase 240-character limit.");
      if (content.length > 100000) throw new Error("Content exceeds the Supabase 100,000-character limit.");

      let categoryId = null;
      const categoryName = asString(post.category).trim().slice(0, 100);
      if (categoryName) {
        const categorySlug = slugify(categoryName).slice(0, 120);
        const { data: existingCategory, error: categoryLookupError } = await supabase
          .from("blog_categories").select("id").eq("slug", categorySlug).maybeSingle();
        if (categoryLookupError) throw categoryLookupError;
        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: categoryInsertError } = await supabase
            .from("blog_categories").insert({ name: categoryName, slug: categorySlug })
            .select("id").single();
          if (categoryInsertError) throw categoryInsertError;
          categoryId = newCategory.id;
        }
      }

      const status = post.status === "published" ? "published" : "draft";
      const publishedAt = status === "published"
        ? (post.publishedAt && !Number.isNaN(Date.parse(post.publishedAt)) ? new Date(post.publishedAt).toISOString() : new Date().toISOString())
        : null;
      const row = {
        title,
        slug,
        excerpt: asString(post.excerpt || post.description).slice(0, 1000) || null,
        content,
        category_id: categoryId,
        author_id: null,
        cover_image_url: asString(post.featuredImage).slice(0, 2048) || null,
        seo_title: asString(post.seoTitle).slice(0, 70) || null,
        seo_description: asString(post.seoDescription || post.description).slice(0, 180) || null,
        status,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
        legacy_metadata: {
          source: "data/blog.ts",
          legacy_id: post.id || null,
          author: post.author || null,
          tags: Array.isArray(post.tags) ? post.tags : [],
          canonicalUrl: post.canonicalUrl || null,
          relatedServicePaths: Array.isArray(post.relatedServicePaths) ? post.relatedServicePaths : [],
          featured: Boolean(post.featured),
          cta: post.cta || null,
          readingTime: post.readingTime || null,
          featuredImageAlt: post.featuredImageAlt || null,
        },
      };

      const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "slug" });
      if (error) throw error;
      insertedOrUpdated++;
    } catch (error) {
      failed++;
      errors.push({ slug: post && post.slug, title: post && post.title, message: error.message || String(error) });
      console.error("FAILED: " + (post && (post.slug || post.title) || "unknown post") + " — " + (error.message || String(error)));
    }
  }

  console.log("\nMigration finished: " + insertedOrUpdated + " inserted/updated, " + failed + " failed.");
  if (errors.length) {
    fs.writeFileSync(path.join(process.cwd(), "blog-migration-errors.json"), JSON.stringify(errors, null, 2));
    console.error("Failure details saved to blog-migration-errors.json");
    process.exitCode = 1;
  }
  if (insertedOrUpdated === 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Blog migration aborted:", error.message || error);
  process.exitCode = 1;
});
