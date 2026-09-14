import {
  Skeleton,
  SkeletonCard,
  SkeletonStatus,
  SkeletonText,
} from "@/components/common/Skeleton";

function SectionHeadingSkeleton() {
  return (
    <div className="mb-10 max-w-3xl">
      <Skeleton className="mb-4 h-3 w-36" />
      <Skeleton className="mb-3 h-12 w-[78%] max-[620px]:h-9" />
      <Skeleton className="h-12 w-[58%] max-[620px]:h-9" />
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <SkeletonStatus label="Loading the BR Tours homepage">
      <section className="flex min-h-[calc(100svh-7.25rem)] items-center bg-primary-ink/12">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <Skeleton className="mb-6 h-9 w-80 max-w-full rounded-full bg-white/35" />
          <div className="grid items-end gap-10 min-[1100px]:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Skeleton className="mb-4 h-20 w-[72%] bg-white/35 max-[620px]:h-14" />
              <Skeleton className="h-20 w-[88%] bg-white/35 max-[620px]:h-14" />
            </div>
            <div className="flex gap-3 min-[1100px]:justify-end">
              <Skeleton className="h-12 w-44 rounded-full bg-secondary/30" />
              <Skeleton className="h-12 w-40 rounded-full bg-white/30" />
            </div>
          </div>
          <div className="mt-7 grid grid-cols-4 gap-2 max-[820px]:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-[4.25rem] rounded-xl bg-white/25" key={index} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-bg-muted py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    </SkeletonStatus>
  );
}

export function ListingPageSkeleton({ label = "Loading journeys" }: { label?: string }) {
  return (
    <SkeletonStatus label={label}>
      <section className="bg-primary-ink/12 py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <Skeleton className="mb-5 h-4 w-36 bg-white/35" />
          <Skeleton className="mb-4 h-16 w-[58%] bg-white/35 max-[620px]:h-11 max-[620px]:w-full" />
          <Skeleton className="h-4 w-[44%] bg-white/30 max-[620px]:w-[85%]" />
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-10 grid grid-cols-4 gap-3 rounded-xl border border-border-subtle bg-white p-4 shadow-card max-[820px]:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-12 rounded-full" key={index} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </SkeletonStatus>
  );
}

export function DetailPageSkeleton({ label = "Loading journey details" }: { label?: string }) {
  return (
    <SkeletonStatus label={label}>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <Skeleton className="mb-6 h-4 w-72 max-w-full" />
        <Skeleton className="h-72 w-full rounded-xl max-[620px]:h-56" />
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_24rem] items-start gap-12 max-[960px]:grid-cols-1">
          <div>
            <Skeleton className="mb-4 h-3 w-28" />
            <Skeleton className="mb-6 h-14 w-[78%] max-[620px]:h-11 max-[620px]:w-full" />
            <SkeletonText lines={4} className="max-w-3xl" />
            <div className="mt-8 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton className="h-12" key={index} />
              ))}
            </div>
          </div>
          <SkeletonCard image={false}>
            <Skeleton className="mb-5 h-3 w-32" />
            <Skeleton className="mb-6 h-12 w-48" />
            <Skeleton className="mb-5 h-32 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-full" />
          </SkeletonCard>
        </div>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)_20rem] gap-8 max-[960px]:grid-cols-1">
          <SkeletonCard image={false}>
            <Skeleton className="mb-5 h-9 w-40" />
            <SkeletonText lines={6} />
          </SkeletonCard>
          <SkeletonCard image={false}>
            <Skeleton className="mb-5 h-8 w-44" />
            <SkeletonText lines={5} />
          </SkeletonCard>
        </div>
      </div>
    </SkeletonStatus>
  );
}

export function ContentPageSkeleton({ label = "Loading page content" }: { label?: string }) {
  return (
    <SkeletonStatus label={label}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 lg:px-10">
        <Skeleton className="mb-5 h-4 w-36" />
        <Skeleton className="mb-4 h-14 w-[68%] max-[620px]:h-10 max-[620px]:w-full" />
        <SkeletonText lines={3} className="mb-10 max-w-2xl" />
        <Skeleton className="mb-8 h-64 w-full rounded-xl" />
        <div className="grid gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard image={false} key={index}>
              <Skeleton className="mb-5 h-8 w-[42%]" />
              <SkeletonText lines={4} />
            </SkeletonCard>
          ))}
        </div>
      </div>
    </SkeletonStatus>
  );
}
