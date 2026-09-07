"use client";

import Link from "next/link";
import {
  CalendarDays,
  Castle,
  Compass,
  Flower2,
  MapPin,
  MountainSnow,
  Search,
  TentTree,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import type { Category, Destination } from "@/lib/contracts";

const durationRanges = {
  "": {},
  weekend: { maxDays: "3" },
  short: { minDays: "3", maxDays: "5" },
  extended: { minDays: "7" },
} as const;

const quickTours = [
  { slug: "char-dham", label: "Char Dham Yatra", icon: MountainSnow },
  { slug: "kashmir", label: "Kashmir Valley", icon: Flower2 },
  { slug: "matheran", label: "Matheran Hill Station", icon: TrainFront },
  { slug: "rajasthan", label: "Royal Rajasthan", icon: Castle },
  { slug: "jaisalmer", label: "Jaisalmer Desert Camp", icon: TentTree },
] as const;

export function QuickSearchForm({
  destinations,
  categories,
}: {
  destinations: Destination[];
  categories: Category[];
}) {
  const [duration, setDuration] =
    useState<keyof typeof durationRanges>("");
  const range = durationRanges[duration];

  return (
    <div className="glass-card mt-[clamp(1.5rem,3.5vh,2.75rem)] min-w-0 max-w-full overflow-hidden rounded-xl p-2 max-[620px]:mt-8 max-[620px]:rounded-lg">
      <form
        className="grid grid-cols-[1.2fr_1fr_1fr_auto] max-[1100px]:grid-cols-3 max-[820px]:grid-cols-1"
        action="/packages"
      >
        <label className="grid min-w-0 gap-0.5 border-r border-border-subtle px-4 py-3 max-[820px]:border-r-0 max-[820px]:border-b">
          <span className="flex items-center gap-1.5 text-[0.67rem] font-extrabold uppercase tracking-[0.08em] text-primary">
            <MapPin aria-hidden="true" size={17} /> Destination
          </span>
          <select
            className="min-w-0 appearance-none border-0 bg-transparent py-1 pr-5 text-sm text-text-body outline-none"
            aria-label="Destination"
            name="destination"
            defaultValue=""
          >
            <option value="">Where would you like to go?</option>
            {destinations.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-0.5 border-r border-border-subtle px-4 py-3 max-[820px]:border-r-0 max-[820px]:border-b">
          <span className="flex items-center gap-1.5 text-[0.67rem] font-extrabold uppercase tracking-[0.08em] text-primary">
            <CalendarDays aria-hidden="true" size={17} /> Duration
          </span>
          <select
            className="min-w-0 appearance-none border-0 bg-transparent py-1 pr-5 text-sm text-text-body outline-none"
            aria-label="Duration"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value as keyof typeof durationRanges)
            }
          >
            <option value="">Any duration</option>
            <option value="weekend">Weekend escape</option>
            <option value="short">3–5 days</option>
            <option value="extended">7+ days</option>
          </select>
          {"minDays" in range ? (
            <input name="minDays" type="hidden" value={range.minDays} />
          ) : null}
          {"maxDays" in range ? (
            <input name="maxDays" type="hidden" value={range.maxDays} />
          ) : null}
        </label>
        <label className="grid min-w-0 gap-0.5 border-r border-border-subtle px-4 py-3 max-[820px]:border-r-0 max-[820px]:border-b">
          <span className="flex items-center gap-1.5 text-[0.67rem] font-extrabold uppercase tracking-[0.08em] text-primary">
            <Compass aria-hidden="true" size={17} /> Travel style
          </span>
          <select
            className="min-w-0 appearance-none border-0 bg-transparent py-1 pr-5 text-sm text-text-body outline-none"
            aria-label="Travel style"
            name="category"
            defaultValue=""
          >
            <option value="">All experiences</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="flex min-h-12 min-w-44 items-center justify-center gap-2 rounded-[calc(var(--radius-xl)-0.35rem)] border-0 bg-gradient-to-br from-accent to-secondary px-4 py-3 text-sm font-extrabold text-white transition hover:-translate-y-1 hover:shadow-accent-sm max-[1100px]:col-span-3 max-[820px]:col-auto"
          type="submit"
        >
          <Search aria-hidden="true" size={19} />
          <span>Explore journeys</span>
        </button>
      </form>
      <nav
        className="flex max-w-full gap-2 overflow-x-auto border-t border-border-subtle px-2 pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Quick tour filters"
      >
        {quickTours.map((tour) => {
          const Icon = tour.icon;
          return (
            <Link
              className="group/pill inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/10 bg-primary-soft px-3 py-2 text-[0.7rem] font-extrabold text-primary no-underline transition hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-secondary-light focus-visible:bg-secondary-light motion-reduce:transform-none"
              href={`/packages?destination=${tour.slug}`}
              key={tour.slug}
            >
              <Icon
                className="text-secondary-hover transition-transform group-hover/pill:scale-110 motion-reduce:transform-none"
                aria-hidden="true"
                size={15}
              />
              {tour.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
