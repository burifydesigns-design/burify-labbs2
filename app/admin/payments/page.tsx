import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import InvoiceCreateForm from "./InvoiceCreateForm";
import SubscriptionCreateForm from "./SubscriptionCreateForm";
import ManualPaymentForm from "./ManualPaymentForm";
import { resendInvoiceEmail, retryPaymentReceipt } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments | Burify Admin", robots: { index: false, follow: false } };

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ emailSent?: string; emailFailed?: string; receiptSent?: string; receiptFailed?: string }> }) {
  const params = await searchParams;
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin/login?error=unauthorized");

  const admin = createAdminClient();
  const [invoiceResult, paymentResult, subscriptionResult, emailLogResult, eventResult, receiptResult] = await Promise.all([
    admin.from("invoices").select("id,invoice_number,currency,total_amount,amount_paid,balance_due,status,due_at,created_at,customers(name,email)").order("created_at", { ascending: false }).limit(100),
    admin.from("payments").select("id,reference,amount,currency,status,channel,paid_at,created_at,invoices(invoice_number),customers(name,email)").order("created_at", { ascending: false }).limit(100),
    admin.from("subscriptions").select("id,description,amount,currency,interval_unit,billing_mode,status,next_billing_at,customers(name,email)").order("created_at", { ascending: false }).limit(100),
    admin.from("invoice_email_logs").select("invoice_id,status,recipient_email,sent_at,created_at,error_message").order("created_at", { ascending: false }).limit(500),
    admin.from("payment_events").select("event_type,processed_at,created_at,last_error,attempt_count").order("created_at", { ascending: false }).limit(100),
    admin.from("payment_receipt_logs").select("payment_id,status,recipient_email,sent_at,created_at,error_message").order("created_at", { ascending: false }).limit(100),
  ]);
  const invoices = invoiceResult.data ?? [];
  const payments = paymentResult.data ?? [];
  const subscriptions = subscriptionResult.data ?? [];
  const events = eventResult.data ?? [];
  const receiptLogs = receiptResult.data ?? [];
  const latestReceiptByPayment = new Map<string, (typeof receiptLogs)[number]>();
  for (const log of receiptLogs) if (!latestReceiptByPayment.has(log.payment_id)) latestReceiptByPayment.set(log.payment_id, log);
  const liveKeyConfigured = (process.env.PAYSTACK_SECRET_KEY || "").startsWith("sk_live_");
  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";
  const stalePendingCount = payments.filter(item => ["pending", "processing"].includes(item.status) && Date.now() - new Date(item.created_at).getTime() > 30 * 60 * 1000).length;
  const webhookIssueCount = events.filter(item => Boolean(item.last_error) || !item.processed_at).length;
  const failedReceiptCount = receiptLogs.filter(item => item.status === "failed").length;
  const latestEmailByInvoice = new Map<string, { status: string; recipient_email: string; error_message: string | null }>();
  for (const log of emailLogResult.data ?? []) {
    if (!latestEmailByInvoice.has(log.invoice_id)) latestEmailByInvoice.set(log.invoice_id, log);
  }
  const paid = payments.filter(item => item.status === "success");
  const collectedKes = paid.filter(item => item.currency === "KES").reduce((sum, item) => sum + Number(item.amount), 0);
  const collectedUsd = paid.filter(item => item.currency === "USD").reduce((sum, item) => sum + Number(item.amount), 0);
  const outstandingKes = invoices.filter(item => item.currency === "KES").reduce((sum, item) => sum + Number(item.balance_due), 0);
  const outstandingUsd = invoices.filter(item => item.currency === "USD").reduce((sum, item) => sum + Number(item.balance_due), 0);
  const fmt = (amount: number, currency: string) => new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100);
  const relationValue = (value: unknown, key: string) => {
    const row = Array.isArray(value) ? value[0] : value;
    return row && typeof row === "object" && key in row ? String((row as Record<string, unknown>)[key] ?? "") : "";
  };
  return <main className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/">BURIFY<span>LABS</span></a><p className="admin-side-label">WORKSPACE</p><a className="admin-nav" href="/admin">Overview</a><a className="admin-nav" href="/admin/work">Work / portfolio</a><a className="admin-nav" href="/admin/blog">Blog management</a><a className="admin-nav" href="/admin/analytics">Analytics</a><a className="admin-nav active" href="/admin/payments">Payments</a><div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] || "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div></aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / FINANCE</p><h1>Payments</h1></div><a className="admin-logout" href="/admin">Back to overview</a></header>
      {params.emailSent ? <p className="admin-success">Invoice email accepted by the email provider.</p> : null}
      {params.emailFailed ? <p className="admin-error">Invoice email could not be sent. Check the email provider configuration and retry.</p> : null}
      {params.receiptSent ? <p className="admin-success">Payment receipt email accepted by the email provider.</p> : null}
      {params.receiptFailed ? <p className="admin-error">Payment receipt retry failed. Check the receipt log and Resend configuration.</p> : null}
      <section className="admin-welcome"><div><p className="admin-eyebrow">BILLING WORKSPACE</p><h2>Invoices and transactions</h2><p>Create invoices and track confirmed payments, balances and retainers.</p></div><span className="admin-live">● Admin only</span></section>
      <section className="admin-panel payment-admin-panel payment-health-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">PRODUCTION MONITORING</p><h2>Payment health</h2></div><span className="admin-count">Live configuration</span></div>
        <div className="payment-health-grid">
          <article><span>Payment switch</span><strong className={paymentsEnabled ? "health-ok" : "health-warning"}>{paymentsEnabled ? "Enabled" : "Disabled"}</strong></article>
          <article><span>Paystack credentials</span><strong className={liveKeyConfigured ? "health-ok" : "health-warning"}>{liveKeyConfigured ? "Live key detected" : "Test / missing key"}</strong></article>
          <article><span>Webhook events needing attention</span><strong className={webhookIssueCount ? "health-warning" : "health-ok"}>{eventResult.error ? "Migration pending" : webhookIssueCount}</strong></article>
          <article><span>Failed receipt emails</span><strong className={receiptResult.error || failedReceiptCount ? "health-warning" : "health-ok"}>{receiptResult.error ? "Migration pending" : failedReceiptCount}</strong></article>
          <article><span>Stale checkout attempts</span><strong className={stalePendingCount ? "health-warning" : "health-ok"}>{stalePendingCount}</strong></article>
          <article><span>Latest webhook event</span><strong>{events[0]?.created_at ? new Date(events[0].created_at).toLocaleString() : eventResult.error ? "Migration pending" : "No events yet"}</strong></article>
        </div>
        <p className="admin-muted">Webhook failures and unprocessed events are counted from the latest 100 events. Receipt failures are counted from the latest 100 receipts. Stale attempts are from the latest 100 payments. Expected Paystack domain: {process.env.PAYSTACK_EXPECTED_DOMAIN || (liveKeyConfigured ? "live" : "test")}.</p>
        {(eventResult.error || receiptResult.error) ? <p className="admin-error">Apply the Paystack production-hardening Supabase migration before these monitoring metrics become available.</p> : null}
      </section>
      <div className="admin-stats">
        <article className="admin-stat"><span>Collected revenue</span><strong>{fmt(collectedKes, "KES")}<small>{fmt(collectedUsd, "USD")} collected in USD</small></strong><small>Successful payments among the latest 100 attempts</small></article>
        <article className="admin-stat"><span>Outstanding balances</span><strong>{fmt(outstandingKes, "KES")}<small>{fmt(outstandingUsd, "USD")} outstanding in USD</small></strong><small>Balances from the latest 100 invoices; currencies are shown separately</small></article>
        <article className="admin-stat"><span>Successful transactions</span><strong>{paid.length}</strong><small>Latest 100 attempts</small></article>
        <article className="admin-stat"><span>Active retainers</span><strong>{subscriptions.filter(item => item.status === "active").length}</strong><small>Recurring and manual agreements</small></article>
      </div>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">BILLING</p><h2>Create invoice</h2></div></div><InvoiceCreateForm/></section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">ACCOUNTS RECEIVABLE</p><h2>Invoices</h2></div><span className="admin-count">{invoices.length} latest</span></div>
        {invoiceResult.error ? <p className="admin-muted">Could not load invoices. Check billing table access.</p> : invoices.length === 0 ? <div className="admin-empty">No invoices have been created.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Email delivery</th><th>Due</th><th>Actions</th></tr></thead><tbody>{invoices.map(item => <tr key={item.id}><td><strong>{item.invoice_number}</strong></td><td>{relationValue(item.customers, "name") || "Customer"}</td><td>{fmt(Number(item.total_amount), item.currency)}</td><td>{fmt(Number(item.amount_paid), item.currency)}</td><td>{fmt(Number(item.balance_due), item.currency)}</td><td><span className="admin-status">{item.status}</span></td><td>{(() => { const log = latestEmailByInvoice.get(item.id); return log ? <><span className="admin-status">{log.status}</span><small>{log.recipient_email}</small></> : <span className="admin-muted">Not emailed</span>; })()}</td><td>{item.due_at ? new Date(item.due_at).toLocaleDateString() : "—"}</td><td><form action={resendInvoiceEmail}><input type="hidden" name="invoice_id" value={item.id}/><button className="admin-logout" type="submit">Resend email</button></form><ManualPaymentForm invoiceId={item.id} balanceDue={Number(item.balance_due)}/></td></tr>)}</tbody></table></div>}
      </section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">TRANSACTION LEDGER</p><h2>Recent payment attempts</h2></div><span className="admin-count">{payments.length} latest</span></div>
        {paymentResult.error ? <p className="admin-muted">Could not load payments.</p> : payments.length === 0 ? <div className="admin-empty">No payment attempts yet.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Invoice</th><th>Amount</th><th>Channel</th><th>Status</th><th>Receipt</th><th>Date</th></tr></thead><tbody>{payments.map(item => <tr key={item.id}><td>{item.reference}</td><td>{relationValue(item.customers, "name") || "Customer"}</td><td>{relationValue(item.invoices, "invoice_number") || "—"}</td><td>{fmt(Number(item.amount), item.currency)}</td><td>{item.channel || "—"}</td><td><span className="admin-status">{item.status}</span></td><td>{(() => { const receipt = latestReceiptByPayment.get(item.id); return receipt ? <><span className="admin-status">{receipt.status}</span>{receipt.status === "failed" ? <form action={retryPaymentReceipt}><input type="hidden" name="reference" value={item.reference}/><button className="admin-logout" type="submit">Retry receipt</button></form> : null}</> : item.status === "success" ? <span className="admin-muted">Not recorded</span> : "—"; })()}</td><td>{item.paid_at ? new Date(item.paid_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">RECURRING BILLING</p><h2>Create manual retainer</h2></div></div><SubscriptionCreateForm/></section>\n      <section className="admin-panel payment-admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">RECURRING BILLING</p><h2>Subscriptions & retainers</h2></div><span className="admin-count">{subscriptions.length} records</span></div>
        {subscriptionResult.error ? <p className="admin-muted">Could not load subscriptions.</p> : subscriptions.length === 0 ? <div className="admin-empty">No retainers or subscriptions yet. Manual recurring invoices are supported; automatic recurring billing requires eligible card authorizations.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Service</th><th>Amount</th><th>Frequency</th><th>Mode</th><th>Status</th><th>Next bill</th></tr></thead><tbody>{subscriptions.map(item => <tr key={item.id}><td>{relationValue(item.customers, "name") || "Customer"}</td><td>{item.description}</td><td>{fmt(Number(item.amount), item.currency)}</td><td>{item.interval_unit}</td><td>{item.billing_mode}</td><td>{item.status}</td><td>{item.next_billing_at ? new Date(item.next_billing_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      <footer className="admin-footer">Burify Labs · Financial records are private to administrators.</footer>
    </section>
  </main>;
}
