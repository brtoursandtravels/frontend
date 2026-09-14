import Link from "next/link";
import { Search } from "lucide-react";

type BlogCategory = { id: string; slug: string; name: string };

function categoryHref(slug?: string) {
  return slug ? `/blog?category=${encodeURIComponent(slug)}` : "/blog";
}

export function BlogDiscoveryBar({ categories, activeCategory, query }: { categories: BlogCategory[]; activeCategory?: string; query?: string }) {
  return (
    <section className="sticky top-[5rem] z-30 border-y border-border-subtle bg-bg-base/92 py-3 shadow-card backdrop-blur-xl max-[620px]:static" aria-label="Journal discovery">
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-5 sm:px-8 lg:px-10">
        <nav className="flex gap-2 overflow-x-auto pb-1 max-[620px]:flex-wrap max-[620px]:overflow-x-visible" aria-label="Article categories">
          <Link className={`shrink-0 rounded-full border px-4 py-2 text-[0.75rem] font-extrabold no-underline transition max-[420px]:px-3 ${!activeCategory ? "border-primary bg-primary text-white" : "border-border-subtle bg-white text-primary hover:border-primary/40"}`} href={categoryHref()}>All dispatches</Link>
          {categories.map((category) => <Link className={`shrink-0 rounded-full border px-4 py-2 text-[0.75rem] font-extrabold no-underline transition max-[420px]:px-3 ${activeCategory === category.slug ? "border-primary bg-primary text-white" : "border-border-subtle bg-white text-primary hover:border-primary/40"}`} href={categoryHref(category.slug)} key={category.id}>{category.name}</Link>)}
        </nav>
        <form className="flex min-w-0 items-center gap-2 max-[520px]:grid max-[520px]:grid-cols-[minmax(0,1fr)_auto]" action="/blog">
          {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
          <label className="relative min-w-0 flex-1" htmlFor="blog-search"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" size={17} /><span className="sr-only">Search journal</span><input className="min-h-11 w-full rounded-full border border-border-subtle bg-white py-2 pl-11 pr-4 text-[0.86rem] text-text-body shadow-card outline-none placeholder:text-text-muted/75 focus:border-primary" id="blog-search" name="q" type="search" defaultValue={query ?? ""} placeholder="Search places, seasons or planning questions" /></label>
          <button className="min-h-11 rounded-full border-0 bg-secondary px-5 text-[0.78rem] font-extrabold text-white transition hover:bg-secondary-hover" type="submit">Search</button>
          {query ? <Link className="text-[0.72rem] font-extrabold text-primary max-[520px]:col-span-2" href={activeCategory ? categoryHref(activeCategory) : "/blog"}>Clear</Link> : null}
        </form>
      </div>
    </section>
  );
}
