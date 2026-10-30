create policy "service role manages contact rate limits"
on public.contact_submission_rate_limits
for all
to service_role
using (true)
with check (true);