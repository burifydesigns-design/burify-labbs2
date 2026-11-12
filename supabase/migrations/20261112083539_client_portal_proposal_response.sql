create or replace function public.growth_client_proposal_response_api(p_user_id uuid,p_proposal_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client_id uuid; v_rows integer; v_code text;
begin
 if p_user_id is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_status not in ('accepted','declined') then raise exception 'Invalid proposal response' using errcode='22023'; end if;
 select p.client_id,p.proposal_code into v_client_id,v_code from growth.proposals p join growth.client_members m on m.client_id=p.client_id where p.id=p_proposal_id and m.user_id=p_user_id and m.member_role='owner';
 if v_client_id is null then raise exception 'You do not have permission to respond to this proposal' using errcode='42501'; end if;
 update growth.proposals set status=p_status,updated_at=now(),accepted_at=case when p_status='accepted' then now() else accepted_at end where id=p_proposal_id and status='sent' and (valid_until is null or valid_until>=current_date);
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Proposal is not awaiting a response or has expired' using errcode='P0002'; end if;
 insert into growth.activity_log(actor,action,detail) values(p_user_id::text,'client_proposal_response',jsonb_build_object('proposal_code',v_code,'status',p_status));
 return jsonb_build_object('ok',true,'status',p_status);
end; $$;
create or replace function public.growth_client_portal_api(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client_id uuid; v_member_role text; v_result jsonb;
begin
 if p_user_id is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select client_id,member_role into v_client_id,v_member_role from growth.client_members where user_id=p_user_id limit 1;
 if v_client_id is null then raise exception 'No client workspace is linked to this account' using errcode='42501'; end if;
 select jsonb_build_object(
  'client',(select to_jsonb(c) from growth.clients c where c.id=v_client_id),
  'member_role',v_member_role,'can_respond',v_member_role='owner',
  'tasks',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'title',t.title,'description',t.description,'status',t.status,'due_date',t.due_date) order by t.sort_order) from growth.onboarding_tasks t where t.client_id=v_client_id),'[]'::jsonb),
  'proposals',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'proposal_code',p.proposal_code,'title',p.title,'summary',p.summary,'scope',p.scope,'amount',p.amount,'currency',p.currency,'status',p.status,'valid_until',p.valid_until) order by p.created_at desc) from growth.proposals p where p.client_id=v_client_id and p.status<>'draft'),'[]'::jsonb),
  'metrics',coalesce((select jsonb_agg(jsonb_build_object('period_start',m.period_start,'enquiries',m.enquiries,'bookings',m.bookings,'no_shows',m.no_shows,'cancellations_recovered',m.cancellations_recovered,'workflow_runs',m.workflow_runs,'workflow_successes',m.workflow_successes,'avg_response_minutes',m.avg_response_minutes) order by m.period_start desc) from growth.client_metrics m where m.client_id=v_client_id),'[]'::jsonb)
 ) into v_result;
 return v_result;
end; $$;
revoke all on function public.growth_client_proposal_response_api(uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.growth_client_portal_api(uuid) from public,anon,authenticated;
grant execute on function public.growth_client_proposal_response_api(uuid,uuid,text) to service_role;
grant execute on function public.growth_client_portal_api(uuid) to service_role;