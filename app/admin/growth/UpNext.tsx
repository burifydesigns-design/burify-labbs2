"use client";

import Link from "next/link";
import TaskCard from "./TaskCard";
import { useTaskState } from "./useTaskState";
import type { Task } from "@/lib/growth/types";

export default function UpNext({ tasks: initial, today }: { tasks: Task[]; today: string }) {
  const { tasks, toggle, error } = useTaskState(initial);
  return <div className="gw-stack">
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    {tasks.length === 0 ? <div className="gw-empty"><strong>Everything is done</strong><p>Nothing left in the 90-day plan.</p></div> :
      tasks.map(task => <TaskCard key={task.id} task={task} today={today} onToggle={() => toggle(task)} />)}
    <Link className="gw-link" href="/admin/growth/plan">Open the full 90-day plan →</Link>
  </div>;
}
