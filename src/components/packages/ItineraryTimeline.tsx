"use client";

import { ArrowLeft, ArrowRight, MapPin, Route } from "lucide-react";
import { useState } from "react";
import type { PackageDetail } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

export function ItineraryTimeline({
  itinerary,
  media = [],
}: {
  itinerary: PackageDetail["itinerary"];
  media?: PackageDetail["media"];
}) {
  const [activeDay, setActiveDay] = useState(
    itinerary[0]?.dayNumber ?? 0,
  );
  const activeIndex = Math.max(
    0,
    itinerary.findIndex((day) => day.dayNumber === activeDay),
  );
  const day = itinerary[activeIndex];
  const preview = media.length ? media[activeIndex % media.length] : null;

  if (!day) {
    return <p>The day-by-day plan is still being prepared.</p>;
  }

  function selectDay(index: number) {
    const selected = itinerary[index];
    if (selected) setActiveDay(selected.dayNumber);
  }

  function onTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % itinerary.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + itinerary.length) % itinerary.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = itinerary.length - 1;
    else return;
    event.preventDefault();
    selectDay(next);
    const tabs = event.currentTarget.parentElement?.querySelectorAll("button");
    (tabs?.[next] as HTMLButtonElement | undefined)?.focus();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="m-0 flex items-center gap-2 text-sm text-text-muted">
          <Route aria-hidden="true" className="text-secondary" size={18} />
          {itinerary.length} thoughtfully paced days
        </p>
        <span className="text-xs font-bold text-primary">
          Day {activeIndex + 1} of {itinerary.length}
        </span>
      </div>

      <div
        className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Choose an itinerary day"
      >
        {itinerary.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              className={`grid min-w-[9.5rem] gap-0.5 rounded-lg border px-4 py-3 text-left transition ${
                selected
                  ? "border-primary bg-primary text-white shadow-glow-teal"
                  : "border-border-subtle bg-bg-muted text-text-body hover:border-primary/35 hover:bg-primary-soft"
              }`}
              type="button"
              role="tab"
              id={`itinerary-tab-${item.dayNumber}`}
              aria-controls={`itinerary-panel-${item.dayNumber}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveDay(item.dayNumber)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              key={item.dayNumber}
            >
              <span
                className={`text-[0.62rem] font-extrabold uppercase tracking-wider ${selected ? "text-secondary-light" : "text-secondary-hover"}`}
              >
                Day {String(item.dayNumber).padStart(2, "0")}
              </span>
              <strong className="truncate text-sm">{item.title}</strong>
            </button>
          );
        })}
      </div>

      <article
        className="grid min-h-[22rem] grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-xl border border-border-subtle bg-bg-muted motion-safe:animate-showcase-reveal max-[720px]:grid-cols-1"
        role="tabpanel"
        id={`itinerary-panel-${day.dayNumber}`}
        aria-labelledby={`itinerary-tab-${day.dayNumber}`}
        key={day.dayNumber}
      >
        <div className="relative min-h-[22rem] overflow-hidden max-[720px]:min-h-56">
          {preview ? (
            <>
              <PublicImage
                alt={preview.altText}
                className="object-cover"
                sizes="(max-width: 720px) 100vw, 38vw"
                src={preview.url}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-primary-ink/70 via-transparent to-transparent" />
              {preview.caption ? (
                <span className="absolute inset-x-0 bottom-0 p-4 text-xs text-white/75">
                  {preview.caption}
                </span>
              ) : null}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_top_right,var(--color-primary-light),var(--color-primary-ink))] p-8 text-center text-white">
              <div className="grid place-items-center gap-3">
                <MapPin aria-hidden="true" size={34} />
                <span className="text-sm font-bold">
                  Route photography will be confirmed with your itinerary.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-[clamp(1.4rem,4vw,2.5rem)]">
          <p className="mb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">
            Day {String(day.dayNumber).padStart(2, "0")}
          </p>
          <h3 className="m-0 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-text-heading">
            {day.title}
          </h3>
          <p className="my-5 text-sm leading-7 text-text-muted">
            {day.description}
          </p>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-[0.68rem] font-bold text-primary">
            <MapPin aria-hidden="true" size={15} /> Planned sightseeing and
            experiences
          </span>
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-extrabold text-primary disabled:opacity-40"
              type="button"
              disabled={activeIndex === 0}
              onClick={() => selectDay(activeIndex - 1)}
            >
              <ArrowLeft aria-hidden="true" size={15} /> Previous
            </button>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-secondary to-accent transition-[width]"
                style={{ width: `${((activeIndex + 1) / itinerary.length) * 100}%` }}
              />
            </span>
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-extrabold text-primary disabled:opacity-40"
              type="button"
              disabled={activeIndex === itinerary.length - 1}
              onClick={() => selectDay(activeIndex + 1)}
            >
              Next <ArrowRight aria-hidden="true" size={15} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
