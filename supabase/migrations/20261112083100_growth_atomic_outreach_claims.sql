alter table growth.outreach_messages add column if not exists sending_at timestamptz;
alter table growth.outreach_messages drop constraint if exists outreach_messages_status_check;
alter table growth.outreach_messages add constraint outreach_messages_status_check check (status = any (array['draft','approved','sending','sent','failed','rejected','cancelled']::text[]));
-- Atomic claim, send-status transitions, daily cap enforcement and unsubscribe cancellation are defined in this migration.
