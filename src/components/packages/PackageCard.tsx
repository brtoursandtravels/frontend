"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Heart, MapPin, Share2 } from "lucide-react";
import { useState } from "react";
import type { PackageCard as PackageCardData } from "@/lib/contracts";
import { formatMoney, priceBasisLabel } from "@/lib/presentation";
import { EnquiryModal } from "@/components/common/EnquiryModal";
import { PublicImage } from "@/components/common/PublicImage";
import { animationClasses } from "@/lib/animations";

export function PackageCard({
  item,
  featured = false,
}: {
  item: PackageCardData;
  featured?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const price = item.startingPrice
    ? formatMoney(item.startingPrice.amount, item.startingPrice.currency)
    : "On request";

  async function share() {
    const url = `${window.location.origin}/packages/${item.slug}`;
    if (navigator.share) {
      await navigator.share({ title: item.title, text: item.summary, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-xl border bg-bg-surface shadow-card hover:border-secondary/45 ${animationClasses.cardLift} ${
        featured
          ? "border-secondary/40 after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:z-3 after:h-1 after:animate-shimmer after:bg-[linear-gradient(90deg,transparent,var(--color-secondary),var(--color-accent),transparent)] after:bg-[length:200%_100%] motion-reduce:after:animate-none"
          : "border-border-subtle"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-muted">
        <Link
          className="absolute inset-0 block"
          href={`/packages/${item.slug}`}
          aria-label={`View ${item.title}`}
        >
          {item.cover ? (
            <PublicImage
              alt={item.cover.altText}
              className={`object-cover ${animationClasses.imageZoom}`}
              priority={featured}
              sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
              src={item.cover.url}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_top_right,var(--color-primary-light),var(--color-primary-ink))] text-center text-white">
              <span className="grid gap-1">
                <strong className="font-display text-5xl">BR</strong>
                <small className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">
                  Photography pending
                </small>
              </span>
            </span>
          )}
        </Link>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-ink/45 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 z-2 flex max-w-[calc(100%-6.5rem)] flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase text-primary shadow-sm backdrop-blur-md">
            {item.nights}N / {item.days}D
          </span>
          {item.categories[0] ? (
            <span className="rounded-full bg-secondary px-3 py-1.5 text-[0.65rem] font-extrabold uppercase text-white shadow-sm">
              {item.categories[0].name}
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3 z-2 flex gap-2">
          <button
            className={`flex size-10 items-center justify-center rounded-full border-0 bg-white/90 shadow-sm backdrop-blur-md transition hover:scale-105 ${saved ? "text-accent" : "text-primary"}`}
            type="button"
            aria-label={
              saved ? "Remove from saved journeys" : "Save this journey"
            }
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            <Heart
              aria-hidden="true"
              size={18}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-full border-0 bg-white/90 text-primary shadow-sm backdrop-blur-md transition hover:scale-105"
            type="button"
            aria-label={copied ? "Journey link copied" : "Share this journey"}
            onClick={() => void share()}
          >
            {copied ? (
              <Check aria-hidden="true" size={18} />
            ) : (
              <Share2 aria-hidden="true" size={18} />
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Journey link copied to clipboard." : ""}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-2 flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-wider text-secondary-hover">
          <MapPin aria-hidden="true" size={15} />
          {item.destinations
            .map((destination) => destination.name)
            .join(" · ") || "Curated journey"}
        </p>
        <h3 className="m-0 font-display text-2xl font-semibold leading-tight text-text-heading">
          <Link
            className="no-underline transition-colors hover:text-primary"
            href={`/packages/${item.slug}`}
          >
            {item.title}
          </Link>
        </h3>
        {item.isDemo ? (
          <span className="mt-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[0.62rem] font-extrabold uppercase text-secondary-hover">
            Demo content
          </span>
        ) : null}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-muted">
          {item.summary}
        </p>
        {item.highlights.length ? (
          <ul className="my-4 flex list-none flex-wrap gap-2 p-0">
            {item.highlights.slice(0, 3).map((highlight) => (
              <li
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[0.65rem] font-bold text-primary"
                key={highlight}
              >
                <Check aria-hidden="true" size={12} strokeWidth={3} />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 border-t border-border-subtle pt-4">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="grid">
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-text-muted">
                Starting from
              </span>
              <strong className="font-display text-2xl leading-tight text-primary">
                {price}
              </strong>
              {item.startingPrice ? (
                <small className="text-[0.65rem] text-text-muted">
                  {priceBasisLabel(item.startingPrice.basis)}
                </small>
              ) : null}
            </div>
            <small className="max-w-28 text-right text-[0.6rem] leading-relaxed text-text-muted">
              Taxes and GST itemised in the confirmed quote
            </small>
          </div>
          <div className="grid grid-cols-2 gap-2 max-[420px]:grid-cols-1">
            <EnquiryModal
              packageSlug={item.slug}
              packageTitle={item.title}
              label="Enquire now"
            />
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-3 text-sm font-extrabold text-primary no-underline transition hover:border-primary hover:bg-white"
              href={`/packages/${item.slug}`}
            >
              Details <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
