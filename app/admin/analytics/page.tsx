import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Analytics | Burify Labs", robots: { index: false, follow: false } };

type EventRow = { created_at: string; status?: string | null };
type TrafficRow = { timestamp?: string; requestPath?: string; referrerHostname?: string; pageviews?: number; visitors?: number };
type VercelPayload<T> = { data?: T };

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

async function queryVercelAnalytics<T>(endpoint: string, params: Record<string, string>): Promise<T | null> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (!token || !projectId) return null;

  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${endpoint}`);
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as VercelPayload<T>;
    return payload.data ?? null;
  } catch {
    return null;
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

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 29);
  const since = sinceDate.toISOString().slice(0, 10);
  const until = new Date().toISOString().slice(0, 10);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 29);
  cutoffDate.setHours(0, 0, 0, 0);
  const cutoff = cutoffDate.toISOString();

  const [leadQuery, contactQuery, postCount, projectCount, serviceCount, trafficTotals, dailyTraffic, topPages, topReferrers] = await Promise.all([
    supabase.from("leads").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("contact_submissions").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    queryVercelAnalytics<{ pageviews?: number; visitors?: number }>("visits/count", {}),
    queryVercelAnalytics<TrafficRow[]>("visits/aggregate", { since, until, by: "day", limit: "31" }),
    queryVercelAnalytics<TrafficRow[]>("visits/aggregate", { since, until, by: "requestPath", limit: "8" }),
    queryVercelAnalytics<TrafficRow[]>("visits/aggregate", { since, until, by: "referrerHostname", limit: "8" }),
  ]);

  const leads = (leadQuery.data ?? []) as EventRow[];
  const contacts = (contactQuery.data ?? []) as EventRow[];
  const series = makeSeries(leads, contacts);
  const max = Math.max(1, ...series.map((d) => d.leads + d.enquiries));
  const trafficDays = (dailyTraffic ?? []).map((row) => ({
    key: row.timestamp?.slice(0, 10) ?? "",
    label: row.timestamp ? new Date(row.timestamp).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—",
    pageviews: row.pageviews ?? 0,
    visitors: row.visitors ?? 0,
  }));
  const maxTraffic = Math.max(1, ...trafficDays.map((d) => d.pageviews));
  const newLeads = leads.filter((x) => x.status === "new").length;
  const newContacts = contacts.filter((x) => x.status === "new").length;
  const vercelConfigured = Boolean(process.env.VERCEL_ANALYTICS_TOKEN && process.env.VERCEL_ANALYTICS_PROJECT_ID);
  const vercelUnavailable = vercelConfigured && trafficTotals === null;

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
      <section className="admin-welcome"><div><p className="admin-eyebrow">WEBSITE PERFORMANCE</p><h2>Traffic & business activity.</h2><p>Vercel visitor analytics alongside private lead and enquiry metrics from Supabase.</p></div><span className="admin-live">● Admin only</span></section>

      <section className="admin-panel analytics-traffic-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">VERCEL WEB ANALYTICS</p><h2>Website traffic</h2></div><span className="admin-count">All-time totals</span></div>
        {!vercelConfigured ? <div className="admin-analytics-setup"><strong>Connect Vercel Analytics</strong><p>Add the Vercel Analytics API credentials as server-side environment variables in Vercel. The API token is only used on the server and is never sent to the browser.</p><ol><li>Create a Vercel access token with access to this project.</li><li>Copy the project ID from Vercel Project Settings.</li><li>Add <code>VERCEL_ANALYTICS_TOKEN</code> and <code>VERCEL_ANALYTICS_PROJECT_ID</code> in Project → Settings → Environment Variables, for Production and Preview as needed.</li><li>If the project belongs to a Vercel team, also add <code>VERCEL_ANALYTICS_TEAM_ID</code>.</li><li>Redeploy the site. Web Analytics must also be enabled in the Vercel project.</li></ol><a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">Open Vercel dashboard ↗</a></div> :
          vercelUnavailable ? <p className="admin-error">Vercel Analytics could not be loaded. Verify the token, project ID, team ID (if applicable), and that Web Analytics is enabled for the project.</p> :
          <>
            <div className="admin-stats analytics-traffic-stats">
              <article className="admin-stat"><span>Page views</span><strong>{(trafficTotals?.pageviews ?? 0).toLocaleString()}</strong><small>All-time tracked views</small></article>
              <article className="admin-stat"><span>Visitors</span><strong>{(trafficTotals?.visitors ?? 0).toLocaleString()}</strong><small>Vercel-reported unique visitors</small></article>
              <article className="admin-stat"><span>Top pages tracked</span><strong>{topPages?.length ?? 0}</strong><small>Pages with traffic in the last 30 days</small></article>
              <article className="admin-stat"><span>Referrers tracked</span><strong>{topReferrers?.length ?? 0}</strong><small>Sources in the last 30 days</small></article>
            </div>
            <div className="admin-panel-heading analytics-subheading"><div><p className="admin-eyebrow">LAST 30 DAYS</p><h2>Daily page views</h2></div><span className="admin-count">Page views</span></div>
            {!trafficDays.length ? <div className="admin-empty"><strong>No traffic data yet</strong><p>Once Vercel receives visits, daily traffic will appear here.</p></div> : <div className="analytics-chart analytics-traffic-chart" role="img" aria-label="Daily Vercel page views for the last 30 days">
              {trafficDays.map((day) => <div className="analytics-bar-column" key={day.key} title={day.label + ": " + day.pageviews + " page views, " + day.visitors + " visitors"}>
                <div className="analytics-bar-stack"><span className="analytics-bar-pageviews" style={{ height: (day.pageviews / maxTraffic * 100) + "%" }} /></div>
                <span className="analytics-bar-label">{day.label}</span>
              </div>)}
            </div>}
            <div className="analytics-traffic-tables">
              <div><h3>Top pages</h3>{!topPages?.length ? <p className="admin-muted">No page data available yet.</p> : <table className="admin-table"><thead><tr><th>Page</th><th>Views</th><th>Visitors</th></tr></thead><tbody>{topPages.map((row, index) => <tr key={row.requestPath ?? index}><td>{row.requestPath ?? "Unknown page"}</td><td>{(row.pageviews ?? 0).toLocaleString()}</td><td>{(row.visitors ?? 0).toLocaleString()}</td></tr>)}</tbody></table>}</div>
              <div><h3>Top referrers</h3>{!topReferrers?.length ? <p className="admin-muted">No referral data available yet.</p> : <table className="admin-table"><thead><tr><th>Source</th><th>Views</th><th>Visitors</th></tr></thead><tbody>{topReferrers.map((row, index) => <tr key={row.referrerHostname ?? index}><td>{row.referrerHostname ?? "Direct / unknown"}</td><td>{(row.pageviews ?? 0).toLocaleString()}</td><td>{(row.visitors ?? 0).toLocaleString()}</td></tr>)}</tbody></table>}</div>
            </div>
          </>}
      </section>

      <section className="admin-panel analytics-business-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">SUPABASE ACTIVITY</p><h2>Leads & enquiries</h2></div><span className="admin-count">Last 30 days</span></div>
        <div className="admin-stats">
          <article className="admin-stat"><span>New leads</span><strong>{leads.length}</strong><small>{newLeads} currently marked new</small></article>
          <article className="admin-stat"><span>Contact enquiries</span><strong>{contacts.length}</strong><small>{newContacts} currently marked new</small></article>
          <article className="admin-stat"><span>Blog posts</span><strong>{postCount.count ?? "—"}</strong><small>Total records in CMS</small></article>
          <article className="admin-stat"><span>Projects / services</span><strong>{projectCount.count ?? 0} / {serviceCount.count ?? 0}</strong><small>Configured in Supabase</small></article>
        </div>
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
