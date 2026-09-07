import type { Metadata } from "next";
import "@fontsource/lato/latin-400.css";
import "@fontsource/lato/latin-700.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-700.css";
import { FloatingContactBar } from "@/components/layout/FloatingContactBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSite } from "@/lib/api";
import { serverEnv } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "BR Tours and Travels",
    template: "%s | BR Tours and Travels",
  },
  description:
    "Discover bespoke journeys across India and beyond, thoughtfully shaped by BR Tours and Travels.",
  icons: {
    icon: "/br-logo-transparent.png",
    apple: "/br-logo-transparent.png",
  },
  openGraph: {
    type: "website",
    siteName: "BR Tours and Travels",
    title: "BR Tours and Travels",
    description:
      "Discover bespoke journeys across India and beyond, thoughtfully shaped by BR Tours and Travels.",
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
    url: serverEnv.NEXT_PUBLIC_SITE_URL,
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
