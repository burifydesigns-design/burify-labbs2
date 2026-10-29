import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteCaseStudy, saveCaseStudy } from "../actions";

export const metadata = { title: "Work management | Burify Labs", robots: { index: false, follow: false } };
type Params = Promise<{ error?: string; saved?: string; deleted?: string }>;

function WorkEditor({ item }: { item?: any }) {
  const editing = Boolean(item?.id);
  const id = editing ? String(item.id) : "new";
  const gallery = Array.isArray(item?.gallery_urls) ? item.gallery_urls.join("\n") : "";
  return <form action={saveCaseStudy} className="admin-blog-editor">
    <h2>{editing ? "Edit work / case study" : "Add a work item"}</h2>
    {editing && <input type="hidden" name="id" value={item.id} />}
    <div className="admin-blog-fields">
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-title"}>Project title *</label><input id={id+"-title"} name="title" required maxLength={200} defaultValue={item?.title ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-slug"}>URL slug</label><input id={id+"-slug"} name="slug" maxLength={180} defaultValue={item?.slug ?? ""} placeholder="Auto-generated from title" /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-category"}>Category</label><input id={id+"-category"} name="category" maxLength={120} defaultValue={item?.category ?? "Web Design"} placeholder="Web Design or AI Automation" /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-client"}>Client / business</label><input id={id+"-client"} name="client_name" maxLength={180} defaultValue={item?.client_name ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-industry"}>Industry</label><input id={id+"-industry"} name="industry" maxLength={120} defaultValue={item?.industry ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-year"}>Year</label><input id={id+"-year"} name="year" maxLength={10} defaultValue={item?.year ?? "2026"} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-order"}>Display order</label><input id={id+"-order"} name="display_order" type="number" min="0" step="1" defaultValue={item?.display_order ?? 0} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-summary"}>Short summary</label><textarea id={id+"-summary"} name="summary" maxLength={1000} defaultValue={item?.summary ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-description"}>Project overview</label><textarea id={id+"-description"} name="description" maxLength={10000} defaultValue={item?.description ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-challenge"}>Challenge</label><textarea id={id+"-challenge"} name="challenge" maxLength={10000} defaultValue={item?.challenge ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-solution"}>Solution</label><textarea id={id+"-solution"} name="solution" maxLength={10000} defaultValue={item?.solution ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-approach"}>Approach / process</label><textarea id={id+"-approach"} name="approach" maxLength={10000} defaultValue={item?.approach ?? item?.solution ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-outcomes"}>Outcomes</label><textarea id={id+"-outcomes"} name="outcomes" maxLength={10000} defaultValue={item?.outcomes ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-cover"}>Cover image URL</label><input id={id+"-cover"} name="cover_image_url" type="url" maxLength={2048} defaultValue={item?.cover_image_url ?? ""} placeholder="https://... or /images/..." /><p className="admin-blog-help">Public website paths such as /images/projects/example.webp are supported.</p></div>
      <div className="admin-blog-field"><label htmlFor={id+"-before"}>Before image / URL</label><input id={id+"-before"} name="before_url" maxLength={2048} defaultValue={item?.before_url ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-after"}>After image / URL</label><input id={id+"-after"} name="after_url" maxLength={2048} defaultValue={item?.after_url ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-original"}>Original website URL</label><input id={id+"-original"} name="original_url" type="url" maxLength={2048} defaultValue={item?.original_url ?? ""} /></div>
      <div className="admin-blog-field"><label htmlFor={id+"-redesigned"}>Redesigned website URL</label><input id={id+"-redesigned"} name="redesigned_url" type="url" maxLength={2048} defaultValue={item?.redesigned_url ?? ""} /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-gallery"}>Gallery image URLs (one per line)</label><textarea id={id+"-gallery"} name="gallery_urls" maxLength={60000} defaultValue={gallery} placeholder="/images/projects/example.webp" /></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={id+"-canonical"}>Canonical path</label><input id={id+"-canonical"} name="canonical_path" maxLength={500} defaultValue={item?.canonical_path ?? (item?.slug ? "/work/"+item.slug : "")} placeholder="/work/project-slug" /></div>
      <div className="admin-blog-field"><label><input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? false} /> Publish on website</label><p className="admin-blog-help">Unpublished work stays in the dashboard only.</p></div>
    </div>
    <div className="admin-blog-actions"><button className="admin-blog-primary" type="submit">{editing ? "Save work item" : "Add work item"}</button></div>
  </form>;
}

