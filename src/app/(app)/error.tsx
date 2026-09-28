"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-line bg-card p-6">
      <h1 className="font-display text-3xl">Something went sideways</h1>
      <p className="mt-2 text-ink-soft">
        Your meals are still saved. Try that again.
      </p>
      <button type="button" className="button-primary mt-5" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
