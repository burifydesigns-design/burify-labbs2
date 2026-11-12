import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadPipeline } from "@/lib/growth/data";
import GrowthShell from "../GrowthShell";
import { createGrowthProposal, updateGrowthProposalStatus } from "../actions";

export const metadata: Metadata = { title: "Proposals | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
type Client={id:string;clinic_name:string};
type Proposal={id:string;client_name:string;proposal_code:string;title:string;amount:number;currency:string;status:string;valid_until:string|null;created_at:string};

export default async function GrowthProposalsPage({searchParams}:{searchParams:Promise<{error?:string;created?:string;updated?:string}>}) {
 const {supabase,user}=await requireGrowthAdmin(); const admin=createAdminClient();
 const [dashboard,pipeline,params]=await Promise.all([admin.rpc("growth_client_ops_api",{p_actor:user.id,p_action:"dashboard",p_payload:{}}),loadPipeline(supabase),searchParams]);
 const data=(dashboard.data??{}) as {clients?:Client[];proposals?:Proposal[]}; const clients=data.clients??[]; const proposals=data.proposals??[];
 return <GrowthShell title="Proposals" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
  {params.error?<p className="admin-error">The proposal action could not be completed.</p>:null}
  {params.created?<p className="admin-success">Proposal created as a draft.</p>:null}
  {params.updated?<p className="admin-success">Proposal status updated.</p>:null}
  <section className="gw-card"><p className="gw-kicker">NEW PROPOSAL</p><h2>Prepare a client proposal</h2><p className="gw-muted">Create a proposal record with scope, amount and expiry. It remains a draft until you mark it as sent.</p>
   <form action={createGrowthProposal} className="growth-prospect-form">
    <label>Client<select name="client_id" required>{clients.map(c=><option key={c.id} value={c.id}>{c.clinic_name}</option>)}</select></label>
    <label>Proposal title<input name="title" required maxLength={200} placeholder="Patient Growth System proposal"/></label>
    <label>Amount<input name="amount" type="number" required min="1" step="0.01"/></label>
    <label>Currency<select name="currency"><option value="KES">KES</option><option value="USD">USD</option></select></label>
    <label>Valid until<input name="valid_until" type="date"/></label>
    <label className="growth-form-wide">Summary<textarea name="summary" rows={3} maxLength={5000}/></label>
    <label className="growth-form-wide">Scope (one deliverable per line)<textarea name="scope" rows={5} maxLength={12000} placeholder={"Website conversion review\nLocal search foundations\nEnquiry follow-up workflow"}/></label>
    <button type="submit" disabled={clients.length===0}>Create proposal draft</button>
   </form>
  </section>
  <section className="gw-card"><p className="gw-kicker">PROPOSAL PIPELINE</p><h2>{proposals.length} proposals</h2>
   {proposals.length===0?<p className="gw-muted">No proposals yet.</p>:<div className="gw-stack">{proposals.map(p=><article className="gw-sent" key={p.id}><div className="gw-sent-main"><strong>{p.proposal_code} · {p.client_name}</strong><small>{p.title}</small><small>{p.currency} {Number(p.amount).toLocaleString()} · {p.status} · {p.valid_until ? "Valid to "+p.valid_until : "No expiry"}</small></div><form action={updateGrowthProposalStatus} className="growth-inline-form"><input type="hidden" name="id" value={p.id}/><select name="status" defaultValue={p.status==="draft"?"sent":p.status}><option value="sent">Mark sent</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="expired">Expired</option></select><button type="submit">Update</button></form></article>)}</div>}
  </section>
 </GrowthShell>;
}