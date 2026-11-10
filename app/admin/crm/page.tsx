import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notion CRM | Burify Admin", robots: { index: false, follow: false } };

type SearchParams = Promise<{ page?: string; q?: string; status?: string; source?: string }>;

export default async function NotionCrmPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }

  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const pageSize = 50;
  const q = (params.q || "").trim().slice(0, 120);
  const status = params.status || "";
  const source = params.source || "";
  let query = supabase.from("notion_crm_leads")
    .select("id,notion_page_url,company,contact_channel,date_added,date_contacted,deal_value,decision_maker,email,estimated_value,final_follow_up,follow_up_1,follow_up_2,follow_up_3,industry,instagram,last_contact,lead_source,linkedin,location,lost_reason,next_follow_up,notes,offer_recommended,personalization,phone,problem_identified,problem_severity,proposal_date,reply,role,sales_call_date,status,website,website_status,whatsapp,won_lost", { count: "exact" })
    .order("company", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (q) query = query.ilike("company", `%${q.replace(/[%_]/g, "")}%`);
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("lead_source", source);
  const { data, count, error } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const leads = data ?? [];
  const fmt = (v: string | null) => v ? new Date(v + (v.length === 10 ? "T00:00:00" : "")).toLocaleDateString() : "—";
  const money = (v: number | null) => v == null ? "—" : new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(v);
  const href = (p: number) => `/admin/crm?page=${p}&q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&source=${encodeURIComponent(source)}`;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/">BURIFY<span>LABS</span></Link>
      <p className="admin-side-label">WORKSPACE</p>
      <Link className="admin-nav" href="/admin">Overview</Link>
      <Link className="admin-nav active" href="/admin/crm">Notion CRM</Link>
      <Link className="admin-nav" href="/admin#leads">Lead pipeline</Link>
      <Link className="admin-nav" href="/admin#contacts">Contact inbox</Link>
      <Link className="admin-nav" href="/admin/work">Work / portfolio</Link>
      <Link className="admin-nav" href="/admin/blog">Blog management</Link>
      <Link className="admin-nav" href="/admin/analytics">Analytics</Link>
      <Link className="admin-nav" href="/admin/payments">Payments</Link>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / SALES WORKSPACE</p><h1>Notion CRM</h1></div><Link className="admin-logout" href="/admin">Back to dashboard</Link></header>
      <section className="admin-welcome"><div><p className="admin-eyebrow">IMPORTED PROSPECT DATABASE</p><h2>{total.toLocaleString()} leads</h2><p>Imported from the Burify Lead CRM in Notion. Original lead details and source records are preserved.</p></div><span className="admin-live">● Admin-only</span></section>
      <section className="admin-panel">
        <form method="get" className="admin-crm-filters">
          <label>Company search<input name="q" defaultValue={q} placeholder="Search company name"/></label>
          <label>Status<select name="status" defaultValue={status}><option value="">All statuses</option>{["NEW","QUALIFIED","CONTACTED","REPLIED","POSITIVE REPLY","SALES CONVERSATION","PROPOSAL SENT","NEGOTIATION","WON","LOST","FOLLOW-UP","NOT A FIT"].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <label>Lead source<select name="source" defaultValue={source}><option value="">All sources</option>{["Google Maps","Instagram","LinkedIn","Referral","Cold Email","Other"].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <button type="submit">Filter leads</button>
        </form>
        {error ? <p className="admin-error">Could not load the imported CRM. Check the admin database policy.</p> : leads.length === 0 ? <div className="admin-empty"><strong>No matching leads</strong><p>Try clearing your search or filters.</p></div> :
        <div className="admin-table-wrap"><table className="admin-table admin-crm-table"><thead><tr><th>Company / contact</th><th>Industry / location</th><th>Source / channel</th><th>Offer / website</th><th>Status</th><th>Follow-up</th><th>Value</th><th>Original record</th></tr></thead><tbody>
          {leads.map(lead=><tr key={lead.id}>
            <td><strong>{lead.company}</strong><small>{lead.decision_maker || lead.role || "—"}</small><small>{lead.email || lead.phone || lead.whatsapp || "No direct contact recorded"}</small></td>
            <td>{lead.industry || "—"}<small>{lead.location || ""}</small></td>
            <td>{lead.lead_source || "—"}<small>{lead.contact_channel || ""}</small></td>
            <td>{lead.offer_recommended || "—"}<small>{lead.website ? <a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a> : "No website recorded"}</small></td>
            <td><span className="admin-status">{lead.status || "—"}</span><small>{lead.problem_severity ? "Severity: "+lead.problem_severity : ""}</small></td>
            <td>{fmt(lead.next_follow_up)}<small>{lead.follow_up_1 ? "1st: "+fmt(lead.follow_up_1) : ""}</small><small>{lead.follow_up_2 ? "2nd: "+fmt(lead.follow_up_2) : ""}</small><small>{lead.follow_up_3 ? "3rd: "+fmt(lead.follow_up_3) : ""}</small></td>
            <td>{lead.estimated_value != null ? money(lead.estimated_value) : "—"}<small>{lead.deal_value != null ? "Deal: "+money(lead.deal_value) : ""}</small></td>
            <td>{lead.notion_page_url ? <a href={lead.notion_page_url} target="_blank" rel="noreferrer">Open Notion ↗</a> : "—"}<details><summary>Lead notes</summary><p>{lead.problem_identified || ""}</p><p>{lead.personalization || ""}</p><p>{lead.notes || ""}</p>{lead.reply ? <p>Reply: {lead.reply}</p> : null}</details></td>
          </tr>)}
        </tbody></table></div>}
        <div className="admin-panel-heading admin-crm-pagination"><span className="admin-muted">Showing {total ? (page-1)*pageSize+1 : 0}–{Math.min(page*pageSize,total)} of {total}</span><div><Link aria-disabled={page<=1} className={page<=1 ? "admin-muted" : "admin-logout"} href={href(Math.max(1,page-1))}>Previous</Link><span> Page {page} of {pages} </span><Link aria-disabled={page>=pages} className={page>=pages ? "admin-muted" : "admin-logout"} href={href(Math.min(pages,page+1))}>Next</Link></div></div>
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace · Imported from Notion</footer>
    </section>
  </main>;
}
