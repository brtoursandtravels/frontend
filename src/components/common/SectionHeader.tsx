import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={`mb-12 flex items-end justify-between gap-8 max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-5 ${
        align === "center" ? "items-center text-center max-[820px]:items-center" : ""
      }`}
    >
      <div className={`max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
        <p className={`mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-hover ${align === "center" ? "justify-center" : ""}`}>
          {eyebrow}
        </p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading">{title}</h2>
        {description ? <p className={`mt-4 max-w-2xl text-base text-text-muted ${align === "center" ? "mx-auto" : ""}`}>{description}</p> : null}
      </div>
      {href ? (
        <Link className="shrink-0 border-b border-secondary pb-1 text-xs font-extrabold uppercase tracking-wider text-primary no-underline transition-all hover:gap-3 hover:text-secondary" href={href}>
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </header>
  );
}
