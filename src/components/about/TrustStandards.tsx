import { BadgeCheck, Headphones, ReceiptText } from "lucide-react";

const standards = [
  { icon: BadgeCheck, title: "Reviewed recommendations", text: "Stays, services and guides are considered for their fit with the route—not simply added from a catalogue." },
  { icon: ReceiptText, title: "Clarity before payment", text: "Pricing, inclusions, exclusions and applicable terms are explained before confirmation." },
  { icon: Headphones, title: "Human travel support", text: "You know how to reach the team when practical questions or changes need attention." },
] as const;

export function TrustStandards() {
  return (
    <section aria-labelledby="standards-title">
      <div>
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Confidence by design</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="standards-title">Trust is built into the process.</h2>
        <p className="mt-4 text-[0.95rem] leading-7 text-text-muted">Clear decisions matter more than borrowed badges. These are the practical standards travellers should expect when planning with BR.</p>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-5 max-[760px]:grid-cols-1">
        {standards.map(({ icon: Icon, title, text }) => (
          <article className="rounded-xl border border-border-subtle border-t-2 border-t-secondary bg-white p-6 shadow-card" key={title}>
            <Icon className="text-primary" aria-hidden="true" size={24} />
            <h3 className="mb-0 mt-5 font-display text-[1.15rem] font-semibold text-text-heading">{title}</h3>
            <p className="mb-0 mt-3 text-[0.9rem] leading-relaxed text-text-muted">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
