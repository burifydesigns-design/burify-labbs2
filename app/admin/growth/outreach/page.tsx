import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { loadDrafts, loadPipeline, loadSent, loadSettings } from "@/lib/growth/data";
import GrowthShell from "../GrowthShell";
import GenerateDrafts from "../GenerateDrafts";
import ApprovalQueue from "../ApprovalQueue";
import SentList from "../SentList";

export const metadata: Metadata = { title: "Outreach | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  const { supabase, user } = await requireGrowthAdmin();
  const [pipeline, drafts, sent, settings] = await Promise.all([loadPipeline(supabase), loadDrafts(supabase), loadSent(supabase), loadSettings(supabase)]);
  return <GrowthShell title="Outreach" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
    <GenerateDrafts ready={pipeline.ready} />
    <section className="gw-section">
      <div className="gw-card-head"><div><p className="gw-kicker">STEP 2</p><h2>Review and approve</h2></div></div>
      <ApprovalQueue key={drafts.map(d => d.id).join(",")} drafts={drafts} sendingEnabled={settings.sendingEnabled} />
    </section>
    <section className="gw-card">
      <div className="gw-card-head"><div><p className="gw-kicker">STEP 3</p><h2>Sent emails</h2><p className="gw-muted">When a prospect replies, mark it here. That stops their follow-ups and updates your CRM.</p></div></div>
      <SentList items={sent} />
    </section>
  </GrowthShell>;
}
