import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Prospect CRM | Burify Admin", robots: { index: false, follow: false } };

type SearchParams = Promise<{ page?: string; q?: string; status?: string; source?: string; market?: string; fit?: string }>;

const STATUSES = ["NEW", "QUALIFIED", "CONTACTED", "REPLIED", "POSITIVE REPLY", "SALES CONVERSATION", "PROPOSAL SENT", "NEGOTIATION", "WON", "LOST", "FOLLOW-UP", "NOT A FIT"];
const SOURCES = ["Google Maps", "Instagram", "LinkedIn", "Referral", "Cold Email", "Other"];

export default async function ProspectCrmPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!(["admin", "super_admin", "marketing"].includes(profile?.role ?? ""))) { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }

  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const pageSize = 30;
  const q = (params.q || "").trim().slice(0, 120);
  const status = params.status || "";
  const source = params.source || "";
  const market = params.market || "international";
  const fit = params.fit || "";
  let query = supabase.from("notion_crm_leads")
    .select("id,company,contact_channel,date_added,date_contacted,deal_value,decision_maker,email,email_subject,email_draft,email_draft_status,email_drafted_at,email_sent_at,email_reply_at,email_reply_summary,estimated_value,final_follow_up,follow_up_1,follow_up_2,follow_up_3,industry,instagram,last_contact,lead_source,linkedin,location,lost_reason,next_follow_up,notes,offer_recommended,personalization,phone,problem_identified,problem_severity,proposal_date,reply,role,sales_call_date,status,website,website_status,whatsapp,won_lost,market_scope,icp_fit", { count: "exact" })
    .order("company", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (q) query = query.ilike("company", "%" + q.replace(/[%_]/g, "") + "%");
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("lead_source", source);
  if (market) query = query.eq("market_scope", market);
  if (fit) query = query.eq("icp_fit", fit);
  const { data, count, error } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const leads = data ?? [];
  const fmt = (v: string | null) => v ? new Date(v + (v.length === 10 ? "T00:00:00" : "")).toLocaleDateString() : "—";
  const money = (v: number | null) => v == null ? "—" : "KES " + new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(v);
  const href = (p: number) => "/admin/crm?page=" + p + "&q=" + encodeURIComponent(q) + "&status=" + encodeURIComponent(status) + "&source=" + encodeURIComponent(source) + "&market=" + encodeURIComponent(market) + "&fit=" + encodeURIComponent(fit);
  const resetHref = "/admin/crm";
  const activeFilters = [q, status, source, market !== "international" ? market : "", fit].filter(Boolean).length;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/">BURIFY<span>LABS</span></Link>
      <p className="admin-side-label">WORKSPACE</p>
      <Link className="admin-nav" href="/admin">Overview</Link>
      <Link className="admin-nav active" href="/admin/crm">Prospect CRM</Link>
      <Link className="admin-nav" href="/admin#leads">Lead pipeline</Link>
      <Link className="admin-nav" href="/admin#contacts">Contact inbox</Link>
      <Link className="admin-nav" href="/admin/work">Work / portfolio</Link>
      <Link className="admin-nav" href="/admin/blog">Blog management</Link>
      <Link className="admin-nav" href="/admin/analytics">Analytics</Link>
      {profile?.role === "admin" && <Link className="admin-nav" href="/admin/payments">Payments</Link>}
    </aside>
    <section className="admin-main prospect-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / SALES WORKSPACE</p><h1>Prospect CRM</h1></div><Link className="admin-logout" href="/admin">← Dashboard</Link></header>
      <section className="prospect-intro">
        <div><span className="prospect-kicker">YOUR SALES PIPELINE</span><h2>Every opportunity, in one place.</h2><p>Review prospects, track conversations and keep your next follow-up visible.</p></div>
        <div className="prospect-intro-mark" aria-hidden="true"><span>CRM</span><strong>↗</strong></div>
      </section>
      <section className="prospect-stats" aria-label="CRM overview">
        <article><span className="prospect-stat-icon">◎</span><div><small>Total prospects</small><strong>{total.toLocaleString()}</strong><p>Matching your current filters</p></div></article>
        <article><span className="prospect-stat-icon">⌕</span><div><small>Current view</small><strong>{leads.length}</strong><p>Prospects on this page</p></div></article>
        <article><span className="prospect-stat-icon">↗</span><div><small>Page</small><strong>{page} <em>/ {pages}</em></strong><p>{pageSize} records per page</p></div></article>
      </section>
      <section className="prospect-workspace">
        <div className="prospect-section-heading"><div><span className="prospect-kicker">DATABASE</span><h3>All prospects</h3><p>Search your imported prospect records and open each profile for more context.</p></div><span className="prospect-total">{total.toLocaleString()} records</span></div>
        <form method="get" className="prospect-filters">
          <label className="prospect-search"><span>Search company</span><input name="q" defaultValue={q} placeholder="Try a company name…" /></label>
          <label><span>Lead status</span><select name="status" defaultValue={status}><option value="">All statuses</option>{STATUSES.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>Market</span><select name="market" defaultValue={market}><option value="international">International only</option><option value="local_excluded">Local market (excluded)</option><option value="needs_review">Market needs review</option><option value="">All markets</option></select></label>
          <label><span>Strategic fit</span><select name="fit" defaultValue={fit}><option value="">All fit categories</option><option value="primary_dental">Primary · Dental</option><option value="secondary_medical">Secondary · Medical</option><option value="outside_current_icp">Outside current ICP</option><option value="needs_review">Needs review</option></select></label>
          <label><span>Lead source</span><select name="source" defaultValue={source}><option value="">All sources</option>{SOURCES.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <div className="prospect-filter-actions"><button type="submit">Apply filters</button>{activeFilters > 0 ? <Link href={resetHref}>Clear</Link> : null}</div>
        </form>
        {error ? <div className="prospect-state prospect-state-error"><strong>We couldn’t load your prospects.</strong><p>Please check the CRM table permissions and try again.</p></div> : leads.length === 0 ? <div className="prospect-state"><strong>No prospects found</strong><p>Try another search or clear the active filters.</p></div> :
        <div className="prospect-list">
          {leads.map(lead=><article className="prospect-card" key={lead.id}>
            <div className="prospect-card-main">
              <div className="prospect-company"><span className="prospect-company-avatar">{(lead.company || "—").trim().slice(0,1).toUpperCase()}</span><div><h4>{lead.company || "Unnamed company"}</h4><p>{lead.industry || "Industry not specified"}{lead.location ? " · " + lead.location : ""}</p></div></div>
              <div className="prospect-contact"><strong>{lead.decision_maker || lead.role || "Contact not specified"}</strong><span>{lead.email || lead.phone || lead.whatsapp || "No direct contact details"}</span></div>
              <div className="prospect-source"><span>{lead.lead_source || "Source unknown"}</span><small>{lead.contact_channel || "Channel not specified"}</small></div>
              <div className="prospect-status-wrap"><span className="prospect-status">{lead.status || "Unclassified"}</span><small>{lead.next_follow_up ? "Next: " + fmt(lead.next_follow_up) : "No follow-up date"}</small><small>{lead.market_scope === "local_excluded" ? "Local market · Excluded" : "International market"}</small><small>{lead.icp_fit === "primary_dental" ? "Primary ICP · Dental" : lead.icp_fit === "secondary_medical" ? "Secondary ICP · Medical" : lead.icp_fit === "outside_current_icp" ? "Outside current clinic ICP" : "ICP review needed"}</small></div>
              <details className="prospect-details"><summary>View details <span>＋</span></summary><div className="prospect-detail-grid">
                <section><small>Strategic market</small><p>{lead.market_scope === "local_excluded" ? "Local market — excluded from prospecting" : lead.market_scope === "international" ? "International" : "Needs review"}</p></section>
                <section><small>Patient Growth ICP fit</small><p>{lead.icp_fit === "primary_dental" ? "Primary — Dental clinic" : lead.icp_fit === "secondary_medical" ? "Secondary — Medical clinic" : lead.icp_fit === "outside_current_icp" ? "Outside current ICP" : "Needs review"}</p></section>
                <section><small>Recommended offer</small><p>{lead.offer_recommended || "—"}</p></section>
                <section><small>Website</small><p>{lead.website ? <a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a> : "—"}</p></section>
                <section><small>Estimated value</small><p>{lead.estimated_value != null ? money(lead.estimated_value) : "—"}</p></section>
                <section><small>Deal value</small><p>{lead.deal_value != null ? money(lead.deal_value) : "—"}</p></section>
                <section><small>Follow-up history</small><p>{[lead.follow_up_1 && "1st: " + fmt(lead.follow_up_1),lead.follow_up_2 && "2nd: " + fmt(lead.follow_up_2),lead.follow_up_3 && "3rd: " + fmt(lead.follow_up_3),lead.final_follow_up && "Final: " + fmt(lead.final_follow_up)].filter(Boolean).join(" · ") || "No follow-up history"}</p></section>
                <section><small>Last contact</small><p>{fmt(lead.last_contact)}{lead.date_contacted ? " · Contacted " + fmt(lead.date_contacted) : ""}</p></section>
                <section><small>Problem identified</small><p>{lead.problem_identified || "—"}</p></section>
                <section><small>Problem severity</small><p>{lead.problem_severity || "—"}</p></section>
                <section className="prospect-detail-wide"><small>Personalization</small><p>{lead.personalization || "—"}</p></section>
                <section className="prospect-detail-wide"><small>Notes</small><p>{lead.notes || "—"}</p></section>
                <section className="prospect-detail-wide"><small>Reply / response</small><p>{lead.reply || "—"}</p></section>
                {lead.email_draft ? <section className="prospect-detail-wide prospect-email-draft"><small>Email draft · {lead.email_draft_status || "Draft"}</small><strong>{lead.email_subject || "No subject"}</strong><p>{lead.email_draft}</p><em>Not sent — review and approve before sending</em></section> : null}
                {lead.email_reply_summary ? <section className="prospect-detail-wide"><small>Email reply summary</small><p>{lead.email_reply_summary}</p></section> : null}
                {lead.lost_reason ? <section><small>Lost reason</small><p>{lead.lost_reason}</p></section> : null}
                {lead.instagram || lead.linkedin ? <section><small>Social profiles</small><p>{[lead.instagram && "Instagram: " + lead.instagram,lead.linkedin && "LinkedIn: " + lead.linkedin].filter(Boolean).join(" · ")}</p></section> : null}
              </div></details>
            </div>
          </article>)}
        </div>}
        <div className="prospect-pagination"><span>Showing {total ? (page-1)*pageSize+1 : 0}–{Math.min(page*pageSize,total)} of {total.toLocaleString()} prospects</span><div><Link aria-disabled={page<=1} className={page<=1 ? "is-disabled" : ""} href={href(Math.max(1,page-1))}>← Previous</Link><span>{page} / {pages}</span><Link aria-disabled={page>=pages} className={page>=pages ? "is-disabled" : ""} href={href(Math.min(pages,page+1))}>Next →</Link></div></div>
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
