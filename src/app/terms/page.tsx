import type { Metadata } from "next";
import { contentPageMetadata } from "@/lib/content-page-metadata";
import { ContentPage } from "@/components/common/ContentPage";
import { staticContentPages } from "@/lib/static-content-pages";

export const revalidate = 30;
export function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("terms", "Terms", "Read the BR Tours and Travels booking terms and conditions.");
}

export default function TermsPage() {
  return <ContentPage eyebrow="Terms" page={staticContentPages["terms"]} />;
}
