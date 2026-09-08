import Link from "next/link";
import { ArrowRight, Camera, Images } from "lucide-react";

export function GalleryCta() {
  return (
    <div className="grid gap-6">
      <aside className="flex items-center justify-between gap-6 rounded-xl border border-border-subtle bg-bg-muted p-6 max-[700px]:items-start max-[700px]:flex-col" aria-labelledby="traveller-photos-title">
        <div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary-muted/60 text-secondary-hover"><Camera aria-hidden="true" size={20} /></div><div><h2 className="m-0 font-display text-[clamp(1.5rem,2.5vw,2rem)] font-semibold leading-[1.12] text-text-heading" id="traveller-photos-title">Have a BR journey worth sharing?</h2><p className="mb-0 mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-text-muted">Send your favourite travel photograph to the team. Guest stories are shown only with permission and approved attribution.</p></div></div>
        <Link className="shrink-0 text-sm font-extrabold text-primary" href="/contact-us#contact-form">Share your story →</Link>
      </aside>
      <section className="relative overflow-hidden rounded-xl bg-primary-ink p-[clamp(1.6rem,5vw,3.8rem)] text-white shadow-dropdown" aria-labelledby="gallery-cta-title">
        <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">From image to itinerary</p>
        <h2 className="m-0 max-w-3xl font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white" id="gallery-cta-title">Found a place that calls to you?</h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/70">Tell our destination team which landscapes inspired you and we’ll help shape them into a private journey.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-accent-hover" href="/contact-us?subject=custom-trip#contact-form">Customise a trip <ArrowRight aria-hidden="true" size={17} /></Link><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-white/10" href="/packages"><Images aria-hidden="true" size={17} /> Browse packages</Link></div>
      </section>
    </div>
  );
}
