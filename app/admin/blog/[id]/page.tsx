import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogEditor } from "../BlogEditor";

export const metadata = {
  title: "Edit blog post | Burify Labs",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,cover_image_url,seo_title,seo_description,status,category:blog_categories(name)")
    .eq("id", id)
    .maybeSingle();
  if (error || !post) notFound();

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
          <div><p className="admin-eyebrow">BURIFY / CONTENT</p><h1>Edit blog post</h1></div>
          <a className="admin-back-link" href="/admin/blog">← Back to blog management</a>
        </header>
        <section className="admin-welcome"><div><p className="admin-eyebrow">CONTENT STUDIO</p><h2>{post.title}</h2><p>Update the article, publication status, cover image and search metadata.</p></div><span className="admin-live">● Admin only</span></section>
        <BlogEditor post={post} />
        <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
      </section>
    </main>
  );
}
