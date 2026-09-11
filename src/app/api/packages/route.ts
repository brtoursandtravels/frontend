import { type NextRequest, NextResponse } from "next/server";
import { ApiRequestError, getPackages, type PackageFilters } from "@/lib/api";

const sorts = new Set<NonNullable<PackageFilters["sort"]>>([
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "duration",
]);

function text(params: URLSearchParams, key: string) {
  const value = params.get(key)?.trim();
  return value ? value.slice(0, 120) : undefined;
}

function number(params: URLSearchParams, key: string) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requestedSort = text(params, "sort") as PackageFilters["sort"];
  const requestedPage = Math.floor(number(params, "page") ?? 1);
  const filters: PackageFilters = {
    q: text(params, "q"),
    destination: text(params, "destination"),
    category: text(params, "category"),
    startingCity: text(params, "startingCity"),
    minDays: number(params, "minDays"),
    maxDays: number(params, "maxDays"),
    minPrice: number(params, "minPrice"),
    maxPrice: number(params, "maxPrice"),
    month: text(params, "month"),
    sort: requestedSort && sorts.has(requestedSort) ? requestedSort : "featured",
    page: Math.max(1, Math.min(requestedPage, 10_000)),
    pageSize: 6,
  };

  try {
    const result = await getPackages(filters);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Packages are temporarily unavailable." },
      { status: error instanceof ApiRequestError ? error.status : 503 },
    );
  }
}
