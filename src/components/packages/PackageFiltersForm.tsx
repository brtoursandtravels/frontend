import type { z } from "zod";
import type { categorySchema, destinationSchema } from "@/lib/contracts";
import type { PackageFilters } from "@/lib/api";
import { BrandedSelect } from "@/components/common/BrandedSelect";
import styles from "./PackageFilters.module.css";

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
    <form className={`${styles.form} text-text-heading`} action="/packages">
      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${idPrefix}-q`}>Search</label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Title, idea or city"
        />
      </div>
      <div className={styles.field}>
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
      </div>
      <div className={styles.field}>
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
      </div>
      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${idPrefix}-city`}>Starting city</label>
        <input
          id={`${idPrefix}-city`}
          name="startingCity"
          defaultValue={filters.startingCity}
          placeholder="For example, Ahmedabad"
        />
      </div>
      <div className={`${styles.pair} ${styles.wide}`}>
        <label className={styles.field} htmlFor={`${idPrefix}-min-days`}>
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
        <label className={styles.field} htmlFor={`${idPrefix}-max-days`}>
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
      <div className={`${styles.pair} ${styles.wide}`}>
        <label className={styles.field} htmlFor={`${idPrefix}-min-price`}>
          Min price
          <input
            id={`${idPrefix}-min-price`}
            name="minPrice"
            type="number"
            min="0"
            defaultValue={filters.minPrice}
          />
        </label>
        <label className={styles.field} htmlFor={`${idPrefix}-max-price`}>
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
      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-month`}>Travel month</label>
        <input
          id={`${idPrefix}-month`}
          name="month"
          type="month"
          defaultValue={filters.month}
        />
      </div>
      <div className={`${styles.field} ${styles.sort}`}>
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
      </div>
      <button className={`${styles.wide} mt-2 w-full rounded-full border-0 bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-hover`} type="submit">
        Apply filters
      </button>
    </form>
  );
}
