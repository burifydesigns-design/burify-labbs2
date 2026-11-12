import type { Metadata } from "next";
import { requireGrowthAdmin } from "@/lib/growth/auth";
import { loadPipeline, loadTasks, todayInNairobi } from "@/lib/growth/data";
import GrowthShell from "../GrowthShell";
import PlanBoard from "../PlanBoard";
import SetupNeeded from "../SetupNeeded";

export const metadata: Metadata = { title: "90-day plan | Burify Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const { supabase, user } = await requireGrowthAdmin();
  const today = todayInNairobi();
  const [{ tasks, error }, pipeline] = await Promise.all([loadTasks(supabase), loadPipeline(supabase)]);
  const startWeek = tasks.find(t => t.due_date === today)?.week
    ?? tasks.find(t => t.status !== "done")?.week ?? 1;
  return <GrowthShell title="90-day plan" eyebrow="BURIFY / GROWTH" email={user.email} pending={pipeline.pending}>
    {error || tasks.length === 0 ? <SetupNeeded /> : <PlanBoard tasks={tasks} today={today} startWeek={startWeek} />}
  </GrowthShell>;
}
