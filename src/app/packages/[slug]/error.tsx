"use client";

export default function PackageError({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Service interruption</p>
        <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">This package cannot be loaded right now</h1>
        <p className="mt-4 text-text-muted">
          The package may still exist; the live backend did not return a usable
          response. This is different from a missing package.
        </p>
        <button className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border-0 bg-primary px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-primary-hover" onClick={retry}>
          Try again
        </button>
      </div>
    </div>
  );
}
