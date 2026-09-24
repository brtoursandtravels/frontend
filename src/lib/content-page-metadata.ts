import "server-only";
import { staticContentPages } from "./static-content-pages";
import { staticPageMetadata } from "./static-page-metadata";

export async function contentPageMetadata(slug: string, title: string, description: string) {
  const page = Object.values(staticContentPages).find(page => page.slug === slug);
  return staticPageMetadata(slug, {
    title: page?.title || title,
    description,
    metaTitle: page?.seoTitle,
    metaDescription: page?.seoDescription,
    path: `/${slug}`,
  });
}
