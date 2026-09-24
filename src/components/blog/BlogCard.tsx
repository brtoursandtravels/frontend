import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { BlogCard as BlogCardData } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

type RelatedTour = { slug: string; title: string; days: number };

export function BlogCard({ item, relatedTour }: { item: BlogCardData; relatedTour?: RelatedTour }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-secondary/35 hover:shadow-card-hover">
      <Link className="relative aspect-[16/10] overflow-hidden bg-primary-soft" href={`/blog/${item.slug}`} aria-label={`Read ${item.title}`}>
        {item.cover ? <PublicImage alt={item.cover.altText} sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" src={item.cover.url} /> : <span className="absolute inset-0 grid place-items-center font-display text-5xl text-primary" aria-label="Photography pending">BR</span>}
        <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10 opacity-75 transition group-hover:opacity-100" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-primary-ink/70 px-3 py-1.5 text-[0.64rem] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-md">{item.category?.name ?? "Travel journal"}</span>
        <ArrowUpRight className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/25 p-2 text-white opacity-0 transition group-hover:rotate-12 group-hover:opacity-100" aria-hidden="true" size={36} />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold text-text-muted"><Clock3 aria-hidden="true" size={14} /><span>{item.readingMinutes} min read</span><span>·</span><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.publishedAt))}</time></div>
        <h2 className="mb-0 mt-4 font-display text-[1.45rem] font-semibold leading-tight text-text-heading"><Link className="no-underline transition-colors hover:text-primary" href={`/blog/${item.slug}`}>{item.title}</Link></h2>
        <p className="mt-4 line-clamp-3 text-[0.925rem] leading-relaxed text-text-muted">{item.excerpt}</p>
        {relatedTour ? <Link className="mt-auto block border-t border-border-subtle pt-4 text-[0.73rem] font-extrabold text-primary no-underline transition hover:text-secondary-hover" href={`/packages/${relatedTour.slug}`}>Featured journey: {relatedTour.title} ({relatedTour.days}D) →</Link> : null}
      </div>
    </article>
  );
}
