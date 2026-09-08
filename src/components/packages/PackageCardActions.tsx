"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function PackageCardActions({
  packageSlug,
  packageSummary,
  packageTitle,
}: {
  packageSlug: string;
  packageSummary: string;
  packageTitle: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/packages/${packageSlug}`;
    if (navigator.share) {
      await navigator.share({ title: packageTitle, text: packageSummary, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="absolute right-3 top-3 z-2 flex gap-2">
      <button
        className="flex size-10 items-center justify-center rounded-full border-0 bg-white/90 text-primary shadow-sm backdrop-blur-md transition hover:scale-105"
        type="button"
        aria-label={copied ? "Journey link copied" : "Share this journey"}
        onClick={() => void share()}
      >
        {copied ? <Check aria-hidden="true" size={18} /> : <Share2 aria-hidden="true" size={18} />}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Journey link copied to clipboard." : ""}
      </span>
    </div>
  );
}
