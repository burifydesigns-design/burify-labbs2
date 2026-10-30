-- Paystack production hardening: webhook diagnostics and idempotent payment receipts.
alter table public.payment_events
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists last_error text;

create index if not exists payment_events_created_idx
  on public.payment_events(created_at desc);

create table if not exists public.payment_receipt_logs (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null unique references public.payments(id) on delete cascade,
  recipient_email text not null check (char_length(recipient_email) <= 254),
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  provider text not null default 'resend' check (provider = 'resend'),
  provider_message_id text,
  error_message text,
  attempt_count integer not null default 1 check (attempt_count > 0),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_receipt_logs_status_created_idx
  on public.payment_receipt_logs(status, created_at desc);

alter table public.payment_receipt_logs enable row level security;
revoke all on table public.payment_receipt_logs from anon, authenticated;
grant all on table public.payment_receipt_logs to service_role;
drop policy if exists "service role manages payment receipt logs" on public.payment_receipt_logs;
create policy "service role manages payment receipt logs"
  on public.payment_receipt_logs for all to service_role
  using (true) with check (true);

comment on table public.payment_receipt_logs is
  'Server-only idempotency and delivery audit for customer payment confirmation emails.';
comment on column public.payment_events.last_error is
  'Sanitized last processing error for webhook operations; never store secret keys or card data.';
