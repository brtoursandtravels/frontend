import { MountainSnow, Route } from "lucide-react";

const stops = [
  { name: "Haridwar", altitude: "1,030 ft", note: "Arrival and orientation", level: 8 },
  { name: "Barkot", altitude: "4,000 ft", note: "Yamunotri base", level: 32 },
  { name: "Uttarkashi", altitude: "3,800 ft", note: "Gangotri sector", level: 30 },
  { name: "Kedarnath", altitude: "11,755 ft", note: "Highest overnight sector", level: 92 },
  { name: "Badrinath", altitude: "10,279 ft", note: "Alaknanda valley", level: 80 },
  { name: "Rishikesh", altitude: "1,220 ft", note: "Circuit completion", level: 10 },
] as const;

export function YatraRouteElevation() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-border-subtle bg-white p-6 shadow-card" aria-labelledby="route-elevation-title">
      <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-secondary-hover"><Route aria-hidden="true" size={16} /> Route and elevation</p>
      <h2 className="mt-0 font-display text-[clamp(1.75rem,2.4vw,2.4rem)] text-text-heading" id="route-elevation-title">A gradual journey into the high Himalayas.</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-text-muted">The circuit moves through changing elevations. Your final road timings, rest stops and acclimatisation plan are confirmed around current conditions.</p>
      <div className="mt-8 grid grid-cols-6 gap-3 max-[760px]:grid-cols-2">
        {stops.map((stop, index) => (
          <article className="relative flex min-h-40 flex-col justify-end rounded-lg bg-[linear-gradient(180deg,var(--color-primary-soft),var(--color-bg-muted))] p-3 pt-12" key={stop.name}>
            <span className="absolute left-3 top-3 grid size-8 place-items-center rounded-full bg-primary text-xs font-extrabold text-white">{index + 1}</span>
            <span className="absolute bottom-0 left-0 w-1 rounded-full bg-secondary" style={{ height: `${stop.level}%` }} aria-hidden="true" />
            <MountainSnow aria-hidden="true" className="mb-2 text-secondary-hover" size={19} />
            <strong className="text-[0.82rem] text-text-heading">{stop.name}</strong>
            <span className="text-[0.7rem] font-bold text-secondary-hover">{stop.altitude}</span>
            <span className="mt-1 text-[0.65rem] leading-relaxed text-text-muted">{stop.note}</span>
          </article>
        ))}
      </div>
      <p className="mb-0 mt-4 text-[0.68rem] leading-relaxed text-text-muted">Elevations are approximate planning references, not medical guidance. Route access and journey times vary with weather, traffic and government controls.</p>
    </section>
  );
}
