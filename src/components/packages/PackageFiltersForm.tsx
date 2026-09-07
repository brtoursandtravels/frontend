import type { z } from "zod";
import type { categorySchema, destinationSchema } from "@/lib/contracts";
import type { PackageFilters } from "@/lib/api";

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
      <select
        id={`${idPrefix}-destination`}
        name="destination"
        defaultValue={filters.destination}
      >
        <option value="">All destinations</option>
        {destinations.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <label htmlFor={`${idPrefix}-category`}>Trip style</label>
      <select
        id={`${idPrefix}-category`}
        name="category"
        defaultValue={filters.category}
      >
        <option value="">All trip styles</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
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
      <select
        id={`${idPrefix}-sort`}
        name="sort"
        defaultValue={filters.sort ?? "featured"}
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="duration">Shortest duration</option>
      </select>
      <button className="mt-2 w-full rounded-full border-0 bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-hover" type="submit">
        Apply filters
      </button>
    </form>
  );
}
