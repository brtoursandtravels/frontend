import Link from "next/link";
import type { z } from "zod";
import type { contentPageResponseSchema } from "@/lib/contracts";

type ContentPageData = z.infer<typeof contentPageResponseSchema>["data"];

export function ContentPage({
  page,
  eyebrow,
  children,
}: {
  page: ContentPageData;
  eyebrow: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <header className="mb-12 rounded-xl bg-primary p-[clamp(2rem,6vw,5rem)] text-white shadow-dropdown">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-light">{eyebrow}</p>
        <h1 className="m-0 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">{page.title}</h1>
        {page.ownerReviewDue ? (
          <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/80" role="note">
            This content is marked for owner review before launch.
          </p>
        ) : null}
      </header>
      <div
        className="mx-auto max-w-3xl text-base leading-8 text-text-body [&_a]:font-semibold [&_a]:text-primary [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:bg-bg-muted [&_blockquote]:p-5 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-text-heading [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-heading [&_li]:my-2 [&_ol]:my-5 [&_p]:my-5 [&_ul]:my-5 [&_img]:my-8 [&_img]:rounded-xl"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
      {children}
    </div>
  );
}

export function ContentUnavailable({ title }: { title: string }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <div className="rounded-xl border border-danger/30 bg-danger-bg p-8 shadow-card sm:p-12">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-danger">Service interruption</p>
        <h1 className="font-display text-4xl font-semibold text-text-heading sm:text-5xl">{title}</h1>
        <p className="mt-4 text-text-muted">
          The live content service did not return a usable response. No policy
          or company information has been invented as a fallback.
        </p>
        <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-primary-hover" href="/contact-us">
          Contact page
        </Link>
      </div>
    </div>
  );
}
