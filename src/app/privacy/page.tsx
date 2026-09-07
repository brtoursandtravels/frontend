import type { Metadata } from "next";
import { ContentPage, ContentUnavailable } from "@/components/common/ContentPage";
import { ApiRequestError, getContentPage } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Privacy notice",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const result = await getContentPage("privacy")
    .then((value) => ({ value, error: null }))
    .catch((error: unknown) => ({ value: null, error }));
  if (result.error instanceof ApiRequestError && result.error.status === 404)
    return <MissingPolicy />;
  if (result.error || !result.value)
    return (
      <ContentUnavailable title="The privacy notice cannot be loaded right now" />
    );
  return <ContentPage eyebrow="Privacy" page={result.value.data} />;
}

function MissingPolicy() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Owner input required</p>
      <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Privacy notice is awaiting approval.</h1>
      <p className="mt-5 text-lg leading-8 text-text-muted">
        The enquiry form remains clear about its immediate purpose, but final
        retention and legal wording must be published before launch.
      </p>
    </div>
  );
}
