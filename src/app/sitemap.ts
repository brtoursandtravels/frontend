import type { MetadataRoute } from "next";
import { getBlog, getPackages } from "@/lib/api";
import { serverEnv } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = serverEnv.NEXT_PUBLIC_SITE_URL;
  const fixed = [
    "",
    "/about-us",
    "/destinations",
    "/packages",
    "/gallery",
    "/contact-us",
    "/blog",
    "/privacy",
    "/terms",
    "/cancellation-policy",
  ];
  const [packages, posts] = await Promise.all([
    allPackageSlugs(),
    allBlogPosts(),
  ]);
  return [
    ...fixed.map((path) => ({
      url: new URL(path || "/", origin).toString(),
      changeFrequency: path ? ("weekly" as const) : ("daily" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...packages.map((slug) => ({
      url: new URL(`/packages/${slug}`, origin).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, origin).toString(),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

async function allPackageSlugs() {
  const first = await getPackages({ page: 1, pageSize: 48 }).catch(() => null);
  if (!first) return [];
  const pages = Math.ceil(first.meta.total / first.meta.pageSize);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
      getPackages({ page: index + 2, pageSize: 48 }).catch(() => null),
    ),
  );
  return [
    first,
    ...rest.filter((item): item is NonNullable<typeof item> => Boolean(item)),
  ].flatMap((page) => page.data.map((item) => item.slug));
}

async function allBlogPosts() {
  const first = await getBlog({ page: 1, pageSize: 48 }).catch(() => null);
  if (!first) return [];
  const pages = Math.ceil(first.meta.total / first.meta.pageSize);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
      getBlog({ page: index + 2, pageSize: 48 }).catch(() => null),
    ),
  );
  return [
    first,
    ...rest.filter((item): item is NonNullable<typeof item> => Boolean(item)),
  ].flatMap((page) =>
    page.data.map((item) => ({
      slug: item.slug,
      publishedAt: item.publishedAt,
    })),
  );
}
