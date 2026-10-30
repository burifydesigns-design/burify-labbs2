-- Website enquiries are written atomically to both the contact inbox and sales pipeline.
alter table public.contact_submissions
  add column if not exists source text not null default 'website',
  add column if not exists landing_page text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists consent_at timestamptz,
  add column if not exists consent_text text;

alter table public.contact_submissions
  drop constraint if exists contact_submissions_source_check;
alter table public.contact_submissions
  add constraint contact_submissions_source_check check (source in ('website','referral','linkedin','email','other'));
alter table public.contact_submissions
  add constraint contact_submissions_landing_page_length check (landing_page is null or char_length(landing_page) <= 2048),
  add constraint contact_submissions_referrer_length check (referrer is null or char_length(referrer) <= 2048),
  add constraint contact_submissions_utm_source_length check (utm_source is null or char_length(utm_source) <= 200),
  add constraint contact_submissions_utm_medium_length check (utm_medium is null or char_length(utm_medium) <= 200),
  add constraint contact_submissions_utm_campaign_length check (utm_campaign is null or char_length(utm_campaign) <= 200),
  add constraint contact_submissions_utm_term_length check (utm_term is null or char_length(utm_term) <= 200),
  add constraint contact_submissions_utm_content_length check (utm_content is null or char_length(utm_content) <= 200);

alter table public.leads
  add column if not exists contact_submission_id uuid references public.contact_submissions(id) on delete set null,
  add column if not exists service_interest text,
  add column if not exists message text,
  add column if not exists landing_page text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text;

alter table public.leads
  add constraint leads_contact_submission_id_unique unique (contact_submission_id),
  add constraint leads_service_interest_length check (service_interest is null or char_length(service_interest) <= 160),
  add constraint leads_message_length check (message is null or char_length(message) <= 5000),
  add constraint leads_landing_page_length check (landing_page is null or char_length(landing_page) <= 2048),
  add constraint leads_referrer_length check (referrer is null or char_length(referrer) <= 2048),
  add constraint leads_utm_source_length check (utm_source is null or char_length(utm_source) <= 200),
  add constraint leads_utm_medium_length check (utm_medium is null or char_length(utm_medium) <= 200),
  add constraint leads_utm_campaign_length check (utm_campaign is null or char_length(utm_campaign) <= 200),
  add constraint leads_utm_term_length check (utm_term is null or char_length(utm_term) <= 200),
  add constraint leads_utm_content_length check (utm_content is null or char_length(utm_content) <= 200);

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index if not exists leads_contact_submission_id_idx on public.leads (contact_submission_id);
create index if not exists leads_source_created_at_idx on public.leads (source, created_at desc);

drop policy if exists contact_public_submit on public.contact_submissions;
revoke insert on table public.contact_submissions from anon, authenticated;

create table if not exists public.contact_submission_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.contact_submission_rate_limits enable row level security;
revoke all on table public.contact_submission_rate_limits from anon, authenticated;
grant all on table public.contact_submission_rate_limits to service_role;

create or replace function public.consume_contact_rate_limit(
  p_ip_hash text, p_limit integer default 5, p_window_seconds integer default 600
)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare v_count integer;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$'
     or p_limit < 1 or p_limit > 100 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate limit arguments';
  end if;
  insert into public.contact_submission_rate_limits (ip_hash, window_started_at, request_count, updated_at)
  values (p_ip_hash, now(), 1, now())
  on conflict (ip_hash) do update
    set request_count = case
          when public.contact_submission_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
          else public.contact_submission_rate_limits.request_count + 1 end,
        window_started_at = case
          when public.contact_submission_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
          else public.contact_submission_rate_limits.window_started_at end,
        updated_at = now()
  returning request_count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.consume_contact_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_contact_rate_limit(text, integer, integer) to service_role;

create or replace function public.create_website_contact_and_lead(p_submission jsonb)
returns jsonb language plpgsql security invoker set search_path = ''
as $$
declare v_contact_id uuid; v_lead_id uuid;
begin
  if coalesce(p_submission->>'consent','false') <> 'true' then raise exception 'Consent is required'; end if;
  insert into public.contact_submissions (
    name,email,company,service_interest,message,consent,status,source,
    landing_page,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content,consent_at,consent_text
  ) values (
    p_submission->>'name',lower(p_submission->>'email'),nullif(p_submission->>'company',''),
    nullif(p_submission->>'service_interest',''),
    coalesce(nullif(p_submission->>'message',''),'Discovery call request submitted through the Burify website.'),
    true,'new','website',nullif(p_submission->>'landing_page',''),nullif(p_submission->>'referrer',''),
    nullif(p_submission->>'utm_source',''),nullif(p_submission->>'utm_medium',''),
    nullif(p_submission->>'utm_campaign',''),nullif(p_submission->>'utm_term',''),
    nullif(p_submission->>'utm_content',''),now(),
    'I agree that Burify may use my details to respond to this enquiry and arrange my discovery call.'
  ) returning id into v_contact_id;
  insert into public.leads (
    full_name,email,company,source,status,contact_submission_id,service_interest,message,
    landing_page,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content
  ) values (
    p_submission->>'name',lower(p_submission->>'email'),nullif(p_submission->>'company',''),
    'website','new',v_contact_id,nullif(p_submission->>'service_interest',''),
    coalesce(nullif(p_submission->>'message',''),'Discovery call request submitted through the Burify website.'),
    nullif(p_submission->>'landing_page',''),nullif(p_submission->>'referrer',''),
    nullif(p_submission->>'utm_source',''),nullif(p_submission->>'utm_medium',''),
    nullif(p_submission->>'utm_campaign',''),nullif(p_submission->>'utm_term',''),
    nullif(p_submission->>'utm_content','')
  ) returning id into v_lead_id;
  return jsonb_build_object('contact_submission_id',v_contact_id,'lead_id',v_lead_id);
end;
$$;
revoke all on function public.create_website_contact_and_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_website_contact_and_lead(jsonb) to service_role;
