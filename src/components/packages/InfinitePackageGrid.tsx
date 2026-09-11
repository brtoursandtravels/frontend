"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PackageCard as PackageCardData } from "@/lib/contracts";
import { PackageCard } from "@/components/packages/PackageCard";

type PackagePage = {
  data: PackageCardData[];
  meta: { page: number; pageSize: number; total: number };
};

export function InfinitePackageGrid({
  initialItems,
  initialMeta,
  query,
}: {
  initialItems: PackageCardData[];
  initialMeta: PackagePage["meta"];
  query: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialMeta.page);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = items.length < initialMeta.total;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setFailed(false);

    try {
      const params = new URLSearchParams(query);
      params.set("page", String(page + 1));
      const response = await fetch(`/api/packages?${params.toString()}`, {
        headers: { accept: "application/json" },
      });

      if (!response.ok) throw new Error("Package request failed");

      const result = (await response.json()) as PackagePage;
      setItems((current) => {
        const knownIds = new Set(current.map((item) => item.id));
        return [
          ...current,
          ...result.data.filter((item) => !knownIds.has(item.id)),
        ];
      });
      setPage(result.meta.page);
    } catch {
      setFailed(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, query]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || failed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [failed, hasMore, loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 gap-6 max-[620px]:grid-cols-1">
        {items.map((item, index) => (
          <PackageCard featured={index === 0} item={item} key={item.id} />
        ))}
      </div>

      <div
        className="mt-8 flex min-h-16 items-center justify-center border-t border-border-subtle pt-6 text-center"
        ref={sentinelRef}
      >
        <div aria-live="polite" className="text-sm font-bold text-text-muted">
          {loading ? (
            <span className="inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary"
              />
              Loading more journeys…
            </span>
          ) : failed ? (
            <button
              className="rounded-full border border-primary px-5 py-2 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-white"
              onClick={() => void loadMore()}
              type="button"
            >
              Try loading more
            </button>
          ) : hasMore ? (
            "Scroll to discover more journeys"
          ) : (
            `You have viewed all ${items.length} journeys`
          )}
        </div>
      </div>
    </>
  );
}
