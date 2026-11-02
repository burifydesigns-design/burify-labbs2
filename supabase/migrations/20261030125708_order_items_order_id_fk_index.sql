-- Cover the order_items.order_id foreign key reported by Supabase Performance Advisor.
create index if not exists order_items_order_id_idx on public.order_items(order_id);
