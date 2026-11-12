create or replace function public.growth_client_portal_api(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client_id uuid; v_member_role text; v_result jsonb;
begin
 if p_user_id is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select client_id,member_role into v_client_id,v_member_role from growth.client_members where user_id=p_user_id limit 1;
 if v_client_id is null then raise exception 'No client workspace is linked to this account' using errcode='42501'; end if;
 select jsonb_build_object(
  'client',(select jsonb_build_object('clinic_name',c.clinic_name,'package',c.package,'status',c.status,'start_date',c.start_date,'website',c.website) from growth.clients c where c.id=v_client_id),
  'member_role',v_member_role,'can_respond',v_member_role='owner',
  'tasks',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'title',t.title,'description',t.description,'status',t.status,'due_date',t.due_date) order by t.sort_order) from growth.onboarding_tasks t where t.client_id=v_client_id),'[]'::jsonb),
  'proposals',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'proposal_code',p.proposal_code,'title',p.title,'summary',p.summary,'scope',p.scope,'amount',p.amount,'currency',p.currency,'status',p.status,'valid_until',p.valid_until) order by p.created_at desc) from growth.proposals p where p.client_id=v_client_id and p.status<>'draft'),'[]'::jsonb),
  'metrics',coalesce((select jsonb_agg(jsonb_build_object('period_start',m.period_start,'enquiries',m.enquiries,'bookings',m.bookings,'no_shows',m.no_shows,'cancellations_recovered',m.cancellations_recovered,'workflow_runs',m.workflow_runs,'workflow_successes',m.workflow_successes,'avg_response_minutes',m.avg_response_minutes) order by m.period_start desc) from growth.client_metrics m where m.client_id=v_client_id),'[]'::jsonb)
 ) into v_result;
 return v_result;
end; $$;
revoke all on function public.growth_client_portal_api(uuid) from public,anon,authenticated;
grant execute on function public.growth_client_portal_api(uuid) to service_role;