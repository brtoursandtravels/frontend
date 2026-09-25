import type { PackageCard as PackageCardData } from "@/lib/contracts";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PackageCard } from "@/components/packages/PackageCard";

export function TrendingPackages({ packages }: { packages: PackageCardData[] }) {
  if (!packages.length) return null;
  return (
    <section className="defer-render bg-bg-muted py-24 max-[820px]:py-[4.5rem]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Tour packages"
          title="Find a trip that suits you."
          description="Browse our trip plans. We will check the dates, hotels, transport and costs with you before you book."
          href="/packages"
          linkLabel="View all packages"
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
