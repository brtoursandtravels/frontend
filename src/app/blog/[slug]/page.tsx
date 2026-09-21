import type { Metadata } from "next";
import { entryMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicImage } from "@/components/common/PublicImage";
import { ShareActions } from "@/components/common/ShareActions";
import { ApiRequestError, getBlogPost } from "@/lib/api";
import { serverEnv } from "@/lib/env";

export const revalidate = 30;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  // Blog details have the same live-API dependency as packages: generate on demand.
  return [];
}

function prepareHeadings(html: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const used = new Set<string>();
  const output = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attributes: string, inner: string) => {
      const text = inner
        .replace(/<[^>]+>/g, "")
        .replaceAll("&amp;", "&")
        .trim();
      if (!text) return _match;
      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "section";
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      headings.push({ id, text, level: Number(level) });
      const cleaned = attributes.replace(/\sid=("[^"]*"|'[^']*')/gi, "");
      return `<h${level}${cleaned} id="${id}">${inner}</h${level}>`;
    },
  );
  return { html: output, headings };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPost(slug).catch(() => null);
  if (!result) return { title: "Travel article" };
  const item = result.data;
  const metadata = entryMetadata({
    title: item.title, description: item.excerpt,
    metaTitle: item.seo.title, metaDescription: item.seo.description,
    path: `/blog/${item.slug}`,
    image: item.cover ? { url: item.cover.url, alt: item.cover.altText } : undefined,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: item.publishedAt,
      authors: item.author ? [item.author.name] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let item;
  try {
    item = (await getBlogPost(slug)).data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }
  const prepared = prepareHeadings(item.contentHtml);
  const articleUrl = new URL(
    `/blog/${item.slug}`,
    serverEnv.NEXT_PUBLIC_SITE_URL,
  ).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.publishedAt,
    mainEntityOfPage: articleUrl,
    ...(item.author
      ? { author: { "@type": "Person", name: item.author.name } }
      : {}),
    ...(item.cover
      ? {
          image: new URL(
            item.cover.url,
            serverEnv.NEXT_PUBLIC_SITE_URL,
          ).toString(),
        }
      : {}),
    publisher: { "@type": "Organization", name: "BR Tours and Travels" },
  };
  return (
    <article>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-text-muted [&_a]:font-semibold [&_a]:text-primary [&_a]:no-underline" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Journal</Link>
          <span>/</span>
          <span aria-current="page">{item.title}</span>
        </nav>
        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">{item.category?.name ?? "Travel journal"}</p>
          <h1 className="m-0 font-display text-[clamp(2.5rem,4.3vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-text-heading">{item.title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-[0.98rem] leading-relaxed text-text-muted">{item.excerpt}</p>
          <div className="my-5 flex flex-wrap justify-center gap-4 text-xs font-semibold text-text-muted">
            <time dateTime={item.publishedAt}>
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
                new Date(item.publishedAt),
              )}
            </time>
            <span>{item.readingMinutes} min read</span>
            {item.author ? <span>By {item.author.name}</span> : null}
          </div>
          {item.isDemo ? (
            <span className="inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-[0.65rem] font-extrabold uppercase text-secondary-hover">Demo editorial content</span>
          ) : null}
          <ShareActions title={item.title} />
        </header>
        {item.cover ? (
          <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-xl bg-bg-muted shadow-card">
            <PublicImage
              alt={item.cover.altText}
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1120px"
              src={item.cover.url}
            />
            {item.cover.caption ? <p className="absolute inset-x-0 bottom-0 m-0 bg-linear-to-t from-black/80 to-transparent px-5 pt-10 pb-4 text-xs text-white/75">{item.cover.caption}</p> : null}
          </div>
        ) : null}
        <div className={`mx-auto grid max-w-5xl items-start gap-10 ${prepared.headings.length >= 2 ? "grid-cols-[15rem_1fr] max-[820px]:grid-cols-1" : "grid-cols-1"}`}>
          {prepared.headings.length >= 2 ? (
            <aside className="sticky top-28 rounded-lg border border-border-subtle bg-white p-5 shadow-card max-[820px]:static">
              <h2 className="mt-0 text-sm font-extrabold text-text-heading">On this page</h2>
              <nav aria-label="Article table of contents">
                <ol className="m-0 grid list-none gap-2 p-0 text-xs">
                  {prepared.headings.map((heading) => (
                    <li
                      className={heading.level === 3 ? "pl-3" : ""}
                      key={heading.id}
                    >
                      <a className="text-text-muted no-underline transition hover:text-primary" href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
          <div
            className="min-w-0 text-base leading-8 text-text-body [&_a]:font-semibold [&_a]:text-primary [&_a]:[overflow-wrap:anywhere] [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:bg-bg-muted [&_blockquote]:p-5 [&_h2]:scroll-mt-28 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-text-heading [&_h3]:scroll-mt-28 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-heading [&_iframe]:max-w-full [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:my-2 [&_ol]:my-5 [&_p]:my-5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_ul]:my-5 [&_video]:h-auto [&_video]:max-w-full"
            dangerouslySetInnerHTML={{ __html: prepared.html }}
          />
        </div>
        {item.author ? (
          <section className="mx-auto mt-12 max-w-4xl rounded-xl border border-border-subtle bg-bg-muted p-6">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">About the author</p>
            <h2 className="m-0 font-display text-3xl text-text-heading">{item.author.name}</h2>
            {item.author.bio ? (
              <p>{item.author.bio}</p>
            ) : (
              <p>No public biography has been supplied.</p>
            )}
          </section>
        ) : null}
        {item.tags.length ? (
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap gap-2" aria-label="Article tags">
            {item.tags.map((tag) => (
              <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary" key={tag.slug}>{tag.name}</span>
            ))}
          </div>
        ) : null}
        {item.relatedArticles.length || item.relatedPackages.length ? (
          <section className="mt-16 border-t border-border-subtle pt-10">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Continue exploring</p>
            <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] text-text-heading">Related reading and tours</h2>
            <div className="mt-8 grid grid-cols-3 gap-5 max-[820px]:grid-cols-1">
              {item.relatedArticles.map((related) => (
                <article className="rounded-xl border border-border-subtle bg-white p-5 shadow-card" key={related.id}>
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-secondary-hover">{related.category?.name ?? "Article"}</span>
                  <h3 className="mt-3 mb-0 font-display text-2xl text-text-heading">
                    <Link className="no-underline hover:text-primary" href={`/blog/${related.slug}`}>{related.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-text-muted">{related.excerpt}</p>
                </article>
              ))}
              {item.relatedPackages.map((related) => (
                <article className="rounded-xl border border-border-subtle bg-white p-5 shadow-card" key={related.id}>
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-secondary-hover">
                    {related.days} days / {related.nights} nights
                  </span>
                  <h3 className="mt-3 mb-0 font-display text-2xl text-text-heading">
                    <Link className="no-underline hover:text-primary" href={`/packages/${related.slug}`}>
                      {related.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-text-muted">{related.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
    </article>
  );
}
