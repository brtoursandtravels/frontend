import type { z } from "zod";
import type { categorySchema, destinationSchema } from "@/lib/contracts";
import type { PackageFilters } from "@/lib/api";
import { PackageFiltersForm } from "@/components/packages/PackageFiltersForm";
import styles from "./PackageFilters.module.css";

type Destination = z.infer<typeof destinationSchema>;
type Category = z.infer<typeof categorySchema>;

export function PackageFilterSidebar({
  filters,
  destinations,
  categories,
  idPrefix,
}: {
  filters: PackageFilters;
  destinations: Destination[];
  categories: Category[];
  idPrefix: string;
}) {
  return (
    <div className={`${styles.panel} rounded-xl border border-border-subtle bg-white shadow-card`}>
      <div className={`${styles.heading} border-b border-border-subtle`}>
        <p className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-secondary-hover">Shape the search</p>
        <h2 className="m-0 font-display text-3xl text-text-heading">Find your journey</h2>
        <p className={`${styles.description} mt-2 text-sm leading-relaxed text-text-muted`}>Adjust the details that matter most. Results update from the live catalogue.</p>
      </div>
      <PackageFiltersForm
        filters={filters}
        destinations={destinations}
        categories={categories}
        idPrefix={idPrefix}
      />
    </div>
  );
}
