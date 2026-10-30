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
The existing `app/api/contact/route.ts` still forwards to Google Apps Script. It has not been changed as part of this dashboard work, so contact submissions will not automatically appear in `contact_submissions` unless the existing integration or a separate sync writes there.

## Security and remaining verification
Never expose a Supabase service-role key in client code. Database RLS remains the security boundary. A Supabase security advisor check reported leaked-password protection is disabled; enable it under Authentication → Settings → Password Security. The repository branch has not yet been built or deployed, so run the Vercel preview/build and resolve any issues before merging.

## Admin user management
The dashboard includes an Access Control section to invite users by email and remove accounts. Supabase Auth Admin APIs run only in server-side code; never expose the secret key to the browser.
- Add `SUPABASE_SECRET_KEY` in Vercel for Preview and Production using the project's server-side secret key from Supabase → Project Settings → API Keys.
- Existing `profiles.role` values are `admin` and `member`. Only administrators can access admin routes or manage accounts.
- Invitations are sent by email and create a matching profile. Removing an Auth user deletes the profile through the existing ON DELETE CASCADE foreign key. The current admin and last admin are protected.
- The dashboard lists the first 100 Auth users.
