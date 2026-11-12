create unique index if not exists growth_client_metrics_period_unique on growth.client_metrics(client_id,period_start);
create or replace function public.growth_client_ops_api(p_actor uuid,p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_result jsonb; v_client uuid; v_rows integer; v_code text;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised for client operations' using errcode='42501'; end if;
 case p_action
  when 'dashboard' then
   select jsonb_build_object(
    'clients',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at desc) from growth.clients c),'[]'::jsonb),
    'proposals',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'client_id',p.client_id,'client_name',c.clinic_name,'proposal_code',p.proposal_code,'title',p.title,'amount',p.amount,'currency',p.currency,'status',p.status,'valid_until',p.valid_until,'created_at',p.created_at) order by p.created_at desc) from growth.proposals p join growth.clients c on c.id=p.client_id),'[]'::jsonb),
    'tasks',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'client_id',t.client_id,'client_name',c.clinic_name,'title',t.title,'description',t.description,'status',t.status,'due_date',t.due_date,'sort_order',t.sort_order) order by c.clinic_name,t.sort_order) from growth.onboarding_tasks t join growth.clients c on c.id=t.client_id),'[]'::jsonb),
    'metrics',coalesce((select jsonb_agg(jsonb_build_object('client_id',m.client_id,'client_name',c.clinic_name,'period_start',m.period_start,'enquiries',m.enquiries,'bookings',m.bookings,'no_shows',m.no_shows,'cancellations_recovered',m.cancellations_recovered,'workflow_runs',m.workflow_runs,'workflow_successes',m.workflow_successes,'avg_response_minutes',m.avg_response_minutes) order by m.period_start desc) from growth.client_metrics m join growth.clients c on c.id=m.client_id),'[]'::jsonb)
   ) into v_result;
  when 'create_client' then
   if nullif(trim(p_payload->>'clinic_name'),'') is null or length(p_payload->>'clinic_name')>180 then raise exception 'A valid client name is required' using errcode='22023'; end if;
   if p_payload->>'package' not in ('conversion_website','patient_growth_system','recall_engine','growth_partner') then raise exception 'Invalid service package' using errcode='22023'; end if;
   insert into growth.clients(clinic_name,package,status,value,start_date,baseline,notes,contact_name,email,website)
   values(trim(p_payload->>'clinic_name'),p_payload->>'package','onboarding',nullif(p_payload->>'value','')::numeric,nullif(p_payload->>'start_date','')::date,'{}'::jsonb,nullif(p_payload->>'notes',''),nullif(p_payload->>'contact_name',''),nullif(lower(p_payload->>'email'),''),nullif(p_payload->>'website','')) returning id into v_client;
   insert into growth.onboarding_tasks(client_id,title,description,sort_order) values
    (v_client,'Kick-off and goals','Confirm objectives, stakeholders and success measures',1),(v_client,'Access and assets','Collect website, analytics, brand and platform access securely',2),(v_client,'Baseline measurement','Record current enquiry, booking and response metrics',3),(v_client,'Scope confirmation','Confirm deliverables, milestones and approvals',4),(v_client,'Build and review','Complete agreed work and client review',5),(v_client,'Launch and handover','Validate launch, train the team and document ownership',6);
   insert into growth.activity_log(actor,action,detail) values(p_actor::text,'create_client',jsonb_build_object('client_id',v_client,'clinic_name',p_payload->>'clinic_name'));
   v_result:=jsonb_build_object('ok',true,'client_id',v_client);
  when 'create_proposal' then
   v_client:=(p_payload->>'client_id')::uuid;
   if not exists(select 1 from growth.clients where id=v_client) then raise exception 'Client not found' using errcode='P0002'; end if;
   if nullif(trim(p_payload->>'title'),'') is null or length(p_payload->>'title')>200 then raise exception 'A valid proposal title is required' using errcode='22023'; end if;
   if coalesce((p_payload->>'amount')::numeric,0)<=0 or p_payload->>'currency' not in ('KES','USD') then raise exception 'Enter a valid amount and currency' using errcode='22023'; end if;
   v_code:='BUR-'||to_char(now(),'YYMM')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
   insert into growth.proposals(client_id,proposal_code,title,summary,scope,amount,currency,status,valid_until)
   values(v_client,v_code,trim(p_payload->>'title'),nullif(p_payload->>'summary',''),coalesce(p_payload->'scope','[]'::jsonb),(p_payload->>'amount')::numeric,p_payload->>'currency','draft',nullif(p_payload->>'valid_until','')::date);
   insert into growth.activity_log(actor,action,detail) values(p_actor::text,'create_proposal',jsonb_build_object('client_id',v_client,'proposal_code',v_code));
   v_result:=jsonb_build_object('ok',true,'proposal_code',v_code);
  when 'update_onboarding' then
   if p_payload->>'status' not in ('todo','in_progress','done','blocked') then raise exception 'Invalid onboarding status' using errcode='22023'; end if;
   update growth.onboarding_tasks set status=p_payload->>'status',completed_at=case when p_payload->>'status'='done' then now() else null end,updated_at=now() where id=(p_payload->>'id')::uuid;
   get diagnostics v_rows=row_count; if v_rows=0 then raise exception 'Onboarding task not found' using errcode='P0002'; end if;
   v_result:=jsonb_build_object('ok',true);
  when 'save_metrics' then
   v_client:=(p_payload->>'client_id')::uuid;
   if not exists(select 1 from growth.clients where id=v_client) then raise exception 'Client not found' using errcode='P0002'; end if;
   insert into growth.client_metrics(client_id,period_start,enquiries,avg_response_minutes,bookings,no_shows,cancellations_recovered,workflow_runs,workflow_successes)
   values(v_client,(p_payload->>'period_start')::date,greatest(0,coalesce((p_payload->>'enquiries')::integer,0)),nullif(p_payload->>'avg_response_minutes','')::numeric,greatest(0,coalesce((p_payload->>'bookings')::integer,0)),greatest(0,coalesce((p_payload->>'no_shows')::integer,0)),greatest(0,coalesce((p_payload->>'cancellations_recovered')::integer,0)),greatest(0,coalesce((p_payload->>'workflow_runs')::integer,0)),greatest(0,coalesce((p_payload->>'workflow_successes')::integer,0)))
   on conflict(client_id,period_start) do update set enquiries=excluded.enquiries,avg_response_minutes=excluded.avg_response_minutes,bookings=excluded.bookings,no_shows=excluded.no_shows,cancellations_recovered=excluded.cancellations_recovered,workflow_runs=excluded.workflow_runs,workflow_successes=excluded.workflow_successes;
   v_result:=jsonb_build_object('ok',true);
  when 'link_member' then
   v_client:=(p_payload->>'client_id')::uuid;
   if not exists(select 1 from growth.clients where id=v_client) then raise exception 'Client not found' using errcode='P0002'; end if;
   insert into growth.client_members(client_id,user_id,member_role) values(v_client,(p_payload->>'user_id')::uuid,coalesce(nullif(p_payload->>'member_role',''),'owner')) on conflict(client_id,user_id) do update set member_role=excluded.member_role;
   v_result:=jsonb_build_object('ok',true);
  else raise exception 'Unsupported client operation' using errcode='22023';
 end case;
 return coalesce(v_result,'{}'::jsonb);
