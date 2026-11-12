create or replace function public.growth_save_settings(
 p_actor uuid,p_sender_name text,p_postal_address text,p_daily_cap integer,p_sending_enabled boolean
) returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_sender jsonb;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to manage Growth Engine settings' using errcode='42501'; end if;
 if nullif(trim(p_sender_name),'') is null or length(p_sender_name)>80 then raise exception 'A valid sender name is required' using errcode='22023'; end if;
 if nullif(trim(p_postal_address),'') is null or length(p_postal_address)>240 then raise exception 'A valid postal address is required' using errcode='22023'; end if;
 if p_daily_cap is null or p_daily_cap<1 or p_daily_cap>100 then raise exception 'Daily send cap must be between 1 and 100' using errcode='22023'; end if;
 select coalesce(value,'{}'::jsonb) into v_sender from growth.settings where key='sender';
 v_sender:=jsonb_set(coalesce(v_sender,'{}'::jsonb),'{name}',to_jsonb(trim(p_sender_name)),true);
 v_sender:=jsonb_set(v_sender,'{postal_address}',to_jsonb(trim(p_postal_address)),true);
 insert into growth.settings(key,value,updated_at) values
  ('sender',v_sender,now()),('daily_send_cap',to_jsonb(p_daily_cap),now()),('sending_enabled',to_jsonb(coalesce(p_sending_enabled,false)),now())
 on conflict(key) do update set value=excluded.value,updated_at=now();
 delete from growth.settings where key in ('sender_name','postal_address');
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'save_settings',jsonb_build_object('sending_enabled',coalesce(p_sending_enabled,false),'daily_cap',p_daily_cap));
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.growth_save_settings(uuid,text,text,integer,boolean) from public,anon,authenticated;
grant execute on function public.growth_save_settings(uuid,text,text,integer,boolean) to service_role;

create or replace function public.growth_cron_api(p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_result jsonb; v_count integer; v_id uuid; v_prospect uuid; v_day_start timestamptz; v_cap integer;
begin
 v_day_start := (date_trunc('day',now() at time zone 'Africa/Nairobi')) at time zone 'Africa/Nairobi';
 case p_action
  when 'queue' then
   select coalesce(jsonb_object_agg(s.key,s.value),'{}'::jsonb) into v_result from growth.settings s;
   if coalesce(v_result->>'sending_enabled','false')<>'true'
      or nullif(v_result->'sender'->>'name','') is null
      or nullif(v_result->'sender'->>'postal_address','') is null then
    return jsonb_build_object('settings',coalesce(v_result,'{}'::jsonb),'sent_today',0,'messages','[]'::jsonb,'skipped','Sending is disabled or sender details are incomplete.');
   end if;
   select count(*) into v_count from growth.outreach_messages where (status='sent' and sent_at>=v_day_start) or (status='sending' and sending_at>=v_day_start);
   select jsonb_build_object('settings',v_result,'sent_today',v_count,'messages',coalesce((
      select jsonb_agg(jsonb_build_object('id',m.id,'prospect_id',p.id,'email',p.email,'clinic_name',p.clinic_name,'subject',m.subject,'body',m.body,'step_number',m.step_number,'sequence_id',m.sequence_id) order by m.approved_at,m.created_at)
      from (select * from growth.outreach_messages where status='approved' and channel='email' order by approved_at,created_at
        limit greatest(0,least(100,coalesce((v_result->>'daily_send_cap')::integer,30)-v_count))) m
      join growth.prospects p on p.id=m.prospect_id
      where nullif(trim(p.email),'') is not null
        and p.status not in ('replied','positive','call_booked','audit_sold','won','lost','unsubscribed')
        and not exists(select 1 from growth.suppression s where lower(s.email)=lower(p.email))
   ),'[]'::jsonb)) into v_result;
  when 'claim' then
   v_id := (p_payload->>'id')::uuid;
   perform pg_advisory_xact_lock(918273645);
   select coalesce((select (value #>> '{}')::integer from growth.settings where key='daily_send_cap'),30) into v_cap;
   v_cap := greatest(1,least(100,coalesce(v_cap,30)));
   select count(*) into v_count from growth.outreach_messages where (status='sent' and sent_at>=v_day_start) or (status='sending' and sending_at>=v_day_start);
   if v_count>=v_cap then return jsonb_build_object('claimed',false,'reason','daily_cap'); end if;
   update growth.outreach_messages m set status='sending',sending_at=now(),error=null from growth.prospects p
    where m.id=v_id and m.prospect_id=p.id and m.status='approved' and m.channel='email'
      and nullif(trim(p.email),'') is not null
      and p.status not in ('replied','positive','call_booked','audit_sold','won','lost','unsubscribed')
      and not exists(select 1 from growth.suppression s where lower(s.email)=lower(p.email))
    returning m.prospect_id into v_prospect;
   return jsonb_build_object('claimed',v_prospect is not null,'reason',case when v_prospect is null then 'not_eligible' else null end);
  when 'mark_sent' then
   v_id := (p_payload->>'id')::uuid;
   update growth.outreach_messages set status='sent',sent_at=now(),provider_message_id=nullif(p_payload->>'provider_message_id',''),error=null where id=v_id and status='sending' returning prospect_id into v_prospect;
   if v_prospect is null then raise exception 'Claimed message not found' using errcode='P0002'; end if;
   update growth.prospects set status='contacted',last_contacted_at=now() where id=v_prospect;
   v_result:=jsonb_build_object('ok',true);
  when 'mark_failed' then
   v_id := (p_payload->>'id')::uuid;
   update growth.outreach_messages set status='failed',error=left(coalesce(p_payload->>'error','Delivery failed'),300) where id=v_id and status='sending';
   get diagnostics v_count=row_count; v_result:=jsonb_build_object('ok',v_count=1);
  when 'mark_cancelled' then
   v_id := (p_payload->>'id')::uuid;
   update growth.outreach_messages set status='cancelled' where id=v_id and status in ('approved','sending');
   get diagnostics v_count=row_count; v_result:=jsonb_build_object('ok',v_count=1);
  when 'activity' then
   insert into growth.activity_log(actor,action,detail) values('cron','send',coalesce(p_payload,'{}'::jsonb));
   v_result:=jsonb_build_object('ok',true);
  else raise exception 'Unsupported cron action' using errcode='22023';
 end case;
 return coalesce(v_result,'{}'::jsonb);
end; $$;
revoke all on function public.growth_cron_api(text,jsonb) from public,anon,authenticated;
grant execute on function public.growth_cron_api(text,jsonb) to service_role;