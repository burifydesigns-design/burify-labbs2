"use client";

import { useState } from "react";
import type { Task } from "@/lib/growth/types";

const LABEL = { auto: "Automated", approve: "Drafted for you", manual: "Your task" } as const;

export function shortDate(date: string | null) {
  if (!date) return "";
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default function TaskCard({ task, today, onToggle }: { task: Task; today: string; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const done = task.status === "done";
  const isToday = task.due_date === today;
  const overdue = !done && task.due_date != null && task.due_date < today;
  return <article className={"gw-task" + (done ? " is-done" : "") + (isToday ? " is-today" : "")}>
    <button type="button" className="gw-check" aria-pressed={done} aria-label={(done ? "Mark not done: " : "Mark done: ") + task.title} onClick={onToggle}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
    </button>
    <div className="gw-task-body">
      <div className="gw-task-meta">
        <span>{task.day_name} · {shortDate(task.due_date)}</span>
        <span className={"gw-chip gw-chip-" + task.automation}>{LABEL[task.automation]}</span>
        {isToday && !done ? <span className="gw-chip gw-chip-today">Today</span> : null}
        {overdue ? <span className="gw-chip gw-chip-late">Overdue</span> : null}
      </div>
      <button type="button" className="gw-task-title" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span>{task.title}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      {open ? <p className="gw-task-desc">{task.description}</p> : null}
    </div>
  </article>;
}
