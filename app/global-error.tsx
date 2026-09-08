"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-h1 md:text-display text-text-primary mb-6 leading-tight">
              Something went wrong
            </h1>
            <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" onClick={reset}>
                Try Again
              </Button>
              <Button variant="outline" size="lg" href="/">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}