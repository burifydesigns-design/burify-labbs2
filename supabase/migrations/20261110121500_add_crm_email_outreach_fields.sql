alter table public.notion_crm_leads
  add column if not exists email_subject text,
  add column if not exists email_draft text,
  add column if not exists email_draft_status text not null default 'not drafted',
  add column if not exists email_drafted_at timestamptz,
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_reply_at timestamptz,
  add column if not exists email_reply_summary text,
  add column if not exists outreach_suppressed boolean not null default false;

create index if not exists notion_crm_leads_email_draft_status_idx
  on public.notion_crm_leads(email_draft_status);
