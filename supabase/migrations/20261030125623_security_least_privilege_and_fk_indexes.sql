-- Least-privilege grants and foreign-key indexes for Burify production.
-- RLS policies remain the row-level authorization boundary.
begin;
revoke all privileges on all tables in schema public from anon, authenticated;
grant select on table public.blog_categories, public.blog_posts, public.case_studies, public.services, public.testimonials to anon;
grant insert on table public.contact_submissions to anon;
grant select, insert, update, delete on table public.blog_categories, public.blog_posts, public.case_studies, public.leads, public.profiles, public.projects, public.services, public.site_settings, public.testimonials to authenticated;
grant select, update, delete on table public.contact_submissions to authenticated;
create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists invoice_items_product_id_idx on public.invoice_items(product_id);
create index if not exists invoices_order_id_idx on public.invoices(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists payment_events_payment_id_idx on public.payment_events(payment_id);
create index if not exists payments_customer_id_idx on public.payments(customer_id);
create index if not exists payments_recorded_by_idx on public.payments(recorded_by);
create index if not exists refunds_payment_id_idx on public.refunds(payment_id);
create index if not exists subscriptions_product_id_idx on public.subscriptions(product_id);
commit;
