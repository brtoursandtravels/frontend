import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogDiscoveryBar } from "@/components/blog/BlogDiscoveryBar";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogNewsletterBanner } from "@/components/blog/BlogNewsletterBanner";
import { FeaturedArticleHero } from "@/components/blog/FeaturedArticleHero";
import { JournalHighlights } from "@/components/blog/JournalHighlights";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ApiRequestError, getBlog, getBlogCategories } from "@/lib/api";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Travel Journal",
  description: "Read BR travel stories, seasonal timing advice and practical destination guides for thoughtful journeys across India.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const [postsResult, categoriesResult] = await Promise.allSettled([
    getBlog({ q: query.q, category: query.category, page, pageSize: 9 }),
    getBlogCategories(),
  ]);

  if (postsResult.status === "rejected") {
    const error = postsResult.reason;
    return (
      <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Journal unavailable</p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">The travel journal cannot be loaded right now.</h1>
          <p className="mt-4 text-text-muted">{error instanceof ApiRequestError ? error.message : "The live article response was not usable."}</p>
          <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/blog">Try again</Link>
        </div>
      </main>
    );
  }

  const posts = postsResult.value;
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];
  const isUnfilteredFirstPage = page === 1 && !query.q && !query.category;
  const featured = isUnfilteredFirstPage ? posts.data[0] : undefined;
  const remaining = featured ? posts.data.slice(1) : posts.data;
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.category) params.set("category", query.category);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/blog${params.size ? `?${params}` : ""}`;
  };

  return (
    <main>
      <BlogHero articleCount={posts.meta.total} />
      <BlogDiscoveryBar categories={categories} activeCategory={query.category} query={query.q} />
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 py-16 sm:px-8 lg:px-10 max-[700px]:gap-12 max-[700px]:py-12">
        {featured ? <FeaturedArticleHero item={featured} relatedTour={featured.relatedTour ?? undefined} /> : null}
        {isUnfilteredFirstPage ? <JournalHighlights posts={remaining} /> : null}

        <section aria-labelledby="article-grid-title">
          <div className="mb-8 flex items-end justify-between gap-5 max-[620px]:items-start max-[620px]:flex-col">
            <div><p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">{query.q || query.category ? "Filtered journal" : "More from the journal"}</p><h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="article-grid-title">{query.q || query.category ? "Search results." : "Practical field guides."}</h2></div>
            <p className="m-0 text-sm font-bold text-text-muted">{posts.meta.total} {posts.meta.total === 1 ? "article" : "articles"}</p>
          </div>
          {remaining.length ? <div className="grid grid-cols-3 gap-6 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">{remaining.map((item) => <BlogCard item={item} relatedTour={item.relatedTour ?? undefined} key={item.id} />)}</div> : <div className="rounded-xl border border-border-subtle bg-white p-8 text-center shadow-card"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-hover">No matching dispatch</p><h3 className="m-0 font-display text-3xl font-semibold text-text-heading">Try a broader travel question.</h3><p className="mx-auto mt-3 max-w-xl text-text-muted">Clear the current filters to return to every published field guide.</p><Link className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white no-underline" href="/blog">Clear all filters</Link></div>}
        </section>

        <BlogNewsletterBanner />
        <PaginationControls page={posts.meta.page} pageSize={posts.meta.pageSize} total={posts.meta.total} hrefForPage={hrefFor} />
      </div>
    </main>
  );
}
