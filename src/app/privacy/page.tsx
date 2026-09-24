import type { Metadata } from "next";
import { contentPageMetadata } from "@/lib/content-page-metadata";
import { ContentPage } from "@/components/common/ContentPage";
import { staticContentPages } from "@/lib/static-content-pages";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("privacy", "Privacy notice", "Read the BR Tours and Travels privacy notice.");
}

export default function PrivacyPage() {
  return <ContentPage eyebrow="Privacy notice" page={staticContentPages["privacy"]} />;
}
