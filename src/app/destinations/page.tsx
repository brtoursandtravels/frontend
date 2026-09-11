import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { ApiRequestError, getDestinations, getPackages } from "@/lib/api";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore Char Dham, Kashmir, Matheran, Rajasthan and Jaisalmer tours with BR Tours and Travels.",
  alternates: { canonical: "/destinations" },
};

const images: Record<string, string> = {
  "char-dham": "/images/tours/char-dham-kedarnath.webp",
  kashmir: "/images/tours/kashmir-dal-lake.webp",
  matheran: "/images/tours/matheran-monsoon.webp",
  rajasthan: "/images/tours/rajasthan-amber-fort.webp",
  jaisalmer: "/images/tours/jaisalmer-golden-fort.webp",
};

export default async function DestinationsPage() {
  const [destinationsResult, packagesResult] = await Promise.allSettled([
    getDestinations(),
    getPackages({ pageSize: 48 }),
  ]);
  if (destinationsResult.status === "rejected") {
    const error = destinationsResult.reason;
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">
            Destinations unavailable
          </p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">
            Destination content cannot be loaded.
          </h1>
          <p className="mt-4 text-text-muted">
            {error instanceof ApiRequestError
              ? error.message
              : "The live destination response was not usable."}
          </p>
          <Link
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-primary-hover"
            href="/destinations"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }
  const destinations = destinationsResult.value.data;
  const packages =
    packagesResult.status === "fulfilled" ? packagesResult.value.data : [];

  return (
    <div>
      <header className="relative flex min-h-[38rem] items-end overflow-hidden text-white max-[620px]:min-h-[33rem]">
        <Image
          className="object-cover"
          alt="A winding Himalayan road at sunrise"
          src="/images/tours/main-tours-hero.webp"
          fill
          priority
          sizes="100vw"
        />
        <span className="absolute inset-0 bg-linear-to-t from-primary-hover/95 via-primary/45 to-black/10" />
        <div className="relative z-1 mx-auto min-h-[38rem] w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 max-[620px]:min-h-[33rem]">
          <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">
            <Sparkles aria-hidden="true" size={16} /> India, five ways
          </p>
          <h1 className="m-0 max-w-4xl font-display text-[clamp(3.2rem,7vw,6.5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-white max-[620px]:text-[clamp(3.2rem,16vw,5rem)]">
            Choose a direction. We will shape the journey.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            Sacred mountain routes, quiet lakes, green hill trails, royal
            cities and desert light—explore BR&apos;s five featured destinations.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10 max-[820px]:py-[4.5rem]">
        {destinations.length ? (
          <div className="grid grid-cols-2 gap-6 max-[820px]:grid-cols-1">
            {destinations.map((destination) => {
              const count = packages.filter((item) =>
                item.destinations.some(
                  (entry) => entry.slug === destination.slug,
                ),
              ).length;
              return (
                <article
                  className="group overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                  key={destination.id}
                >
                  <Link
                    className="relative block aspect-[16/10] overflow-hidden"
                    href={`/packages?destination=${destination.slug}`}
                  >
                    <Image
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={`${destination.name} destination landscape`}
                      src={
                        images[destination.slug] ??
                        "/images/tours/main-tours-hero.webp"
                      }
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-extrabold text-primary backdrop-blur-md">
                      {count} published {count === 1 ? "journey" : "journeys"}
                    </span>
                  </Link>
                  <div className="p-6">
                    <p className="mb-2 flex items-center gap-1.5 text-[0.67rem] font-extrabold uppercase tracking-wider text-secondary-hover">
                      <MapPin aria-hidden="true" size={15} /> India
                    </p>
                    <h2 className="m-0 font-display text-3xl font-semibold text-text-heading">
                      {destination.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {destination.summary ??
                        "Explore the live BR catalogue for this destination."}
                    </p>
                    <Link
                      className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-primary no-underline hover:text-secondary"
                      href={`/packages?destination=${destination.slug}`}
                    >
                      Explore {destination.name}{" "}
                      <ArrowUpRight aria-hidden="true" size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card">
            <h2 className="font-display text-3xl text-text-heading">
              Destinations are being prepared.
            </h2>
            <p className="mt-3 text-text-muted">
              No unpublished regions have been substituted.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
