import { BadgeCheck, Compass, Landmark, ReceiptText } from "lucide-react";

const pillars = [
  { number: "01", icon: Compass, title: "Bespoke, never cloned", text: "Every conversation begins with your pace, interests and practical needs—not a generic template.", note: "Designed around you" },
  { number: "02", icon: BadgeCheck, title: "Carefully considered stays", text: "Recommendations balance location, comfort, character and suitability for the journey you want.", note: "Fit before fashion" },
  { number: "03", icon: Landmark, title: "Grounded local context", text: "Routes are shaped around sensible travel times, regional character and experiences worth slowing down for.", note: "Place-led planning" },
  { number: "04", icon: ReceiptText, title: "No hidden surprises", text: "Inclusions, exclusions, availability and applicable terms are clarified before a request becomes a booking.", note: "Clarity first" },
] as const;

export function PhilosophyPillars() {
  return (
    <section aria-labelledby="pillars-title">
      <div>
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">The craft of travel</p>
        <h2 className="m-0 whitespace-nowrap font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading max-[900px]:whitespace-normal" id="pillars-title">Four principles behind every BR journey.</h2>
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
