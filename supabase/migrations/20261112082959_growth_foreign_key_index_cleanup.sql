create index if not exists audits_prospect_id_idx on growth.audits(prospect_id);
create index if not exists outreach_messages_sequence_id_idx on growth.outreach_messages(sequence_id);
drop index if exists growth.growth_client_metrics_period_unique;