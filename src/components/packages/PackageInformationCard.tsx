import type { LucideIcon } from "lucide-react";

export function PackageInformationCard({
  id,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  title: string;
  description: string | null;
  icon: LucideIcon;
}) {
  if (!description?.trim()) return null;

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mb-6 rounded-xl border border-border-subtle bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
          <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
        </span>
        <h2
          className="m-0 min-w-0 font-display text-xl font-semibold leading-snug text-text-heading [overflow-wrap:anywhere]"
          id={`${id}-heading`}
        >
          {title}
        </h2>
      </div>
      <p className="mb-0 mt-4 whitespace-pre-line text-sm leading-7 text-text-muted [overflow-wrap:anywhere] sm:pl-[3.25rem] sm:text-[0.95rem]">
        {description.trim()}
      </p>
    </section>
  );
}
