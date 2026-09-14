import Link from "next/link";
import { Grid2X2, Images, SlidersHorizontal } from "lucide-react";
import type { Destination, PackageCard } from "@/lib/contracts";
import { BrandedSelect } from "@/components/common/BrandedSelect";

type GalleryQuery = { destination?: string; package?: string; view?: string };

function galleryHref(query: GalleryQuery, changes: GalleryQuery) {
  const params = new URLSearchParams();
  const merged = { ...query, ...changes };
  if (merged.destination) params.set("destination", merged.destination);
  if (merged.package) params.set("package", merged.package);
  if (merged.view === "wall") params.set("view", "wall");
  return `/gallery${params.size ? `?${params}` : ""}`;
}

export function GalleryDiscoveryBar({ destinations, packages, query }: { destinations: Destination[]; packages: PackageCard[]; query: GalleryQuery }) {
  const wall = query.view === "wall";
  return (
    <section className="sticky top-[5rem] z-30 border-y border-border-subtle bg-bg-base/92 py-3 shadow-card backdrop-blur-xl max-[620px]:static" aria-label="Gallery discovery filters">
      <div className="mx-auto grid min-w-0 w-full max-w-7xl gap-3 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center justify-between gap-4 max-[800px]:items-start max-[620px]:flex-col">
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 max-[620px]:w-full max-[620px]:flex-none max-[620px]:flex-wrap max-[620px]:overflow-x-visible" aria-label="Filter by destination">
            <Link className={`shrink-0 rounded-full border px-4 py-2 text-[0.75rem] font-extrabold no-underline transition max-[420px]:px-3 ${!query.destination ? "border-primary bg-primary text-white" : "border-border-subtle bg-white text-primary hover:border-primary/40"}`} href={galleryHref(query, { destination: undefined })}>All collections</Link>
            {destinations.slice(0, 8).map((destination) => {
              const active = query.destination === destination.slug;
              return <Link className={`shrink-0 rounded-full border px-4 py-2 text-[0.75rem] font-extrabold no-underline transition max-[420px]:px-3 ${active ? "border-primary bg-primary text-white" : "border-border-subtle bg-white text-primary hover:border-primary/40"}`} href={galleryHref(query, { destination: destination.slug })} key={destination.id}>{destination.name}</Link>;
            })}
          </nav>
          <div className="flex shrink-0 rounded-full border border-border-subtle bg-white p-1 max-[620px]:self-start" aria-label="Gallery view">
            <Link aria-label="Curated album view" aria-current={!wall ? "page" : undefined} className={`grid min-h-9 grid-cols-[auto_1fr] items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-extrabold no-underline ${!wall ? "bg-primary text-white" : "text-primary"}`} href={galleryHref(query, { view: undefined })}><Images aria-hidden="true" size={15} /><span className="max-[620px]:hidden">Albums</span></Link>
            <Link aria-label="Masonry photo wall" aria-current={wall ? "page" : undefined} className={`grid min-h-9 grid-cols-[auto_1fr] items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-extrabold no-underline ${wall ? "bg-primary text-white" : "text-primary"}`} href={galleryHref(query, { view: "wall" })}><Grid2X2 aria-hidden="true" size={15} /><span className="max-[620px]:hidden">Photo wall</span></Link>
          </div>
        </div>
        <form className="flex min-w-0 w-full items-center gap-3 max-[620px]:grid max-[620px]:grid-cols-[minmax(0,1fr)_auto]" action="/gallery">
          {query.destination ? <input type="hidden" name="destination" value={query.destination} /> : null}
          {wall ? <input type="hidden" name="view" value="wall" /> : null}
          <label className="sr-only" htmlFor="gallery-package"><SlidersHorizontal aria-hidden="true" /> Filter by related package</label>
          <BrandedSelect
            className="min-w-0 flex-1"
            defaultValue={query.package ?? ""}
            id="gallery-package"
            name="package"
            options={[
              { value: "", label: "View photos from any package" },
              ...packages.map((item) => ({ value: item.slug, label: item.title })),
            ]}
            pill
          />
          <button className="min-h-10 rounded-full border-0 bg-secondary px-5 text-[0.75rem] font-extrabold text-white transition hover:bg-secondary-hover" type="submit">Apply</button>
          {query.destination || query.package ? <Link className="text-[0.72rem] font-extrabold text-primary max-[620px]:col-span-2" href={wall ? "/gallery?view=wall" : "/gallery"}>Clear filters</Link> : null}
        </form>
      </div>
    </section>
  );
}
