import type { Metadata } from "next";
import Link from "next/link";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  ApiRequestError,
  getDestinations,
  getGalleryAlbum,
  getGalleryAlbums,
  getPackages,
} from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse published, rights-reviewed BR gallery albums with accessible captions and keyboard lightboxes.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{
    destination?: string;
    package?: string;
    page?: string;
  }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const [albumsResult, destinationsResult, packagesResult] =
    await Promise.allSettled([
      getGalleryAlbums({
        destination: query.destination,
        package: query.package,
        page,
        pageSize: 6,
      }),
      getDestinations(),
      getPackages({ pageSize: 48 }),
    ]);
  if (albumsResult.status === "rejected") {
    const error = albumsResult.reason;
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Gallery unavailable</p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Albums cannot be loaded right now</h1>
          <p className="mt-4 text-text-muted">
            {error instanceof ApiRequestError
              ? error.message
              : "The live gallery response was not usable."}
          </p>
          <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/gallery">
            Try again
          </Link>
        </div>
      </div>
    );
  }
  const listing = albumsResult.value;
  const albums = await Promise.all(
    listing.data.map((album) =>
      getGalleryAlbum(album.slug)
        .then((result) => result.data)
        .catch(() => ({ ...album, images: [] })),
    ),
  );
  const destinations =
    destinationsResult.status === "fulfilled"
      ? destinationsResult.value.data
      : [];
  const packages =
    packagesResult.status === "fulfilled" ? packagesResult.value.data : [];
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.destination) params.set("destination", query.destination);
    if (query.package) params.set("package", query.package);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/gallery${params.size ? `?${params}` : ""}`;
  };
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <header className="max-w-4xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Visual journal</p>
        <h1 className="m-0 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.98] text-text-heading">Published journeys, responsibly shown.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
          Only public media from database-backed albums appears here. Private
          documents are never gallery content.
        </p>
      </header>
      <form className="my-10 grid grid-cols-[auto_1fr_auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-border-subtle bg-white p-5 shadow-card max-[820px]:grid-cols-1 [&_label]:text-xs [&_label]:font-extrabold [&_label]:text-text-heading [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-border-subtle [&_select]:bg-bg-base [&_select]:px-3 [&_select]:py-2.5" action="/gallery">
        <label htmlFor="gallery-destination">Destination</label>
        <select
          id="gallery-destination"
          name="destination"
          defaultValue={query.destination}
        >
          <option value="">All destinations</option>
          {destinations.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <label htmlFor="gallery-package">Related package</label>
        <select
          id="gallery-package"
          name="package"
          defaultValue={query.package}
        >
          <option value="">All packages</option>
          {packages.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
        <button className="rounded-full border-0 bg-primary px-5 py-3 text-sm font-extrabold text-white" type="submit">
          Apply filters
        </button>
        {query.destination || query.package ? (
          <Link className="text-xs font-extrabold text-primary" href="/gallery">Clear</Link>
        ) : null}
      </form>
      <p className="mb-8 text-sm font-bold text-text-muted">
        {listing.meta.total} {listing.meta.total === 1 ? "album" : "albums"}
      </p>
      {albums.length ? (
        <div className="grid gap-16">
          {albums.map((album) => (
            <section className="border-t border-border-subtle pt-10" key={album.id}>
              <div className="mb-6 flex items-start justify-between gap-5">
                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">
                    {album.destination?.name ?? "Gallery album"}
                  </p>
                  <h2 className="m-0 font-display text-4xl font-semibold text-text-heading">{album.title}</h2>
                  {album.description ? <p className="mt-3 max-w-2xl text-text-muted">{album.description}</p> : null}
                </div>
                {album.isDemo ? (
                  <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[0.65rem] font-extrabold uppercase text-secondary-hover">Demo album</span>
                ) : null}
              </div>
              <ImageLightbox images={album.images} label={album.title} />
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card">
          <h2 className="font-display text-3xl text-text-heading">No published albums match</h2>
          <p className="mt-3 text-text-muted">
            Try clearing filters. Empty albums do not substitute unlicensed
            images.
          </p>
        </div>
      )}
      <PaginationControls
        page={listing.meta.page}
        pageSize={listing.meta.pageSize}
        total={listing.meta.total}
        hrefForPage={hrefFor}
      />
    </div>
  );
}
