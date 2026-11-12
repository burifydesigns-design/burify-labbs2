alter table growth.proposals add column if not exists invoice_creation_started_at timestamptz;
create or replace function public.growth_claim_proposal_invoice(p_actor uuid,p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_client uuid;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to create proposal invoices' using errcode='42501'; end if;
 update growth.proposals set invoice_creation_started_at=now(),updated_at=now()
  where id=p_proposal_id and status='accepted' and invoice_id is null
    and (invoice_creation_started_at is null or invoice_creation_started_at<now()-interval '15 minutes')
  returning client_id into v_client;
 if v_client is null then return jsonb_build_object('claimed',false,'reason','not_accepted_or_already_invoiced'); end if;
 return jsonb_build_object('claimed',true,'client_id',v_client);
end; $$;
create or replace function public.growth_link_proposal_invoice(p_actor uuid,p_proposal_id uuid,p_invoice_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to link proposal invoices' using errcode='42501'; end if;
 update growth.proposals set invoice_id=p_invoice_id,invoice_creation_started_at=null,updated_at=now()
  where id=p_proposal_id and status='accepted' and invoice_id is null and invoice_creation_started_at>=now()-interval '15 minutes';
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'Proposal invoice claim expired or proposal already invoiced' using errcode='P0002'; end if;
 return jsonb_build_object('ok',true);
end; $$;
create or replace function public.growth_release_proposal_invoice_claim(p_actor uuid,p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to release proposal invoice claim' using errcode='42501'; end if;
 update growth.proposals set invoice_creation_started_at=null,updated_at=now() where id=p_proposal_id and invoice_id is null;
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.growth_claim_proposal_invoice(uuid,uuid) from public,anon,authenticated;
revoke all on function public.growth_link_proposal_invoice(uuid,uuid,uuid) from public,anon,authenticated;
revoke all on function public.growth_release_proposal_invoice_claim(uuid,uuid) from public,anon,authenticated;
grant execute on function public.growth_claim_proposal_invoice(uuid,uuid) to service_role;
grant execute on function public.growth_link_proposal_invoice(uuid,uuid,uuid) to service_role;
grant execute on function public.growth_release_proposal_invoice_claim(uuid,uuid) to service_role;