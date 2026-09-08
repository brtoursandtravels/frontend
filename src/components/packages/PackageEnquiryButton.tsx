"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";

type LoadedModal = ComponentType<{
  packageSlug: string;
  packageTitle: string;
  label?: string;
  initiallyOpen?: boolean;
}>;

export function PackageEnquiryButton({
  packageSlug,
  packageTitle,
}: {
  packageSlug: string;
  packageTitle: string;
}) {
  const [Modal, setModal] = useState<LoadedModal | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadModal() {
    setLoading(true);
    try {
      const enquiryModule = await import("@/components/common/EnquiryModal");
      setModal(() => enquiryModule.EnquiryModal);
    } finally {
      setLoading(false);
    }
  }

  if (Modal) {
    return (
      <Modal
        initiallyOpen
        label="Enquire now"
        packageSlug={packageSlug}
        packageTitle={packageTitle}
      />
    );
  }

  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-0 bg-gradient-to-br from-accent to-secondary px-5 py-3 text-sm font-extrabold text-white shadow-accent-md transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-75"
      disabled={loading}
      type="button"
      onClick={() => void loadModal()}
    >
      {loading ? "Opening…" : "Enquire now"} <ArrowUpRight aria-hidden="true" size={18} />
    </button>
  );
}
