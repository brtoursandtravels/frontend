import Link from "next/link";
import type { BlogCard as BlogCardData } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";

export function BlogCard({
  item,
  featured = false,
}: {
  item: BlogCardData;
  featured?: boolean;
}) {
  return (
    <article className={`group overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${featured ? "grid grid-cols-[1.15fr_0.85fr] max-[820px]:grid-cols-1" : ""}`}>
      <div className={`relative overflow-hidden bg-primary-soft ${featured ? "min-h-80" : "aspect-[16/10]"}`}>
        {item.cover ? (
          <PublicImage
            alt={item.cover.altText}
            sizes={
              featured
                ? "(max-width: 900px) 100vw, 55vw"
                : "(max-width: 767px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            src={item.cover.url}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-5xl text-primary" aria-label="Photography pending">BR</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap justify-between gap-3 text-[0.65rem] font-extrabold uppercase tracking-wider text-secondary-hover">
          <span>{item.category?.name ?? "Travel journal"}</span>
          <span>{item.readingMinutes} min read</span>
        </div>
        <h2 className={`mt-4 mb-0 font-display font-semibold leading-tight text-text-heading ${featured ? "text-4xl" : "text-2xl"}`}>
          <Link className="no-underline transition-colors hover:text-primary" href={`/blog/${item.slug}`}>{item.title}</Link>
        </h2>
        {item.isDemo ? <span className="mt-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[0.62rem] font-extrabold uppercase text-secondary-hover">Demo article</span> : null}
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-muted">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-border-subtle pt-4 text-xs text-text-muted">
          <time dateTime={item.publishedAt}>
            {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
              new Date(item.publishedAt),
            )}
          </time>
          {item.author ? <span>By {item.author.name}</span> : null}
        </div>
      </div>
    </article>
  );
}
