import type { Metadata } from "next";
import "../admin/admin.css";
import "../admin/growth/growth.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { portalRespondToProposal, portalSignOut } from "./actions";

export const metadata: Metadata = { title: "Client workspace | Burify", robots: { index:false, follow:false } };
export const dynamic = "force-dynamic";
type PortalData = {
 can_respond?:boolean;
 client?:{clinic_name:string;package:string;status:string;start_date:string|null;website:string|null};
 tasks?:{id:string;title:string;description:string|null;status:string;due_date:string|null}[];
 proposals?:{id:string;proposal_code:string;title:string;summary:string|null;scope:string[];amount:number;currency:string;status:string;valid_until:string|null}[];
 metrics?:{period_start:string;enquiries:number;bookings:number;no_shows:number;cancellations_recovered:number;workflow_runs:number;workflow_successes:number;avg_response_minutes:number|null}[];
};
export default async function ClientPortalPage({searchParams}:{searchParams:Promise<{proposal?:string}>}){
 const params=await searchParams;
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/portal/login");
 const {data,error}=await createAdminClient().rpc("growth_client_portal_api",{p_user_id:user.id});
 if(error || !data) return <main className="admin-main"><header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / CLIENT WORKSPACE</p><h1>Workspace access pending</h1></div><form action={portalSignOut}><button className="admin-logout">Sign out</button></form></header><section className="gw-card"><h2>No client workspace is linked</h2><p className="gw-muted">Ask your Burify contact to invite this email address to the correct client workspace.</p></section></main>;
 const portal=data as PortalData; const client=portal.client;
 return <main className="admin-main" style={{maxWidth:1180,margin:"0 auto",padding:24}}>
  <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / CLIENT WORKSPACE</p><h1>{client?.clinic_name ?? "Your workspace"}</h1><p className="admin-muted">{client?.package?.replaceAll("_"," ")} · {client?.status}</p></div><form action={portalSignOut}><button className="admin-logout" type="submit">Sign out</button></form></header>
  <section className="gw-card"><p className="gw-kicker">PROJECT OVERVIEW</p><h2>Welcome to your Burify workspace</h2><p className="gw-muted">View agreed proposals, onboarding progress and performance information shared by your Burify team.</p>{params.proposal==="accepted"?<p className="admin-success">Proposal accepted. Your Burify project lead will follow up with the next steps.</p>:null}{params.proposal==="declined"?<p className="admin-success">Your proposal response has been recorded.</p>:null}{params.proposal==="error"?<p className="admin-error" role="alert">We could not record your proposal response. It may have expired or already been answered.</p>:null}{client?.website?<p className="gw-muted">Website: <Link href={client.website} target="_blank">{client.website}</Link></p>:null}</section>
  <section className="gw-card"><p className="gw-kicker">DELIVERY</p><h2>Onboarding & project tasks</h2>{(portal.tasks??[]).length===0?<p className="gw-muted">No tasks have been added yet.</p>:<div className="gw-stack">{portal.tasks!.map(t=><article className="gw-sent" key={t.id}><div className="gw-sent-main"><strong>{t.title}</strong><small>{t.description??""}</small><small>{t.due_date??""}</small></div><span className="gw-chip">{t.status.replaceAll("_"," ")}</span></article>)}</div>}</section>
  <section className="gw-card"><p className="gw-kicker">PROPOSALS</p><h2>Shared proposals</h2>{(portal.proposals??[]).length===0?<p className="gw-muted">No proposals have been shared yet.</p>:<div className="gw-stack">{portal.proposals!.map(p=><article className="gw-sent" key={p.proposal_code}><div className="gw-sent-main"><strong>{p.proposal_code} · {p.title}</strong><small>{p.summary??""}</small><small>{p.currency} {Number(p.amount).toLocaleString()} · {p.status}{p.valid_until?" · Valid until "+p.valid_until:""}</small>{p.scope?.length?<ul>{p.scope.map((item,i)=><li key={i}>{item}</li>)}</ul>:null}</div>{portal.can_respond && p.status==="sent" ? <div className="gw-actions"><form action={portalRespondToProposal}><input type="hidden" name="proposal_id" value={p.id}/><input type="hidden" name="status" value="accepted"/><button className="gw-btn gw-btn-primary" type="submit">Accept proposal</button></form><form action={portalRespondToProposal}><input type="hidden" name="proposal_id" value={p.id}/><input type="hidden" name="status" value="declined"/><button className="gw-btn" type="submit">Decline</button></form></div> : null}</article>)}</div>}</section>
  <section className="gw-card"><p className="gw-kicker">PERFORMANCE</p><h2>Monthly results</h2>{(portal.metrics??[]).length===0?<p className="gw-muted">Monthly performance data has not been added yet.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Month</th><th>Enquiries</th><th>Bookings</th><th>No-shows</th><th>Recovered</th><th>Response min</th></tr></thead><tbody>{portal.metrics!.map(m=><tr key={m.period_start}><td>{m.period_start}</td><td>{m.enquiries}</td><td>{m.bookings}</td><td>{m.no_shows}</td><td>{m.cancellations_recovered}</td><td>{m.avg_response_minutes??"—"}</td></tr>)}</tbody></table></div>}</section>
  <footer className="admin-footer">Burify Solutions · Client workspace · Questions? Contact your project lead.</footer>
 </main>;
}