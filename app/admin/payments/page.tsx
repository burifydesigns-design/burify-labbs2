import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import InvoiceCreateForm from "./InvoiceCreateForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments | Burify Admin", robots: { index: false, follow: false } };

export default async function AdminPaymentsPage() {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin/login?error=unauthorized");

  const admin = createAdminClient();
  const [invoiceResult, paymentResult, subscriptionResult] = await Promise.all([
    admin.from("invoices").select("id,invoice_number,currency,total_amount,amount_paid,balance_due,status,due_at,created_at,customers(name,email)").order("created_at", { ascending: false }).limit(100),
    admin.from("payments").select("id,reference,amount,currency,status,channel,paid_at,created_at,invoices(invoice_number),customers(name,email)").order("created_at", { ascending: false }).limit(100),
    admin.from("subscriptions").select("id,description,amount,currency,interval_unit,billing_mode,status,next_billing_at,customers(name,email)").order("created_at", { ascending: false }).limit(100),
  ]);
  const invoices = invoiceResult.data ?? [];
  const payments = paymentResult.data ?? [];
  const subscriptions = subscriptionResult.data ?? [];
  const paid = payments.filter(item => item.status === "success");
  const totalCollected = paid.reduce((sum, item) => sum + Number(item.amount), 0);
  const outstanding = invoices.reduce((sum, item) => sum + Number(item.balance_due), 0);
  const fmt = (amount: number, currency: string) => new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100);
  const customerName = (value: unknown) => {
    const row = Array.isArray(value) ? value[0] : value;
    return row && typeof row === "object" && "name" in row ? String(row.name) : "Customer";
  };
  return <main className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/">BURIFY<span>LABS</span></a><p className="admin-side-label">WORKSPACE</p><a className="admin-nav" href="/admin">Overview</a><a className="admin-nav" href="/admin/work">Work / portfolio</a><a className="admin-nav" href="/admin/blog">Blog management</a><a className="admin-nav" href="/admin/analytics">Analytics</a><a className="admin-nav active" href="/admin/payments">Payments</a><div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] || "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div></aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / FINANCE</p><h1>Payments</h1></div><a className="admin-logout" href="/admin">Back to overview</a></header>
      <section className="admin-welcome"><div><p className="admin-eyebrow">BILLING WORKSPACE</p><h2>Invoices and transactions</h2><p>Create invoices and track confirmed payments, balances and retainers.</p></div><span className="admin-live">● Admin only</span></section>
      <div className="admin-stats">
        <article className="admin-stat"><span>Collected revenue</span><strong>{fmt(totalCollected, "KES")}</strong><small>Successful Paystack and manual records</small></article>
        <article className="admin-stat"><span>Outstanding balances</span><strong>{fmt(outstanding, "KES")}</strong><small>All invoice currencies shown as KES equivalent label — see invoice rows for exact currency</small></article>
        <article className="admin-stat"><span>Successful transactions</span><strong>{paid.length}</strong><small>Latest 100 attempts</small></article>
        <article className="admin-stat"><span>Active retainers</span><strong>{subscriptions.filter(item => item.status === "active").length}</strong><small>Recurring and manual agreements</small></article>
      </div>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">BILLING</p><h2>Create invoice</h2></div></div><InvoiceCreateForm/></section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">ACCOUNTS RECEIVABLE</p><h2>Invoices</h2></div><span className="admin-count">{invoices.length} latest</span></div>
        {invoiceResult.error ? <p className="admin-muted">Could not load invoices. Check billing table access.</p> : invoices.length === 0 ? <div className="admin-empty">No invoices have been created.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Due</th></tr></thead><tbody>{invoices.map(item => <tr key={item.id}><td><strong>{item.invoice_number}</strong></td><td>{customerName(item.customers)}</td><td>{fmt(Number(item.total_amount), item.currency)}</td><td>{fmt(Number(item.amount_paid), item.currency)}</td><td>{fmt(Number(item.balance_due), item.currency)}</td><td><span className="admin-status">{item.status}</span></td><td>{item.due_at ? new Date(item.due_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">TRANSACTION LEDGER</p><h2>Recent payment attempts</h2></div><span className="admin-count">{payments.length} latest</span></div>
        {paymentResult.error ? <p className="admin-muted">Could not load payments.</p> : payments.length === 0 ? <div className="admin-empty">No payment attempts yet.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Invoice</th><th>Amount</th><th>Channel</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map(item => <tr key={item.id}><td>{item.reference}</td><td>{customerName(item.customers)}</td><td>{customerName(item.invoices) === "Customer" ? "—" : customerName(item.invoices)}</td><td>{fmt(Number(item.amount), item.currency)}</td><td>{item.channel || "—"}</td><td><span className="admin-status">{item.status}</span></td><td>{item.paid_at ? new Date(item.paid_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">RECURRING BILLING</p><h2>Subscriptions & retainers</h2></div><span className="admin-count">{subscriptions.length} records</span></div>
        {subscriptionResult.error ? <p className="admin-muted">Could not load subscriptions.</p> : subscriptions.length === 0 ? <div className="admin-empty">No retainers or subscriptions yet. Manual recurring invoices are supported; automatic recurring billing requires eligible card authorizations.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Service</th><th>Amount</th><th>Frequency</th><th>Mode</th><th>Status</th><th>Next bill</th></tr></thead><tbody>{subscriptions.map(item => <tr key={item.id}><td>{customerName(item.customers)}</td><td>{item.description}</td><td>{fmt(Number(item.amount), item.currency)}</td><td>{item.interval_unit}</td><td>{item.billing_mode}</td><td>{item.status}</td><td>{item.next_billing_at ? new Date(item.next_billing_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      <footer className="admin-footer">Burify Labs · Financial records are private to administrators.</footer>
    </section>
  </main>;
}
