"use client";

import { useState, useTransition } from "react";
import { setKpiValue } from "./actions";
import type { Kpi } from "@/lib/growth/types";

function KpiCard({ kpi }: { kpi: Kpi }) {
  const [value, setValue] = useState<number | null>(kpi.current);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const target = kpi.target_value;
  const pct = target && value != null && kpi.higher_is_better ? Math.min(100, (value / target) * 100) : null;
  const met = value != null && target != null && (kpi.higher_is_better ? value >= target : value <= target);

  const save = (next: number) => {
    const clean = Math.max(0, next);
    const previous = value;
    setValue(clean); setError(null);
    start(async () => {
      const result = await setKpiValue(kpi.metric, clean);
      if (!result.ok) { setValue(previous); setError(result.error ?? "Could not save."); }
    });
  };

  return <article className={"gw-kpi" + (met ? " is-met" : "")}>
    <p className="gw-kicker">{kpi.category.toUpperCase()}</p>
    <h3>{kpi.metric}</h3>
    <div className="gw-kpi-row">
      <strong>{value == null ? "—" : value.toLocaleString()}{kpi.unit && kpi.unit !== "count" && value != null ? <em> {kpi.unit}</em> : null}</strong>
      <span>Target: {kpi.target_label}</span>
    </div>
    {pct !== null ? <div className="gw-bar" aria-hidden="true"><i style={{ width: pct + "%" }} /></div> : <div className="gw-bar gw-bar-empty" aria-hidden="true" />}
    {kpi.auto ? <small className="gw-muted">Updates automatically from your CRM</small> :
      <div className="gw-stepper" aria-busy={pending}>
        <button type="button" aria-label={"Decrease " + kpi.metric} onClick={() => save((value ?? 0) - 1)} disabled={pending || !value}>−</button>
        <input type="number" min={0} inputMode="numeric" aria-label={kpi.metric + " current value"} value={value ?? ""} placeholder="0"
          onChange={e => setValue(e.target.value === "" ? null : Number(e.target.value))}
          onBlur={() => { if (value !== kpi.current && value != null) save(value); }} />
        <button type="button" aria-label={"Increase " + kpi.metric} onClick={() => save((value ?? 0) + 1)} disabled={pending}>+</button>
      </div>}
    {error ? <small className="gw-error" role="alert">{error}</small> : null}
  </article>;
}

export default function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return <div className="gw-kpis">{kpis.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)}</div>;
}
