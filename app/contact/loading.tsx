export default function ContactLoading() {
  return (
    <div className="p-8 rounded-2xl border border-border bg-background animate-pulse">
      <div className="h-8 bg-border-light rounded w-1/3 mb-6" />
      <div className="space-y-4">
        <div className="h-12 bg-border-light rounded" />
        <div className="h-12 bg-border-light rounded" />
        <div className="h-12 bg-border-light rounded" />
        <div className="h-32 bg-border-light rounded" />
        <div className="h-12 bg-border-light rounded w-1/4" />
      </div>
    </div>
  );
}