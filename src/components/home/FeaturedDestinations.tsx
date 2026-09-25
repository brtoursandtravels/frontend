import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Destination } from "@/lib/contracts";
import { SectionHeader } from "@/components/common/SectionHeader";
import { animationClasses } from "@/lib/animations";

const destinationAssets = {
  "char-dham": "/images/tours/char-dham-kedarnath.webp",
  kashmir: "/images/tours/kashmir-dal-lake.webp",
  matheran: "/images/tours/matheran-monsoon.webp",
  rajasthan: "/images/tours/rajasthan-amber-fort.webp",
  jaisalmer: "/images/tours/jaisalmer-golden-fort.webp",
} as const;

const fallbackAssets = Object.values(destinationAssets);

function assetFor(destination: Destination, index: number) {
  return (
    destination.cover?.url ??
    destinationAssets[destination.slug as keyof typeof destinationAssets] ??
    fallbackAssets[index % fallbackAssets.length]!
  );
}

export function FeaturedDestinations({
  destinations,
}: {
  destinations: Destination[];
}) {
  const items = destinations.slice(0, 5);
  if (!items.length) return null;
  return (
    <section
      className="defer-render mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10 max-[820px]:py-[4.5rem]"
      id="featured-destinations"
    >
      <SectionHeader
        eyebrow="Places to visit"
        title="Where would you like to travel?"
        description="Explore these places and find a trip you would enjoy."
        href="/destinations"
        linkLabel="View all places"
      />
      <div className="grid auto-rows-[18rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((destination, index) => (
          <Link
            className={`group relative min-h-64 overflow-hidden rounded-xl bg-primary text-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover ${
              index === 0
                ? "sm:col-span-2 lg:col-span-4 lg:row-span-2"
                : index < 3
                  ? "lg:col-span-2"
                  : "lg:col-span-3"
            }`}
            href={`/packages?destination=${destination.slug}`}
            key={destination.id}
          >
            <Image
              alt={
                destination.cover?.altText ??
                `${destination.name} travel landscape`
              }
              src={assetFor(destination, index)}
              className={`object-cover ${animationClasses.imageZoom}`}
              fill
              sizes={
                index === 0
                  ? "(max-width: 800px) 100vw, 65vw"
                  : "(max-width: 800px) 100vw, 40vw"
              }
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-2 p-6">
              <p className="mb-2 flex items-center gap-1.5 text-[0.72rem] font-extrabold uppercase tracking-wider text-secondary-light">
                <MapPin aria-hidden="true" size={16} /> Explore this place
              </p>
              <h3 className="m-0 font-display text-[1.65rem] font-semibold leading-tight text-white">
                {destination.name}
              </h3>
              <span className="mt-2 block max-w-md text-[0.95rem] leading-relaxed text-white/80">
                {destination.summary ??
                  "See the trips you can take here."}
              </span>
            </div>
            <ArrowUpRight
              className="absolute right-5 top-5 z-2 rounded-full bg-white/15 p-2 text-white backdrop-blur-md transition group-hover:rotate-12"
              aria-hidden="true"
              size={38}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
