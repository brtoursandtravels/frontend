import { Activity, Backpack, BadgeCheck, ChevronDown } from "lucide-react";

const guidance = [
  { icon: BadgeCheck, title: "Registration and permits", text: "We explain the current registration process and help organise the traveller details needed for submission. Government approval and access remain subject to the applicable rules." },
  { icon: Activity, title: "Medical fitness and altitude", text: "Speak with your doctor before high-altitude travel, particularly for heart, respiratory or blood-pressure concerns. Build in rest, hydration and a realistic walking pace." },
  { icon: Backpack, title: "What to pack", text: "Bring warm layers, a waterproof outer layer, grip-soled walking shoes, sun protection and your prescribed medicines. A final seasonal checklist is shared before departure." },
] as const;

export function YatraPreparationGuide() {
  return (
    <section className="mb-6 rounded-xl border border-border-subtle bg-white p-6 shadow-card" aria-labelledby="preparation-title">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover">Pilgrim preparation</p>
      <h2 className="mt-0 font-display text-[clamp(1.75rem,2.4vw,2.4rem)] text-text-heading" id="preparation-title">Prepare calmly and travel responsibly.</h2>
      <div className="mt-5 border-t border-border-subtle">
        {guidance.map(({ icon: Icon, text, title }) => (
          <details className="group border-b border-border-subtle" key={title}>
            <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-5 [&::-webkit-details-marker]:hidden">
              <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary"><Icon aria-hidden="true" size={19} /></span>
              <strong className="text-[0.95rem] text-text-heading">{title}</strong>
              <ChevronDown aria-hidden="true" className="text-secondary transition group-open:rotate-180" size={18} />
            </summary>
            <p className="mb-5 ml-13 mt-0 max-w-2xl text-[0.86rem] leading-relaxed text-text-muted">{text}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
