create or replace function public.growth_update_kpi(p_actor uuid,p_metric text,p_current_value numeric)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public,growth as $$
declare v_rows integer;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and role='admin') then raise exception 'Not authorised to update Growth Engine KPIs' using errcode='42501'; end if;
 if nullif(trim(p_metric),'') is null or p_current_value is null or p_current_value<0 or p_current_value>1000000000 then raise exception 'Invalid KPI value' using errcode='22023'; end if;
 update growth.kpis set current_value=p_current_value where metric=p_metric and metric<>'Qualified conversations';
 get diagnostics v_rows=row_count;
 if v_rows=0 then raise exception 'KPI is not editable or was not found' using errcode='P0002'; end if;
 insert into growth.activity_log(actor,action,detail) values(p_actor::text,'update_kpi',jsonb_build_object('metric',p_metric,'value',p_current_value));
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.growth_update_kpi(uuid,text,numeric) from public,anon,authenticated;
grant execute on function public.growth_update_kpi(uuid,text,numeric) to service_role;