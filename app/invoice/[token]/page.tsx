import "../invoice.css";
import { createHash } from "node:crypto";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import PayInvoiceButton from "./PayInvoiceButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoice | Burify Labs", robots: { index: false, follow: false } };

export default async function PublicInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const admin = createAdminClient();
  const { data: invoice } = await admin.from("invoices")
    .select("id,invoice_number,currency,total_amount,amount_paid,balance_due,status,description,due_at,customers(name,company_name),invoice_items(id,description,quantity,unit_amount,total_amount)")
    .eq("public_token_hash", tokenHash).maybeSingle();
  if (!invoice || invoice.status === "draft" || invoice.status === "cancelled") notFound();
  const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
  const money = (value: number) => new Intl.NumberFormat("en", { style: "currency", currency: invoice.currency }).format(Number(value) / 100);
  const items = Array.isArray(invoice.invoice_items) ? invoice.invoice_items : [];
  return <main className="public-invoice-shell">
    <section className="public-invoice-card">
      <a className="public-invoice-brand" href="/">BURIFY LABS</a>
      <div className="public-invoice-heading"><div><p>INVOICE</p><h1>{invoice.invoice_number}</h1></div><span className={`public-invoice-status status-${invoice.status}`}>{invoice.status.replace("_", " ")}</span></div>
      <p className="public-invoice-to">Billed to <strong>{customer?.name || "Customer"}</strong>{customer?.company_name ? ` · ${customer.company_name}` : ""}</p>
      {invoice.description ? <p className="public-invoice-description">{invoice.description}</p> : null}
      <div className="public-invoice-items">
        {items.map((item: { id: string; description: string; quantity: number; total_amount: number }) => <div key={item.id}><span>{item.description}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</span><strong>{money(item.total_amount)}</strong></div>)}
      </div>
      <div className="public-invoice-totals"><div><span>Total</span><strong>{money(invoice.total_amount)}</strong></div><div><span>Paid</span><strong>{money(invoice.amount_paid)}</strong></div><div className="balance"><span>Balance due</span><strong>{money(invoice.balance_due)}</strong></div></div>
      {invoice.due_at ? <p className="public-invoice-due">Due {new Date(invoice.due_at).toLocaleDateString()}</p> : null}
      {Number(invoice.balance_due) > 0
        ? <PayInvoiceButton token={token} balanceDue={Number(invoice.balance_due)} currency={invoice.currency}/>
        : <p className="public-invoice-paid">This invoice has been paid in full. Thank you.</p>}
      <p className="public-invoice-footnote">Questions about this invoice? Contact Burify through <a href="/contact">our contact page</a>.</p>
    </section>
  </main>;
}
