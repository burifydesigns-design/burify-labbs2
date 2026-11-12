create or replace function public.growth_generate_drafts(p_actor uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_count integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to generate Growth Engine drafts' using errcode='42501'; end if;
 with eligible as (
  select p.id,p.clinic_name,p.contact_name,p.email,p.personalization_note from growth.prospects p
  where p.status in ('new','queued') and nullif(trim(p.email),'') is not null
  and not exists(select 1 from growth.outreach_messages m where m.prospect_id=p.id and m.step_number=1)
  order by p.score desc,p.created_at asc limit 50
 ), inserted as (
  insert into growth.outreach_messages(prospect_id,step_number,channel,subject,body,status)
  select e.id,1,'email','A practical growth idea for '||e.clinic_name,
   'Hello '||coalesce(nullif(trim(e.contact_name),''),'there')||E',\n\nI’m reaching out from Burify. We help dental and private healthcare practices improve website conversion, local visibility and enquiry follow-up.\n\n'||case when nullif(trim(e.personalization_note),'') is not null then 'I thought this may be relevant to your practice: '||left(trim(e.personalization_note),700)||E'.\n\n' else '' end||'If this is a priority, I can share a few practical ideas tailored to your practice. Would you be open to a short conversation?\n\nRegards,\nBurify Solutions','draft'
  from eligible e returning id
 ) select count(*) into v_count from inserted;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'generate_drafts',jsonb_build_object('count',v_count));
 return jsonb_build_object('ok',true,'count',v_count);
end; $$;
create or replace function public.growth_mark_replied(p_actor uuid,p_message_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_prospect uuid; v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to update outreach' using errcode='42501'; end if;
 update growth.outreach_messages set replied_at=coalesce(replied_at,now()) where id=p_message_id and status='sent' returning prospect_id into v_prospect;
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Sent message not found' using errcode='P0002'; end if;
 update growth.prospects set status='replied' where id=v_prospect;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'mark_replied',jsonb_build_object('message_id',p_message_id,'prospect_id',v_prospect));
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.growth_generate_drafts(uuid) from public,anon,authenticated;
revoke all on function public.growth_mark_replied(uuid,uuid) from public,anon,authenticated;
grant execute on function public.growth_generate_drafts(uuid) to service_role;
grant execute on function public.growth_mark_replied(uuid,uuid) to service_role;