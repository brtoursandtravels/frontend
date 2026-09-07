import type { ReactNode } from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-primary/10 motion-reduce:animate-none ${className}`}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["w-full", "w-[92%]", "w-[78%]", "w-[86%]"];

  return (
    <div aria-hidden="true" className={`grid gap-3 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton className={`h-3.5 ${widths[index % widths.length]}`} key={index} />
      ))}
    </div>
  );
}

export function SkeletonCard({
  image = true,
  children,
}: {
  image?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card">
      {image ? <Skeleton className="h-52 rounded-none" /> : null}
      <div className="p-5">
        {children ?? (
          <>
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="mb-5 h-8 w-[82%]" />
            <SkeletonText lines={3} />
          </>
        )}
      </div>
    </div>
  );
}

export function SkeletonStatus({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div aria-busy="true" aria-live="polite" role="status">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
