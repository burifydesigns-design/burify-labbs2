"use client";

import { useEffect, useState } from "react";

export default function PaymentStatus({ reference }: { reference: string }) {
  const [state, setState] = useState("Checking your payment securely…");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!reference) { setState("No payment reference was provided."); return; }
    let active = true;
    fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`, { cache: "no-store" })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.error || "Payment is not confirmed yet.");
        if (active) { setSuccess(true); setState("Your payment has been verified and your invoice has been updated."); }
      })
      .catch(error => { if (active) setState(error instanceof Error ? error.message : "We could not verify this payment yet. Please contact Burify with your payment reference."); });
    return () => { active = false; };
  }, [reference]);
  return <main className="payment-status-shell"><section><a href="/">BURIFY LABS</a><div className={success ? "payment-status-icon success" : "payment-status-icon"}>{success ? "✓" : "…"}</div><h1>{success ? "Payment confirmed" : "Payment status"}</h1><p>{state}</p>{reference ? <small>Reference: {reference}</small> : null}<a className="payment-status-link" href="/contact">Contact Burify</a></section></main>;
}
