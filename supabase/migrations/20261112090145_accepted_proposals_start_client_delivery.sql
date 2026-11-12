create or replace function public.growth_client_proposal_response_api(p_user_id uuid,p_proposal_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client_id uuid; v_rows integer; v_code text;
begin
 if p_user_id is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_status not in ('accepted','declined') then raise exception 'Invalid proposal response' using errcode='22023'; end if;
 select p.client_id,p.proposal_code into v_client_id,v_code from growth.proposals p join growth.client_members m on m.client_id=p.client_id where p.id=p_proposal_id and m.user_id=p_user_id and m.member_role='owner';
 if v_client_id is null then raise exception 'You do not have permission to respond to this proposal' using errcode='42501'; end if;
 update growth.proposals set status=p_status,updated_at=now(),accepted_at=case when p_status='accepted' then now() else accepted_at end
  where id=p_proposal_id and status='sent' and (valid_until is null or valid_until>=current_date);
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Proposal is not awaiting a response or has expired' using errcode='P0002'; end if;
 if p_status='accepted' then update growth.clients set status='building',updated_at=now() where id=v_client_id and status='onboarding'; end if;
 insert into growth.activity_log(actor,action,detail) values(p_user_id::text,'client_proposal_response',jsonb_build_object('proposal_code',v_code,'status',p_status));
 return jsonb_build_object('ok',true,'status',p_status);
end; $$;
revoke all on function public.growth_client_proposal_response_api(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.growth_client_proposal_response_api(uuid,uuid,text) to service_role;