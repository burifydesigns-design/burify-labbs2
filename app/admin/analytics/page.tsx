import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Analytics | Burify Labs", robots: { index: false, follow: false } };

type EventRow = { created_at: string; status?: string | null };

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
  const [leadQuery, contactQuery, postCount, projectCount, serviceCount] = await Promise.all([
    supabase.from("leads").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("contact_submissions").select("created_at,status").gte("created_at", cutoff).order("created_at"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
  ]);
  const leads = (leadQuery.data ?? []) as EventRow[];
  const contacts = (contactQuery.data ?? []) as EventRow[];
  const series = makeSeries(leads, contacts);
  const max = Math.max(1, ...series.map((d) => d.leads + d.enquiries));
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
      <section className="admin-welcome"><div><p className="admin-eyebrow">LAST 30 DAYS</p><h2>Business activity at a glance.</h2><p>Private operational analytics based on records in your Supabase database. No lead names, emails or message contents are included here.</p></div><span className="admin-live">● Admin only</span></section>
      <div className="admin-stats">
        <article className="admin-stat"><span>New leads</span><strong>{leads.length}</strong><small>{newLeads} currently marked new</small></article>
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
      <section className="admin-content-note"><div><p className="admin-eyebrow">WEBSITE TRAFFIC</p><h2>Visitor analytics</h2><p>Vercel Analytics can measure page views, visitors, top pages and referrers after it is enabled in the website layout and Vercel project. These traffic metrics are separate from the database activity shown above.</p></div><a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">Open Vercel dashboard ↗</a></section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
