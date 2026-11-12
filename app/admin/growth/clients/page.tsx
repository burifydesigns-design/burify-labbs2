import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadPipeline } from "@/lib/growth/data";
import GrowthShell from "../GrowthShell";
import { createGrowthClient, inviteGrowthClientMember, recordGrowthMetrics, updateGrowthOnboardingTask } from "../actions";

export const metadata: Metadata = { title: "Clients & onboarding | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Client = { id:string; clinic_name:string; package:string; status:string; value:number|null; start_date:string|null; contact_name:string|null; email:string|null; website:string|null };
type Task = { id:string; client_id:string; client_name:string; title:string; description:string|null; status:string; due_date:string|null };
type Metric = { client_id:string; client_name:string; period_start:string; enquiries:number; bookings:number; no_shows:number; cancellations_recovered:number; workflow_runs:number; workflow_successes:number; avg_response_minutes:number|null };

export default async function GrowthClientsPage({ searchParams }: { searchParams: Promise<{ error?:string; created?:string; invited?:string; metricsSaved?:string; taskUpdated?:string }> }) {
  const { supabase, user } = await requireGrowthAdmin();
  const admin = createAdminClient();
  const [dashboard, pipeline, params] = await Promise.all([
    admin.rpc("growth_client_ops_api", { p_actor:user.id, p_action:"dashboard", p_payload:{} }),
    loadPipeline(supabase),
    searchParams,
  ]);
  const data = (dashboard.data ?? {}) as { clients?:Client[]; tasks?:Task[]; metrics?:Metric[] };
  const clients = data.clients ?? [];
  const tasks = data.tasks ?? [];
  const metrics = data.metrics ?? [];
  const errorText = params.error === "invite" ? "The portal invitation could not be sent. Check Supabase Auth email delivery and try again." : params.error === "invite-link" ? "The invitation was sent but the portal membership could not be linked." : params.error ? "The requested client operation could not be completed." : "";
  return <GrowthShell title="Clients & onboarding" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
    {errorText ? <p className="admin-error" role="alert">{errorText}</p> : null}
    {params.created ? <p className="admin-success">Client created with a six-step onboarding checklist.</p> : null}
    {params.invited ? <p className="admin-success">Portal invitation sent and access linked.</p> : null}
    {params.metricsSaved ? <p className="admin-success">Monthly performance metrics saved.</p> : null}
    {params.taskUpdated ? <p className="admin-success">Onboarding task updated.</p> : null}
    <section className="gw-card">
      <p className="gw-kicker">CLIENT SETUP</p><h2>Create a client workspace</h2>
      <p className="gw-muted">Create the client record and generate a standard onboarding checklist. Add client portal access after creation.</p>
      <form action={createGrowthClient} className="growth-prospect-form">
        <label>Clinic / business name *<input name="clinic_name" required maxLength={180}/></label>
        <label>Primary contact<input name="contact_name" maxLength={160}/></label>
        <label>Contact email<input name="email" type="email" maxLength={254}/></label>
        <label>Website<input name="website" type="url" maxLength={2048}/></label>
        <label>Service package<select name="package" defaultValue="patient_growth_system"><option value="patient_growth_system">Patient Growth System</option><option value="conversion_website">Conversion Website</option><option value="recall_engine">Recall Engine</option><option value="growth_partner">Growth Partner</option></select></label>
        <label>Contract value<input name="value" type="number" min="0" step="0.01"/></label>
        <label>Start date<input name="start_date" type="date"/></label>
        <label className="growth-form-wide">Notes<input name="notes" maxLength={5000}/></label>
        <button type="submit">Create client workspace</button>
      </form>
    </section>
    <section className="gw-card">
      <p className="gw-kicker">CLIENT DIRECTORY</p><h2>{clients.length} client workspaces</h2>
      {clients.length===0 ? <p className="gw-muted">No clients created yet.</p> : <div className="gw-stack">{clients.map(client=><article className="gw-sent" key={client.id}><div className="gw-sent-main"><strong>{client.clinic_name}</strong><small>{client.contact_name || "Contact not set"} · {client.email || "No email"} · {client.package.replaceAll("_"," ")}</small><small>{client.status} · {client.start_date || "Start date not set"}{client.value!=null ? " · "+client.value : ""}</small></div><form action={inviteGrowthClientMember} className="growth-inline-form"><input type="hidden" name="client_id" value={client.id}/><input name="email" type="email" required placeholder="Client login email" aria-label={"Invite client for "+client.clinic_name}/><button type="submit">Invite to portal</button></form></article>)}</div>}
    </section>
    <section className="gw-card">
      <p className="gw-kicker">ONBOARDING</p><h2>Delivery checklist</h2>
      {tasks.length===0 ? <p className="gw-muted">Onboarding tasks appear when you create a client.</p> : <div className="gw-stack">{tasks.map(task=><article className="gw-sent" key={task.id}><div className="gw-sent-main"><strong>{task.client_name} · {task.title}</strong><small>{task.description || ""}</small></div><form action={updateGrowthOnboardingTask} className="growth-inline-form"><input type="hidden" name="id" value={task.id}/><select name="status" defaultValue={task.status}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option><option value="blocked">Blocked</option></select><button type="submit">Save</button></form></article>)}</div>}
    </section>
    <section className="gw-card">
      <p className="gw-kicker">MONTHLY REPORTING</p><h2>Record client performance</h2>
      <form action={recordGrowthMetrics} className="growth-prospect-form">
        <label>Client<select name="client_id" required>{clients.map(c=><option key={c.id} value={c.id}>{c.clinic_name}</option>)}</select></label>
        <label>Reporting month<input name="period_start" type="date" required/></label>
        <label>Enquiries<input name="enquiries" type="number" min="0" defaultValue="0"/></label>
        <label>Bookings<input name="bookings" type="number" min="0" defaultValue="0"/></label>
        <label>No-shows<input name="no_shows" type="number" min="0" defaultValue="0"/></label>
        <label>Cancellations recovered<input name="cancellations_recovered" type="number" min="0" defaultValue="0"/></label>
        <label>Average response (minutes)<input name="avg_response_minutes" type="number" min="0" step="0.1"/></label>
        <label>Workflow runs<input name="workflow_runs" type="number" min="0" defaultValue="0"/></label>
        <label>Successful workflow runs<input name="workflow_successes" type="number" min="0" defaultValue="0"/></label>
        <button type="submit" disabled={clients.length===0}>Save monthly metrics</button>
      </form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Client</th><th>Month</th><th>Enquiries</th><th>Bookings</th><th>Recovered</th><th>Workflow success</th></tr></thead><tbody>{metrics.map((m,i)=><tr key={m.client_id+"-"+m.period_start+"-"+i}><td>{m.client_name}</td><td>{m.period_start}</td><td>{m.enquiries}</td><td>{m.bookings}</td><td>{m.cancellations_recovered}</td><td>{m.workflow_successes}/{m.workflow_runs}</td></tr>)}</tbody></table></div>
      <p className="gw-muted">Reports use metrics entered by your team. They are not independently verified or automatically attributed to marketing activity.</p>
    </section>
  </GrowthShell>;
}