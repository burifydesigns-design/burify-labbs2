-- Paystack-backed billing foundation for Burify Labs.
-- All financial tables are server-only; public access is via token-checked API routes.
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 160),
  email text not null check (char_length(email) <= 254),
  phone text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists customers_email_lower_uidx on public.customers (lower(email));

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 180),
  slug text not null unique,
  product_type text not null check (product_type in ('website_project','ai_automation','consultation','digital_product','retainer','other')),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending','processing','completed','cancelled','refunded')),
  currency text not null check (currency in ('KES','USD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null check (char_length(description) between 1 and 500),
  quantity integer not null default 1 check (quantity between 1 and 10000),
  unit_amount bigint not null check (unit_amount > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  invoice_number text not null unique,
  public_token_hash text not null unique check (public_token_hash ~ '^[a-f0-9]{64}$'),
  currency text not null check (currency in ('KES','USD')),
  subtotal_amount bigint not null check (subtotal_amount > 0),
  total_amount bigint not null check (total_amount > 0),
  amount_paid bigint not null default 0 check (amount_paid >= 0),
  balance_due bigint generated always as (greatest(total_amount - amount_paid, 0)) stored,
  status text not null default 'draft' check (status in ('draft','sent','partially_paid','paid','overdue','cancelled')),
  description text,
  due_at timestamptz,
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid <= total_amount)
);
create index if not exists invoices_customer_created_idx on public.invoices(customer_id, created_at desc);
create index if not exists invoices_status_due_idx on public.invoices(status, due_at);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null check (char_length(description) between 1 and 500),
  quantity integer not null default 1 check (quantity between 1 and 10000),
  unit_amount bigint not null check (unit_amount > 0),
  total_amount bigint generated always as (quantity::bigint * unit_amount) stored,
  created_at timestamptz not null default now()
);
create index if not exists invoice_items_invoice_idx on public.invoice_items(invoice_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  provider text not null default 'paystack' check (provider in ('paystack','manual')),
  reference text not null unique,
  provider_transaction_id text,
  amount bigint not null check (amount > 0),
  currency text not null check (currency in ('KES','USD')),
  channel text,
  status text not null default 'pending' check (status in ('pending','processing','success','failed','abandoned','reversed')),
  authorization_url text,
  paid_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payments_invoice_created_idx on public.payments(invoice_id, created_at desc);
create index if not exists payments_status_created_idx on public.payments(status, created_at desc);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete set null,
  provider text not null default 'paystack',
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  amount bigint not null check (amount > 0),
  currency text not null check (currency in ('KES','USD')),
  interval_unit text not null check (interval_unit in ('weekly','monthly','quarterly','yearly')),
  billing_mode text not null default 'manual' check (billing_mode in ('manual','card_automatic')),
  provider_subscription_code text,
  status text not null default 'pending' check (status in ('pending','active','past_due','paused','cancelled','completed')),
  next_billing_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_customer_status_idx on public.subscriptions(customer_id, status);

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  amount bigint not null check (amount > 0),
  provider_reference text unique,
  status text not null default 'pending' check (status in ('pending','processing','succeeded','failed')),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['customers','products','orders','order_items','invoices','invoice_items','payments','payment_events','subscriptions','refunds'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant all on table public.%I to service_role', t);
  end loop;
end $$;

create or replace function public.finalize_paystack_payment(
  p_reference text,
  p_transaction_id text,
  p_amount bigint,
  p_currency text,
  p_channel text default null,
  p_paid_at timestamptz default now()
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
  v_paid bigint;
  v_status text;
begin
  select * into v_payment
  from public.payments
  where reference = p_reference and provider = 'paystack'
  for update;

  if not found then raise exception 'Payment reference not found'; end if;
  if v_payment.amount <> p_amount or v_payment.currency <> upper(p_currency) then
    raise exception 'Verified transaction amount or currency does not match payment';
  end if;

  if v_payment.status <> 'success' then
    update public.payments
      set status = 'success',
          provider_transaction_id = p_transaction_id,
          channel = coalesce(p_channel, channel),
          paid_at = coalesce(p_paid_at, now()),
          updated_at = now(),
          failure_reason = null
    where id = v_payment.id;
  end if;

  select coalesce(sum(amount), 0) into v_paid
  from public.payments
  where invoice_id = v_payment.invoice_id and status = 'success';

  update public.invoices
    set amount_paid = least(v_paid, total_amount),
        status = case
          when least(v_paid, total_amount) >= total_amount then 'paid'
          when least(v_paid, total_amount) > 0 then 'partially_paid'
          else status
        end,
        paid_at = case when least(v_paid, total_amount) >= total_amount then coalesce(p_paid_at, now()) else null end,
        updated_at = now()
  where id = v_payment.invoice_id
  returning status into v_status;

  return jsonb_build_object('payment_id', v_payment.id, 'invoice_id', v_payment.invoice_id, 'invoice_status', v_status);
end;
$$;
revoke all on function public.finalize_paystack_payment(text,text,bigint,text,text,timestamptz) from public, anon, authenticated;
grant execute on function public.finalize_paystack_payment(text,text,bigint,text,text,timestamptz) to service_role;

comment on table public.payments is 'Payment attempts and verified transactions. Amounts use minor currency units.';
comment on table public.payment_events is 'Idempotent provider webhook audit log. Payloads must not contain card credentials.';
comment on column public.invoices.public_token_hash is 'SHA-256 hash of an unguessable public invoice token; raw token is only shown to the admin once.';
