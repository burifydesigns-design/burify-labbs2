"use client";

import { Button } from "@/components/ui/Button";

export default function BlogError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 rounded-2xl border border-red-200 bg-red-50 text-center">
      <h2 className="text-h3 text-red-900 mb-2">Something went wrong</h2>
      <p className="text-body text-red-700 mb-6">
        We couldn&apos;t load this article. Please try again or return to the blog.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" href="/blog">
          Back to Blog
        </Button>
      </div>
    </div>
  );
}