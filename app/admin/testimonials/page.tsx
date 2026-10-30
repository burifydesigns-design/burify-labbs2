import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteTestimonial, saveTestimonial } from "../actions";

export const metadata = { title: "Testimonials | Burify Labs", robots: { index: false, follow: false } };
type Params = Promise<{ error?: string; saved?: string; deleted?: string }>;

function TestimonialEditor({ item }: { item?: any }) {
  const editing = Boolean(item?.id);
  const formId = editing ? String(item.id) : "new-testimonial";
  return <form action={saveTestimonial} className="admin-blog-editor">
    <h2>{editing ? "Edit testimonial" : "Add a testimonial"}</h2>
    {editing && <input type="hidden" name="id" value={item.id}/>}
    <div className="admin-blog-fields">
      <div className="admin-blog-field"><label htmlFor={formId+"-name"}>Client name *</label><input id={formId+"-name"} name="client_name" required maxLength={160} defaultValue={item?.client_name ?? ""}/></div>
      <div className="admin-blog-field"><label htmlFor={formId+"-role"}>Client role</label><input id={formId+"-role"} name="client_role" maxLength={160} defaultValue={item?.client_role ?? ""} placeholder="Founder, Director, etc."/></div>
      <div className="admin-blog-field"><label htmlFor={formId+"-company"}>Company</label><input id={formId+"-company"} name="company" maxLength={180} defaultValue={item?.company ?? ""}/></div>
      <div className="admin-blog-field"><label htmlFor={formId+"-rating"}>Rating</label><select id={formId+"-rating"} name="rating" defaultValue={item?.rating ?? ""}><option value="">No rating</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></div>
      <div className="admin-blog-field admin-blog-field-full"><label htmlFor={formId+"-quote"}>Testimonial *</label><textarea id={formId+"-quote"} name="quote" required maxLength={3000} rows={5} defaultValue={item?.quote ?? ""}/></div>
      <div className="admin-blog-field"><label htmlFor={formId+"-order"}>Display order</label><input id={formId+"-order"} name="display_order" type="number" min="0" step="1" defaultValue={item?.display_order ?? 0}/></div>
      <div className="admin-blog-field"><label><input type="checkbox" name="is_approved" defaultChecked={item?.is_approved ?? false}/> Approved and visible on website</label><p className="admin-blog-help">Unapproved testimonials remain in the dashboard and are not public.</p></div>
    </div>
    <div className="admin-blog-actions"><button className="admin-blog-primary" type="submit">{editing ? "Save testimonial" : "Add testimonial"}</button></div>
  </form>;
}

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: Params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }
  const [{ data: items, error }, params] = await Promise.all([
    supabase.from("testimonials").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }),
    searchParams
  ]);
  const testimonials = items ?? [];
  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav" href="/admin">Overview</a>
      <a className="admin-nav" href="/admin#leads">Lead pipeline</a>
      <a className="admin-nav" href="/admin#contacts">Contact inbox</a>
      <a className="admin-nav" href="/admin/work">Work / portfolio</a>
      <a className="admin-nav active" href="/admin/testimonials">Testimonials</a>
      <a className="admin-nav" href="/admin/blog">Blog management</a>
      <a className="admin-nav" href="/admin/analytics">Analytics</a>
      <div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / CONTENT</p><h1>Testimonials</h1></div><a className="admin-logout" href="/admin">Back to overview</a></header>
      {params.error && <p className="admin-error">{params.error === "invalid" ? "Check the required fields, rating and display order." : params.error === "confirm-delete" ? "Type DELETE to permanently remove the testimonial." : params.error === "delete" ? "The testimonial could not be deleted." : "The testimonial could not be saved. Check database permissions."}</p>}
      {params.saved && <p className="admin-success">Testimonial saved.</p>}
      {params.deleted && <p className="admin-success">Testimonial deleted.</p>}
      <section className="admin-welcome"><div><p className="admin-eyebrow">SOCIAL PROOF CMS</p><h2>Manage client testimonials.</h2><p>Add, edit, approve, unapprove and remove testimonials. Only approved testimonials should appear publicly.</p></div><span className="admin-live">● Admin only</span></section>
      <div className="admin-stats">
        <article className="admin-stat"><span>Total testimonials</span><strong>{testimonials.length}</strong><small>Stored in Supabase</small></article>
        <article className="admin-stat"><span>Approved</span><strong>{testimonials.filter((x:any)=>x.is_approved).length}</strong><small>Eligible for public display</small></article>
        <article className="admin-stat"><span>Pending review</span><strong>{testimonials.filter((x:any)=>!x.is_approved).length}</strong><small>Dashboard only</small></article>
        <article className="admin-stat"><span>Display order</span><strong>Custom</strong><small>Lower numbers appear first</small></article>
      </div>
      <TestimonialEditor/>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">TESTIMONIAL LIBRARY</p><h2>Existing testimonials</h2></div><span className="admin-count">{testimonials.length} records</span></div>
        {error ? <p className="admin-muted">Could not load testimonials. Check the testimonials table and admin RLS policies.</p> : testimonials.length === 0 ? <div className="admin-empty"><strong>No testimonials yet</strong><p>Add your first client testimonial using the form above.</p></div> : testimonials.map((item:any)=><details className="admin-blog-row" key={item.id}><summary><div><div className="admin-blog-row-title">{item.client_name}{item.company ? " · "+item.company : ""}</div><div className="admin-blog-row-meta">{item.rating ? item.rating+"/5 · " : ""}Order {item.display_order} · {item.quote.slice(0,100)}{item.quote.length>100?"…":""}</div></div><span className={"admin-status "+(item.is_approved?"status-qualified":"")}>{item.is_approved?"approved":"pending"}</span></summary><TestimonialEditor item={item}/><form action={deleteTestimonial} className="admin-blog-delete"><input type="hidden" name="id" value={item.id}/><label htmlFor={"confirm-"+item.id} className="admin-blog-help">Type DELETE to permanently remove this testimonial.</label><input id={"confirm-"+item.id} name="confirmation" required pattern="DELETE" autoComplete="off"/><button type="submit">Delete testimonial</button></form></details>)}
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
