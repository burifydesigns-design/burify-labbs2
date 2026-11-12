import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { loadPipeline, loadSettings } from "@/lib/growth/data";
import { resendConfigured } from "@/lib/growth/template";
import GrowthShell from "../GrowthShell";
import SettingsForm from "../SettingsForm";

export const metadata: Metadata = { title: "Growth settings | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function GrowthSettingsPage() {
  const { supabase, user } = await requireGrowthAdmin();
  const [settings, pipeline] = await Promise.all([loadSettings(supabase), loadPipeline(supabase)]);
  return <GrowthShell title="Settings" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
    <SettingsForm emailReady={resendConfigured()} initial={{ senderName: settings.senderName, postalAddress: settings.postalAddress, dailyCap: settings.dailyCap, sendingEnabled: settings.sendingEnabled }} />
  </GrowthShell>;
}
