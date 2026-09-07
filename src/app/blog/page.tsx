import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ApiRequestError, getBlog, getBlogCategories } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Travel journal",
  description:
    "Browse published BR travel-planning articles by category or search term.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const [postsResult, categoriesResult] = await Promise.allSettled([
    getBlog({ q: query.q, category: query.category, page, pageSize: 9 }),
    getBlogCategories(),
  ]);
  if (postsResult.status === "rejected") {
    const error = postsResult.reason;
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Journal unavailable</p>
          <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">Articles cannot be loaded right now</h1>
          <p className="mt-4 text-text-muted">
            {error instanceof ApiRequestError
              ? error.message
              : "The live article response was not usable."}
          </p>
          <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline" href="/blog">
            Try again
          </Link>
        </div>
      </div>
    );
  }
  const posts = postsResult.value;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.category) params.set("category", query.category);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/blog${params.size ? `?${params}` : ""}`;
  };
  const featured = page === 1 ? posts.data[0] : undefined;
  const remaining = featured ? posts.data.slice(1) : posts.data;
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <header className="max-w-4xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Travel journal</p>
        <h1 className="m-0 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.98] text-text-heading">Useful notes for thoughtful journeys.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
          Published, sanitized editorial content appears here directly from the
          BR CMS.
        </p>
      </header>
      <form className="my-10 grid grid-cols-[auto_1fr_auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-border-subtle bg-white p-5 shadow-card max-[820px]:grid-cols-1 [&_label]:text-xs [&_label]:font-extrabold [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-border-subtle [&_input]:bg-bg-base [&_input]:px-3 [&_input]:py-2.5 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-border-subtle [&_select]:bg-bg-base [&_select]:px-3 [&_select]:py-2.5" action="/blog">
        <label htmlFor="blog-search">Search articles</label>
        <input
          id="blog-search"
          name="q"
          type="search"
          defaultValue={query.q}
          placeholder="Topic or planning question"
        />
        <label htmlFor="blog-category">Category</label>
        <select
          id="blog-category"
          name="category"
          defaultValue={query.category}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="rounded-full border-0 bg-primary px-5 py-3 text-sm font-extrabold text-white" type="submit">
          Search journal
        </button>
        {query.q || query.category ? (
          <Link className="text-xs font-extrabold text-primary" href="/blog">Clear filters</Link>
        ) : null}
      </form>
      <p className="mb-8 text-sm font-bold text-text-muted">
        {posts.meta.total} {posts.meta.total === 1 ? "article" : "articles"}
      </p>
      {featured ? (
        <section className="mb-8" aria-label="Featured article">
          <BlogCard featured item={featured} />
        </section>
      ) : null}
      {remaining.length ? (
        <div className="grid grid-cols-3 gap-6 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
          {remaining.map((item) => (
            <BlogCard item={item} key={item.id} />
          ))}
        </div>
      ) : !featured ? (
        <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-card">
          <h2 className="font-display text-3xl text-text-heading">No published articles match</h2>
          <p className="mt-3 text-text-muted">
            Try a broader search. Draft and demo-ineligible posts remain
            private.
          </p>
        </div>
      ) : null}
      <PaginationControls
        page={posts.meta.page}
        pageSize={posts.meta.pageSize}
        total={posts.meta.total}
        hrefForPage={hrefFor}
      />
    </div>
  );
}
