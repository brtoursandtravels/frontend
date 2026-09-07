import { Headphones, Plane, ShieldCheck, Star } from "lucide-react";

const metrics = [
  { icon: Star, value: "4.9/5", label: "Traveller rating" },
  { icon: Plane, value: "10,000+", label: "Happy travellers" },
  { icon: ShieldCheck, value: "Verified", label: "Stays and guides" },
  { icon: Headphones, value: "24/7", label: "Travel support" },
];

export function TrustMetricsBar() {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2 max-[1100px]:grid-cols-2 max-[620px]:gap-2" aria-label="BR Tours service highlights">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md max-[620px]:p-2.5" key={metric.label}>
            <Icon className="shrink-0 text-secondary-light" aria-hidden="true" size={21} />
            <p className="m-0 grid leading-tight"><strong className="text-sm text-white max-[620px]:text-xs">{metric.value}</strong><span className="text-[0.68rem] text-white/65 max-[620px]:text-[0.6rem]">{metric.label}</span></p>
          </div>
        );
      })}
    </div>
  );
}
