create or replace function public.growth_update_proposal_status(p_actor uuid,p_proposal_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to update proposals' using errcode='42501'; end if;
 if p_status not in ('sent','accepted','declined','expired') then raise exception 'Invalid proposal status' using errcode='22023'; end if;
 update growth.proposals set status=p_status,updated_at=now(),sent_at=case when p_status='sent' then coalesce(sent_at,now()) else sent_at end,accepted_at=case when p_status='accepted' then coalesce(accepted_at,now()) else accepted_at end where id=p_proposal_id and status in ('draft','sent');
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Proposal not found or no longer editable' using errcode='P0002'; end if;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'update_proposal_status',jsonb_build_object('proposal_id',p_proposal_id,'status',p_status));
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.growth_update_proposal_status(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.growth_update_proposal_status(uuid,uuid,text) to service_role;