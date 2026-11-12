alter table public.notion_crm_leads add column if not exists lead_score integer not null default 0 check(lead_score between 0 and 100);
alter table public.notion_crm_leads add column if not exists score_updated_at timestamptz;
create or replace function public.set_notion_crm_lead_score()
returns trigger language plpgsql set search_path=pg_catalog,public as $$
declare v_score integer:=0;
begin
 v_score:=v_score+case new.icp_fit when 'primary_dental' then 40 when 'secondary_medical' then 28 when 'outside_current_icp' then 0 else 10 end;
 v_score:=v_score+case new.market_scope when 'international' then 20 when 'local_excluded' then -60 else 0 end;
 if nullif(trim(coalesce(new.website,'')),'') is not null then v_score:=v_score+10; end if;
 if nullif(trim(coalesce(new.email,'')),'') is not null then v_score:=v_score+10; end if;
 if nullif(trim(coalesce(new.personalization,'')),'') is not null then v_score:=v_score+10; end if;
 v_score:=v_score+case lower(coalesce(new.problem_severity,'')) when 'high' then 10 when 'medium' then 6 when 'low' then 3 else 0 end;
 if lower(coalesce(new.status,'')) in ('positive reply','sales conversation','proposal sent','negotiation','won') then v_score:=v_score+5; end if;
 if coalesce(new.outreach_suppressed,false) or new.market_scope='local_excluded' then v_score:=0; end if;
 new.lead_score:=greatest(0,least(100,v_score)); new.score_updated_at:=now(); return new;
end; $$;
drop trigger if exists notion_crm_lead_score_trigger on public.notion_crm_leads;
create trigger notion_crm_lead_score_trigger before insert or update of icp_fit,market_scope,website,email,personalization,problem_severity,status,outreach_suppressed on public.notion_crm_leads for each row execute function public.set_notion_crm_lead_score();
update public.notion_crm_leads set lead_score=0;