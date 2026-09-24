import type { StaticContentPage } from "@/lib/static-content-pages";

export function ContentPage({
  page,
  eyebrow,
  children,
}: {
  page: StaticContentPage;
  eyebrow: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
      <header className="mb-10 rounded-xl bg-primary p-[clamp(2rem,5vw,4rem)] text-white shadow-dropdown">
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">{eyebrow}</p>
        <h1 className="m-0 max-w-[15ch] text-balance font-display text-[clamp(2.4rem,4.5vw,3.75rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-white">{page.title}</h1>
        {page.ownerReviewDue ? (
          <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/80" role="note">
            This content is marked for owner review before launch.
          </p>
        ) : null}
      </header>
      <div
        className="mx-auto min-w-0 max-w-3xl text-[0.98rem] leading-7 text-text-body [&_a]:font-semibold [&_a]:text-primary [&_a]:[overflow-wrap:anywhere] [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:bg-bg-muted [&_blockquote]:p-5 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[clamp(1.65rem,2.5vw,2rem)] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-text-heading [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-heading [&_iframe]:max-w-full [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:my-2 [&_ol]:my-5 [&_p]:my-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_ul]:my-5 [&_video]:h-auto [&_video]:max-w-full"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
      {children}
    </div>
  );
}
