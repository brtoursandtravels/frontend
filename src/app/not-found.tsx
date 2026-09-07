import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card sm:p-12">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">404</p>
        <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">That journey is not here</h1>
        <p className="mt-4 text-text-muted">The page may have moved, remained unpublished, or never existed.</p>
        <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-primary-hover" href="/packages">
          Browse packages
        </Link>
      </div>
    </div>
  );
}
