import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Thoughtful human review",
    meta: "Within 4 business hours",
    text: "A destination specialist reviews your dates, group size, priorities and preferred travel style.",
  },
  {
    number: "02",
    title: "A transparent itinerary draft",
    meta: "Clear choices, carefully explained",
    text: "We shape a day-by-day route with suitable stays, transfers and itemised pricing for discussion.",
  },
  {
    number: "03",
    title: "Zero-pressure refinement",
    meta: "Commit only when it feels right",
    text: "Adjust the pace, hotels and experiences until the journey genuinely fits you.",
  },
] as const;

export function ConsultationTimeline() {
  return (
    <aside className="self-start rounded-xl bg-primary p-[clamp(1.5rem,3vw,2.5rem)] text-white shadow-dropdown">
      <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-light">The BR consultation promise</p>
      <h2 className="m-0 text-balance font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold leading-[1.08] text-white">What happens after you reach out?</h2>
      <ol className="my-7 grid list-none gap-5 p-0">
        {steps.map((step) => (
          <li className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-white/15 pt-5" key={step.number}>
            <span className="font-display text-lg font-bold text-secondary-light">{step.number}</span>
            <div>
              <h3 className="m-0 text-[0.98rem] font-extrabold text-white">{step.title}</h3>
              <p className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-secondary-light">{step.meta}</p>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-white/70">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 rounded-lg border border-white/15 bg-white/8 p-4 text-[0.82rem] font-bold text-white/85">
        <span className="flex items-center gap-2"><ShieldCheck aria-hidden="true" className="text-secondary-light" size={17} /> Complimentary initial planning</span>
        <span className="flex items-center gap-2"><LockKeyhole aria-hidden="true" className="text-secondary-light" size={17} /> Your contact details stay private</span>
        <span className="flex items-center gap-2"><Sparkles aria-hidden="true" className="text-secondary-light" size={17} /> Dedicated support throughout your journey</span>
      </div>
    </aside>
  );
}
