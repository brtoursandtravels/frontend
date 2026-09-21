import Link from "next/link";
import { Grid2X2, Images, SlidersHorizontal } from "lucide-react";
import type { PackageCard } from "@/lib/contracts";
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

export function GalleryDiscoveryBar({ packages, query }: { packages: Pick<PackageCard, "slug" | "title">[]; query: GalleryQuery }) {
  const wall = query.view === "wall";
  return (
    <section className="sticky top-[5rem] z-30 border-y border-border-subtle bg-bg-base/92 py-3 shadow-card backdrop-blur-xl max-[620px]:relative max-[620px]:top-0" aria-label="Gallery discovery filters">
      <div className="mx-auto flex min-w-0 w-full max-w-7xl items-center gap-3 px-5 sm:px-8 lg:px-10 max-[800px]:flex-wrap max-[620px]:items-stretch">
        <form className="flex min-w-0 flex-1 items-center gap-3 max-[800px]:basis-full max-[620px]:flex-col max-[620px]:items-stretch" action="/gallery">
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
            submitOnValueChange
          />
          {query.destination || query.package ? <Link className="text-[0.72rem] font-extrabold text-primary max-[620px]:self-start" href={wall ? "/gallery?view=wall" : "/gallery"}>Clear filters</Link> : null}
        </form>
        <div className="ml-auto flex shrink-0 rounded-full border border-border-subtle bg-white p-1 max-[620px]:self-end" aria-label="Gallery view">
          <Link aria-label="Curated album view" aria-current={!wall ? "page" : undefined} className={`grid min-h-9 grid-cols-[auto_1fr] items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-extrabold no-underline ${!wall ? "bg-primary text-white" : "text-primary"}`} href={galleryHref(query, { view: undefined })}><Images aria-hidden="true" size={15} /><span>Albums</span></Link>
          <Link aria-label="Masonry photo wall" aria-current={wall ? "page" : undefined} className={`grid min-h-9 grid-cols-[auto_1fr] items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-extrabold no-underline ${wall ? "bg-primary text-white" : "text-primary"}`} href={galleryHref(query, { view: "wall" })}><Grid2X2 aria-hidden="true" size={15} /><span>Photo wall</span></Link>
        </div>
      </div>
    </section>
  );
}
