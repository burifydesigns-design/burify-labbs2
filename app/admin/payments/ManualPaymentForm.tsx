"use client";

import { useState, useTransition } from "react";
import { recordManualPayment } from "./actions";

export default function ManualPaymentForm({ invoiceId, balanceDue }: { invoiceId: string; balanceDue: number }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const result = await recordManualPayment(formData);
      setMessage(result.ok ? "Payment recorded." : result.error || "Could not record payment.");
      if (result.ok) window.location.reload();
    });
  }
  if (balanceDue <= 0) return <span className="admin-muted">Settled</span>;
  return <form action={submit} className="manual-payment-form">
    <input type="hidden" name="invoice_id" value={invoiceId}/>
    <input name="amount" aria-label="Manual payment amount" type="number" min="0.01" max={(balanceDue / 100).toFixed(2)} step="0.01" defaultValue={(balanceDue / 100).toFixed(2)} required/>
    <select name="channel" aria-label="Payment method"><option value="M-PESA (manual)">M-PESA</option><option value="Bank transfer (manual)">Bank transfer</option><option value="Cash (manual)">Cash</option><option value="Other (manual)">Other</option></select>
    <button type="submit" disabled={pending}>{pending ? "Saving…" : "Record"}</button>
    {message ? <small role="status">{message}</small> : null}
  </form>;
}
