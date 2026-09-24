import type { Metadata } from "next";
import { contentPageMetadata } from "@/lib/content-page-metadata";
import { ContentPage } from "@/components/common/ContentPage";
import { staticContentPages } from "@/lib/static-content-pages";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("cancellation-policy", "Cancellation policy", "Read the BR Tours and Travels cancellation policy.");
}

export default function CancellationPolicyPage() {
  return <ContentPage eyebrow="Cancellation policy" page={staticContentPages["cancellation-policy"]} />;
}
