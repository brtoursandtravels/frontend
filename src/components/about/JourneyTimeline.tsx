import { Headphones, MessageCircle, Route, ShieldCheck } from "lucide-react";

const stages = [
  { number: "01", icon: MessageCircle, title: "Tell us your plans", text: "Share your dates, budget, who is coming and what you would like to do." },
  { number: "02", icon: Route, title: "Plan your trip", text: "We help you choose the places, activities and travel plan that suit you." },
  { number: "03", icon: ShieldCheck, title: "Check the details", text: "We check what is available and explain the costs and booking terms before you decide." },
  { number: "04", icon: Headphones, title: "Get help along the way", text: "You can contact our team for help before you leave and while you travel." },
] as const;

export function JourneyTimeline() {
  return (
    <section className="rounded-xl bg-primary p-[clamp(1.5rem,4vw,3.5rem)] text-white shadow-card" aria-labelledby="timeline-title">
      <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">How we work</p>
      <h2 className="m-0 whitespace-nowrap font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white max-[900px]:whitespace-normal" id="timeline-title">How we plan your trip with you.</h2>
      <ol className="relative mt-9 grid list-none grid-cols-4 gap-5 p-0 max-[800px]:grid-cols-1">
        {stages.map(({ number, icon: Icon, title, text }, index) => (
          <li className="relative z-1 max-[800px]:grid max-[800px]:grid-cols-[3rem_1fr] max-[800px]:gap-4" key={number}>
            {index < stages.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-12 right-[-1.25rem] top-6 h-px bg-white/20 max-[800px]:bottom-[-1.25rem] max-[800px]:left-6 max-[800px]:right-auto max-[800px]:top-12 max-[800px]:h-auto max-[800px]:w-px"
              />
            ) : null}
            <div className="relative z-1 grid size-12 place-items-center rounded-full border border-secondary-light/60 bg-primary-ink text-secondary-light shadow-card"><Icon aria-hidden="true" size={20} /></div>
            <div><span className="mt-5 block text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-secondary-light max-[800px]:mt-0">Step {number}</span><h3 className="mb-0 mt-1 font-display text-[1.15rem] font-semibold text-white">{title}</h3><p className="mb-0 mt-2 text-[0.9rem] leading-relaxed text-white/70">{text}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
