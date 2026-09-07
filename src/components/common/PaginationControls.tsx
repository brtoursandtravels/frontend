import Link from "next/link";

export function PaginationControls({
  page,
  pageSize,
  total,
  hrefForPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-between gap-4 border-t border-border-subtle pt-5 text-sm [&_a]:rounded-full [&_a]:border [&_a]:border-primary [&_a]:px-4 [&_a]:py-2 [&_a]:font-bold [&_a]:text-primary [&_a]:no-underline [&_span[aria-disabled='true']]:opacity-40" aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)}>← Previous</Link>
      ) : (
        <span aria-disabled="true">← Previous</span>
      )}
      <span>
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link href={hrefForPage(page + 1)}>Next →</Link>
      ) : (
        <span aria-disabled="true">Next →</span>
      )}
    </nav>
  );
}
