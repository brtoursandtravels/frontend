"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export function EnquiryModal({
  packageSlug,
  packageTitle,
  departures = [],
  label = "Enquire now",
  whatsappHref,
  defaultAdultCount,
  defaultChildCount,
  initiallyOpen = false,
  defaultMessage,
}: {
  packageSlug?: string;
  packageTitle?: string;
  departures?: Array<{ id: string; label: string }>;
  label?: string;
  whatsappHref?: string | null;
  defaultAdultCount?: number;
  defaultChildCount?: number;
  initiallyOpen?: boolean;
  defaultMessage?: string;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => !element.hasAttribute("aria-hidden"));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-0 bg-gradient-to-br from-accent to-secondary px-5 py-3 text-sm font-extrabold text-white shadow-accent-md transition hover:-translate-y-0.5" type="button" ref={triggerRef} onClick={() => setOpen(true)}>
        {label} <ArrowUpRight aria-hidden="true" size={18} />
      </button>
      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-100 grid place-items-center overflow-y-auto bg-primary-ink/65 p-5 backdrop-blur-sm max-[620px]:p-0" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section ref={dialogRef} className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-[clamp(1.4rem,4vw,2.5rem)] shadow-dropdown max-[620px]:min-h-screen max-[620px]:max-h-screen max-[620px]:rounded-none" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
            <header className="flex items-start justify-between gap-5 border-b border-border-subtle pb-5">
              <div><p className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Start planning</p><h2 className="m-0 font-display text-4xl leading-tight text-text-heading" id="enquiry-modal-title">Tell us about your journey.</h2></div>
              <button className="flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-bg-muted text-primary" type="button" ref={closeRef} onClick={close} aria-label="Close enquiry form"><X aria-hidden="true" /></button>
            </header>
            <p className="my-4 text-sm text-text-muted">Your request is saved for staff review. It is not treated as a confirmed booking.</p>
            <EnquiryForm
              compact
              packageSlug={packageSlug}
              packageTitle={packageTitle}
              departures={departures}
              whatsappHref={whatsappHref}
              defaultAdultCount={defaultAdultCount}
              defaultChildCount={defaultChildCount}
              defaultMessage={defaultMessage}
            />
          </section>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
