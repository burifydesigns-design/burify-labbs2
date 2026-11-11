-- Secure server-side access to the private Growth Engine schema.
-- The schema remains unexposed to the Supabase Data API; all access goes
-- through this authenticated RPC and the caller's profiles.role.

create or replace function public.growth_admin_api(
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, growth, auth
as $function$
declare
  v_user_id uuid := auth.uid();
  v_status text;
  v_id uuid;
  v_rows integer;
  v_result jsonb;
  v_score integer;
begin
  if v_user_id is null or not exists (
    select 1 from public.profiles
    where id = v_user_id and role in ('admin', 'marketing')
  ) then
    raise exception 'Not authorised to access Growth Engine' using errcode = '42501';
  end if;

  case p_action
    when 'dashboard' then
      select jsonb_build_object(
        'counts', jsonb_build_object(
          'prospects', (select count(*) from growth.prospects),
          'new_prospects', (select count(*) from growth.prospects where status = 'new'),
          'messages_draft', (select count(*) from growth.outreach_messages where status = 'draft'),
          'messages_sent', (select count(*) from growth.outreach_messages where status = 'sent'),
          'replies', (select count(*) from growth.outreach_messages where replied_at is not null),
          'audits', (select count(*) from growth.audits),
          'clients', (select count(*) from growth.clients),
          'tasks_done', (select count(*) from growth.plan_tasks where status = 'done'),
          'tasks_total', (select count(*) from growth.plan_tasks)
        ),
        'kpis', coalesce((select jsonb_agg(to_jsonb(k) order by k.id) from growth.kpis k), '[]'::jsonb),
        'tasks', coalesce((select jsonb_agg(to_jsonb(t) order by t.week, t.day_index) from (
          select id, week, day_index, day_name, title, status, due_date
          from growth.plan_tasks
          where status <> 'done'
          order by week, day_index
          limit 8
        ) t), '[]'::jsonb)
      ) into v_result;

    when 'prospects' then
      select coalesce(jsonb_agg(to_jsonb(p) order by p.created_at desc), '[]'::jsonb)
      into v_result from (
        select * from growth.prospects order by created_at desc limit 300
      ) p;

    when 'tasks' then
      select coalesce(jsonb_agg(to_jsonb(t) order by t.week, t.day_index), '[]'::jsonb)
      into v_result from growth.plan_tasks t;

    when 'approvals' then
      select coalesce(jsonb_agg(to_jsonb(m) || jsonb_build_object(
        'clinic_name', p.clinic_name, 'contact_name', p.contact_name, 'email', p.email
      ) order by m.created_at desc), '[]'::jsonb)
      into v_result
      from growth.outreach_messages m
      join growth.prospects p on p.id = m.prospect_id
      where m.status in ('draft', 'approved');

    when 'settings' then
      select coalesce(jsonb_object_agg(s.key, s.value), '{}'::jsonb)
      into v_result from growth.settings s;

    when 'add_prospect' then
      if nullif(trim(p_payload->>'clinic_name'), '') is null
         or length(p_payload->>'clinic_name') > 180 then
        raise exception 'A valid clinic name is required' using errcode = '22023';
      end if;
      if nullif(trim(p_payload->>'email'), '') is not null
         and (length(p_payload->>'email') > 254 or (p_payload->>'email') !~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$') then
        raise exception 'Enter a valid email address' using errcode = '22023';
      end if;
      v_status := coalesce(nullif(p_payload->>'segment',''), 'high_value_dental');
      if v_status not in ('high_value_dental','multi_location','paid_ads','medical','other') then
        raise exception 'Invalid prospect segment' using errcode = '22023';
      end if;
      insert into growth.prospects (
        clinic_name, contact_name, role, email, website, location, country,
        segment, lead_source, personalization_note, notes
      ) values (
        left(trim(p_payload->>'clinic_name'),180),
        nullif(left(trim(p_payload->>'contact_name'),180),''),
        nullif(left(trim(p_payload->>'role'),120),''),
        nullif(lower(trim(p_payload->>'email')),''),
        nullif(left(trim(p_payload->>'website'),2048),''),
        nullif(left(trim(p_payload->>'location'),180),''),
        nullif(left(trim(p_payload->>'country'),100),''),
        v_status,
        nullif(left(trim(p_payload->>'lead_source'),120),''),
        nullif(left(trim(p_payload->>'personalization_note'),2000),''),
        nullif(left(trim(p_payload->>'notes'),5000),'')
      );
      insert into growth.activity_log(actor, action, detail)
      values (v_user_id::text, 'add_prospect', jsonb_build_object('clinic_name', left(trim(p_payload->>'clinic_name'),180)));
      v_result := jsonb_build_object('ok', true);

    when 'update_task' then
      v_status := p_payload->>'status';
      if v_status not in ('todo','in_progress','done','skipped') then
        raise exception 'Invalid task status' using errcode = '22023';
      end if;
      update growth.plan_tasks
      set status = v_status,
          completed_at = case when v_status = 'done' then now() else null end,
          notes = case when p_payload ? 'notes' then left(p_payload->>'notes',5000) else notes end
      where id = (p_payload->>'id')::integer;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then raise exception 'Task not found' using errcode = 'P0002'; end if;
      insert into growth.activity_log(actor, action, detail)
      values (v_user_id::text, 'update_task', jsonb_build_object('id', p_payload->>'id', 'status', v_status));
      v_result := jsonb_build_object('ok', true);

    when 'update_prospect' then
      v_status := p_payload->>'status';
      if v_status not in ('new','queued','contacted','replied','positive','call_booked','audit_sold','won','lost','unsubscribed') then
        raise exception 'Invalid prospect status' using errcode = '22023';
      end if;
      v_score := case when p_payload ? 'score' then greatest(0, least(100, (p_payload->>'score')::integer)) else null end;
      update growth.prospects
      set status = v_status,
          notes = case when p_payload ? 'notes' then left(p_payload->>'notes',5000) else notes end,
          score = coalesce(v_score, score),
          last_contacted_at = case when v_status = 'contacted' then coalesce(last_contacted_at, now()) else last_contacted_at end
      where id = (p_payload->>'id')::uuid;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then raise exception 'Prospect not found' using errcode = 'P0002'; end if;
      insert into growth.activity_log(actor, action, detail)
      values (v_user_id::text, 'update_prospect', jsonb_build_object('id', p_payload->>'id', 'status', v_status));
      v_result := jsonb_build_object('ok', true);

    when 'approve_message' then
      update growth.outreach_messages
      set status = 'approved', approved_at = now()
      where id = (p_payload->>'id')::uuid and status = 'draft';
      get diagnostics v_rows = row_count;
      if v_rows = 0 then raise exception 'Draft not found or already reviewed' using errcode = 'P0002'; end if;
      insert into growth.activity_log(actor, action, detail)
      values (v_user_id::text, 'approve_message', jsonb_build_object('id', p_payload->>'id'));
      v_result := jsonb_build_object('ok', true);

    when 'reject_message' then
      update growth.outreach_messages
      set status = 'rejected'
      where id = (p_payload->>'id')::uuid and status = 'draft';
      get diagnostics v_rows = row_count;
      if v_rows = 0 then raise exception 'Draft not found or already reviewed' using errcode = 'P0002'; end if;
      insert into growth.activity_log(actor, action, detail)
      values (v_user_id::text, 'reject_message', jsonb_build_object('id', p_payload->>'id'));
      v_result := jsonb_build_object('ok', true);

    else
      raise exception 'Unsupported Growth Engine action' using errcode = '22023';
  end case;

  return coalesce(v_result, '{}'::jsonb);
end;
$function$;

revoke all on function public.growth_admin_api(text, jsonb) from public;
revoke all on function public.growth_admin_api(text, jsonb) from anon;
grant execute on function public.growth_admin_api(text, jsonb) to authenticated;
