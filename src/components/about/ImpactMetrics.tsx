import { Headphones, Plane, ShieldCheck, Star } from "lucide-react";

const metrics = [
  { icon: Star, value: "4.9/5", label: "Traveller rating" },
  { icon: Plane, value: "10,000+", label: "Happy travellers" },
  { icon: ShieldCheck, value: "Checked", label: "Hotels and guides" },
  { icon: Headphones, value: "24/7", label: "Help during your trip" },
] as const;

export function ImpactMetrics() {
  return (
    <section className="rounded-xl border border-secondary/20 bg-[linear-gradient(120deg,var(--color-bg-muted),white)] px-4 py-5 shadow-card sm:px-6" aria-label="BR Tours in numbers">
      <div className="grid grid-cols-4 divide-x divide-border-subtle max-[760px]:grid-cols-2 max-[760px]:gap-y-5 max-[760px]:divide-x-0">
        {metrics.map(({ icon: Icon, value, label }) => (
          <div className="px-4 text-center max-[500px]:px-2" key={label}>
            <Icon className="mx-auto mb-2 text-secondary" aria-hidden="true" size={19} />
            <strong className="block font-display text-[clamp(1.2rem,2vw,1.55rem)] leading-none text-primary">{value}</strong>
            <span className="mt-1.5 block text-[0.7rem] font-bold leading-snug text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
