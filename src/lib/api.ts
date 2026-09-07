import "server-only";
import type { ZodType } from "zod";
import {
  apiErrorSchema,
  blogCategoriesResponseSchema,
  blogDetailResponseSchema,
  blogListResponseSchema,
  categoriesResponseSchema,
  contentPageResponseSchema,
  destinationsResponseSchema,
  faqResponseSchema,
  galleryAlbumResponseSchema,
  galleryListResponseSchema,
  homeResponseSchema,
  packageDetailResponseSchema,
  packageListResponseSchema,
  siteResponseSchema,
  testimonialResponseSchema,
} from "./contracts";
import { serverEnv } from "./env";

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function apiFetch(path: string) {
  try {
    return await fetch(serverEnv.INTERNAL_API_BASE_URL + path, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
  } catch {
    throw new ApiRequestError(
      503,
      "API_UNAVAILABLE",
      "Live website information is temporarily unavailable. Please try again.",
    );
  }
}

async function assertResponse(response: Response) {
  if (response.ok) return response;
  const payload: unknown = await response.json().catch(() => null);
  const parsed = apiErrorSchema.safeParse(payload);
  throw new ApiRequestError(
    response.status,
    parsed.success ? parsed.data.error.code : "API_ERROR",
    parsed.success
      ? parsed.data.error.message
      : "The request could not be completed.",
    parsed.success ? parsed.data.error.requestId : undefined,
  );
}

async function parsed<T>(path: string, schema: ZodType<T>): Promise<T> {
  const response = await assertResponse(await apiFetch(path));
  return schema.parse(await response.json());
}

function queryString(values: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export type PackageFilters = {
  q?: string;
  destination?: string;
  category?: string;
  startingCity?: string;
  minDays?: number;
  maxDays?: number;
  minPrice?: number;
  maxPrice?: number;
  month?: string;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "duration";
  page?: number;
  pageSize?: number;
};

export function getPackages(options: PackageFilters = {}) {
  return parsed(`/packages${queryString(options)}`, packageListResponseSchema);
}

export function getPackage(slug: string) {
  return parsed(
    `/packages/${encodeURIComponent(slug)}`,
    packageDetailResponseSchema,
  );
}

export async function getPackageWithRedirect(slug: string) {
  const response = await assertResponse(
    await apiFetch(`/packages/${encodeURIComponent(slug)}`),
  );
  const payload = packageDetailResponseSchema.parse(await response.json());
  const finalSlug = decodeURIComponent(
    new URL(response.url).pathname.split("/").at(-1) ?? slug,
  );
  return { ...payload, redirectSlug: finalSlug !== slug ? finalSlug : null };
}

export function getSite() {
  return parsed("/site", siteResponseSchema);
}

export function getHome() {
  return parsed("/home", homeResponseSchema);
}

export function getContentPage(slug: string) {
  return parsed(
    `/pages/${encodeURIComponent(slug)}`,
    contentPageResponseSchema,
  );
}

export function getDestinations() {
  return parsed("/destinations", destinationsResponseSchema);
}

export function getCategories() {
  return parsed("/categories", categoriesResponseSchema);
}

export function getGalleryAlbums(
  options: {
    destination?: string;
    package?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  return parsed(
    `/gallery/albums${queryString(options)}`,
    galleryListResponseSchema,
  );
}

export function getGalleryAlbum(slug: string) {
  return parsed(
    `/gallery/albums/${encodeURIComponent(slug)}`,
    galleryAlbumResponseSchema,
  );
}

export function getBlog(
  options: {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  return parsed(`/blog${queryString(options)}`, blogListResponseSchema);
}

export function getBlogPost(slug: string) {
  return parsed(`/blog/${encodeURIComponent(slug)}`, blogDetailResponseSchema);
}

export function getBlogCategories() {
  return parsed("/blog/categories", blogCategoriesResponseSchema);
}

export function getFaqs(packageSlug?: string) {
  return parsed(
    `/faqs${queryString({ package: packageSlug })}`,
    faqResponseSchema,
  );
}

export function getTestimonials() {
  return parsed("/testimonials", testimonialResponseSchema);
}
