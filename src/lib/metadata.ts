import type { Metadata } from "next";

export function entryMetadata({
  title, description, metaTitle, metaDescription, path, image,
}: {
  title: string;
  description: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  const customTitle = metaTitle?.trim();
  const resolvedTitle = customTitle || title;
  const resolvedDescription = metaDescription?.trim() || description;
  return {
    // An explicitly entered Meta Title must not acquire another brand suffix.
    title: customTitle || path === "/" ? { absolute: resolvedTitle } : title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website", title: resolvedTitle, description: resolvedDescription,
      url: path, ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: resolvedTitle, description: resolvedDescription,
      ...(image ? { images: [image.url] } : {}),
    },
  };
}

export function staticMetadata(defaults: Parameters<typeof entryMetadata>[0], value: unknown): Metadata {
  const saved = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  return entryMetadata({
    ...defaults,
    metaTitle: typeof saved.metaTitle === "string" && saved.metaTitle.trim() ? saved.metaTitle : defaults.metaTitle,
    metaDescription: typeof saved.metaDescription === "string" && saved.metaDescription.trim() ? saved.metaDescription : defaults.metaDescription,
  });
}
