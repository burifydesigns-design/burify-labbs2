-- Tag every website enquiry with the service track it belongs to (web design vs AI automation)
-- and an optional outreach prospect reference, so replies from cold email can be matched
-- back to the prospect in the sales CRM.
alter table public.contact_submissions
  add column if not exists track text,
  add column if not exists prospect_ref text;

alter table public.leads
  add column if not exists track text,
  add column if not exists prospect_ref text;

alter table public.contact_submissions
  drop constraint if exists contact_submissions_track_check,
  drop constraint if exists contact_submissions_prospect_ref_check;
alter table public.contact_submissions
  add constraint contact_submissions_track_check check (track is null or track in ('web_design','ai_automation')),
  add constraint contact_submissions_prospect_ref_check check (prospect_ref is null or prospect_ref ~ '^[A-Za-z0-9_-]{1,64}$');

alter table public.leads
  drop constraint if exists leads_track_check,
  drop constraint if exists leads_prospect_ref_check;
alter table public.leads
  add constraint leads_track_check check (track is null or track in ('web_design','ai_automation')),
  add constraint leads_prospect_ref_check check (prospect_ref is null or prospect_ref ~ '^[A-Za-z0-9_-]{1,64}$');

create index if not exists leads_track_created_at_idx on public.leads (track, created_at desc);
create index if not exists leads_prospect_ref_idx on public.leads (prospect_ref) where prospect_ref is not null;

create or replace function public.create_website_contact_and_lead(p_submission jsonb)
returns jsonb language plpgsql security invoker set search_path = ''
as $$
declare v_contact_id uuid; v_lead_id uuid;
begin
  if coalesce(p_submission->>'consent','false') <> 'true' then raise exception 'Consent is required'; end if;
  insert into public.contact_submissions (
    name,email,company,service_interest,message,consent,status,source,
    landing_page,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content,consent_at,consent_text,
    track,prospect_ref
  ) values (
    p_submission->>'name',lower(p_submission->>'email'),nullif(p_submission->>'company',''),
    nullif(p_submission->>'service_interest',''),
    coalesce(nullif(p_submission->>'message',''),'Discovery call request submitted through the Burify website.'),
    true,'new','website',nullif(p_submission->>'landing_page',''),nullif(p_submission->>'referrer',''),
    nullif(p_submission->>'utm_source',''),nullif(p_submission->>'utm_medium',''),
    nullif(p_submission->>'utm_campaign',''),nullif(p_submission->>'utm_term',''),
    nullif(p_submission->>'utm_content',''),now(),
    'I agree that Burify may use my details to respond to this enquiry and arrange my discovery call.',
    nullif(p_submission->>'track',''),nullif(p_submission->>'prospect_ref','')
  ) returning id into v_contact_id;
  insert into public.leads (
    full_name,email,company,source,status,contact_submission_id,service_interest,message,
    landing_page,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content,
    track,prospect_ref
  ) values (
    p_submission->>'name',lower(p_submission->>'email'),nullif(p_submission->>'company',''),
    'website','new',v_contact_id,nullif(p_submission->>'service_interest',''),
    coalesce(nullif(p_submission->>'message',''),'Discovery call request submitted through the Burify website.'),
    nullif(p_submission->>'landing_page',''),nullif(p_submission->>'referrer',''),
    nullif(p_submission->>'utm_source',''),nullif(p_submission->>'utm_medium',''),
    nullif(p_submission->>'utm_campaign',''),nullif(p_submission->>'utm_term',''),
    nullif(p_submission->>'utm_content',''),
    nullif(p_submission->>'track',''),nullif(p_submission->>'prospect_ref','')
  ) returning id into v_lead_id;
  return jsonb_build_object('contact_submission_id',v_contact_id,'lead_id',v_lead_id);
end;
$$;
revoke all on function public.create_website_contact_and_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_website_contact_and_lead(jsonb) to service_role;
