import type { Metadata } from "next";
import { ContentPage, ContentUnavailable } from "@/components/common/ContentPage";
import { ApiRequestError, getContentPage } from "@/lib/api";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const result = await getContentPage("terms")
    .then((value) => ({ value, error: null }))
    .catch((error: unknown) => ({ value: null, error }));
  if (result.error instanceof ApiRequestError && result.error.status === 404)
    return <MissingTerms />;
  if (result.error || !result.value)
    return <ContentUnavailable title="Terms cannot be loaded right now" />;
  return <ContentPage eyebrow="Terms" page={result.value.data} />;
}

function MissingTerms() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Owner input required</p>
      <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Commercial terms are awaiting approval.</h1>
      <p className="mt-5 text-lg leading-8 text-text-muted">
        No unapproved payment, supplier or liability terms are being presented
        as final.
      </p>
    </div>
  );
}
