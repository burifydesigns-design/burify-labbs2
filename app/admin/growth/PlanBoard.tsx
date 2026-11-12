"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProgressRing from "./ProgressRing";
import TaskCard from "./TaskCard";
import { useTaskState } from "./useTaskState";
import type { Task } from "@/lib/growth/types";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "auto", label: "Automated" },
  { id: "approve", label: "Drafted for you" },
  { id: "manual", label: "Your tasks" },
] as const;

export default function PlanBoard({ tasks: initial, today, startWeek }: { tasks: Task[]; today: string; startWeek: number }) {
  const { tasks, toggle, error } = useTaskState(initial);
  const [week, setWeek] = useState(startWeek);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [hideDone, setHideDone] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const list = tasks.filter(t => t.week === i + 1);
    return { week: i + 1, total: list.length, done: list.filter(t => t.status === "done").length };
  }), [tasks]);
  const done = tasks.filter(t => t.status === "done").length;
  const current = weeks[week - 1];
  const visible = tasks.filter(t => t.week === week && (filter === "all" || t.automation === filter) && !(hideDone && t.status === "done"));
  const todayWeek = tasks.find(t => t.due_date === today)?.week ?? null;

  useEffect(() => {
    stripRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [week]);

  return <div className="gw-plan">
    <section className="gw-card gw-plan-summary">
      <ProgressRing value={done} total={tasks.length} size={112} label="complete" />
      <div>
        <p className="gw-kicker">90-DAY PLAN</p>
        <h2>{done} of {tasks.length} tasks done</h2>
        <p className="gw-muted">Week {week}: {current.done}/{current.total} done. Tap a title to see the full brief.</p>
        <div className="gw-bar" aria-hidden="true"><i style={{ width: (current.total ? (current.done / current.total) * 100 : 0) + "%" }} /></div>
      </div>
      {todayWeek && todayWeek !== week ? <button type="button" className="gw-btn gw-btn-soft" onClick={() => setWeek(todayWeek)}>Jump to this week</button> : null}
    </section>

    <div className="gw-weeks" role="tablist" aria-label="Plan weeks" ref={stripRef}>
      {weeks.map(w => <button key={w.week} type="button" role="tab" aria-selected={w.week === week} className={"gw-week" + (w.week === week ? " is-active" : "") + (w.done === w.total && w.total > 0 ? " is-complete" : "")} onClick={() => setWeek(w.week)}>
        <span>W{w.week}</span><i style={{ ["--p" as string]: (w.total ? (w.done / w.total) * 100 : 0) + "%" }} /><small>{w.done}/{w.total}</small>
      </button>)}
    </div>

    <div className="gw-toolbar">
      <div className="gw-chips" role="group" aria-label="Filter tasks">
        {FILTERS.map(f => <button key={f.id} type="button" aria-pressed={filter === f.id} className={"gw-pill" + (filter === f.id ? " is-active" : "")} onClick={() => setFilter(f.id)}>{f.label}</button>)}
      </div>
      <label className="gw-switch-row"><input type="checkbox" checked={hideDone} onChange={e => setHideDone(e.target.checked)} /><span>Hide done</span></label>
    </div>

    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    <div className="gw-stack" aria-live="polite">
      {visible.length === 0 ? <div className="gw-empty"><strong>Nothing to show</strong><p>Try another filter or turn off “Hide done”.</p></div> :
        visible.map(task => <TaskCard key={task.id} task={task} today={today} onToggle={() => toggle(task)} />)}
    </div>
  </div>;
}
