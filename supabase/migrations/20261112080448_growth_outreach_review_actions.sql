create or replace function public.growth_review_message(p_actor uuid,p_message_id uuid,p_decision text,p_subject text default null,p_body text default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to review Growth Engine drafts' using errcode='42501'; end if;
 if p_decision not in ('approve','reject') then raise exception 'Invalid review decision' using errcode='22023'; end if;
 if p_decision='approve' then
  if nullif(trim(p_subject),'') is null or length(p_subject)>200 or nullif(trim(p_body),'') is null or length(p_body)>8000 then raise exception 'A valid subject and message body are required' using errcode='22023'; end if;
  if (p_subject || p_body) ~ '\{\{[A-Za-z0-9_]+\}\}' then raise exception 'Replace all template placeholders before approval' using errcode='22023'; end if;
  update growth.outreach_messages set subject=trim(p_subject),body=trim(p_body),status='approved',approved_at=now() where id=p_message_id and status='draft';
 else update growth.outreach_messages set status='rejected' where id=p_message_id and status='draft';
 end if;
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Draft not found or already reviewed' using errcode='P0002'; end if;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'review_message',jsonb_build_object('id',p_message_id,'decision',p_decision));
 return jsonb_build_object('ok',true);
end; $$;
create or replace function public.growth_approve_ready_messages(p_actor uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to approve Growth Engine drafts' using errcode='42501'; end if;
 update growth.outreach_messages set status='approved',approved_at=now()
 where status='draft' and channel='email' and nullif(trim(subject),'') is not null and nullif(trim(body),'') is not null and not ((subject || body) ~ '\{\{[A-Za-z0-9_]+\}\}');
 get diagnostics v_rows=row_count;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'approve_ready_messages',jsonb_build_object('count',v_rows));
 return jsonb_build_object('ok',true,'count',v_rows);
end; $$;
revoke all on function public.growth_review_message(uuid,uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.growth_approve_ready_messages(uuid) from public,anon,authenticated;
grant execute on function public.growth_review_message(uuid,uuid,text,text,text) to service_role;
grant execute on function public.growth_approve_ready_messages(uuid) to service_role;