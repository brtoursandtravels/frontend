"use client";

import { useState } from "react";

export function ShareActions({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copied.");
    } catch {
      setMessage("Copy was blocked. Select the address from your browser.");
    }
  }
  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title, url: window.location.href });
      setMessage("Share sheet opened.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Sharing was not available.");
    }
  }
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
      <button className="rounded-full border border-primary px-4 py-2 font-bold text-primary" type="button" onClick={share}>
        Share article
      </button>
      <button className="rounded-full border border-border-subtle px-4 py-2 font-bold text-text-body" type="button" onClick={copy}>
        Copy link
      </button>
      <span className="text-text-muted" role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
