import Link from "next/link";
import { ArrowRight, Clock3, Star } from "lucide-react";
import type { BlogCard } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

type RelatedTour = { slug: string; title: string; days: number };

export function FeaturedArticleHero({ item, relatedTour }: { item: BlogCard; relatedTour?: RelatedTour }) {
  return (
    <article className="group grid min-h-[31rem] grid-cols-[1.2fr_.8fr] overflow-hidden rounded-xl bg-primary-ink text-white shadow-dropdown max-[850px]:grid-cols-1" aria-labelledby={`featured-${item.id}`}>
      <div className="relative min-h-[25rem] overflow-hidden bg-primary">
        {item.cover ? <PublicImage alt={item.cover.altText} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" sizes="(max-width: 850px) 100vw, 60vw" src={item.cover.url} /> : <span className="absolute inset-0 grid place-items-center font-display text-6xl text-white/50">BR</span>}
        <span className="absolute inset-0 bg-gradient-to-t from-primary-ink/50 to-transparent" aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center p-[clamp(1.6rem,4vw,3.5rem)]">
        <p className="mb-4 flex flex-wrap items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] text-secondary-light"><span className="inline-flex items-center gap-1"><Star aria-hidden="true" size={13} fill="currentColor" /> Cover story</span><span className="text-white/30">·</span>{item.category?.name ?? "Travel journal"}</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.07] tracking-[-0.03em] text-white" id={`featured-${item.id}`}>{item.title}</h2>
        <p className="mt-5 line-clamp-4 text-[0.98rem] leading-relaxed text-white/72">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.75rem] font-bold text-white/62"><Clock3 aria-hidden="true" size={15} /><span>{item.readingMinutes} min read</span>{item.author ? <><span>·</span><span>By {item.author.name}</span></> : null}</div>
        {relatedTour ? <Link className="mt-4 text-[0.75rem] font-extrabold text-secondary-light no-underline" href={`/packages/${relatedTour.slug}`}>Featured journey: {relatedTour.title} ({relatedTour.days}D) →</Link> : null}
        <Link className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-accent-hover" href={`/blog/${item.slug}`}>Read the full dispatch <ArrowRight aria-hidden="true" size={17} /></Link>
      </div>
    </article>
  );
}
