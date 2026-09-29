import type { Metadata } from "next";
import "@fontsource/lato/latin-400.css";
import "@fontsource/lato/latin-700.css";
import { FloatingContactBar } from "@/components/layout/FloatingContactBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSite } from "@/lib/api";
import { siteOrigin } from "@/lib/env";
import "./globals.css";

// Keep every public page on the same freshness interval, including new routes.
export const revalidate = 30;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "BR Tours and Travels",
    template: "%s | BR Tours and Travels",
  },
  description:
    "Plan your next trip with BR Tours and Travels. Explore tour packages, car and bus rentals, and holidays planned around your dates and budget.",
  openGraph: {
    type: "website",
    siteName: "BR Tours and Travels",
    title: "BR Tours and Travels",
    description:
      "Plan your next trip with BR Tours and Travels. Explore tour packages, car and bus rentals, and holidays planned around your dates and budget.",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite()
    .then((result) => result.data)
    .catch(() => null);
  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "BR Tours and Travels",
    url: siteOrigin,
  };
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-bg-base text-text-body antialiased">
        <a className="fixed -top-20 left-4 z-100 bg-white px-4 py-3 font-bold text-primary focus:top-4" href="#main-content">
          Skip to content
        </a>
        <SiteHeader site={site} />
        <main className="min-h-[60vh]" id="main-content">{children}</main>
        <SiteFooter site={site} />
        <FloatingContactBar site={site} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replaceAll("<", "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
