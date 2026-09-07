"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Clock3,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { PackageDetail } from "@/lib/contracts";
import { formatMoney, priceBasisLabel } from "@/lib/presentation";
import { EnquiryModal } from "@/components/common/EnquiryModal";

function whatsappEstimateHref(
  href: string,
  packageTitle: string,
  adults: number,
  children: number,
) {
  try {
    const url = new URL(href);
    url.searchParams.set(
      "text",
      `Hello BR Tours, I would like to discuss ${packageTitle} for ${adults} adult${adults === 1 ? "" : "s"} and ${children} child${children === 1 ? "" : "ren"}.`,
    );
    return url.toString();
  } catch {
    return href;
  }
}

function PartyCounter({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  const guestType = label === "Adults" ? "adult guests" : "child guests";
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text-heading" htmlFor={id}>
        {label}
      </label>
      <div className="grid grid-cols-[2.5rem_1fr_2.5rem] overflow-hidden rounded-full border border-border-subtle bg-white">
        <button
          className="grid place-items-center border-0 bg-primary-soft text-primary transition hover:bg-primary hover:text-white"
          type="button"
          aria-label={`Decrease ${guestType}`}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus aria-hidden="true" size={15} />
        </button>
        <input
          className="min-w-0 border-0 bg-transparent px-1 py-2 text-center text-sm font-extrabold text-text-heading outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          id={id}
          type="number"
          min={min}
          max={50}
          value={value}
          onChange={(event) =>
            onChange(
              Math.min(
                50,
                Math.max(min, Number(event.target.value) || min),
              ),
            )
          }
        />
        <button
          className="grid place-items-center border-0 bg-primary-soft text-primary transition hover:bg-primary hover:text-white"
          type="button"
          aria-label={`Increase ${guestType}`}
          onClick={() => onChange(Math.min(50, value + 1))}
        >
          <Plus aria-hidden="true" size={15} />
        </button>
      </div>
    </div>
  );
}

export function StickyBookingCard({
  item,
  departures,
  whatsappHref,
}: {
  item: PackageDetail;
  departures: Array<{ id: string; label: string }>;
  whatsappHref?: string | null;
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const travellers = adults + children;
  const canEstimate =
    item.startingPrice?.basis === "PER_PERSON" && travellers > 0;
  const estimatedAmount = canEstimate
    ? String(Number(item.startingPrice!.amount) * travellers)
    : null;

  return (
    <aside className="sticky top-24 overflow-hidden rounded-xl border border-secondary/25 bg-white p-6 shadow-card after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-1 after:bg-gradient-to-r after:from-secondary after:via-accent after:to-secondary max-[820px]:relative">
      <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-secondary-hover">
        Plan this journey
      </p>
      <div className="grid border-b border-border-subtle pb-5">
        <span className="text-[0.65rem] font-bold uppercase text-text-muted">
          Starting from
        </span>
        <strong className="font-display text-4xl text-primary">
          {item.startingPrice
            ? formatMoney(
                estimatedAmount ?? item.startingPrice.amount,
                item.startingPrice.currency,
              )
            : "Price on request"}
        </strong>
        {item.startingPrice ? (
          <small className="text-xs text-text-muted">
            {canEstimate
              ? `estimated for ${travellers} traveller${travellers === 1 ? "" : "s"}`
              : priceBasisLabel(item.startingPrice.basis)}
          </small>
        ) : null}
        <small className="mt-1 text-[0.62rem] leading-relaxed text-text-muted">
          Taxes, GST and final inclusions are itemised before confirmation.
        </small>
      </div>

      <fieldset className="my-5 grid grid-cols-2 gap-3 rounded-lg border border-border-subtle bg-bg-muted p-4 max-[420px]:grid-cols-1">
        <legend className="px-1 text-xs font-extrabold text-text-heading">
          <Users
            className="mr-1 inline text-accent"
            aria-hidden="true"
            size={15}
          />
          Party-size estimate
        </legend>
        <PartyCounter
          id="booking-adults"
          label="Adults"
          value={adults}
          min={1}
          onChange={setAdults}
        />
        <PartyCounter
          id="booking-children"
          label="Children"
          value={children}
          min={0}
          onChange={setChildren}
        />
        <p className="col-span-2 m-0 text-[0.65rem] leading-relaxed text-text-muted max-[420px]:col-span-1">
          This is a starting-price reference only. Child rates, rooms,
          departures, taxes and availability are confirmed by BR staff.
        </p>
      </fieldset>

      <div className="my-5 grid gap-3 text-xs text-text-body [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_svg]:text-accent">
        <span>
          <Clock3 aria-hidden="true" size={16} /> Response reviewed by staff
        </span>
        <span>
          <CalendarCheck aria-hidden="true" size={16} /> Dates confirmed
          personally
        </span>
        <span>
          <ShieldCheck aria-hidden="true" size={16} /> No payment at enquiry
        </span>
      </div>

      <div className="grid gap-2">
        <EnquiryModal
          packageSlug={item.slug}
          packageTitle={item.title}
          departures={departures}
          label="Enquire about this journey"
          whatsappHref={whatsappHref}
          defaultAdultCount={adults}
          defaultChildCount={children}
        />
        {whatsappHref ? (
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-success/25 bg-success-bg px-5 py-3 text-sm font-extrabold text-success no-underline transition hover:-translate-y-0.5 motion-reduce:transform-none"
            href={whatsappEstimateHref(
              whatsappHref,
              item.title,
              adults,
              children,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" size={18} /> Ask on WhatsApp
          </a>
        ) : null}
      </div>
      <p className="mt-3 text-center text-[0.65rem] leading-relaxed text-text-muted">
        Submitting a request does not guarantee price, inventory or booking.
      </p>
    </aside>
  );
}
