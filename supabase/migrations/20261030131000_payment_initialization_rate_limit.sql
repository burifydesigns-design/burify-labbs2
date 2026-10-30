-- Database-backed abuse protection for public Paystack checkout initialization.
create table if not exists public.payment_init_rate_limits (
  ip_hash text not null check (ip_hash ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (ip_hash, window_start)
);

alter table public.payment_init_rate_limits enable row level security;
revoke all privileges on table public.payment_init_rate_limits from anon, authenticated;
grant all privileges on table public.payment_init_rate_limits to service_role;

create or replace function public.consume_payment_init_rate_limit(
  p_ip_hash text,
  p_limit integer default 10,
  p_window_seconds integer default 600
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  if p_ip_hash !~ '^[a-f0-9]{64}$'
    or p_limit < 1 or p_limit > 100
    or p_window_seconds < 60 or p_window_seconds > 3600 then
    raise exception 'Invalid rate limit parameters';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.payment_init_rate_limits(ip_hash, window_start, request_count)
  values (p_ip_hash, v_window_start, 1)
  on conflict (ip_hash, window_start)
  do update set
    request_count = public.payment_init_rate_limits.request_count + 1,
    updated_at = now()
  returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.consume_payment_init_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_payment_init_rate_limit(text, integer, integer) to service_role;
