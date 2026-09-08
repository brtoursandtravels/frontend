import type { PackageCard as PackageCardData } from "@/lib/contracts";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PackageCard } from "@/components/packages/PackageCard";

export function TrendingPackages({ packages }: { packages: PackageCardData[] }) {
  if (!packages.length) return null;
  return (
    <section className="defer-render bg-bg-muted py-24 max-[820px]:py-[4.5rem]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Curated for this season"
          title="Journeys travellers are considering now."
          description="Every itinerary is a starting point. Dates, pace and services are confirmed with you before booking."
          href="/packages"
          linkLabel="Explore all journeys"
        />
        <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
          {packages.slice(0, 6).map((item, index) => (
            <PackageCard featured={index === 0} item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
