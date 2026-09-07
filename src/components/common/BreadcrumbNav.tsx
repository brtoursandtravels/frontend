import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function BreadcrumbNav({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="mb-5 text-xs text-text-muted" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            {index ? <ChevronRight aria-hidden="true" size={14} /> : null}
            {item.href ? (
              <Link className="text-primary no-underline transition-colors hover:text-secondary" href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
