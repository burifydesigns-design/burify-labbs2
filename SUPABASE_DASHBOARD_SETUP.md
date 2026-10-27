# Burify Labs admin dashboard

## Included
- `/admin/login`: Supabase Auth password sign-in.
- `/admin`: admin-only overview, lead list, and lead status updates.
- Server-side role checks against `profiles.role = 'admin'`.
- Dashboard is private from search engines.

## Configure Vercel
In Vercel → Project → Settings → Environment Variables, add:
- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: your Supabase publishable key (or legacy anon key).

Use the same values for Preview and Production as appropriate, then redeploy. Do not add a service-role key to the browser or commit secrets to Git.

## Admin user
1. In Supabase → Authentication → Users, create the administrator account.
2. Ensure the matching user has a row in `public.profiles` with `id` equal to the Auth user UUID and `role` equal to `admin`.
3. Confirm RLS on `profiles` prevents users from changing their own role, and that only admins can read/update leads.
4. Sign in at `/admin/login`.

## Assumptions to verify
The dashboard expects `profiles(id, role)`, `leads(id, name, email, company, service, status, created_at, source)`, `projects(id)`, and `blog_posts(id)`. If the actual schema uses different column names, update the queries to match. The dashboard intentionally does not modify the existing Google Apps Script contact route.

## Security
Never expose a Supabase service-role key in client code. Protect lead data with database RLS, not only UI checks. Ensure the leads table has policies granting select/update only to authenticated admins. Website lead inserts should use a narrow, column-limited policy and server-side validation/rate limiting.
