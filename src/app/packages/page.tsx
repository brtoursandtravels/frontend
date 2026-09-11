import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PackageActiveFilters } from "@/components/packages/PackageActiveFilters";
import { PackageFilterSidebar } from "@/components/packages/PackageFilterSidebar";
import { InfinitePackageGrid } from "@/components/packages/InfinitePackageGrid";
import {
  ApiRequestError,
  getCategories,
  getDestinations,
  getPackages,
  type PackageFilters,
} from "@/lib/api";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Tour packages",
  description:
    "Search and filter published BR tour ideas by destination, style, duration, price and travel month.",
  alternates: { canonical: "/packages" },
};

type Search = Record<string, string | string[] | undefined>;
const text = (value: string | string[] | undefined) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: string | string[] | undefined) => {
  const parsed = Number(text(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const query = await searchParams;
  const filters: PackageFilters = {
    q: text(query.q),
    destination: text(query.destination),
    category: text(query.category),
    startingCity: text(query.startingCity),
    minDays: number(query.minDays),
    maxDays: number(query.maxDays),
    minPrice: number(query.minPrice),
    maxPrice: number(query.maxPrice),
    month: text(query.month),
    sort:
      (
        ["featured", "newest", "price-asc", "price-desc", "duration"] as const
      ).find((item) => item === text(query.sort)) ?? "featured",
    page: 1,
    pageSize: 6,
  };
  const [destinationsResult, categoriesResult, catalogueResult] =
    await Promise.allSettled([
      getDestinations(),
      getCategories(),
      getPackages(filters),
    ]);
  const destinations =
    destinationsResult.status === "fulfilled"
      ? destinationsResult.value.data
      : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];

  if (catalogueResult.status === "rejected") {
    const error = catalogueResult.reason;
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/25 bg-danger-bg p-8 shadow-card">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-danger">Catalogue unavailable</p>
          <h1 className="font-display text-4xl text-text-heading">We could not load packages</h1>
          <p>
            {error instanceof ApiRequestError
              ? error.message
              : "The live package response was not usable."}
          </p>
          <Link className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/packages">
            Retry without filters
          </Link>
        </div>
      </div>
    );
  }

  const result = catalogueResult.value;
  const queryFor = (changes: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, pageSize: undefined, ...changes }).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== "" &&
          !(key === "sort" && value === "featured") &&
          !(key === "page" && value === 1)
        )
          params.set(key, String(value));
      },
    );
    return `/packages${params.size ? `?${params}` : ""}`;
  };
  const infiniteQuery = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && key !== "page") {
      infiniteQuery.set(key, String(value));
    }
  });
  const labels: Record<string, string> = {
    q: `Search: ${filters.q ?? ""}`,
    destination:
      destinations.find((item) => item.slug === filters.destination)?.name ??
      filters.destination ??
      "",
    category:
      categories.find((item) => item.slug === filters.category)?.name ??
      filters.category ??
      "",
    startingCity: `Starts: ${filters.startingCity ?? ""}`,
    minDays: `From ${filters.minDays ?? ""} days`,
    maxDays: `Up to ${filters.maxDays ?? ""} days`,
    minPrice: `Min ₹${filters.minPrice ?? ""}`,
    maxPrice: `Max ₹${filters.maxPrice ?? ""}`,
    month: `Month: ${filters.month ?? ""}`,
    sort: `Sort: ${filters.sort?.replaceAll("-", " ") ?? ""}`,
  };
  const active = Object.entries(filters).filter(
    ([key, value]) =>
      !["page", "pageSize"].includes(key) &&
      value !== undefined &&
      value !== "" &&
      !(key === "sort" && value === "featured"),
  );
  const activeFilters = active.map(([key]) => ({
    key,
    label: labels[key] ?? key,
    href: queryFor({ [key]: undefined, page: undefined }),
  }));

  return (
    <div>
      <header className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-primary-ink text-white">
        <Image
          alt="A Himalayan monastery overlooking the Ladakh mountains"
          className="-z-2 object-cover object-center"
          fetchPriority="high"
          fill
          loading="eager"
          sizes="100vw"
          src="/images/travel/ladakh-monastery.webp"
        />
        <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,35,36,.50)_0%,rgba(2,35,36,.28)_48%,rgba(2,35,36,.05)_76%,transparent_100%)] max-[700px]:bg-[linear-gradient(90deg,rgba(2,35,36,.64),rgba(2,35,36,.24))]" aria-hidden="true" />
        <div className="relative z-1 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">Curated journeys</p>
        <h1 className="m-0 max-w-4xl text-balance font-display text-[clamp(2.85rem,4.3vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white [text-shadow:0_3px_16px_rgb(0_0_0_/_0.45)] max-[620px]:text-[clamp(2.5rem,11vw,3.5rem)]">Find the journey that feels like yours.</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
          Search the live BR catalogue by destination, pace and travel style.
          Availability is confirmed personally after your enquiry.
        </p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <details className="mb-10 hidden rounded-lg border border-border-subtle bg-white p-5 max-[960px]:block">
        <summary className="font-extrabold text-primary">Filters and sorting</summary>
        <PackageFilterSidebar
          categories={categories}
          destinations={destinations}
          filters={filters}
          idPrefix="mobile"
        />
      </details>
      <div className="grid grid-cols-[18rem_1fr] items-start gap-8 max-[820px]:grid-cols-1">
        <aside className="sticky top-24 max-[960px]:hidden" aria-label="Package filters">
          <PackageFilterSidebar
            categories={categories}
            destinations={destinations}
            filters={filters}
            idPrefix="desktop"
          />
        </aside>
        <section aria-labelledby="results-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Live catalogue</p>
              <h2 className="m-0 font-display text-3xl text-text-heading" id="results-heading">
                {result.meta.total} {result.meta.total === 1 ? "idea" : "ideas"}{" "}
                found
              </h2>
            </div>
            {active.length ? <Link className="text-xs font-extrabold text-primary" href="/packages">Clear all</Link> : null}
          </div>
          <PackageActiveFilters filters={activeFilters} />
          {result.data.length ? (
            <InfinitePackageGrid
              initialItems={result.data}
              initialMeta={result.meta}
              key={infiniteQuery.toString()}
              query={infiniteQuery.toString()}
            />
          ) : (
            <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card">
              <h2 className="font-display text-3xl text-text-heading">No matching packages</h2>
              <p>
                Try removing a filter or choosing a different month. No fallback
                offers were inserted.
              </p>
              <Link href="/packages">Clear filters</Link>
            </div>
          )}
        </section>
      </div>
      </div>
    </div>
  );
}
