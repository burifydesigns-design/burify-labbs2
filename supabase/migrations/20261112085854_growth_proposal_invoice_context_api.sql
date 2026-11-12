create or replace function public.growth_proposal_invoice_context_api(p_actor uuid,p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_result jsonb;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to create proposal invoices' using errcode='42501'; end if;
 select jsonb_build_object(
  'proposal',jsonb_build_object('id',p.id,'client_id',p.client_id,'title',p.title,'summary',p.summary,'amount',p.amount,'currency',p.currency,'status',p.status,'invoice_id',p.invoice_id),
  'client',jsonb_build_object('clinic_name',c.clinic_name,'contact_name',c.contact_name,'email',c.email)
 ) into v_result from growth.proposals p join growth.clients c on c.id=p.client_id where p.id=p_proposal_id;
 if v_result is null then raise exception 'Proposal or client not found' using errcode='P0002'; end if;
 return v_result;
end; $$;
create or replace function public.growth_proposal_invoice_status_api(p_actor uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_result jsonb;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to read proposal invoice status' using errcode='42501'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'invoice_id',p.invoice_id)),'[]'::jsonb) into v_result from growth.proposals p;
 return v_result;
end; $$;
revoke all on function public.growth_proposal_invoice_context_api(uuid,uuid) from public,anon,authenticated;
revoke all on function public.growth_proposal_invoice_status_api(uuid) from public,anon,authenticated;
grant execute on function public.growth_proposal_invoice_context_api(uuid,uuid) to service_role;
grant execute on function public.growth_proposal_invoice_status_api(uuid) to service_role;