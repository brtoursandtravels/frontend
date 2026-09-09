import type { z } from "zod";
import type { categorySchema, destinationSchema } from "@/lib/contracts";
import type { PackageFilters } from "@/lib/api";
import { BrandedSelect } from "@/components/common/BrandedSelect";

type Destination = z.infer<typeof destinationSchema>;
type Category = z.infer<typeof categorySchema>;

export function PackageFiltersForm({
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
    <form className="grid gap-3 text-xs font-bold text-text-heading [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-border-subtle [&_input]:bg-bg-base [&_input]:px-3 [&_input]:py-2.5 [&_input]:font-normal [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-border-subtle [&_select]:bg-bg-base [&_select]:px-3 [&_select]:py-2.5 [&_select]:font-normal" action="/packages">
      <label htmlFor={`${idPrefix}-q`}>Search</label>
      <input
        id={`${idPrefix}-q`}
        name="q"
        type="search"
        defaultValue={filters.q}
        placeholder="Title, idea or city"
      />
      <label htmlFor={`${idPrefix}-destination`}>Destination</label>
      <BrandedSelect
        className="w-full"
        id={`${idPrefix}-destination`}
        name="destination"
        defaultValue={filters.destination}
        options={[
          { value: "", label: "All destinations" },
          ...destinations.map((item) => ({ value: item.slug, label: item.name })),
        ]}
      />
      <label htmlFor={`${idPrefix}-category`}>Trip style</label>
      <BrandedSelect
        className="w-full"
        id={`${idPrefix}-category`}
        name="category"
        defaultValue={filters.category}
        options={[
          { value: "", label: "All trip styles" },
          ...categories.map((item) => ({ value: item.slug, label: item.name })),
        ]}
      />
      <label htmlFor={`${idPrefix}-city`}>Starting city</label>
      <input
        id={`${idPrefix}-city`}
        name="startingCity"
        defaultValue={filters.startingCity}
        placeholder="For example, Ahmedabad"
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5" htmlFor={`${idPrefix}-min-days`}>
          Min days
          <input
            id={`${idPrefix}-min-days`}
            name="minDays"
            type="number"
            min="1"
            max="90"
            defaultValue={filters.minDays}
          />
        </label>
        <label className="grid gap-1.5" htmlFor={`${idPrefix}-max-days`}>
          Max days
          <input
            id={`${idPrefix}-max-days`}
            name="maxDays"
            type="number"
            min="1"
            max="90"
            defaultValue={filters.maxDays}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5" htmlFor={`${idPrefix}-min-price`}>
          Min price
          <input
            id={`${idPrefix}-min-price`}
            name="minPrice"
            type="number"
            min="0"
            defaultValue={filters.minPrice}
          />
        </label>
        <label className="grid gap-1.5" htmlFor={`${idPrefix}-max-price`}>
          Max price
          <input
            id={`${idPrefix}-max-price`}
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={filters.maxPrice}
          />
        </label>
      </div>
      <label htmlFor={`${idPrefix}-month`}>Travel month</label>
      <input
        id={`${idPrefix}-month`}
        name="month"
        type="month"
        defaultValue={filters.month}
      />
      <label htmlFor={`${idPrefix}-sort`}>Sort by</label>
      <BrandedSelect
        className="w-full"
        id={`${idPrefix}-sort`}
        name="sort"
        defaultValue={filters.sort ?? "featured"}
        options={[
          { value: "featured", label: "Featured" },
          { value: "newest", label: "Newest" },
          { value: "price-asc", label: "Price: low to high" },
          { value: "price-desc", label: "Price: high to low" },
          { value: "duration", label: "Shortest duration" },
        ]}
      />
      <button className="mt-2 w-full rounded-full border-0 bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-hover" type="submit">
        Apply filters
      </button>
    </form>
  );
}
