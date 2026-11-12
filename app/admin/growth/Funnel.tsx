export default function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(1, ...steps.map(s => s.value));
  return <ol className="gw-funnel">
    {steps.map((step, i) => {
      const prev = i > 0 ? steps[i - 1].value : 0;
      const rate = i > 0 && prev > 0 ? Math.round((step.value / prev) * 100) : null;
      return <li key={step.label}>
        <div className="gw-funnel-head"><span>{step.label}</span><strong>{step.value.toLocaleString()}</strong></div>
        <div className="gw-funnel-bar" aria-hidden="true"><i style={{ width: Math.max(step.value ? 3 : 0, (step.value / max) * 100) + "%" }} /></div>
        {rate !== null ? <small>{rate}% of previous step</small> : <small>Clinics in your ICP with an email</small>}
      </li>;
    })}
  </ol>;
}
