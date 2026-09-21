"use client";

import { BedDouble, ChevronDown, Footprints, Images, MapPin, Plane, Route, Utensils } from "lucide-react";
import { useState } from "react";
import type { PackageDetail } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";
import { BrandedSelect } from "@/components/common/BrandedSelect";

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
    if (day.image) return day.image;
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
    <div className="@container">
      <div className="mb-5 flex items-end justify-between gap-4 @max-[34rem]:items-stretch @max-[34rem]:flex-col">
        <p className="m-0 flex items-center gap-2 text-sm text-text-muted">
          <Route aria-hidden="true" className="text-secondary" size={18} />
          {itinerary.length} thoughtfully paced days
        </p>
        <div className="flex items-end gap-2 @max-[34rem]:w-full @max-[22rem]:items-stretch @max-[22rem]:flex-col">
          <div className="grid min-w-52 gap-1 text-[0.62rem] font-extrabold uppercase tracking-wider text-secondary-hover @max-[34rem]:min-w-0 @max-[34rem]:flex-1">
            <label htmlFor="itinerary-day-select">Jump to a day</label>
            <BrandedSelect
              defaultValue=""
              id="itinerary-day-select"
              onValueChange={(value) => {
                if (value) jumpToDay(Number(value));
              }}
              options={[
                { value: "", label: "Select day", disabled: true },
                ...itinerary.map((day) => ({ value: String(day.dayNumber), label: `Day ${day.dayNumber}: ${day.title}` })),
              ]}
              pill
            />
          </div>
          <button
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-extrabold text-primary transition hover:border-primary"
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
                  <div className={`grid ${preview ? "grid-cols-[1fr_15rem]" : "grid-cols-1"} @max-[34rem]:grid-cols-1`}>
                    <div className="p-5">
                      <p className="m-0 text-sm leading-7 text-text-muted">{day.description}</p>
                      {day.activities.length ? <ul className="mt-4 space-y-2 pl-5 text-sm text-text-muted">{day.activities.map((activity, i) => <li key={i}>{activity}</li>)}</ul> : null}
                      <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] font-bold text-primary">
                        {day.accommodation ? <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><BedDouble aria-hidden="true" size={14} />{day.accommodation}</span> : null}
                        {day.meals ? <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><Utensils aria-hidden="true" size={14} />{day.meals}</span> : null}
                        {!day.accommodation && !day.meals ? <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2"><MapPin aria-hidden="true" size={15} />Planned route and experiences</span> : null}
                      </div>
                    </div>
                    {preview ? (
                      <div className="relative min-h-44 overflow-hidden @max-[34rem]:order-first">
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
