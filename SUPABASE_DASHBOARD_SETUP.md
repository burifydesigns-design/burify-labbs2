# Burify Labs admin dashboard

## Routes included
- `/admin/login`: Supabase Auth password sign-in.
- `/admin`: server-rendered admin overview, lead pipeline, recent contact submissions, project/blog/service counts, and lead status updates.
- Server-side role checks require `public.profiles.role = 'admin'`.
- Admin pages set `robots: noindex, nofollow`.

## Verified database schema
Live schema inspected in Supabase project `fsgmowsvwwtjmvmyaijj` on 2026-10-27:
- `profiles(id, full_name, role, created_at, updated_at)`
- `leads(id, full_name, email, company, website, industry, source, status, notes, next_follow_up_at, created_at, updated_at)`
- `contact_submissions(id, name, email, company, service_interest, message, consent, status, created_at)`
- `projects(id, title, client_name, service_id, status, summary, start_date, target_date, completed_at, created_at, updated_at)`
- `services(id, slug, name, short_description, description, icon, display_order, is_published, created_at, updated_at)`
- `blog_posts(id, category_id, author_id, slug, title, excerpt, content, cover_image_url, seo_title, seo_description, status, published_at, created_at, updated_at)`

The lead and contact tables currently contain no records. All ten inspected public tables have RLS enabled. Policies inspected show admin-only access for lead management and contact-submission reads/updates, plus public insert policy for contact submissions. Never treat RLS being enabled alone as proof of policy correctness.

## Configure Vercel
In Vercel → Project → Settings → Environment Variables, add:
- `SUPABASE_URL=https://fsgmowsvwwtjmvmyaijj.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` = the project's publishable key (or legacy anon key).

Set appropriate Preview and Production values, then redeploy. Do not add a service-role key to the frontend or commit secrets to Git. The dashboard uses the Supabase SSR cookie client.

## Admin user
1. In Supabase → Authentication → Users, create the administrator account.
2. Ensure the matching row in `public.profiles` has `id` equal to the Auth user UUID and `role = 'admin'`.
3. The existing `profiles_read_self_or_admin` policy allows the signed-in user to read their own profile; admin management policies use `private.is_admin()`.
4. Sign in at `/admin/login`.

## Status values
Lead statuses accepted by the schema and dashboard: `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`, `nurture`.
Contact-submission statuses in the database: `new`, `read`, `replied`, `archived`, `spam`. The current dashboard displays contact submissions but does not yet change their statuses.

## Existing contact form
The `app/api/contact/route.ts` endpoint now validates contact-form submissions and inserts them directly into `public.contact_submissions` through the Supabase server client. Google Apps Script is no longer used by this route. Keep the Supabase publishable/anon key in Vercel environment variables; never use a service-role key in the website. Ensure the existing contact form sends JSON to `/api/contact` with `name`, `email`, optional `company`, `service_interest` (or legacy `service`), optional `message` (or legacy `projectDetails`), and optional boolean `consent`. The public insert RLS policy must permit the required fields and the database should default status to `new`. The contact page posts to `/api/contact`; the current booking form sends name and email only, which are accepted by the API and stored with optional fields empty.

## Security and remaining verification
Never expose a Supabase service-role key in client code. Database RLS remains the security boundary. A Supabase security advisor check reported leaked-password protection is disabled; enable it under Authentication → Settings → Password Security. The repository branch has not yet been built or deployed, so run the Vercel preview/build and resolve any issues before merging.
