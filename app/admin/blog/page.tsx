import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteBlogPost } from "../actions";
import { BlogEditor } from "./BlogEditor";

export const metadata = {
  title: "Blog management | Burify Labs",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ error?: string; saved?: string; deleted?: string }>;

export default async function AdminBlogPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!(["admin", "super_admin", "marketing"].includes(profile?.role ?? ""))) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  // Keep article HTML out of the overview response. The editor fetches it only
  // when an administrator opens an individual post for editing.
  const [{ data: posts, error }, params] = await Promise.all([
    supabase.from("blog_posts").select("id,title,slug,excerpt,cover_image_url,seo_title,seo_description,status,published_at,created_at,updated_at,category:blog_categories(name)").order("updated_at", { ascending: false }),
    searchParams,
  ]);
  const rows = posts ?? [];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
        <p className="admin-side-label">WORKSPACE</p>
        <a className="admin-nav" href="/admin">Overview</a>
        <a className="admin-nav" href="/admin/work">Work / portfolio</a>
        <a className="admin-nav active" href="/admin/blog">Blog management</a>
        <div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-eyebrow">BURIFY / CONTENT</p><h1>Blog management</h1></div>
          <a className="admin-back-link" href="/admin">← Back to dashboard</a>
        </header>
        {params.error && <p className="admin-error">{params.error === "invalid" ? "Please check the title, slug, status, URLs and field lengths." : params.error === "category" ? "Could not create or find that category. Check its name and try again." : params.error === "confirm-delete" ? 'To delete a post, type DELETE in its confirmation field.' : params.error === "delete" ? "The post could not be deleted. Check database permissions." : "The post could not be saved. The slug may already be in use or a database rule may have rejected it."}</p>}
        {params.saved && <p className="admin-success">Blog post saved.</p>}
        {params.deleted && <p className="admin-success">Blog post deleted.</p>}
        <section className="admin-welcome"><div><p className="admin-eyebrow">CONTENT STUDIO</p><h2>Create, update and remove articles.</h2><p>Manage drafts, publication status, cover images and search metadata.</p></div><span className="admin-live">● Admin only</span></section>
        <div className="admin-stats">
          <article className="admin-stat"><span>Total posts</span><strong>{rows.length}</strong><small>Stored in Supabase</small></article>
          <article className="admin-stat"><span>Published</span><strong>{rows.filter((p: any) => p.status === "published").length}</strong><small>Marked published</small></article>
          <article className="admin-stat"><span>Drafts</span><strong>{rows.filter((p: any) => p.status === "draft").length}</strong><small>Not published</small></article>
          <article className="admin-stat"><span>Archived</span><strong>{rows.filter((p: any) => p.status === "archived").length}</strong><small>Hidden from active work</small></article>
        </div>
        <BlogEditor />
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">YOUR CONTENT</p><h2>Existing blog posts</h2></div><span className="admin-count">{rows.length} posts</span></div>
          {error ? <p className="admin-muted">Could not load blog posts. Check the blog table and its admin RLS policies.</p> : rows.length === 0 ? <div className="admin-empty"><strong>No database blog posts yet</strong><p>Create your first post above. Existing code-based articles are separate until they are migrated into this CMS.</p></div> : rows.map((post: any) => (
            <details className="admin-blog-row" key={post.id}>
              <summary><div><div className="admin-blog-row-title">{post.title}</div><div className="admin-blog-row-meta">/blog/{post.slug} · Updated {new Date(post.updated_at).toLocaleDateString()}</div></div><span className={"admin-status " + (post.status === "published" ? "status-qualified" : "")}>{post.status}</span></summary>
              <div className="admin-blog-row-actions">
                <a className="admin-back-link" href={`/admin/blog/${post.id}`}>Edit article</a>
                {post.status === "published" && <a className="admin-back-link" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">View published article</a>}
              </div>
              <form action={deleteBlogPost} className="admin-blog-delete">
                <input type="hidden" name="id" value={post.id} />
                <label htmlFor={"confirm-" + post.id} className="admin-blog-help">Type DELETE to remove this post permanently.</label>
                <input id={"confirm-" + post.id} name="confirmation" placeholder="Type DELETE" autoComplete="off" />
                <button type="submit">Delete post</button>
              </form>
            </details>
          ))}
        </section>
        <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
      </section>
    </main>
  );
}
