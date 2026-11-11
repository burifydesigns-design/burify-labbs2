import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addGrowthProspect, updateGrowthProspect, updateGrowthTask, reviewGrowthMessage } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Growth Engine | Burify Labs", robots: { index: false, follow: false } };

type Counts = { prospects:number; new_prospects:number; messages_draft:number; messages_sent:number; replies:number; audits:number; clients:number; tasks_done:number; tasks_total:number };
type Prospect = { id:string; clinic_name:string; contact_name:string|null; role:string|null; email:string|null; website:string|null; location:string|null; country:string|null; segment:string; status:string; score:number; notes:string|null; lead_source:string|null; created_at:string };
type Task = { id:number; week:number; day_index:number; day_name:string; title:string; description:string|null; category:string; automation:string; status:string; due_date:string|null; notes:string|null };
type Message = { id:string; clinic_name:string; contact_name:string|null; email:string|null; subject:string|null; body:string; status:string; created_at:string };
type Kpi = { id:number; category:string; metric:string; target_label:string; target_value:number|null; current_value:number; unit:string|null; higher_is_better:boolean };

export default async function GrowthEnginePage({ searchParams }: { searchParams: Promise<{ error?:string; added?:string; updated?:string; taskUpdated?:string; reviewed?:string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin/login?error=unauthorized");

  const admin = createAdminClient();
  const rpc = (p_action: string) => admin.rpc("growth_admin_api", { p_actor: user.id, p_action, p_payload: {} });
  const [dashboardResult, prospectsResult, tasksResult, approvalsResult, params] = await Promise.all([
    rpc("dashboard"),
    rpc("prospects"),
    rpc("tasks"),
    rpc("approvals"),
    searchParams
  ]);

  const dashboard = dashboardResult.data as { counts:Counts; kpis:Kpi[]; tasks:Task[] } | null;
  const counts = dashboard?.counts;
  const prospects = (prospectsResult.data ?? []) as Prospect[];
  const tasks = (tasksResult.data ?? []) as Task[];
  const weekGroups = Array.from(
    tasks.reduce((weeks, task) => {
      const days = weeks.get(task.week) ?? new Map<number, Task[]>();
      const dayTasks = days.get(task.day_index) ?? [];
      dayTasks.push(task);
      days.set(task.day_index, dayTasks);
      weeks.set(task.week, days);
      return weeks;
    }, new Map<number, Map<number, Task[]>>()),
    ([week, days]) => ({
      week,
      days: Array.from(days, ([dayIndex, dayTasks]) => ({
        dayIndex,
        dayName: dayTasks[0]?.day_name ?? `Day ${dayIndex}`,
        tasks: dayTasks,
      })).sort((a, b) => a.dayIndex - b.dayIndex),
    }),
  ).sort((a, b) => a.week - b.week);
  const approvals = (approvalsResult.data ?? []) as Message[];
  const errors = [dashboardResult.error, prospectsResult.error, tasksResult.error, approvalsResult.error].filter(Boolean);
  const fmt = (value:string) => new Date(value).toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric" });

  return <main className="admin-main growth-main">
    <header className="admin-topbar">
      <div><p className="admin-eyebrow">BURIFY / WORKSPACE / GROWTH</p><h1>Growth Engine</h1></div>
      <div className="growth-header-actions"><span className="admin-live">● Shared production database</span><a className="growth-back-link" href="/admin">← Dashboard</a></div>
    </header>
    {params.error && <p className="admin-error">The Growth Engine action could not be completed. Check your access and try again.</p>}
    {params.added && <p className="admin-success">Prospect added.</p>}
    {params.updated && <p className="admin-success">Prospect updated.</p>}
    {params.taskUpdated && <p className="admin-success">Task updated.</p>}
    {params.reviewed && <p className="admin-success">Message review saved. Approval does not send the email.</p>}
    {errors.length > 0 ? <section className="admin-panel"><h2>Growth data is not available</h2><p className="admin-muted">The secure Growth Engine database function is not available to this session yet. Confirm the migration and authenticated account role.</p></section> : <>
      <section className="growth-intro"><div><p className="admin-eyebrow">PATIENT GROWTH SYSTEMS</p><h2>One workspace for growth operations.</h2><p>Manage clinic prospects, the 90-day execution plan and outreach approvals alongside your existing Burify CRM.</p></div><span className="growth-readiness">Production data · Protected access</span></section>
      <section className="growth-stats">
        <article className="admin-stat"><span>Growth prospects</span><strong>{counts?.prospects ?? 0}</strong><small>{counts?.new_prospects ?? 0} new prospects</small></article>
        <article className="admin-stat"><span>Draft approvals</span><strong>{counts?.messages_draft ?? 0}</strong><small>Require human review</small></article>
        <article className="admin-stat"><span>Outreach sent</span><strong>{counts?.messages_sent ?? 0}</strong><small>{counts?.replies ?? 0} replies recorded</small></article>
        <article className="admin-stat"><span>Execution plan</span><strong>{counts?.tasks_done ?? 0}/{counts?.tasks_total ?? 0}</strong><small>Tasks completed</small></article>
      </section>
      <section className="growth-kpis">
        {(dashboard?.kpis ?? []).map(kpi => <article className="growth-kpi" key={kpi.id}><span>{kpi.category}</span><strong>{kpi.current_value}{kpi.unit ? " "+kpi.unit : ""}</strong><p>{kpi.metric} · Target {kpi.target_label}</p></article>)}
      </section>
      <section className="admin-panel growth-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">PIPELINE</p><h2>Clinic prospects</h2></div><span className="admin-count">{prospects.length} shown · up to 300</span></div>
        <form action={addGrowthProspect} className="growth-prospect-form">
          <label>Clinic name *<input name="clinic_name" required maxLength={180} placeholder="Clinic or dental group"/></label>
          <label>Contact name<input name="contact_name" maxLength={180} placeholder="Decision-maker"/></label>
          <label>Contact role<input name="role" maxLength={120} placeholder="Practice manager"/></label>
          <label>Email<input name="email" type="email" maxLength={254} placeholder="name@clinic.com"/></label>
          <label>Website<input name="website" type="url" maxLength={2048} placeholder="https://"/></label>
          <label>Location<input name="location" maxLength={180} placeholder="City / region"/></label>
          <label>Country<input name="country" maxLength={100} placeholder="Country"/></label>
          <label>Segment<select name="segment" defaultValue="high_value_dental"><option value="high_value_dental">High-value dental</option><option value="multi_location">Multi-location</option><option value="paid_ads">Paid ads</option><option value="medical">Medical</option><option value="other">Other</option></select></label>
          <label>Lead source<input name="lead_source" maxLength={120} placeholder="Research / referral"/></label>
          <label className="growth-form-wide">Personalization note<input name="personalization_note" maxLength={2000} placeholder="Verified reason this clinic may be a fit"/></label>
          <button type="submit">Add prospect</button>
        </form>
        {prospects.length === 0 ? <div className="admin-empty"><strong>No Growth Engine prospects yet</strong><p>Your existing CRM remains unchanged. Add new Growth Engine prospects here.</p></div> :
          <div className="admin-table-wrap"><table className="admin-table growth-table"><thead><tr><th>Clinic</th><th>Contact</th><th>Segment</th><th>Score</th><th>Status</th><th>Update</th></tr></thead><tbody>
            {prospects.map(p => <tr key={p.id}><td><strong>{p.clinic_name}</strong><small>{p.location || p.country || "—"}{p.website ? " · "+p.website : ""}</small></td><td>{p.contact_name || "—"}<small>{p.email || p.role || ""}</small></td><td>{p.segment.replaceAll("_"," ")}</td><td>{p.score}</td><td><span className="admin-status">{p.status.replaceAll("_"," ")}</span></td><td><form action={updateGrowthProspect} className="growth-inline-form"><input type="hidden" name="id" value={p.id}/><select name="status" defaultValue={p.status} aria-label={"Status for "+p.clinic_name}><option value="new">New</option><option value="queued">Queued</option><option value="contacted">Contacted</option><option value="replied">Replied</option><option value="positive">Positive</option><option value="call_booked">Call booked</option><option value="audit_sold">Audit sold</option><option value="won">Won</option><option value="lost">Lost</option><option value="unsubscribed">Unsubscribed</option></select><input name="score" type="number" min="0" max="100" defaultValue={p.score} aria-label="Prospect score"/><button type="submit">Save</button></form></td></tr>)}
          </tbody></table></div>}
      </section>
      <section className="growth-two-col">
        <section className="admin-panel growth-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">EXECUTION</p><h2>90-day plan</h2></div><span className="admin-count">{tasks.length} tasks</span></div>
          <div className="growth-week-list">
            {weekGroups.map(({ week, days }) => {
              const weekTasks = days.flatMap(day => day.tasks);
              const completed = weekTasks.filter(task => task.status === "done").length;
              return <details className="growth-week" key={week}>
                <summary className="growth-week-summary">
                  <span className="growth-week-chevron" aria-hidden="true">⌄</span>
                  <span className="growth-week-title"><strong>Week {week}</strong><small>{days.length} days · {weekTasks.length} tasks</small></span>
                  <span className="growth-week-progress">{completed}/{weekTasks.length} complete</span>
                </summary>
                <div className="growth-day-list">
                  {days.map(day => {
                    const dayDone = day.tasks.filter(task => task.status === "done").length;
                    return <details className="growth-day" key={day.dayIndex}>
                      <summary className="growth-day-summary">
                        <span><strong>Day {day.dayIndex} · {day.dayName}</strong><small>{day.tasks.length} tasks · {dayDone} complete</small></span>
                        <span className="growth-day-chevron" aria-hidden="true">+</span>
                      </summary>
                      <div className="growth-task-list">
                        {day.tasks.map(t => <article className="growth-task" key={t.id}>
                          <div><small>{t.category.replaceAll("_"," ")}</small><strong>{t.title}</strong><p>{t.description || t.category}</p>{t.due_date && <small className="growth-task-due">Due {fmt(t.due_date)}</small>}</div>
                          <form action={updateGrowthTask}><input type="hidden" name="id" value={t.id}/><select name="status" defaultValue={t.status} aria-label={"Status for "+t.title}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option><option value="skipped">Skipped</option></select><button type="submit">Save</button></form>
                        </article>)}
                      </div>
                    </details>;
                  })}
                </div>
              </details>;
            })}
          </div>
        </section>
        <section className="admin-panel growth-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">HUMAN REVIEW</p><h2>Outreach approvals</h2></div><span className="admin-count">{approvals.filter(m=>m.status==="draft").length} drafts</span></div>
          {approvals.length === 0 ? <div className="admin-empty"><strong>No messages awaiting review</strong><p>Draft outreach messages will appear here before approval.</p></div> : <div className="growth-approval-list">{approvals.map(m=><article className="growth-approval" key={m.id}><div className="growth-approval-head"><strong>{m.clinic_name}</strong><span className="admin-status">{m.status}</span></div><small>{m.contact_name || "Clinic contact"}{m.email ? " · "+m.email : ""}</small><h3>{m.subject || "Outreach message"}</h3><p>{m.body}</p>{m.status==="draft" && <form action={reviewGrowthMessage}><input type="hidden" name="id" value={m.id}/><button name="decision" value="approve_message" type="submit">Approve draft</button><button name="decision" value="reject_message" type="submit" className="growth-reject">Reject</button></form>}</article>)}</div>}
          <p className="admin-muted growth-note">Approving a draft does not send it. Outbound sending remains disabled until the sender, consent, suppression and delivery controls are verified.</p>
        </section>
      </section>
    </>}
    <footer className="admin-footer">Burify Labs · Growth Engine · Shared Supabase production workspace</footer>
  </main>;
}
