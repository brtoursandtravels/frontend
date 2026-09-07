"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Castle,
  Check,
  Clock3,
  Flower2,
  MapPin,
  MessageCircle,
  MountainSnow,
  Sparkles,
  TentTree,
  TrainFront,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PackageCard } from "@/lib/contracts";
import { formatMoney, priceBasisLabel } from "@/lib/presentation";

const tours = [
  {
    slug: "char-dham",
    name: "Char Dham",
    icon: MountainSnow,
    image: "/images/tours/char-dham-kedarnath.webp",
    alt: "Kedarnath Temple beneath the Himalayan peaks",
    season: "May–Jun · Sep–Oct",
    duration: "11N / 12D",
    tagline: "A sacred Himalayan circuit, paced with care.",
    description:
      "Follow Yamunotri, Gangotri, Kedarnath and Badrinath with practical mountain-road timing, acclimatisation and personal support.",
    highlights: [
      "All four Char Dham shrines",
      "Altitude-aware Himalayan pacing",
      "Kedarnath access planned to current rules",
    ],
    colorClass: "bg-chardham",
    softClass: "bg-chardham/15 text-chardham",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    icon: Flower2,
    image: "/images/tours/kashmir-dal-lake.webp",
    alt: "A traditional shikara crossing Dal Lake in Kashmir",
    season: "Mar–Oct · Dec–Feb",
    duration: "5N / 6D",
    tagline: "Lake mornings and high-meadow horizons.",
    description:
      "Move gently through Srinagar, Gulmarg and Pahalgam with room for shikara rides, garden walks and flexible mountain days.",
    highlights: [
      "Dal Lake shikara experience",
      "Gulmarg and Pahalgam landscapes",
      "Houseboat and private-group options",
    ],
    colorClass: "bg-kashmir",
    softClass: "bg-kashmir/15 text-kashmir",
  },
  {
    slug: "matheran",
    name: "Matheran",
    icon: TrainFront,
    image: "/images/tours/matheran-monsoon.webp",
    alt: "A rain-washed forest trail through green Matheran hills",
    season: "Jun–Feb",
    duration: "2N / 3D",
    tagline: "A slower, greener weekend above the city.",
    description:
      "Trade traffic for red-earth trails, misty viewpoints and a walkable hill-station rhythm close to Mumbai.",
    highlights: [
      "Vehicle-free hill-station centre",
      "Heritage toy train, when operating",
      "Forest walks and valley viewpoints",
    ],
    colorClass: "bg-matheran",
    softClass: "bg-matheran/15 text-matheran",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    icon: Castle,
    image: "/images/tours/rajasthan-amber-fort.webp",
    alt: "Amber Fort glowing above Maota Lake near Jaipur",
    season: "Oct–Mar",
    duration: "7N / 8D",
    tagline: "Royal cities, layered stories and desert light.",
    description:
      "Connect Jaipur, Jodhpur and Udaipur through forts, old-city lanes, crafts and evenings beside the lakes.",
    highlights: [
      "Jaipur, Jodhpur and Udaipur circuit",
      "Forts, palaces and local neighbourhoods",
      "Comfortably spaced intercity drives",
    ],
    colorClass: "bg-rajasthan",
    softClass: "bg-rajasthan/15 text-rajasthan",
  },
  {
    slug: "jaisalmer",
    name: "Jaisalmer",
    icon: TentTree,
    image: "/images/tours/jaisalmer-golden-fort.webp",
    alt: "Golden Jaisalmer Fort beyond the Thar Desert dunes",
    season: "Oct–Mar",
    duration: "3N / 4D",
    tagline: "Golden-stone heritage under a desert sky.",
    description:
      "Pair Jaisalmer’s living fort and carved havelis with a thoughtfully selected evening among the Thar dunes.",
    highlights: [
      "Living fort and historic havelis",
      "Curated desert sunset experience",
      "Camel safari and seasonal stargazing",
    ],
    colorClass: "bg-jaisalmer",
    softClass: "bg-jaisalmer/15 text-jaisalmer",
  },
] as const;

function packageForTour(packages: PackageCard[], slug: string) {
  const matches = packages.filter((item) =>
    item.destinations.some((destination) => destination.slug === slug),
  );
  return matches.reduce<PackageCard | null>((lowest, item) => {
    if (!lowest) return item;
    const itemPrice = Number(item.startingPrice?.amount ?? Number.POSITIVE_INFINITY);
    const lowestPrice = Number(
      lowest.startingPrice?.amount ?? Number.POSITIVE_INFINITY,
    );
    return itemPrice < lowestPrice ? item : lowest;
  }, null);
}

function whatsappTourHref(href: string, tourName: string) {
  try {
    const url = new URL(href);
    url.searchParams.set(
      "text",
      `Hello BR Tours, I would like to discuss a ${tourName} journey.`,
    );
    return url.toString();
  } catch {
    return href;
  }
}

