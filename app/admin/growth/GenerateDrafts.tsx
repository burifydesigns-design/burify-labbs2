"use client";

import { useState, useTransition } from "react";
import { generateDrafts } from "./actions";

export default function GenerateDrafts({ ready }: { ready: number }) {
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  return <section className="gw-card gw-generate">
    <div>
      <p className="gw-kicker">STEP 1</p>
      <h2>{ready.toLocaleString()} prospects ready for outreach</h2>
      <p className="gw-muted">International dental and medical clinics from your CRM with an email address that haven’t been drafted yet. Drafts are created in batches of up to 50. Nothing is sent until you approve it.</p>
      {message ? <p className={message.kind === "ok" ? "admin-success" : "admin-error"} role="status">{message.text}</p> : null}
    </div>
    <button type="button" className="gw-btn gw-btn-primary" disabled={pending || ready === 0} onClick={() => {
      setMessage(null);
      start(async () => {
        const result = await generateDrafts();
        if (!result.ok) setMessage({ kind: "error", text: result.error ?? "Could not create drafts." });
        else setMessage({ kind: "ok", text: result.count ? `${result.count} drafts created. Review them below.` : "No eligible prospects found." });
      });
    }}>{pending ? "Creating drafts…" : "Create drafts"}</button>
  </section>;
}
