"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { apiErrorSchema, inquiryReceiptSchema } from "@/lib/contracts";

const schema = z.string().trim().email("Enter a valid email address.");

export function NewsletterForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const idempotencyKey = useRef("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email.");
      return;
    }
    setError("");
    setPending(true);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1"}/inquiries`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": idempotencyKey.current,
          },
          body: JSON.stringify({
            type: "CONTACT",
            name: "Newsletter subscriber",
            email: parsed.data,
            subject: "Travel journal updates",
            message: "Please contact me about BR travel journal updates.",
            sourcePath: window.location.pathname,
            privacyAccepted: true,
            policyVersion: "2026-08-31",
          }),
        },
      );
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const parsedError = apiErrorSchema.safeParse(payload);
        throw new Error(
          parsedError.success
            ? parsedError.data.error.message
            : "Your request could not be saved.",
        );
      }
      inquiryReceiptSchema.parse(payload);
      form.reset();
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your request could not be saved.",
      );
    } finally {
      setPending(false);
    }
  }

  if (saved) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-success/15 px-4 py-3 text-sm text-success-contrast" role="status">
        <CheckCircle2 aria-hidden="true" size={18} /> Request saved. The BR
        team will review your travel-update preference.
      </p>
    );
  }

  return (
    <form className="grid gap-2" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="newsletter-email">
        Email for travel updates
      </label>
      <div className="flex items-center rounded-full border border-white/20 bg-white/10 p-1.5">
        <input
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-2 text-[0.9rem] text-white outline-none placeholder:text-white/55"
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
        />
        <button className="flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-accent text-white transition hover:scale-105 disabled:opacity-60" disabled={pending} type="submit" aria-label="Request updates">
          <ArrowRight aria-hidden="true" size={19} />
        </button>
      </div>
      {error ? (
        <span className="text-xs font-semibold text-danger-contrast" id="newsletter-error" role="alert">
          {error}
        </span>
      ) : (
        <small className="text-xs text-white/60">No spam. Your request is saved for staff review.</small>
      )}
    </form>
  );
}