end; $$;
create or replace function public.growth_client_portal_api(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client_id uuid; v_result jsonb;
begin
 if p_user_id is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select client_id into v_client_id from growth.client_members where user_id=p_user_id limit 1;
 if v_client_id is null then raise exception 'No client workspace is linked to this account' using errcode='42501'; end if;
 select jsonb_build_object(
  'client',(select to_jsonb(c) from growth.clients c where c.id=v_client_id),
  'tasks',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'title',t.title,'description',t.description,'status',t.status,'due_date',t.due_date) order by t.sort_order) from growth.onboarding_tasks t where t.client_id=v_client_id),'[]'::jsonb),
  'proposals',coalesce((select jsonb_agg(jsonb_build_object('proposal_code',p.proposal_code,'title',p.title,'summary',p.summary,'scope',p.scope,'amount',p.amount,'currency',p.currency,'status',p.status,'valid_until',p.valid_until) order by p.created_at desc) from growth.proposals p where p.client_id=v_client_id and p.status<>'draft'),'[]'::jsonb),
  'metrics',coalesce((select jsonb_agg(jsonb_build_object('period_start',m.period_start,'enquiries',m.enquiries,'bookings',m.bookings,'no_shows',m.no_shows,'cancellations_recovered',m.cancellations_recovered,'workflow_runs',m.workflow_runs,'workflow_successes',m.workflow_successes,'avg_response_minutes',m.avg_response_minutes) order by m.period_start desc) from growth.client_metrics m where m.client_id=v_client_id),'[]'::jsonb)
 ) into v_result;
 return v_result;
end; $$;
revoke all on function public.growth_client_ops_api(uuid,text,jsonb) from public,anon,authenticated;
revoke all on function public.growth_client_portal_api(uuid) from public,anon,authenticated;
grant execute on function public.growth_client_ops_api(uuid,text,jsonb) to service_role;
grant execute on function public.growth_client_portal_api(uuid) to service_role;