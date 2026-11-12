export default function ProgressRing({ value, total, size = 132, label }: { value: number; total: number; size?: number; label: string }) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total ? Math.min(1, value / total) : 0;
  return <div className="gw-ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} of ${total}`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} className="gw-ring-track" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} className="gw-ring-value" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
    <div className="gw-ring-text"><strong>{Math.round(pct * 100)}%</strong><span>{label}</span></div>
  </div>;
}
