"use client";

import { useState, useTransition } from "react";
import { createSubscription } from "./subscription-actions";

export default function SubscriptionCreateForm() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createSubscription(formData);
      if (!result.ok) setError(result.error || "Could not create retainer.");
      else window.location.reload();
    });
  }
  return <form action={submit} className="payment-create-form">
    <label>Customer name<input name="customer_name" required maxLength={160}/></label>
    <label>Customer email<input name="customer_email" type="email" required maxLength={254}/></label>
    <label>Service / retainer description<input name="description" required maxLength={500} placeholder="Monthly website maintenance"/></label>
    <div className="payment-form-row"><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>Currency<select name="currency" defaultValue="KES"><option value="KES">KES</option><option value="USD">USD</option></select></label></div>
    <div className="payment-form-row"><label>Billing frequency<select name="interval_unit" defaultValue="monthly"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></label><label>Next billing date<input name="next_billing_at" type="date" required/></label></div>
    <button type="submit" disabled={pending}>{pending ? "Saving retainer…" : "Create manual retainer"}</button>
    <p className="admin-muted">Creates a recurring billing agreement and tracking record. It does not automatically charge the customer; issue an invoice each period.</p>
    {error ? <p role="alert" className="payment-form-error">{error}</p> : null}
  </form>;
}