export default async function AdminWorkPage({ searchParams }: { searchParams: Params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }
  const [{ data, error }, params] = await Promise.all([
    supabase.from("case_studies").select("*").order("display_order", { ascending: true }).order("updated_at", { ascending: false }),
    searchParams,
  ]);
  const items = data ?? [];
  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav" href="/admin">Overview</a>
      <a className="admin-nav active" href="/admin/work">Work / portfolio</a>
      <a className="admin-nav" href="/admin/blog">Blog management</a>
      <a className="admin-nav" href="/admin/analytics">Analytics</a>
      <div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / CONTENT</p><h1>Work / portfolio</h1></div><a className="admin-back-link" href="/admin">← Back to dashboard</a></header>
      {params.error && <p className="admin-error">{params.error === "invalid" ? "Check required fields, URLs and field lengths." : params.error === "confirm-delete" ? "Type DELETE to permanently remove this item." : params.error === "delete" ? "The item could not be deleted." : "The item could not be saved. Check for a duplicate URL slug or database permissions."}</p>}
      {params.saved && <p className="admin-success">Work item saved. Published items are available on the website.</p>}
      {params.deleted && <p className="admin-success">Work item deleted.</p>}
      <section className="admin-welcome"><div><p className="admin-eyebrow">PORTFOLIO CMS</p><h2>Manage the work shown on your website.</h2><p>Add, edit, publish, unpublish or remove portfolio items. Published changes feed the homepage and Work pages from Supabase.</p></div><span className="admin-live">● Admin only</span></section>
      <div className="admin-stats"><article className="admin-stat"><span>Total work items</span><strong>{items.length}</strong><small>Stored in Supabase</small></article><article className="admin-stat"><span>Published</span><strong>{items.filter((x:any)=>x.is_published).length}</strong><small>Visible on website</small></article><article className="admin-stat"><span>Drafts</span><strong>{items.filter((x:any)=>!x.is_published).length}</strong><small>Admin only</small></article><article className="admin-stat"><span>Sorted display</span><strong>Custom</strong><small>Use display order</small></article></div>
      <WorkEditor />
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">PORTFOLIO LIBRARY</p><h2>Existing work</h2></div><span className="admin-count">{items.length} items</span></div>
        {error ? <p className="admin-muted">Could not load case studies. Check Supabase case_studies permissions.</p> : items.length === 0 ? <div className="admin-empty"><strong>No work items in the database yet</strong><p>Use the form above to add a project. Existing code-based portfolio entries will be migrated into this CMS separately.</p></div> : items.map((item:any)=><details className="admin-blog-row" key={item.id}><summary><div><div className="admin-blog-row-title">{item.title}</div><div className="admin-blog-row-meta">/work/{item.slug} · Order {item.display_order}</div></div><span className={"admin-status "+(item.is_published?"status-qualified":"")}>{item.is_published?"published":"draft"}</span></summary><WorkEditor item={item}/><form action={deleteCaseStudy} className="admin-blog-delete"><input type="hidden" name="id" value={item.id}/><label htmlFor={"confirm-"+item.id} className="admin-blog-help">Type DELETE to permanently remove this item.</label><input id={"confirm-"+item.id} name="confirmation" required pattern="DELETE" autoComplete="off"/><button type="submit">Delete work</button></form></details>)}
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
