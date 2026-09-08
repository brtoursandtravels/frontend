"use client";

import { BedDouble, CarFront, ChevronDown, Footprints, Images, MapPin, Plane, Route, Utensils } from "lucide-react";
import { useState } from "react";
import type { PackageDetail } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

export function ItineraryTimeline({
  itinerary,
  media = [],
  yatraMode = false,
}: {
  itinerary: PackageDetail["itinerary"];
  media?: PackageDetail["media"];
  yatraMode?: boolean;
}) {
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(itinerary[0] ? [itinerary[0].dayNumber] : []),
  );
  const allOpen = itinerary.length > 0 && openDays.size === itinerary.length;

  if (!itinerary.length) {
    return <p>The day-by-day plan is still being prepared.</p>;
  }

  function toggleDay(dayNumber: number) {
    setOpenDays((current) => {
      const next = new Set(current);
      if (next.has(dayNumber)) next.delete(dayNumber);
      else next.add(dayNumber);
      return next;
    });
  }

  function jumpToDay(dayNumber: number) {
    setOpenDays((current) => new Set(current).add(dayNumber));
    window.requestAnimationFrame(() => {
      document.getElementById(`itinerary-day-${dayNumber}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function imageForDay(day: PackageDetail["itinerary"][number], index: number) {
    if (!media.length) return null;
    if (!yatraMode) return media[index % media.length] ?? null;
    const searchText = `${day.title} ${day.description}`;
    const imageKey = /helicopter|helipad|phata/i.test(searchText)
      ? "helicopter"
      : /kedarnath/i.test(searchText)
        ? "kedarnath"
        : /badrinath/i.test(searchText)
          ? "badrinath"
          : /gangotri/i.test(searchText)
            ? "gangotri"
            : /yamunotri/i.test(searchText)
              ? "yamunotri"
              : "road";
    return media.find((item) => item.id.includes(imageKey)) ?? media[index % media.length] ?? null;
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4 max-[720px]:items-stretch max-[720px]:flex-col">
        <p className="m-0 flex items-center gap-2 text-sm text-text-muted">
          <Route aria-hidden="true" className="text-secondary" size={18} />
          {itinerary.length} thoughtfully paced days
        </p>
        <div className="flex items-end gap-2 max-[520px]:items-stretch max-[520px]:flex-col">
          <label className="grid min-w-52 gap-1 text-[0.62rem] font-extrabold uppercase tracking-wider text-secondary-hover">
            Jump to a day
            <select
              className="rounded-full border border-border-subtle bg-white px-4 py-2.5 text-xs font-bold normal-case tracking-normal text-text-heading outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) jumpToDay(Number(event.target.value));
              }}
            >
              <option value="" disabled>Select day</option>
              {itinerary.map((day) => <option value={day.dayNumber} key={day.dayNumber}>Day {day.dayNumber}: {day.title}</option>)}
            </select>
          </label>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-extrabold text-primary transition hover:border-primary"
            type="button"
            onClick={() => setOpenDays(allOpen ? new Set() : new Set(itinerary.map((day) => day.dayNumber)))}
          >
            <Images aria-hidden="true" size={15} /> {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {itinerary.map((day, index) => {
          const expanded = openDays.has(day.dayNumber);
          const preview = imageForDay(day, index);
          const isKedarnathDay = yatraMode && (day.dayNumber === 5 || day.dayNumber === 6 || /kedarnath/i.test(`${day.title} ${day.description}`));
          return (
            <article className={`scroll-mt-28 overflow-hidden rounded-lg border transition ${expanded ? "border-secondary/35 bg-bg-muted shadow-sm" : "border-border-subtle bg-white hover:border-primary/25"}`} id={`itinerary-day-${day.dayNumber}`} key={day.dayNumber}>
              <h3 className="m-0">
                <button
                  className="grid min-h-14 w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-0 bg-transparent px-4 py-3 text-left"
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`itinerary-content-${day.dayNumber}`}
                  onClick={() => toggleDay(day.dayNumber)}
                >
                  <span className={`rounded-md px-3 py-1.5 text-[0.68rem] font-extrabold uppercase ${expanded ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}>Day {day.dayNumber}</span>
                  <span className="font-display text-[0.95rem] font-semibold text-text-heading">{day.title}</span>
                  <ChevronDown aria-hidden="true" className={`text-secondary transition-transform ${expanded ? "rotate-180" : ""}`} size={18} />
                </button>
              </h3>

              {expanded ? (
                <div className="border-t border-border-subtle" id={`itinerary-content-${day.dayNumber}`}>
                  <div className={`grid ${preview ? "grid-cols-[1fr_15rem]" : "grid-cols-1"} max-[720px]:grid-cols-1`}>
                    <div className="p-5">
                      <p className="m-0 text-sm leading-7 text-text-muted">{day.description}</p>
                      {yatraMode ? (
                        <div className="mt-4 flex flex-wrap gap-2 text-[0.66rem] font-bold text-primary">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><BedDouble aria-hidden="true" size={14} /> Halt confirmed in final plan</span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><Utensils aria-hidden="true" size={14} /> Meals shown in inclusions</span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><CarFront aria-hidden="true" size={14} /> Timings reviewed</span>
                        </div>
                      ) : (
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[0.68rem] font-bold text-primary"><MapPin aria-hidden="true" size={15} /> Planned route and experiences</span>
                      )}
                    </div>
                    {preview ? (
                      <div className="relative min-h-44 overflow-hidden max-[720px]:order-first">
                        <PublicImage alt={preview.altText} className="object-cover" sizes="(max-width: 720px) 100vw, 240px" src={preview.url} />
                      </div>
                    ) : null}
                  </div>

                  {isKedarnathDay ? (
                    <div className="grid grid-cols-2 gap-3 border-t border-border-subtle p-4 max-[620px]:grid-cols-1">
                      <div className="rounded-lg bg-white p-4">
                        <Footprints aria-hidden="true" className="mb-2 text-secondary-hover" size={21} />
                        <strong className="block text-sm text-text-heading">Trek, pony or palki</strong>
                        <p className="mb-0 mt-1 text-xs leading-relaxed text-text-muted">Requires realistic time and fitness planning. Local services depend on operations and availability.</p>
                      </div>
                      <div className="rounded-lg bg-accent-soft p-4">
                        <Plane aria-hidden="true" className="mb-2 text-secondary-hover" size={21} />
                        <strong className="block text-sm text-text-heading">Helicopter shuttle</strong>
                        <p className="mb-0 mt-1 text-xs leading-relaxed text-text-muted">Subject to weather, operator schedules, passenger rules and availability.</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
