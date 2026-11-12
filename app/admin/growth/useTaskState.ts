"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setTaskStatus } from "./actions";
import type { Task } from "@/lib/growth/types";

export function useTaskState(initial: Task[]) {
  const [tasks, apply] = useOptimistic(initial, (state: Task[], update: { id: number; status: Task["status"] }) =>
    state.map(t => (t.id === update.id ? { ...t, status: update.status } : t)));
  const [, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (task: Task) => {
    const status: Task["status"] = task.status === "done" ? "todo" : "done";
    setError(null);
    start(async () => {
      apply({ id: task.id, status });
      const result = await setTaskStatus(task.id, status);
      if (!result.ok) setError(result.error ?? "Could not save this task.");
    });
  };
  return { tasks, toggle, error };
}
