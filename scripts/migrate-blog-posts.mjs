import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { createClient } from "@supabase/supabase-js";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");

// Next.js loads .env.local automatically, but standalone Node scripts do not.
function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const contents = require("node:fs").readFileSync(path, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || Object.prototype.hasOwnProperty.call(process.env, match[1])) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "");
    }
    process.env[match[1]] = value;
  }
}
loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment. Never expose the service role key in browser code.");
}

const source = await readFile(new URL("../data/blog.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove },
}).outputText;
const sandboxModule = { exports: {} };
vm.runInNewContext(`(function(exports, require, module) { ${transpiled}\n})(module.exports, () => ({}), module);`, {
  module: sandboxModule,
  console,
});
const posts = sandboxModule.exports.blogPosts;
if (!Array.isArray(posts) || posts.length === 0) throw new Error("Could not load posts from data/blog.ts.");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
const categoryIds = new Map();
for (const name of categories) {
  const slug = name.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
  const { data, error } = await supabase.from("blog_categories")
    .upsert({ name, slug }, { onConflict: "slug" }).select("id").single();
  if (error) throw new Error(`Category "${name}": ${error.message}`);
  categoryIds.set(name, data.id);
}

const rows = posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt || post.description || null,
  content: post.content || "",
  category_id: categoryIds.get(post.category) ?? null,
  cover_image_url: post.featuredImage || null,
  seo_title: (post.seoTitle || post.title).slice(0, 70),
  seo_description: (post.seoDescription || post.description || post.excerpt || "").slice(0, 180) || null,
  status: post.status === "published" ? "published" : "draft",
  published_at: post.status === "published" ? (post.publishedAt || new Date().toISOString()) : null,
  legacy_metadata: {
    legacy_id: post.id,
    description: post.description ?? "",
    author: post.author ?? { name: "Burify" },
    tags: post.tags ?? [],
    featured_image_alt: post.featuredImageAlt ?? post.title,
    reading_time: post.readingTime ?? null,
    canonical_url: post.canonicalUrl ?? null,
    related_service_paths: post.relatedServicePaths ?? [],
    featured: Boolean(post.featured),
    cta: post.cta ?? null,
    legacy_updated_at: post.updatedAt ?? null,
  },
}));

// Idempotent: match by slug so repeated runs update the migrated article, not duplicate it.
let migrated = 0;
for (let offset = 0; offset < rows.length; offset += 25) {
  const batch = rows.slice(offset, offset + 25);
  const { error } = await supabase.from("blog_posts").upsert(batch, { onConflict: "slug" });
  if (error) throw new Error(`Blog post batch starting at ${offset + 1} failed: ${error.message}`);
  migrated += batch.length;
}
console.log(`Migrated/upserted ${migrated} posts and ${categories.length} categories into Supabase.`);
console.log("Review the public blog and admin dashboard before removing legacy source data.");
