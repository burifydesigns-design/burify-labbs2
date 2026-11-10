create table if not exists public.notion_crm_leads (
  id uuid primary key default gen_random_uuid(),
  notion_page_id text not null unique,
  notion_page_url text,
  company text not null,
  contact_channel text,
  date_added date,
  date_contacted date,
  deal_value numeric(14,2),
  decision_maker text,
  email text,
  estimated_value numeric(14,2),
  final_follow_up date,
  follow_up_1 date,
  follow_up_2 date,
  follow_up_3 date,
  industry text,
  instagram text,
  last_contact date,
  lead_source text,
  linkedin text,
  location text,
  lost_reason text,
  next_follow_up date,
  notes text,
  offer_recommended text,
  personalization text,
  phone text,
  problem_identified text,
  problem_severity text,
  proposal_date date,
  reply text,
  role text,
  sales_call_date date,
  status text,
  website text,
  website_status text,
  whatsapp text,
  won_lost text,
  notion_created_time timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notion_crm_leads_company_idx on public.notion_crm_leads (company);
create index if not exists notion_crm_leads_status_idx on public.notion_crm_leads (status);
create index if not exists notion_crm_leads_source_idx on public.notion_crm_leads (lead_source);
create index if not exists notion_crm_leads_next_follow_up_idx on public.notion_crm_leads (next_follow_up);

alter table public.notion_crm_leads enable row level security;

drop policy if exists notion_crm_leads_admin_manage on public.notion_crm_leads;
create policy notion_crm_leads_admin_manage
  on public.notion_crm_leads
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

grant select, insert, update, delete on public.notion_crm_leads to authenticated;
