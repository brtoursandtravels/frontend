import type { Metadata } from "next";
import { contentPageMetadata } from "@/lib/content-page-metadata";
import { ContentPage, ContentUnavailable } from "@/components/common/ContentPage";
import { ApiRequestError, getContentPage } from "@/lib/api";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("cancellation-policy", "Cancellation policy", "Read the BR Tours and Travels cancellation policy.");
}

export default async function CancellationPolicyPage() {
  const result = await getContentPage("cancellation-policy")
    .then((value) => ({ value, error: null }))
    .catch((error: unknown) => ({ value: null, error }));
  if (result.error instanceof ApiRequestError && result.error.status === 404)
    return <MissingPolicy />;
  if (result.error || !result.value)
    return (
      <ContentUnavailable title="Cancellation information cannot be loaded right now" />
    );
  return <ContentPage eyebrow="Cancellation policy" page={result.value.data} />;
}

function MissingPolicy() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Owner input required</p>
      <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Cancellation rules are awaiting approval.</h1>
      <p className="mt-5 text-lg leading-8 text-text-muted">
        Package-specific rules may still appear on an eligible tour. General
        refund and cancellation wording must be owner-approved before launch.
      </p>
    </div>
  );
}
