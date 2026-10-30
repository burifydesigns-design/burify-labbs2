"use client";

import { useState } from "react";

export default function PayInvoiceButton({ token, balanceDue, currency }: { token: string; balanceDue: number; currency: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function startPayment() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.authorizationUrl) throw new Error(payload.error || "Unable to start payment.");
      window.location.assign(payload.authorizationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start payment.");
      setLoading(false);
    }
  }
  return <div className="invoice-pay-action">
    <button type="button" onClick={startPayment} disabled={loading || balanceDue <= 0}>
      {loading ? "Connecting to secure checkout…" : `Pay ${currency} ${(balanceDue / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
    </button>
    {error ? <p role="alert">{error}</p> : null}
    <small>Secure checkout powered by Paystack. Burify does not store your card details.</small>
  </div>;
}