export function FlagshipToursShowcase({
  packages,
  whatsappHref,
}: {
  packages: PackageCard[];
  whatsappHref?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const tour = tours[activeIndex]!;
  const featuredPackage = packageForTour(packages, tour.slug);
  const price = featuredPackage?.startingPrice
    ? formatMoney(
        featuredPackage.startingPrice.amount,
        featuredPackage.startingPrice.currency,
      )
    : null;
  const priceBasis = featuredPackage?.startingPrice
    ? priceBasisLabel(featuredPackage.startingPrice.basis)
    : null;
  const duration = featuredPackage
    ? `${featuredPackage.nights}N / ${featuredPackage.days}D`
    : tour.duration;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % tours.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [paused]);

  function move(direction: 1 | -1) {
    setActiveIndex(
      (current) => (current + direction + tours.length) % tours.length,
    );
  }

  return (
    <section
      className="scroll-mt-24 overflow-hidden bg-primary-ink py-24 text-white max-[820px]:py-[4.5rem]"
      id="flagship-tours"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setPaused(false);
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-8 max-[820px]:items-start max-[820px]:flex-col">
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">
              <Sparkles aria-hidden="true" size={16} /> Five flagship journeys
            </p>
            <h2 className="m-0 text-balance font-display text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
              One country. Five unforgettable moods.
            </h2>
          </div>
          <p className="m-0 max-w-sm text-sm leading-relaxed text-white/65">
            Choose a landscape to see its signature route. Every itinerary can
            be refined around your dates, pace and travelling party.
          </p>
        </div>

        <div
          className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Flagship tour destinations"
        >
          {tours.map((item, index) => {
            const Icon = item.icon;
            const active = index === activeIndex;
            return (
              <button
                className={`flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-extrabold transition motion-reduce:transition-none ${
                  active
                    ? "border-white bg-white text-primary shadow-glow-gold"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:bg-white/10 hover:text-white"
                }`}
                type="button"
                role="tab"
                id={`flagship-tab-${item.slug}`}
                aria-controls={`flagship-panel-${item.slug}`}
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                key={item.slug}
              >
                <Icon aria-hidden="true" size={18} /> {item.name}
              </button>
            );
          })}
        </div>

        <article
          className="grid min-h-[36rem] grid-cols-[1.18fr_0.82fr] overflow-hidden rounded-xl border border-white/15 bg-white shadow-dropdown motion-safe:animate-showcase-reveal max-[900px]:grid-cols-1"
          role="tabpanel"
          id={`flagship-panel-${tour.slug}`}
          aria-labelledby={`flagship-tab-${tour.slug}`}
          key={tour.slug}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const end = event.changedTouches[0]?.clientX;
            if (touchStart.current === null || end === undefined) return;
            const distance = touchStart.current - end;
            touchStart.current = null;
            if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
          }}
        >
          <div className="group relative min-h-[36rem] overflow-hidden max-[900px]:min-h-[28rem] max-[620px]:min-h-[22rem]">
            <Image
              className="object-cover transition-transform duration-1000 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
              src={tour.image}
              alt={tour.alt}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 900px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-ink/90 via-primary-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary-ink/60 px-3 py-2 text-xs font-extrabold text-white backdrop-blur-xl">
                <Clock3 aria-hidden="true" size={15} /> {duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary-ink/60 px-3 py-2 text-xs font-extrabold text-white backdrop-blur-xl">
                <CalendarDays aria-hidden="true" size={15} /> Best: {tour.season}
              </span>
            </div>
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden p-[clamp(1.6rem,4vw,3.5rem)] text-text-body">
            <span
              className={`absolute right-0 top-0 h-full w-1.5 ${tour.colorClass}`}
              aria-hidden="true"
            />
            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-hover">
              <MapPin aria-hidden="true" size={16} /> {tour.name}, India
            </p>
            <h3 className="m-0 font-display text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.035em] text-text-heading">
              {tour.tagline}
            </h3>
            <p className="my-5 text-sm leading-7 text-text-muted">
              {tour.description}
            </p>
            <ul className="m-0 grid list-none gap-3 p-0">
              {tour.highlights.map((highlight) => (
                <li className="flex items-start gap-3 text-sm" key={highlight}>
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${tour.softClass}`}
                  >
                    <Check aria-hidden="true" size={14} strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="my-6 border-y border-border-subtle py-4">
              <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-muted">
                Starting from
              </span>
              <strong className="font-display text-3xl text-primary">
                {price ?? "Personal quote"}
              </strong>
              {price ? (
                <span className="ml-2 text-xs text-text-muted">
                  {priceBasis ? `${priceBasis}*` : "*"}
                </span>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-primary-hover motion-reduce:transform-none"
                href={`/packages?destination=${tour.slug}`}
              >
                View packages <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              {whatsappHref ? (
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-success/30 bg-success-bg px-5 py-3 text-center text-sm font-extrabold text-success no-underline transition hover:-translate-y-0.5 motion-reduce:transform-none"
                  href={whatsappTourHref(whatsappHref, tour.name)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" size={17} /> WhatsApp
                  enquiry
                </a>
              ) : (
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-5 py-3 text-sm font-extrabold text-primary no-underline"
                  href={`/contact-us?tour=${tour.slug}`}
                >
                  <MessageCircle aria-hidden="true" size={17} /> Quick enquiry
                </Link>
              )}
            </div>
            <p className="mb-0 mt-3 text-[0.65rem] leading-relaxed text-text-muted">
              *Final price, taxes, dates and inclusions are confirmed after
              enquiry.
            </p>
          </div>
        </article>

        <div className="mt-5 flex items-center justify-between gap-5 text-xs text-white/55">
          <span>{paused ? "Paused while you explore" : "Advances every 6 seconds"}</span>
          <div className="flex gap-2" aria-hidden="true">
            {tours.map((item, index) => (
              <span
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-secondary" : "w-1.5 bg-white/25"
                }`}
                key={item.slug}
              />
            ))}
          </div>
          <span className="max-[620px]:hidden">Swipe on mobile</span>
        </div>
      </div>
    </section>
  );
}
