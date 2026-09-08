import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PackageCard as PackageCardData } from "@/lib/contracts";
import { formatMoney, priceBasisLabel } from "@/lib/presentation";
import { PublicImage } from "@/components/common/PublicImage";
import { animationClasses } from "@/lib/animations";
import { PackageCardActions } from "@/components/packages/PackageCardActions";

export function PackageCard({
  item,
  featured = false,
}: {
  item: PackageCardData;
  featured?: boolean;
}) {
  const price = item.startingPrice
    ? formatMoney(item.startingPrice.amount, item.startingPrice.currency)
    : "On request";

  return (
    <article
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-xl border bg-bg-surface shadow-card hover:border-secondary/45 ${animationClasses.cardLift} ${
        featured ? "border-secondary/40" : "border-border-subtle"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-muted">
        <Link className="absolute inset-0 block" href={`/packages/${item.slug}`} aria-label={`View ${item.title}`}>
          {item.cover ? (
            <PublicImage
              alt={item.cover.altText}
              className={`object-cover ${animationClasses.imageZoom}`}
              priority={featured}
              sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
              src={item.cover.url}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-primary text-center text-white">
              <span className="grid gap-1">
                <strong className="font-display text-5xl">BR</strong>
                <small className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">Photography pending</small>
              </span>
            </span>
          )}
        </Link>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-ink/25 via-transparent to-primary-ink/10" />
        <div className="absolute left-3 top-3 z-2 flex max-w-[calc(100%-4rem)] flex-wrap gap-2">
          <span className="rounded-full bg-white/92 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase text-primary shadow-sm backdrop-blur-md">{item.nights}N / {item.days}D</span>
          {item.categories[0] ? <span className="rounded-full bg-primary-ink/78 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase text-white shadow-sm backdrop-blur-sm">{item.categories[0].name}</span> : null}
        </div>
        <PackageCardActions packageSlug={item.slug} packageSummary={item.summary} packageTitle={item.title} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="m-0 font-display text-[1.1rem] font-semibold leading-snug text-text-heading">
          <Link className="no-underline transition-colors hover:text-primary" href={`/packages/${item.slug}`}>{item.title}</Link>
        </h3>
        {item.isDemo ? <span className="mt-2 inline-flex self-start rounded-full bg-accent-soft px-2.5 py-1 text-[0.62rem] font-extrabold uppercase text-secondary-hover">Demo content</span> : null}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border-subtle pt-4">
          <div className="grid">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-text-muted">From</span>
            <span className="flex items-baseline gap-1.5">
              <strong className="font-display text-[1.25rem] leading-tight text-primary">{price}</strong>
              {item.startingPrice ? <small className="text-[0.62rem] font-bold text-text-muted">+ GST</small> : null}
            </span>
            {item.startingPrice ? <small className="text-[0.65rem] text-text-muted">{priceBasisLabel(item.startingPrice.basis)}</small> : null}
          </div>
          <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary/20 bg-bg-muted px-5 py-2 text-xs font-extrabold text-primary no-underline transition hover:border-primary hover:bg-primary hover:text-white" href={`/packages/${item.slug}`}>
            Details <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
