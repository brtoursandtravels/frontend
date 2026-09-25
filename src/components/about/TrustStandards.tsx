import { BadgeCheck, Headphones, ReceiptText } from "lucide-react";

const standards = [
  { icon: BadgeCheck, title: "Hotels and guides that suit your trip", text: "We check that the suggested hotels, services and guides fit your travel plans." },
  { icon: ReceiptText, title: "Clear prices", text: "We explain the price, what it covers, any extra costs and the booking terms before you book." },
  { icon: Headphones, title: "A team you can reach", text: "We share how to contact our team if you have questions or your plans change." },
] as const;

export function TrustStandards() {
  return (
    <section aria-labelledby="standards-title">
      <div>
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Why choose BR</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="standards-title">Clear details and help when you need it.</h2>
        <p className="mt-4 text-[0.95rem] leading-7 text-text-muted">We explain your travel options, costs and booking terms so you know what to expect.</p>
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
