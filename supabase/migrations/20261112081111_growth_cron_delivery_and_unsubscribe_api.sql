create or replace function public.growth_cron_api(p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_result jsonb; v_count integer; v_id uuid; v_prospect uuid;
begin
 case p_action
  when 'queue' then
   select coalesce(jsonb_object_agg(s.key,s.value),'{}'::jsonb) into v_result from growth.settings s;
   if coalesce(v_result->>'sending_enabled','false')<>'true' or nullif(v_result->>'sender_name','') is null or nullif(v_result->>'postal_address','') is null then
    return jsonb_build_object('settings',coalesce(v_result,'{}'::jsonb),'sent_today',0,'messages','[]'::jsonb,'skipped','Sending is disabled or sender details are incomplete.');
   end if;
   select count(*) into v_count from growth.outreach_messages where status='sent' and sent_at>=((date_trunc('day',now() at time zone 'Africa/Nairobi')) at time zone 'Africa/Nairobi');
   select jsonb_build_object('settings',v_result,'sent_today',v_count,'messages',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'prospect_id',p.id,'email',p.email,'clinic_name',p.clinic_name,'subject',m.subject,'body',m.body,'step_number',m.step_number,'sequence_id',m.sequence_id) order by m.approved_at,m.created_at) from (select * from growth.outreach_messages where status='approved' and channel='email' order by approved_at,created_at limit greatest(0,least(100,coalesce((v_result->>'daily_send_cap')::integer,30)-v_count))) m join growth.prospects p on p.id=m.prospect_id where nullif(trim(p.email),'') is not null and p.status not in ('replied','positive','call_booked','audit_sold','won','lost','unsubscribed') and not exists(select 1 from growth.suppression s where lower(s.email)=lower(p.email))),'[]'::jsonb)) into v_result;
  when 'mark_sent' then
   v_id:=(p_payload->>'id')::uuid;
   update growth.outreach_messages set status='sent',sent_at=now(),provider_message_id=nullif(p_payload->>'provider_message_id',''),error=null where id=v_id and status='approved' returning prospect_id into v_prospect;
   if v_prospect is null then raise exception 'Approved message not found' using errcode='P0002'; end if;
   update growth.prospects set status='contacted',last_contacted_at=now() where id=v_prospect;
   v_result:=jsonb_build_object('ok',true);
  when 'mark_failed' then
   v_id:=(p_payload->>'id')::uuid;
   update growth.outreach_messages set status='failed',error=left(coalesce(p_payload->>'error','Delivery failed'),300) where id=v_id and status='approved';
   get diagnostics v_count=row_count; v_result:=jsonb_build_object('ok',v_count=1);
  when 'mark_cancelled' then
   v_id:=(p_payload->>'id')::uuid;
   update growth.outreach_messages set status='cancelled' where id=v_id and status='approved';
   v_result:=jsonb_build_object('ok',true);
  when 'activity' then
   insert into growth.activity_log(actor,action,detail) values('cron','send',coalesce(p_payload,'{}'::jsonb));
   v_result:=jsonb_build_object('ok',true);
  else raise exception 'Unsupported cron action' using errcode='22023';
 end case;
 return coalesce(v_result,'{}'::jsonb);
end; $$;
create or replace function public.growth_unsubscribe_api(p_email text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_email text:=lower(trim(p_email)); v_count integer;
begin
 if v_email is null or length(v_email)>254 or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid email' using errcode='22023'; end if;
 insert into growth.suppression(email,reason) values(v_email,'unsubscribed') on conflict(email) do update set reason='unsubscribed';
 update growth.prospects set status='unsubscribed' where lower(email)=v_email;
 update growth.outreach_messages set status='cancelled' where status in ('draft','approved') and prospect_id in (select id from growth.prospects where lower(email)=v_email);
 get diagnostics v_count=row_count;
 return jsonb_build_object('ok',true,'cancelled',v_count);
end; $$;
revoke all on function public.growth_cron_api(text,jsonb) from public,anon,authenticated;
revoke all on function public.growth_unsubscribe_api(text) from public,anon,authenticated;
grant execute on function public.growth_cron_api(text,jsonb) to service_role;
grant execute on function public.growth_unsubscribe_api(text) to service_role;