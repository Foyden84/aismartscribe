"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <Link href="/" className="auth-brand-link">
          AI Smart Scribe
        </Link>
      </div>
      <div className="auth-content">
        <div className="error-card">
          <div className="error-badge">Something went wrong</div>
          <h1>We hit a snag on our end.</h1>
          <p>
            The page ran into an unexpected error. It&apos;s usually temporary
            — try again, or head back to the home page.
          </p>
          {error.digest && (
            <p className="error-digest">Error ID: {error.digest}</p>
          )}
          <div className="error-actions">
            <button type="button" className="btn btn-primary" onClick={reset}>
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
