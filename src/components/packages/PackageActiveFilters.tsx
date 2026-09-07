import Link from "next/link";
import { X } from "lucide-react";

export function PackageActiveFilters({
  filters,
}: {
  filters: Array<{ key: string; label: string; href: string }>;
}) {
  if (!filters.length) return null;
  return (
    <div className="mb-5 flex flex-wrap gap-2" aria-label="Selected filters">
      {filters.map((filter) => (
        <Link className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary no-underline transition hover:bg-primary hover:text-white" href={filter.href} key={filter.key}>
          {filter.label}
          <X aria-hidden="true" size={14} />
          <span className="sr-only">Remove filter</span>
        </Link>
      ))}
    </div>
  );
}
