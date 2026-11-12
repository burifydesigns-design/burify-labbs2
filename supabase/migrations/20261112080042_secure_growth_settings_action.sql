-- Keep the Growth Engine settings RPC versioned with the production database migration.
create or replace function public.growth_save_settings(
  p_actor uuid,
  p_sender_name text,
  p_postal_address text,
  p_daily_cap integer,
  p_sending_enabled boolean
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, growth
as $$
begin
  if p_actor is null or not exists (
    select 1 from public.profiles where id = p_actor and role = 'admin'
  ) then
    raise exception 'Not authorised to manage Growth Engine settings' using errcode = '42501';
  end if;
  if nullif(trim(p_sender_name), '') is null or length(p_sender_name) > 80 then
    raise exception 'A valid sender name is required' using errcode = '22023';
  end if;
  if nullif(trim(p_postal_address), '') is null or length(p_postal_address) > 240 then
    raise exception 'A valid postal address is required' using errcode = '22023';
  end if;
  if p_daily_cap is null or p_daily_cap < 1 or p_daily_cap > 100 then
    raise exception 'Daily send cap must be between 1 and 100' using errcode = '22023';
  end if;
  insert into growth.settings(key, value, updated_at) values
    ('sender_name', to_jsonb(trim(p_sender_name)), now()),
    ('postal_address', to_jsonb(trim(p_postal_address)), now()),
    ('daily_send_cap', to_jsonb(p_daily_cap), now()),
    ('sending_enabled', to_jsonb(coalesce(p_sending_enabled, false)), now())
  on conflict (key) do update set value = excluded.value, updated_at = now();
  insert into growth.activity_log(actor, action, detail)
  values (p_actor::text, 'save_settings', jsonb_build_object('sending_enabled', coalesce(p_sending_enabled,false), 'daily_cap', p_daily_cap));
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.growth_save_settings(uuid,text,text,integer,boolean) from public, anon, authenticated;
grant execute on function public.growth_save_settings(uuid,text,text,integer,boolean) to service_role;
