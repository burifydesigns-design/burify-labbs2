export default function BlogPostLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-10 bg-border-light rounded w-2/3 mb-4" />
      <div className="h-6 bg-border-light rounded w-1/3 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-border-light rounded" style={{ width: `${85 - i * 5}%` }} />
        ))}
      </div>
    </div>
  );
}