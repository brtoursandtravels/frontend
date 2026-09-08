import { CarFront, Clock3, MountainSnow, Utensils } from "lucide-react";

export function YatraEssentials({ days, nights }: { days: number; nights: number }) {
  const items = [
    { icon: Clock3, value: `${days}D / ${nights}N`, label: "Considered pilgrimage pace" },
    { icon: MountainSnow, value: "Four dhams", label: "Yamunotri to Badrinath" },
    { icon: CarFront, value: "Private road travel", label: "Mountain-route planning" },
    { icon: Utensils, value: "Meal preferences", label: "Discuss Satvik requirements" },
  ];
  return (
    <section className="mt-5 grid grid-cols-4 overflow-hidden rounded-xl border border-border-subtle bg-white shadow-card max-[820px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="Yatra essentials">
      {items.map(({ icon: Icon, label, value }) => (
        <div className="grid grid-cols-[2.25rem_1fr] gap-3 border-r border-border-subtle p-4 last:border-0 max-[820px]:border-b" key={value}>
          <Icon aria-hidden="true" className="text-secondary-hover" size={22} />
          <div><strong className="block text-[0.9rem] text-text-heading">{value}</strong><span className="mt-1 block text-[0.72rem] text-text-muted">{label}</span></div>
        </div>
      ))}
    </section>
  );
}
