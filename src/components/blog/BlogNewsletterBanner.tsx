import { Mail, ShieldCheck } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function BlogNewsletterBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary-ink p-[clamp(1.6rem,5vw,3.8rem)] text-white shadow-dropdown" aria-labelledby="journal-newsletter-title">
      <Mail className="absolute -right-8 -top-10 text-white/5" aria-hidden="true" size={230} strokeWidth={1} />
      <div className="relative grid grid-cols-[1fr_minmax(18rem,.65fr)] items-center gap-10 max-[800px]:grid-cols-1">
        <div><p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">The travel dispatch</p><h2 className="m-0 max-w-2xl font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white" id="journal-newsletter-title">Receive useful travel notes in your inbox.</h2><p className="mb-0 mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/70">Seasonal guidance, thoughtful routes and new journal stories from the BR team.</p></div>
        <div><NewsletterForm /><p className="mb-0 mt-3 flex items-center gap-1.5 text-[0.7rem] text-white/55"><ShieldCheck aria-hidden="true" size={14} /> Your request is saved for staff review.</p></div>
      </div>
    </section>
  );
}
