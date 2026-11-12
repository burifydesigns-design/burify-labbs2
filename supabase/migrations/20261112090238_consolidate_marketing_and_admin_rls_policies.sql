drop policy if exists marketing_read_blog_categories on public.blog_categories;
drop policy if exists marketing_read_blog_posts on public.blog_posts;
drop policy if exists blog_posts_authenticated_read_published on public.blog_posts;
create policy blog_posts_authenticated_read_published on public.blog_posts for select to authenticated
using (((status='published') and (published_at<=now())) or (select private.is_admin()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
drop policy if exists marketing_read_case_studies on public.case_studies;
drop policy if exists case_studies_authenticated_read_published on public.case_studies;
create policy case_studies_authenticated_read_published on public.case_studies for select to authenticated
using (is_published=true or (select private.is_admin()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
drop policy if exists marketing_crm_manage on public.notion_crm_leads;
drop policy if exists notion_crm_leads_admin_manage on public.notion_crm_leads;
create policy notion_crm_leads_dashboard_manage on public.notion_crm_leads for all to authenticated
using ((select private.is_admin()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'))
with check ((select private.is_admin()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
drop policy if exists marketing_read_projects on public.projects;
drop policy if exists projects_admin_manage on public.projects;
create policy projects_dashboard_read on public.projects for select to authenticated
using ((select private.is_admin()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='marketing'));
create policy projects_admin_insert on public.projects for insert to authenticated with check ((select private.is_admin()));
create policy projects_admin_update on public.projects for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy projects_admin_delete on public.projects for delete to authenticated using ((select private.is_admin()));