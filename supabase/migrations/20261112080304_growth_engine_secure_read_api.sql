create or replace function public.growth_read_api(p_actor uuid, p_action text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, growth
as $$
declare v_result jsonb;
begin
  if p_actor is null or not exists (select 1 from public.profiles where id=p_actor and role='admin') then
    raise exception 'Not authorised to access Growth Engine data' using errcode='42501';
  end if;
  case p_action
    when 'tasks' then select coalesce(jsonb_agg(to_jsonb(t) order by t.week,t.day_index,t.id),'[]'::jsonb) into v_result from growth.plan_tasks t;
    when 'settings' then select coalesce(jsonb_object_agg(s.key,s.value),'{}'::jsonb) into v_result from growth.settings s;
    when 'kpis' then select coalesce(jsonb_agg(to_jsonb(k) order by k.id),'[]'::jsonb) into v_result from growth.kpis k;
    when 'drafts' then
      select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'lead_id',m.prospect_id,'step_number',m.step_number,'to_email',p.email,'subject',m.subject,'body',m.body,'company',p.clinic_name,'contact',p.contact_name,'fit',p.segment,'hasPersonalization',coalesce(length(trim(p.personalization_note))>0,false)) order by m.created_at),'[]'::jsonb)
      into v_result from growth.outreach_messages m join growth.prospects p on p.id=m.prospect_id where m.status='draft' and m.channel='email';
    when 'sent' then
      select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'lead_id',m.prospect_id,'step_number',m.step_number,'to_email',p.email,'subject',m.subject,'company',p.clinic_name,'status',m.status,'sent_at',m.sent_at,'replied_at',m.replied_at,'error',m.error,'created_at',m.created_at) order by m.created_at desc),'[]'::jsonb)
      into v_result from (select * from growth.outreach_messages where status in ('sent','failed') and channel='email' order by created_at desc limit 100) m join growth.prospects p on p.id=m.prospect_id;
    when 'activity' then select coalesce(jsonb_agg(to_jsonb(a) order by a.at desc),'[]'::jsonb) into v_result from (select * from growth.activity_log order by at desc limit 25) a;
    when 'pipeline' then select jsonb_build_object('pool',(select count(*) from growth.prospects),'ready',(select count(*) from growth.prospects where status='new' and email is not null and email<>''),'drafted',(select count(*) from growth.outreach_messages where status in ('draft','approved','sent','failed')),'approved',(select count(*) from growth.outreach_messages where status in ('approved','sent')),'sent',(select count(*) from growth.outreach_messages where status='sent'),'replied',(select count(*) from growth.outreach_messages where replied_at is not null),'pending',(select count(*) from growth.outreach_messages where status='draft'),'conversations',(select count(*) from growth.prospects where status in ('positive','call_booked','audit_sold','won')),'sentToday',(select count(*) from growth.outreach_messages where status='sent' and sent_at>=now()-interval '24 hours')) into v_result;
    else raise exception 'Unsupported Growth Engine read action' using errcode='22023';
  end case;
  return coalesce(v_result,'{}'::jsonb);
end;
$$;
revoke all on function public.growth_read_api(uuid,text) from public, anon, authenticated;
grant execute on function public.growth_read_api(uuid,text) to service_role;
