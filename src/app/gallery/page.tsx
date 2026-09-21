import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/static-page-metadata";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { PaginationControls } from "@/components/common/PaginationControls";
import { RetryPageButton } from "@/components/common/RetryPageButton";
import { GalleryCta } from "@/components/gallery/GalleryCta";
import { GalleryDiscoveryBar } from "@/components/gallery/GalleryDiscoveryBar";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { ApiRequestError, getGalleryAlbums, getPackageOptions } from "@/lib/api";
import { completeGalleryAlbum } from "@/lib/galleryEditorialMedia";

export const revalidate = 3600;
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("gallery", {
  title: "Travel Gallery",
  description: "Explore published BR Tours travel collections, destination photographs and visual stories from across India.",
    path: "/gallery",
  });
}

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ destination?: string; package?: string; page?: string; view?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const [albumsResult, packagesResult] = await Promise.allSettled([
    getGalleryAlbums({ destination: query.destination, package: query.package, page, pageSize: 6, includeImages: true }),
    getPackageOptions(),
  ]);

  if (albumsResult.status === "rejected") {
    const error = albumsResult.reason;
    return (
      <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Gallery unavailable</p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">The visual journal cannot be loaded right now.</h1>
          <p className="mt-4 text-text-muted">{error instanceof ApiRequestError ? error.message : "The live gallery response was not usable."}</p>
          <RetryPageButton className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white" />
        </div>
      </main>
    );
  }

  const listing = albumsResult.value;
  const albums = listing.data.map((album) =>
    completeGalleryAlbum({
      ...album,
      images: album.images ?? (album.cover ? [album.cover] : []),
    }),
  );
  const packages = packagesResult.status === "fulfilled" ? packagesResult.value.data : [];
  const selectedPackage = packages.find((item) => item.slug === query.package);
  const allImages = albums.flatMap((album) => album.images);
  const wallView = query.view === "wall";
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.destination) params.set("destination", query.destination);
    if (query.package) params.set("package", query.package);
    if (wallView) params.set("view", "wall");
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/gallery${params.size ? `?${params}` : ""}`;
  };

  return (
    <main>
      <GalleryHero albumCount={listing.meta.total} imageCount={allImages.length} />
      <GalleryDiscoveryBar packages={packages} query={query} />

      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 text-sm font-bold text-text-muted"><strong className="text-text-heading">{listing.meta.total}</strong> {listing.meta.total === 1 ? "collection" : "collections"}</p>
          <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-secondary-hover">{wallView ? "Fluid photo wall" : "Curated photo essays"}</p>
        </div>

        {albums.length ? (
          wallView ? (
            <ImageLightbox images={allImages} label="BR Tours visual journal" variant="masonry" planHref="/contact-us?subject=custom-trip#contact-form" />
          ) : (
            <div className="grid gap-20">
              {albums.map((album) => {
                const destination = album.destination?.name;
                const destinationHref = album.destination ? `/packages?destination=${encodeURIComponent(album.destination.slug)}` : "/packages";
                const planHref = `/contact-us?subject=${encodeURIComponent(destination ? `Trip inspired by ${destination}` : `Trip inspired by ${album.title}`)}#contact-form`;
                return (
                  <section className="defer-render border-t border-border-subtle pt-10 first:border-t-0 first:pt-0" key={album.id} aria-labelledby={`album-${album.id}`}>
                    <div className="mb-6 flex items-start justify-between gap-5 max-[620px]:flex-col">
                      <div>
                        <p className="mb-2 inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover"><MapPin aria-hidden="true" size={14} /> {destination ?? "BR visual journal"}</p>
                        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id={`album-${album.id}`}>{album.title}</h2>
                        {album.description ? <p className="mb-0 mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-text-muted">{album.description}</p> : null}
                      </div>
                      <span className="shrink-0 rounded-full bg-bg-muted px-3 py-1.5 text-[0.68rem] font-extrabold text-primary">{album.images.length} {album.images.length === 1 ? "photograph" : "photographs"}</span>
                    </div>
                    <ImageLightbox images={album.images} label={album.title} location={destination} planHref={planHref} packageHref={selectedPackage ? `/packages/${selectedPackage.slug}` : undefined} />
                    <div className="mt-4 flex items-center justify-between gap-4 overflow-hidden rounded-lg bg-white px-5 py-3 shadow-[inset_0_0_0_1px_var(--color-border-subtle)] max-[620px]:items-start max-[620px]:flex-col">
                      <p className="m-0 text-[0.8rem] text-text-muted">Inspired by this collection? Explore journeys that can bring the destination into your itinerary.</p>
                      <Link className="inline-flex shrink-0 items-center gap-1.5 text-[0.78rem] font-extrabold text-primary no-underline" href={selectedPackage ? `/packages/${selectedPackage.slug}` : destinationHref}>{selectedPackage ? selectedPackage.title : `Explore ${destination ?? "journeys"}`} <ArrowRight aria-hidden="true" size={15} /></Link>
                    </div>
                  </section>
                );
              })}
            </div>
          )
        ) : (
          <div className="rounded-xl border border-border-subtle bg-white p-8 text-center shadow-card sm:p-12">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-hover">No matching collection</p>
            <h2 className="m-0 font-display text-3xl font-semibold text-text-heading">Try a wider view of India.</h2>
            <p className="mx-auto mt-3 max-w-xl text-text-muted">Clear the current filters to return to every published album.</p>
            <Link className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white no-underline" href="/gallery">Clear all filters</Link>
          </div>
        )}

        <PaginationControls page={listing.meta.page} pageSize={listing.meta.pageSize} total={listing.meta.total} hrefForPage={hrefFor} />
        <GalleryCta />
      </div>
    </main>
  );
}
