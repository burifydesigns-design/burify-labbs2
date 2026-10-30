create table if not exists public.invoice_email_logs (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  recipient_email text not null check (char_length(recipient_email) <= 254),
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  provider text not null default 'resend' check (provider = 'resend'),
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists invoice_email_logs_invoice_created_idx
  on public.invoice_email_logs(invoice_id, created_at desc);

alter table public.invoice_email_logs enable row level security;
revoke all on table public.invoice_email_logs from anon, authenticated;
grant all on table public.invoice_email_logs to service_role;
drop policy if exists "service role manages invoice email logs" on public.invoice_email_logs;
create policy "service role manages invoice email logs"
  on public.invoice_email_logs for all to service_role
  using (true) with check (true);

comment on table public.invoice_email_logs is
  'Server-only audit history for transactional invoice email attempts. Does not store raw invoice access tokens.';