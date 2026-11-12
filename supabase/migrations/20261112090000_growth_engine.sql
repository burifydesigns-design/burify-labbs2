-- Burify Labs growth engine: 90-day clinic growth plan, outreach approval queue and scorecard.
-- Builds on public.notion_crm_leads (prospects) and private.is_admin() (access control).

create table if not exists public.growth_plan_tasks (
  id serial primary key,
  week int not null check (week between 1 and 12),
  day_index int not null check (day_index between 1 and 5),
  day_name text not null,
  title text not null,
  description text,
  category text not null default 'general',
  automation text not null default 'manual' check (automation in ('auto','approve','manual')),
  status text not null default 'todo' check (status in ('todo','in_progress','done','skipped')),
  due_date date,
  completed_at timestamptz,
  notes text,
  unique (week, day_index)
);

create table if not exists public.growth_kpis (
  id serial primary key,
  category text not null,
  metric text not null,
  target_label text not null,
  target_value numeric,
  unit text,
  higher_is_better boolean not null default true,
  unique (category, metric)
);

create table if not exists public.growth_sequences (
  id serial primary key,
  name text not null unique,
  description text,
  active boolean not null default true
);

create table if not exists public.growth_sequence_steps (
  id serial primary key,
  sequence_id int not null references public.growth_sequences(id) on delete cascade,
  step_number int not null,
  delay_days int not null default 0,
  subject_template text not null,
  body_template text not null,
  unique (sequence_id, step_number)
);

create table if not exists public.growth_outreach_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.notion_crm_leads(id) on delete cascade,
  sequence_id int references public.growth_sequences(id),
  step_number int not null default 1,
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft','approved','sent','failed','rejected','cancelled')),
  approved_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  error text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  unique (lead_id, sequence_id, step_number)
);
create index if not exists growth_outreach_status_idx on public.growth_outreach_messages (status, approved_at);
create index if not exists growth_outreach_lead_idx on public.growth_outreach_messages (lead_id);
create index if not exists growth_outreach_sequence_idx on public.growth_outreach_messages (sequence_id);

create table if not exists public.growth_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_suppression (
  email text primary key,
  reason text not null default 'unsubscribed',
  created_at timestamptz not null default now()
);

create table if not exists public.growth_activity_log (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor text not null default 'system',
  action text not null,
  detail jsonb
);

