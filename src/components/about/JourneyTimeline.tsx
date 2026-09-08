import { Headphones, MessageCircle, Route, ShieldCheck } from "lucide-react";

const stages = [
  { number: "01", icon: MessageCircle, title: "Listen", text: "We learn who is travelling, what matters and what should feel effortless." },
  { number: "02", icon: Route, title: "Shape", text: "A practical route takes form around your pace, dates and preferred experiences." },
  { number: "03", icon: ShieldCheck, title: "Verify", text: "Availability, inclusions and terms are checked before you make a decision." },
  { number: "04", icon: Headphones, title: "Support", text: "A human point of contact stays close before and throughout the journey." },
] as const;

export function JourneyTimeline() {
  return (
    <section className="rounded-xl bg-primary p-[clamp(1.5rem,4vw,3.5rem)] text-white shadow-card" aria-labelledby="timeline-title">
      <p className="mb-3 text-[0.73rem] font-extrabold uppercase tracking-[0.17em] text-secondary-light">How we work</p>
      <h2 className="m-0 max-w-2xl font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white" id="timeline-title">A clear path from first idea to travel day.</h2>
      <ol className="relative mt-9 grid list-none grid-cols-4 gap-5 p-0 before:absolute before:left-[10%] before:right-[10%] before:top-6 before:h-px before:bg-white/20 max-[800px]:grid-cols-1 max-[800px]:before:bottom-[8%] max-[800px]:before:left-6 max-[800px]:before:right-auto max-[800px]:before:top-[8%] max-[800px]:before:h-auto max-[800px]:before:w-px">
        {stages.map(({ number, icon: Icon, title, text }) => (
          <li className="relative z-1 max-[800px]:grid max-[800px]:grid-cols-[3rem_1fr] max-[800px]:gap-4" key={number}>
            <div className="grid size-12 place-items-center rounded-full border border-secondary-light/60 bg-primary-ink text-secondary-light shadow-card"><Icon aria-hidden="true" size={20} /></div>
            <div><span className="mt-5 block text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-secondary-light max-[800px]:mt-0">Step {number}</span><h3 className="mb-0 mt-1 text-lg font-extrabold text-white">{title}</h3><p className="mb-0 mt-2 text-[0.85rem] leading-relaxed text-white/70">{text}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
