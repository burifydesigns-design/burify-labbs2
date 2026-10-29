import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Analytics | Burify Labs", robots: { index: false, follow: false } };

type EventRow = { created_at: string; status?: string | null };
type TrafficRow = {
  timestamp?: string;
  requestPath?: string;
  pageviews?: number;
  visitors?: number;
};
type TrafficResult =
  | { configured: false; error: string; daily: TrafficRow[]; pages: TrafficRow[] }
  | { configured: true; error: null; daily: TrafficRow[]; pages: TrafficRow[] };

function makeSeries(leads: EventRow[], contacts: EventRow[], days = 30) {
  const series: { label: string; key: string; leads: number; enquiries: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({
      key,
      label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      leads: leads.filter((x) => x.created_at?.slice(0, 10) === key).length,
      enquiries: contacts.filter((x) => x.created_at?.slice(0, 10) === key).length,
    });
  }
  return series;
}

async function getVercelTraffic(): Promise<TrafficResult> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    return {
      configured: false,
      error: "Add VERCEL_ACCESS_TOKEN and VERCEL_PROJECT_ID to your Vercel project environment variables, then redeploy. VERCEL_TEAM_ID is only required for team-owned projects.",
      daily: [],
      pages: [],
    };
  }

  const untilDate = new Date();
  const sinceDate = new Date(untilDate);
  sinceDate.setUTCDate(sinceDate.getUTCDate() - 29);
  const dateOnly = (date: Date) => date.toISOString().slice(0, 10);
  const base = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";

  async function query(by: string) {
    const url = new URL(base);
    url.searchParams.set("projectId", projectId);
    url.searchParams.set("since", dateOnly(sinceDate));
    url.searchParams.set("until", dateOnly(untilDate));
    url.searchParams.set("by", by);
    url.searchParams.set("limit", by === "requestPath" ? "10" : "30");
    if (teamId) url.searchParams.set("teamId", teamId);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Vercel Analytics API request failed");
    const payload = (await response.json()) as { data?: TrafficRow[] };
    return Array.isArray(payload.data) ? payload.data : [];
  }

  try {
    const [daily, pages] = await Promise.all([query("day"), query("requestPath")]);
    return {
      configured: true,
      error: null,
      daily,
      pages: pages.sort((a, b) => (b.pageviews ?? 0) - (a.pageviews ?? 0)).slice(0, 10),
    };
  } catch {
    return {
      configured: false,
      error: "Vercel Analytics could not be loaded. Confirm Web Analytics is enabled for this project and that the access token has permission to read analytics.",
      daily: [],
      pages: [],
    };
  }
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);
  const cutoff = since.toISOString();
  const [leadQuery, contactQuery, postCount, projectCount, serviceCount, traffic] = await Promise.all([
    supabase.from("leads").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("contact_submissions").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    getVercelTraffic(),
  ]);
  const leads = (leadQuery.data ?? []) as EventRow[];
  const contacts = (contactQuery.data ?? []) as EventRow[];
  const series = makeSeries(leads, contacts);
  const max = Math.max(1, ...series.map((d) => d.leads + d.enquiries));
  const trafficMax = Math.max(1, ...traffic.daily.map((d) => d.pageviews ?? 0));
  const totalPageviews = traffic.daily.reduce((sum, d) => sum + (d.pageviews ?? 0), 0);
  const totalVisitors = traffic.daily.reduce((sum, d) => sum + (d.visitors ?? 0), 0);
  const newLeads = leads.filter((x) => x.status === "new").length;
  const newContacts = contacts.filter((x) => x.status === "new").length;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav" href="/admin">Overview</a>
      <a className="admin-nav" href="/admin#leads">Lead pipeline</a>
      <a className="admin-nav" href="/admin#contacts">Contact inbox</a>
      <a className="admin-nav" href="/admin/blog">Blog management</a>
      <a className="admin-nav active" href="/admin/analytics">Analytics</a>
      <div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / PERFORMANCE</p><h1>Analytics</h1></div><a className="admin-back-link" href="/admin">← Back to overview</a></header>
      <section className="admin-welcome"><div><p className="admin-eyebrow">LAST 30 DAYS</p><h2>Website & business analytics.</h2><p>Website traffic is read from Vercel Web Analytics. Leads and enquiries below come from Supabase.</p></div><span className="admin-live">● Admin only</span></section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">VERCEL WEB ANALYTICS</p><h2>Website traffic</h2></div><a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">Open Vercel ↗</a></div>
        {!traffic.configured ? <div className="admin-empty"><strong>Connect Vercel Analytics</strong><p>{traffic.error}</p><p>Set the variables in Vercel → Project → Settings → Environment Variables. Keep the access token private and server-side; do not use a NEXT_PUBLIC_ prefix.</p></div> : <>
          <div className="admin-stats">
            <article className="admin-stat"><span>Page views</span><strong>{totalPageviews.toLocaleString()}</strong><small>Last 30 days</small></article>
            <article className="admin-stat"><span>Visitors</span><strong>{totalVisitors.toLocaleString()}</strong><small>Daily visitor totals summed across the period</small></article>
            <article className="admin-stat"><span>Top pages tracked</span><strong>{traffic.pages.length}</strong><small>Most-viewed URL paths</small></article>
            <article className="admin-stat"><span>Data source</span><strong>Vercel</strong><small>Web Analytics API</small></article>
          </div>
          {traffic.daily.length > 0 ? <div className="analytics-chart" role="img" aria-label="Daily Vercel page views for the last 30 days">
            {traffic.daily.map((day) => <div className="analytics-bar-column" key={day.timestamp ?? "day-" + day.pageviews} title={(day.timestamp ? new Date(day.timestamp).toLocaleDateString() : "Day") + ": " + (day.pageviews ?? 0) + " page views, " + (day.visitors ?? 0) + " visitors"}>
              <div className="analytics-bar-stack"><span className="analytics-bar-leads" style={{ height: ((day.pageviews ?? 0) / trafficMax * 100) + "%" }} /></div>
              <span className="analytics-bar-label">{day.timestamp ? new Date(day.timestamp).toLocaleDateString("en", { month: "short", day: "numeric" }) : ""}</span>
            </div>)}
          </div> : <div className="admin-empty"><strong>No traffic data returned yet</strong><p>Check that Web Analytics is enabled and has collected production visits for the selected period.</p></div>}
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">CONTENT PERFORMANCE</p><h2>Top pages</h2></div><span className="admin-count">Last 30 days</span></div>
          {traffic.pages.length === 0 ? <p className="admin-muted">No page-level traffic data is available yet.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Page path</th><th>Page views</th><th>Visitors</th></tr></thead><tbody>{traffic.pages.map((page, index) => <tr key={page.requestPath ?? index}><td><strong>{page.requestPath || "Unknown path"}</strong></td><td>{(page.pageviews ?? 0).toLocaleString()}</td><td>{(page.visitors ?? 0).toLocaleString()}</td></tr>)}</tbody></table></div>}
        </>}
      </section>

      <div className="admin-stats">
        <article className="admin-stat"><span>Leads (30 days)</span><strong>{leads.length}</strong><small>{newLeads} currently marked new</small></article>
        <article className="admin-stat"><span>Contact enquiries</span><strong>{contacts.length}</strong><small>{newContacts} currently marked new</small></article>
        <article className="admin-stat"><span>Blog posts</span><strong>{postCount.count ?? "—"}</strong><small>Total records in CMS</small></article>
        <article className="admin-stat"><span>Projects / services</span><strong>{projectCount.count ?? 0} / {serviceCount.count ?? 0}</strong><small>Configured in Supabase</small></article>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">DAILY VOLUME</p><h2>Leads & enquiries</h2></div><span className="admin-count">30 days</span></div>
        {(leadQuery.error || contactQuery.error) && <p className="admin-error">Some activity data could not be loaded. Check the Supabase table schema and admin RLS policies.</p>}
        {leads.length + contacts.length === 0 ? <div className="admin-empty"><strong>No recent activity</strong><p>New leads and contact submissions will appear here when records are saved to Supabase.</p></div> :
          <div className="analytics-chart" role="img" aria-label="Daily lead and contact enquiry counts for the last 30 days">
            {series.map((day) => <div className="analytics-bar-column" key={day.key} title={day.label + ": " + day.leads + " leads, " + day.enquiries + " enquiries"}>
              <div className="analytics-bar-stack"><span className="analytics-bar-leads" style={{ height: (day.leads / max * 100) + "%" }} /><span className="analytics-bar-enquiries" style={{ height: (day.enquiries / max * 100) + "%" }} /></div>
              <span className="analytics-bar-label">{day.label}</span>
            </div>)}
          </div>}
        <div className="analytics-legend"><span><i className="analytics-dot analytics-dot-leads" /> Leads</span><span><i className="analytics-dot analytics-dot-enquiries" /> Contact enquiries</span></div>
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
