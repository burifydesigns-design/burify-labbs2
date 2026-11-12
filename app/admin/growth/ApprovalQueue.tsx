"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { approveAllDrafts, approveDraft, rejectDraft } from "./actions";
import type { Draft } from "@/lib/growth/types";

const FIT: Record<string, string> = { primary_dental: "Dental", secondary_medical: "Medical" };

export default function ApprovalQueue({ drafts, sendingEnabled }: { drafts: Draft[]; sendingEnabled: boolean }) {
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<Record<string, { subject?: string; body?: string }>>({});
  const queue = useMemo(() => drafts.filter(d => !removed.has(d.id)), [drafts, removed]);
  const [selectedId, setSelectedId] = useState<string | null>(drafts[0]?.id ?? null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [pending, start] = useTransition();

  const selected = queue.find(d => d.id === selectedId) ?? queue[0] ?? null;
  const subject = selected ? (edits[selected.id]?.subject ?? selected.subject) : "";
  const body = selected ? (edits[selected.id]?.body ?? selected.body) : "";
  const hasPlaceholder = /\{\{\w+\}\}/.test(subject + body);

  const advance = (id: string) => {
    const idx = queue.findIndex(d => d.id === id);
    const next = queue[idx + 1] ?? queue[idx - 1] ?? null;
    setRemoved(prev => new Set(prev).add(id));
    setSelectedId(next?.id ?? null);
  };

  const approve = () => {
    if (!selected || pending) return;
    const id = selected.id;
    setMessage(null);
    start(async () => {
      const result = await approveDraft(id, subject, body);
      if (result.ok) { advance(id); setMessage({ kind: "ok", text: "Approved and queued. Scheduled sending still depends on the enabled sending settings and delivery checks." }); }
      else setMessage({ kind: "error", text: result.error ?? "Could not approve." });
    });
  };

  const reject = () => {
    if (!selected || pending) return;
    const id = selected.id;
    setMessage(null);
    start(async () => {
      const result = await rejectDraft(id);
      if (result.ok) { advance(id); setMessage({ kind: "ok", text: "Draft rejected." }); }
      else setMessage({ kind: "error", text: result.error ?? "Could not reject." });
    });
  };

  const approveAll = () => {
    setMessage(null); setConfirmAll(false);
    start(async () => {
      const result = await approveAllDrafts();
      if (result.ok) {
        setRemoved(new Set(drafts.filter(d => !/\{\{\w+\}\}/.test(d.subject + d.body)).map(d => d.id)));
        setMessage({ kind: "ok", text: `${result.count ?? 0} drafts approved.` });
      } else setMessage({ kind: "error", text: result.error ?? "Could not approve." });
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); approve(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (queue.length === 0) return <div className="gw-card gw-empty gw-empty-lg">
    <strong>Your approval queue is clear</strong>
    <p>{message?.kind === "ok" ? message.text : "Generate drafts from your CRM prospects and they will appear here for review."}</p>
  </div>;

  return <div className="gw-queue">
    <div className="gw-queue-bar">
      <div><strong>{queue.length}</strong> draft{queue.length === 1 ? "" : "s"} waiting
        {!sendingEnabled ? <span className="gw-chip gw-chip-late">Sending is off</span> : null}</div>
      {confirmAll ?
        <div className="gw-confirm" role="alertdialog" aria-label="Confirm approve all"><span>Approve all {queue.length} as written?</span>
          <button type="button" className="gw-btn gw-btn-primary" onClick={approveAll} disabled={pending}>Yes, approve</button>
          <button type="button" className="gw-btn gw-btn-ghost" onClick={() => setConfirmAll(false)}>Cancel</button></div> :
        queue.length > 1 ? <button type="button" className="gw-btn gw-btn-soft" onClick={() => setConfirmAll(true)} disabled={pending}>Approve all</button> : null}
    </div>

    <div className="gw-queue-grid">
      <ul className="gw-draft-list" aria-label="Draft emails">
        {queue.map(d => <li key={d.id}>
          <button type="button" className={"gw-draft-item" + (d.id === selected?.id ? " is-active" : "")} aria-current={d.id === selected?.id} onClick={() => setSelectedId(d.id)}>
            <span className="gw-avatar" aria-hidden="true">{d.company.trim().slice(0, 1).toUpperCase()}</span>
            <span className="gw-draft-text"><strong>{d.company}</strong><small>{edits[d.id]?.subject ?? d.subject}</small></span>
            <span className="gw-draft-tags">
              {d.step_number > 1 ? <span className="gw-chip">Follow-up {d.step_number - 1}</span> : null}
              {!d.hasPersonalization ? <span className="gw-chip gw-chip-late" title="No personalisation note in the CRM">Generic</span> : null}
            </span>
          </button>
        </li>)}
      </ul>

      {selected ? <section className="gw-editor" aria-label="Edit draft">
        <header>
          <div><h3>{selected.company}</h3>
            <p>{selected.contact ?? "Contact not set"} · {selected.to_email}{selected.fit ? " · " + (FIT[selected.fit] ?? selected.fit) : ""}</p></div>
        </header>
        {!selected.hasPersonalization ? <p className="gw-note">This prospect has no personalisation note, so the opening line is blank. Add a sentence below before approving.</p> : null}
        <label>Subject<input value={subject} maxLength={200} onChange={e => setEdits(p => ({ ...p, [selected.id]: { ...p[selected.id], subject: e.target.value } }))} /></label>
        <label>Message<textarea value={body} rows={14} maxLength={8000} onChange={e => setEdits(p => ({ ...p, [selected.id]: { ...p[selected.id], body: e.target.value } }))} /></label>
        <p className="gw-muted gw-footnote">An unsubscribe link and your postal address are added automatically when this is sent.</p>
        {hasPlaceholder ? <p className="gw-error" role="alert">Replace the {"{{placeholders}}"} before approving.</p> : null}
        {message ? <p className={message.kind === "ok" ? "admin-success" : "admin-error"} role="status">{message.text}</p> : null}
        <div className="gw-actions">
          <button type="button" className="gw-btn gw-btn-primary" onClick={approve} disabled={pending || hasPlaceholder || !subject.trim() || !body.trim()}>{pending ? "Saving…" : "Approve"}<kbd>Ctrl ↵</kbd></button>
          <button type="button" className="gw-btn gw-btn-danger" onClick={reject} disabled={pending}>Reject</button>
        </div>
      </section> : null}
    </div>
  </div>;
}
