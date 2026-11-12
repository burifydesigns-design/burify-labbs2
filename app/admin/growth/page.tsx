import Link from "next/link";
import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { daysBetween, loadActivity, loadKpis, loadPipeline, loadSettings, loadTasks, todayInNairobi } from "@/lib/growth/data";
import { PLAN_START } from "@/lib/growth/types";
import GrowthShell from "./GrowthShell";
import ProgressRing from "./ProgressRing";
import Funnel from "./Funnel";
import KpiCards from "./KpiCards";
import UpNext from "./UpNext";
import SetupNeeded from "./SetupNeeded";

export const metadata: Metadata = { title: "Growth engine | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ACTION_LABEL: Record<string, string> = { drafts_generated: "Drafts created", settings_saved: "Settings saved", send: "Scheduled send", followups: "Follow-up drafts created" };

export default async function GrowthOverview() {
  const { supabase, user } = await requireGrowthAdmin();
  const today = todayInNairobi();
  const [{ tasks, error }, pipeline, settings, activity] = await Promise.all([loadTasks(supabase), loadPipeline(supabase), loadSettings(supabase), loadActivity(supabase)]);

  if (error || tasks.length === 0) return <GrowthShell title="Growth engine" eyebrow="BURIFY / GROWTH" email={user.email} pending={0}><SetupNeeded /></GrowthShell>;

  const kpis = await loadKpis(supabase, settings.kpiCurrent, pipeline.conversations);
  const done = tasks.filter(t => t.status === "done").length;
  const offset = daysBetween(PLAN_START, today);
  const planDay = Math.min(90, offset + 1);
  const upNext = tasks.filter(t => t.status !== "done").slice(0, 4);
  const dueToday = tasks.filter(t => t.due_date === today && t.status !== "done").length;
  const weekProgress = Array.from({ length: 12 }, (_, i) => {
    const list = tasks.filter(t => t.week === i + 1);
    return { week: i + 1, pct: list.length ? list.filter(t => t.status === "done").length / list.length : 0 };
  });
  const replyRate = pipeline.sent ? Math.round((pipeline.replied / pipeline.sent) * 100) : 0;

  return <GrowthShell title="Growth engine" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
    <section className="gw-hero">
      <div className="gw-hero-copy">
        <p className="gw-kicker">PATIENT GROWTH · 90-DAY PLAN</p>
        <h2>{offset < 0 ? `Your plan starts in ${-offset} day${offset === -1 ? "" : "s"}` : `Day ${planDay} of 90`}</h2>
        <p>{dueToday > 0 ? `${dueToday} task${dueToday === 1 ? " is" : "s are"} due today.` : "Nothing is due today."} {pipeline.pending > 0 ? `${pipeline.pending} email draft${pipeline.pending === 1 ? " is" : "s are"} waiting for your approval.` : ""}</p>
        <div className="gw-hero-actions">
          <Link className="gw-btn gw-btn-primary" href="/admin/growth/plan">Open plan</Link>
          <Link className="gw-btn gw-btn-light" href="/admin/growth/outreach">{pipeline.pending > 0 ? `Review ${pipeline.pending} draft${pipeline.pending === 1 ? "" : "s"}` : "Go to outreach"}</Link>
        </div>
      </div>
      <ProgressRing value={done} total={tasks.length} label="plan done" />
    </section>

    <section className="gw-stats" aria-label="Outreach snapshot">
      <article><small>Ready to contact</small><strong>{pipeline.ready.toLocaleString()}</strong><p>ICP prospects not yet drafted</p></article>
      <article><small>Awaiting approval</small><strong>{pipeline.pending}</strong><p>{pipeline.approved - pipeline.sent} approved, queued to send</p></article>
      <article><small>Emails sent</small><strong>{pipeline.sent}</strong><p>{pipeline.sentToday} in the last 24 hours</p></article>
      <article><small>Reply rate</small><strong>{replyRate}%</strong><p>{pipeline.replied} repl{pipeline.replied === 1 ? "y" : "ies"} recorded</p></article>
    </section>

    <div className="gw-columns">
      <section className="gw-card">
        <div className="gw-card-head"><div><p className="gw-kicker">UP NEXT</p><h2>Your next tasks</h2></div></div>
        <UpNext tasks={upNext} today={today} />
      </section>
      <section className="gw-card">
        <div className="gw-card-head"><div><p className="gw-kicker">OUTREACH FUNNEL</p><h2>From prospect to reply</h2></div></div>
        <Funnel steps={[
          { label: "In ICP with email", value: pipeline.pool }, { label: "Drafted", value: pipeline.drafted },
          { label: "Approved", value: pipeline.approved }, { label: "Sent", value: pipeline.sent }, { label: "Replied", value: pipeline.replied },
        ]} />
      </section>
    </div>

    <section className="gw-card">
      <div className="gw-card-head"><div><p className="gw-kicker">DAY-90 SCORECARD</p><h2>Targets</h2></div></div>
      <KpiCards kpis={kpis} />
    </section>

    <div className="gw-columns">
      <section className="gw-card">
        <div className="gw-card-head"><div><p className="gw-kicker">12 WEEKS</p><h2>Plan progress</h2></div></div>
        <div className="gw-weekbars" role="img" aria-label="Completion by week">
          {weekProgress.map(w => <Link key={w.week} href="/admin/growth/plan" className="gw-weekbar" title={`Week ${w.week}: ${Math.round(w.pct * 100)}% done`}><i style={{ height: Math.max(4, w.pct * 100) + "%" }} /><span>W{w.week}</span></Link>)}
        </div>
      </section>
      <section className="gw-card">
        <div className="gw-card-head"><div><p className="gw-kicker">ACTIVITY</p><h2>Recent activity</h2></div></div>
        {activity.length === 0 ? <div className="gw-empty"><strong>No activity yet</strong><p>Drafts, sends and settings changes show up here.</p></div> :
          <ul className="gw-activity">{activity.map(a => <li key={a.id}><span aria-hidden="true" />
            <div><strong>{ACTION_LABEL[a.action] ?? a.action}</strong><small>{new Date(a.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" })} · {a.actor}</small></div></li>)}</ul>}
      </section>
    </div>
  </GrowthShell>;
}
