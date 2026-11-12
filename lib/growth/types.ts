export type Automation = "auto" | "approve" | "manual";
export type TaskStatus = "todo" | "in_progress" | "done" | "skipped";

export type Task = {
  id: number;
  week: number;
  day_index: number;
  day_name: string;
  title: string;
  description: string | null;
  category: string;
  automation: Automation;
  status: TaskStatus;
  due_date: string | null;
};

export type Kpi = {
  id: number;
  category: string;
  metric: string;
  target_label: string;
  target_value: number | null;
  unit: string | null;
  higher_is_better: boolean;
  current: number | null;
  auto: boolean;
};

export type Draft = {
  id: string;
  lead_id: string;
  step_number: number;
  to_email: string;
  subject: string;
  body: string;
  company: string;
  contact: string | null;
  fit: string | null;
  hasPersonalization: boolean;
};

export type SentMessage = {
  id: string;
  lead_id: string;
  step_number: number;
  to_email: string;
  subject: string;
  company: string;
  status: string;
  sent_at: string | null;
  replied_at: string | null;
  error: string | null;
};

export type ActionResult = { ok: boolean; error?: string; count?: number };

export const ICP_FITS = ["primary_dental", "secondary_medical"] as const;
export const PLAN_START = "2026-11-16";
