import "server-only";
import { getContentPage } from "./api";
import { staticPageMetadata } from "./static-page-metadata";

export async function contentPageMetadata(slug: string, title: string, description: string) {
  const result = await getContentPage(slug).catch(() => null);
  return staticPageMetadata(slug, {
    title: result?.data.title || title,
    description,
    metaTitle: result?.data.seoTitle,
    metaDescription: result?.data.seoDescription,
    path: `/${slug}`,
  });
}