do $$
declare t text;
begin
  foreach t in array array['growth_plan_tasks','growth_kpis','growth_sequences','growth_sequence_steps','growth_outreach_messages','growth_settings','growth_suppression','growth_activity_log']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_manage', t);
    execute format('create policy %I on public.%I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t || '_admin_manage', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
grant usage, select on all sequences in schema public to authenticated;

-- 90-day plan (starts Monday 16 Nov 2026)
insert into public.growth_plan_tasks (week, day_index, day_name, title, description, category, automation, due_date)
select v.week, v.day_index, v.day_name, v.title, v.description, v.category, v.automation,
       date '2026-11-16' + ((v.week-1)*7 + (v.day_index-1))
from (values
(1,1,'Monday','Define the dental/medical beachhead and ICP','Pick one initial focus (private dental practices with implants, aligners, cosmetic). One-page ICP: practice type, location, chairs, lead sources, reception capacity, systems, main bottleneck.','strategy','manual'),
(1,2,'Tuesday','Create positioning and offer ladder','Write the positioning statement. Define Conversion Website, Patient Growth System (flagship) and Patient Growth Partner with outcome, deliverables, exclusions, starting price.','offer','manual'),
(1,3,'Wednesday','Build the Patient Growth Audit','Paid discovery at $990 + GST, credited toward the system within 30 days. Deliverables: workflow audit, lead-leakage map, automation opportunities, integration plan, privacy checklist, fixed-scope proposal.','offer','approve'),
(1,4,'Thursday','Create the patient workflow demo','Build or storyboard the dental workflow: enquiry, instant response, qualification, CRM record, team notification, booking link, escalation path.','demo','manual'),
(1,5,'Friday','Build the outbound prospect list','50-100 dental and medical clinics. Prioritise active Google presence, paid ads, multiple locations, booking gaps. Add contact, role, website, lead source, personalisation note.','outreach','auto'),
(2,1,'Monday','Write outreach sequences','Primary cold email, two follow-ups, LinkedIn connection message, voicemail script. One problem only: missed or delayed patient enquiries.','outreach','approve'),
(2,2,'Tuesday','Create the booking and qualification flow','Calendar booking page with qualifying questions: practice type, locations, lead sources, reception capacity, CRM, main bottleneck.','sales','manual'),
(2,3,'Wednesday','Create the Patient Leakage Audit lead magnet','One-page checklist or scorecard showing where enquiries are lost. Use in outreach and on the website.','content','approve'),
(2,4,'Thursday','Launch the first outreach batch','Send 25-35 highly personalised emails. Track opens, replies, positive replies, objections, booked calls. Do not send large volumes before validating the message.','outreach','approve'),
(2,5,'Friday','Review responses and refine messaging','Analyse which subject lines, hooks and personalisation points get replies. Update the sequence based on real objections.','outreach','auto'),
(3,1,'Monday','Audit the current Burify website','Review homepage, service pages, portfolio, contact flow, booking flow, proof. Identify gaps in clarity, credibility and conversion paths.','website','manual'),
(3,2,'Tuesday','Rewrite the homepage around clinics','Message: More booked appointments, less front-desk admin. Lead with the outcome, not the technology.','website','manual'),
(3,3,'Wednesday','Build the Patient Growth System service page','Patient journey, deliverables, compliance boundaries, implementation process, expected outcomes.','website','manual'),
(3,4,'Thursday','Create the Patient Growth Audit page','Who it is for, what is included, what the clinic receives, price, booking CTA.','website','manual'),
(3,5,'Friday','Add proof and case-study framework','Turn the existing n8n real-estate workflow into a case study (problem, workflow, result, before/after). Create a reusable template.','website','manual'),
(4,1,'Monday','Document the standard patient journey','Map the ideal clinic workflow: enquiry, response, qualification, CRM update, routing, booking, reminders, cancellation recovery, review request.','automation_build','manual'),
(4,2,'Tuesday','Build the enquiry intake template','Reusable intake form and workflow capturing patient type, location, preferred times, treatment interest, contact preference.','automation_build','manual'),
(4,3,'Wednesday','Build the instant-response workflow','Immediate acknowledgement and booking path. Urgent or complex enquiries escalate to a human.','automation_build','manual'),
(4,4,'Thursday','Build CRM and routing workflows','Templates for CRM record creation, tagging, lead-source tracking, owner assignment, team notification.','automation_build','manual'),
(4,5,'Friday','Test the end-to-end workflow','Test new patient, existing patient, urgent, after-hours, invalid data and booking request paths. Document failures and fixes.','automation_build','manual'),
(5,1,'Monday','Create a campaign-specific landing page','Focused dental clinic landing page: Turn more patient enquiries into booked appointments. Audit offer, demo, proof, booking CTA.','website','manual'),
(5,2,'Tuesday','Create targeted outreach lists','Three segments: high-value dental clinics, multi-location groups, clinics running paid ads. Personalise the first line per segment.','outreach','auto'),
(5,3,'Wednesday','Launch 50 personalised emails','Controlled batch with tailored first lines. Track replies and booked calls, not vanity metrics.','outreach','approve'),
(5,4,'Thursday','Follow up with non-responders','First follow-up to non-responders. Short, references the original problem.','outreach','approve'),
(5,5,'Friday','Review campaign performance','Reply rate, positive-reply rate, meeting-booked rate, objections. Update messaging, targeting and offer.','outreach','auto'),
(6,1,'Monday','Publish the first LinkedIn post','Post on missed after-hours enquiries and the cost of slow response, with a clinic-relevant observation.','content','approve'),
(6,2,'Tuesday','Create a short demo video','60-90 second walkthrough of the patient enquiry workflow. Focus on outcome: faster response, cleaner CRM data, more bookings.','content','manual'),
(6,3,'Wednesday','Publish the Patient Leakage Audit','Publish the lead magnet on the website, LinkedIn and outreach follow-ups.','content','approve'),
(6,4,'Thursday','Create a case-study outline','Framework to complete after each client project: baseline, workflow, implementation, results, client quote.','content','approve'),
(6,5,'Friday','Engage with 20 clinic decision-makers','Comment thoughtfully on posts from practice owners, dental groups and healthcare marketers. Build visibility before pitching.','content','manual'),
(7,1,'Monday','Review the first sales conversations','Identify recurring objections, questions and buying triggers. Update the sales script and proposal.','sales','manual'),
(7,2,'Tuesday','Create the proposal template','Problem, recommended system, deliverables, timeline, investment, exclusions, next steps.','sales','approve'),
(7,3,'Wednesday','Create the onboarding checklist','What Burify needs from the clinic: system access, brand assets, lead sources, approval contacts, compliance requirements, reporting baseline.','delivery','approve'),
(7,4,'Thursday','Create the implementation timeline','Standard 3-6 week delivery plan with milestones, client responsibilities and acceptance criteria.','delivery','approve'),
(7,5,'Friday','Refine the offer based on feedback','Adjust Patient Growth System scope, pricing and positioning based on what prospects actually value.','offer','manual'),
(8,1,'Monday','Define the Patient Growth Partner tiers','Three retainer levels by number of workflows, integrations, support level, reporting, lead volume.','retainer','approve'),
(8,2,'Tuesday','Create the monthly reporting template','Report showing enquiries, response time, bookings, no-shows, cancellations recovered, workflow performance.','retainer','approve'),
(8,3,'Wednesday','Create the optimisation roadmap','Quarterly roadmap template identifying the next automation opportunity after the system goes live.','retainer','approve'),
(8,4,'Thursday','Create the maintenance checklist','Recurring checks: workflow failures, API/token issues, consent settings, data quality, message templates, escalation paths.','retainer','approve'),
(8,5,'Friday','Package the retainer offer','One-page retainer proposal that makes ongoing optimisation feel essential.','retainer','approve'),
(9,1,'Monday','Identify referral partners','List dental consultants, practice managers, healthcare marketers, web designers, practice-management software providers.','partners','auto'),
(9,2,'Tuesday','Create a partner pitch','How Burify helps their clients improve patient acquisition and front-desk efficiency without replacing their core service.','partners','approve'),
(9,3,'Wednesday','Create a referral incentive','Simple arrangement: referral fee, reciprocal introduction or co-marketing.','partners','manual'),
(9,4,'Thursday','Contact 20 potential partners','Personalised partnership messages focused on mutual client value.','partners','approve'),
(9,5,'Friday','Follow up and schedule conversations','Follow up with interested partners and book introductory calls.','partners','manual'),
(10,1,'Monday','Kick off the first Patient Growth System','Structured kickoff call, confirm scope, collect access, establish success metrics.','delivery','manual'),
(10,2,'Tuesday','Map the client current patient journey','Document every step from first enquiry to booked appointment, including delays, manual steps and data gaps.','delivery','manual'),
(10,3,'Wednesday','Build the first workflow','Highest-value workflow first: instant response, qualification, CRM update, team notification.','delivery','manual'),
(10,4,'Thursday','Test and refine','End-to-end tests, edge cases, urgent enquiries escalate correctly.','delivery','manual'),
(10,5,'Friday','Train the clinic team','Short training session and a one-page SOP for staff.','delivery','manual'),
(11,1,'Monday','Establish reporting baselines','Dashboard tracks enquiries, response time, bookings, no-shows and workflow reliability from launch.','reporting','auto'),
(11,2,'Tuesday','Review early performance','Identify bottlenecks, failed messages, low-quality leads and workflow gaps.','reporting','auto'),
(11,3,'Wednesday','Optimise the patient journey','Improve messaging, qualification questions, routing rules and booking handoffs from early data.','delivery','manual'),
(11,4,'Thursday','Create the first case study','Baseline, implementation, early results and business impact.','content','approve'),
(11,5,'Friday','Present results and propose the retainer','Show what is working, what can improve, and how the Patient Growth Partner retainer protects and expands the system.','retainer','manual'),
(12,1,'Monday','Review the full 90-day performance','Leads, calls, audits sold, projects won, revenue, delivery time, margins, client outcomes.','reporting','auto'),
(12,2,'Tuesday','Double down on the winning niche','Identify the highest-converting clinic segment and double outreach and content there.','strategy','auto'),
(12,3,'Wednesday','Systemise the sales process','Turn best-performing outreach, proposal, demo and onboarding materials into reusable templates.','sales','manual'),
(12,4,'Thursday','Systemise delivery','Document the repeatable build process, QA checklist, client training and reporting workflow.','delivery','manual'),
(12,5,'Friday','Plan the next 90 days','Set targets for revenue, retainers, case studies, partnerships and productised offers.','strategy','manual')
) as v(week, day_index, day_name, title, description, category, automation)
on conflict (week, day_index) do nothing;

insert into public.growth_kpis (category, metric, target_label, target_value, unit, higher_is_better) values
('Commercial','Qualified conversations','50+',50,'count',true),
('Commercial','Patient Growth Audits sold','8-12',8,'count',true),
('Commercial','Patient Growth Systems sold','3-5',3,'count',true),
('Commercial','Retainer conversion rate','50%+ of completed builds',50,'%',true),
('Delivery','Average lead response time','Under 5 minutes',5,'minutes',false),
('Delivery','Automation reliability','95%+ successful runs',95,'%',true)
on conflict (category, metric) do nothing;

insert into public.growth_settings (key, value) values
('sending_enabled', 'false'::jsonb),
('daily_send_cap', '30'::jsonb),
('sender_name', '""'::jsonb),
('postal_address', '""'::jsonb)
on conflict (key) do nothing;

insert into public.growth_sequences (name, description)
values ('Dental clinics - missed enquiries', 'Primary cold sequence: one problem, missed or delayed patient enquiries. Variables: first_name, clinic_name, personalization, sender_name.')
on conflict (name) do nothing;

insert into public.growth_sequence_steps (sequence_id, step_number, delay_days, subject_template, body_template)
select s.id, v.step_number, v.delay_days, v.subject, v.body
from public.growth_sequences s,
(values
(1, 0, 'Quick question about {{clinic_name}} after-hours enquiries',
E'Hi {{first_name}},\n\n{{personalization}}\n\nMost clinics we speak to lose a handful of patient enquiries every week: after-hours form fills and missed calls that get a reply the next day, by which point the patient has booked elsewhere.\n\nWe help dental practices reply to every enquiry within minutes, qualify it, update the CRM and offer a booking link, while urgent or clinical enquiries go straight to your team.\n\nWould it be useful if I sent over a one-page Patient Leakage checklist so you can see where enquiries might be slipping at {{clinic_name}}?\n\nBest,\n{{sender_name}}\nBurify Labs'),
(2, 3, 'Following up: enquiry response at {{clinic_name}}',
E'Hi {{first_name}},\n\nJust following up on my note about patient enquiries at {{clinic_name}}. The short version: every delayed reply is a patient who may book with another clinic, and it is fixable without adding reception headcount.\n\nHappy to send the one-page checklist if that is easier than a call.\n\nBest,\n{{sender_name}}\nBurify Labs'),
(3, 7, 'Should I close the loop?',
E'Hi {{first_name}},\n\nI will leave it here so I do not clutter your inbox. If improving enquiry response and booked appointments at {{clinic_name}} becomes a priority, I would be glad to share what we have built for clinics.\n\nBest,\n{{sender_name}}\nBurify Labs')
) as v(step_number, delay_days, subject, body)
where s.name = 'Dental clinics - missed enquiries'
on conflict (sequence_id, step_number) do nothing;
