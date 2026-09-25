import { BadgeCheck, Compass, Landmark, ReceiptText } from "lucide-react";

const pillars = [
  { number: "01", icon: Compass, title: "Plans that suit you", text: "We plan around your dates, interests and budget, with time for the things you enjoy.", note: "Your choices matter" },
  { number: "02", icon: BadgeCheck, title: "Places to stay", text: "We suggest hotels that suit your trip, with a convenient location and the comfort you need.", note: "Stay comfortably" },
  { number: "03", icon: Landmark, title: "Time to enjoy each place", text: "We allow time for travel, sightseeing and rest, so you can enjoy each stop without rushing.", note: "Take your time" },
  { number: "04", icon: ReceiptText, title: "Clear costs and details", text: "Before you book, we explain what is included, what costs extra and which booking terms apply.", note: "Know before you book" },
] as const;

export function PhilosophyPillars() {
  return (
    <section aria-labelledby="pillars-title">
      <div>
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">What you can expect</p>
        <h2 className="m-0 whitespace-nowrap font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading max-[900px]:whitespace-normal" id="pillars-title">How we help you plan your trip.</h2>
      </div>
      <div className="mt-8 grid grid-cols-4 gap-4 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
        {pillars.map(({ number, icon: Icon, title, text, note }) => (
          <article className="group relative overflow-hidden rounded-xl border border-border-subtle bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-card-hover" key={number}>
            <span className="absolute right-4 top-3 font-display text-5xl font-bold text-primary/6" aria-hidden="true">{number}</span>
            <div className="grid size-11 place-items-center rounded-lg bg-secondary-muted/55 text-secondary-hover"><Icon aria-hidden="true" size={22} /></div>
            <h3 className="mb-0 mt-6 font-display text-[1.15rem] font-semibold leading-tight text-text-heading">{title}</h3>
            <p className="mb-0 mt-3 text-[0.9rem] leading-relaxed text-text-muted">{text}</p>
            <span className="mt-5 inline-flex rounded-full bg-bg-muted px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-primary transition group-hover:bg-primary group-hover:text-white">{note}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
