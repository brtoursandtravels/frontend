import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

export function GalleryCta() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary-ink p-[clamp(1.6rem,5vw,3.8rem)] text-white shadow-dropdown" aria-labelledby="gallery-cta-title">
      <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">From image to itinerary</p>
      <h2 className="m-0 max-w-3xl font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white" id="gallery-cta-title">Found a place that calls to you?</h2>
      <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/70">Tell our destination team which landscapes inspired you and we’ll help shape them into a private journey.</p>
      <div className="mt-7 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-accent-hover" href="/contact-us?subject=custom-trip#contact-form">Customise a trip <ArrowRight aria-hidden="true" size={17} /></Link><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-white/10" href="/packages"><Images aria-hidden="true" size={17} /> Browse packages</Link></div>
    </section>
  );
}
