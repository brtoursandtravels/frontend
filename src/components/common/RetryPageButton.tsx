"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryPageButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={`${className ?? ""} disabled:cursor-wait disabled:opacity-60`}
      disabled={isPending}
      aria-busy={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? "Trying again..." : "Try again"}
    </button>
  );
}
