drop policy if exists marketing_dashboard_manage on public.blog_categories;
drop policy if exists marketing_dashboard_manage on public.blog_posts;
drop policy if exists marketing_dashboard_manage on public.case_studies;
drop policy if exists marketing_dashboard_manage on public.contact_submissions;
drop policy if exists marketing_dashboard_manage on public.leads;
drop policy if exists marketing_dashboard_manage on public.projects;
drop policy if exists marketing_dashboard_manage on public.services;
drop policy if exists marketing_dashboard_manage on public.site_settings;
drop policy if exists marketing_dashboard_manage on public.testimonials;
drop policy if exists marketing_dashboard_manage on public.notion_crm_leads;
create policy marketing_crm_manage on public.notion_crm_leads for all to authenticated
using ((select private.has_dashboard_access()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'))
with check ((select private.has_dashboard_access()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
create policy marketing_read_blog_categories on public.blog_categories for select to authenticated
using ((select private.has_dashboard_access()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
create policy marketing_read_blog_posts on public.blog_posts for select to authenticated
using ((select private.has_dashboard_access()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
create policy marketing_read_case_studies on public.case_studies for select to authenticated
using ((select private.has_dashboard_access()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
-- Existing marketing_read_projects policy is SELECT-only.