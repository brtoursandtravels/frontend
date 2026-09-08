import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

export function AboutCtaBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-primary-ink p-[clamp(1.7rem,5vw,4rem)] text-white shadow-dropdown" aria-labelledby="about-cta-title">
      <div className="absolute -right-16 -top-20 -z-1 size-72 rounded-full border border-secondary/25" aria-hidden="true" />
      <div className="absolute -bottom-24 right-24 -z-1 size-60 rounded-full bg-secondary/10 blur-2xl" aria-hidden="true" />
      <div className="grid grid-cols-[1fr_auto] items-end gap-8 max-[760px]:grid-cols-1">
        <div><p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">Begin with a conversation</p><h2 className="m-0 max-w-3xl font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white" id="about-cta-title">Ready to shape a journey that feels like yours?</h2><p className="mb-0 mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/75">Share the first idea with a destination specialist. There is no booking obligation, and details are reviewed before confirmation.</p></div>
        <div className="flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-accent-hover" href="/contact-us?subject=custom-trip#contact-form">Start a trip request <ArrowRight aria-hidden="true" size={17} /></Link><Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:bg-white/15" href="/contact-us#contact-form"><MessageCircle aria-hidden="true" size={17} /> Ask a question</Link></div>
      </div>
      <p className="mb-0 mt-7 flex flex-wrap gap-x-4 gap-y-2 text-[0.72rem] font-bold text-white/65"><span className="inline-flex items-center gap-1"><Check aria-hidden="true" size={13} /> Clear inclusions</span><span className="inline-flex items-center gap-1"><Check aria-hidden="true" size={13} /> Human support</span><span className="inline-flex items-center gap-1"><Check aria-hidden="true" size={13} /> Confirmation before commitment</span></p>
    </section>
  );
}
