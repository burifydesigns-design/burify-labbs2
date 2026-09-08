export default function WorkDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-10 bg-border-light rounded w-2/3 mb-4" />
      <div className="h-6 bg-border-light rounded w-1/3 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-border-light rounded" style={{ width: `${80 - i * 5}%` }} />
        ))}
      </div>
    </div>
  );
}