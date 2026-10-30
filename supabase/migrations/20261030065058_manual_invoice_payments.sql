alter table public.payments
  add column if not exists recorded_by uuid references auth.users(id) on delete set null;

create or replace function public.record_manual_invoice_payment(
  p_invoice_id uuid,
  p_amount bigint,
  p_channel text,
  p_recorded_by uuid,
  p_reference text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_invoice public.invoices%rowtype;
  v_payment_id uuid;
  v_paid bigint;
  v_status text;
begin
  select * into v_invoice from public.invoices where id = p_invoice_id for update;
  if not found then raise exception 'Invoice not found'; end if;
  if v_invoice.status in ('draft','cancelled') then raise exception 'Invoice is not payable'; end if;
  if p_amount is null or p_amount <= 0 or p_amount > v_invoice.balance_due then
    raise exception 'Manual payment must be greater than zero and no more than the outstanding balance';
  end if;
  if p_reference is null or char_length(p_reference) > 100 then raise exception 'Invalid payment reference'; end if;

  insert into public.payments (
    invoice_id, customer_id, provider, reference, amount, currency, channel,
    status, paid_at, recorded_by, created_at, updated_at
  ) values (
    v_invoice.id, v_invoice.customer_id, 'manual', p_reference, p_amount,
    v_invoice.currency, left(coalesce(p_channel, 'manual'), 80),
    'success', now(), p_recorded_by, now(), now()
  ) returning id into v_payment_id;

  v_paid := v_invoice.amount_paid + p_amount;
  update public.invoices
    set amount_paid = v_paid,
        status = case when v_paid >= total_amount then 'paid' else 'partially_paid' end,
        paid_at = case when v_paid >= total_amount then now() else null end,
        updated_at = now()
  where id = v_invoice.id
  returning status into v_status;

  return jsonb_build_object('payment_id', v_payment_id, 'invoice_id', v_invoice.id, 'invoice_status', v_status);
end;
$$;
revoke all on function public.record_manual_invoice_payment(uuid,bigint,text,uuid,text) from public, anon, authenticated;
grant execute on function public.record_manual_invoice_payment(uuid,bigint,text,uuid,text) to service_role;
