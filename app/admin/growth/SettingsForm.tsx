"use client";

import { useState, useTransition } from "react";
import { saveGrowthSettings } from "./actions";

export default function SettingsForm({ initial, emailReady }: {
  initial: { senderName: string; postalAddress: string; dailyCap: number; sendingEnabled: boolean }; emailReady: boolean;
}) {
  const [senderName, setSenderName] = useState(initial.senderName);
  const [postalAddress, setPostalAddress] = useState(initial.postalAddress);
  const [dailyCap, setDailyCap] = useState(initial.dailyCap);
  const [enabled, setEnabled] = useState(initial.sendingEnabled);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const detailsReady = Boolean(senderName.trim() && postalAddress.trim());
  const checks = [
    { ok: emailReady, label: "Email service connected", hint: "Set RESEND_API_KEY, RESEND_FROM_EMAIL and CRON_SECRET in Vercel." },
    { ok: Boolean(senderName.trim()), label: "Sender name added", hint: "Used to sign each email." },
    { ok: Boolean(postalAddress.trim()), label: "Postal address added", hint: "Required in the footer of cold email in most regions." },
  ];

  return <form className="gw-card gw-settings" onSubmit={e => {
    e.preventDefault(); setMessage(null);
    start(async () => {
      const result = await saveGrowthSettings({ senderName, postalAddress, dailyCap, sendingEnabled: enabled });
      setMessage(result.ok ? { kind: "ok", text: "Settings saved." } : { kind: "error", text: result.error ?? "Could not save." });
      if (result.ok && enabled && !detailsReady) setEnabled(false);
    });
  }}>
    <ul className="gw-checklist" aria-label="Sending readiness">
      {checks.map(c => <li key={c.label} className={c.ok ? "is-ok" : ""}><span aria-hidden="true">{c.ok ? "✓" : "○"}</span><div><strong>{c.label}</strong>{!c.ok ? <small>{c.hint}</small> : null}</div></li>)}
    </ul>
    <div className="gw-fields">
      <label>Sender name<input value={senderName} maxLength={80} onChange={e => setSenderName(e.target.value)} placeholder="Your name" /></label>
      <label>Daily send cap<input type="number" min={1} max={100} value={dailyCap} onChange={e => setDailyCap(Number(e.target.value))} /><small>Keep this low while you validate the message (25–35 a day).</small></label>
      <label className="gw-field-wide">Business postal address<input value={postalAddress} maxLength={240} onChange={e => setPostalAddress(e.target.value)} placeholder="Street, city, country" /></label>
    </div>
    <div className="gw-toggle-row">
      <div><strong>Allow scheduled sending</strong><p>When on, approved emails are sent once each weekday at 12:30 (Nairobi time) within your daily cap. Drafts are never sent without approval.</p></div>
      <button type="button" role="switch" aria-checked={enabled && detailsReady} className={"gw-switch" + (enabled && detailsReady ? " is-on" : "")} disabled={!detailsReady || !emailReady} onClick={() => setEnabled(v => !v)}><span /></button>
    </div>
    {message ? <p className={message.kind === "ok" ? "admin-success" : "admin-error"} role="status">{message.text}</p> : null}
    <div className="gw-actions"><button type="submit" className="gw-btn gw-btn-primary" disabled={pending}>{pending ? "Saving…" : "Save settings"}</button></div>
  </form>;
}
