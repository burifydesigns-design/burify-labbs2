"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";

export default function InvoiceCreateForm() {
  const [result, setResult] = useState<{ link?: string; invoiceNumber?: string; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();
  function submit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const response = await createInvoice(formData);
      setResult(response.ok ? { link: response.link, invoiceNumber: response.invoiceNumber } : { error: response.error });
    });
  }
  return <form action={submit} className="payment-create-form">
    <label>Customer name<input name="customer_name" required maxLength={160}/></label>
    <label>Customer email<input name="customer_email" type="email" required maxLength={254}/></label>
    <label>Company (optional)<input name="company_name" maxLength={180}/></label>
    <label>Invoice description<input name="description" required maxLength={500} placeholder="Website project deposit"/></label>
    <div className="payment-form-row"><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>Currency<select name="currency" defaultValue="KES"><option value="KES">KES</option><option value="USD">USD</option></select></label></div>
    <label>Due date (optional)<input name="due_at" type="date"/></label>
    <button type="submit" disabled={pending}>{pending ? "Creating invoice…" : "Create invoice & payment link"}</button>
    {result?.error ? <p role="alert" className="payment-form-error">{result.error}</p> : null}
    {result?.link ? <div className="payment-created-link"><strong>{result.invoiceNumber} created</strong><p>Copy and send this secure link to the customer. It is shown only once.</p><input readOnly value={result.link} onFocus={event => event.currentTarget.select()}/><button type="button" onClick={() => navigator.clipboard.writeText(result.link!)}>Copy payment link</button></div> : null}
  </form>;
}
