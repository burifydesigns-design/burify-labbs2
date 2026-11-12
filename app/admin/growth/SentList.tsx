"use client";

import { useState, useTransition } from "react";
import { markReplied } from "./actions";
import type { SentMessage } from "@/lib/growth/types";

export default function SentList({ items }: { items: SentMessage[] }) {
  const [replied, setReplied] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (items.length === 0) return <div className="gw-empty"><strong>Nothing sent yet</strong><p>Approved emails appear here after the next scheduled send.</p></div>;

  return <div className="gw-stack">
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    {items.map(item => {
      const isReplied = Boolean(item.replied_at) || replied.has(item.id);
      return <article className="gw-sent" key={item.id}>
        <div className="gw-sent-main">
          <strong>{item.company}</strong>
          <small>{item.subject}</small>
          <small>{item.status === "failed" ? "Failed: " + (item.error ?? "unknown error") : (item.step_number > 1 ? `Follow-up ${item.step_number - 1} · ` : "") + (item.sent_at ? new Date(item.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Nairobi" }) : "")}</small>
        </div>
        {item.status === "failed" ? <span className="gw-chip gw-chip-late">Failed</span> :
          isReplied ? <span className="gw-chip gw-chip-done">Replied</span> :
            <button type="button" className="gw-btn gw-btn-soft" disabled={pending} onClick={() => {
              setError(null);
              start(async () => {
                setReplied(prev => new Set(prev).add(item.id));
                const result = await markReplied(item.id);
                if (!result.ok) { setReplied(prev => { const n = new Set(prev); n.delete(item.id); return n; }); setError(result.error ?? "Could not record this reply."); }
              });
            }}>Mark replied</button>}
      </article>;
    })}
  </div>;
}
