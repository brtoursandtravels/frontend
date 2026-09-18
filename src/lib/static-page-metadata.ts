import "server-only";
import { getSite } from "./api";
import { staticMetadata } from "./metadata";

export async function staticPageMetadata(key: string, defaults: Parameters<typeof staticMetadata>[0]) {
  const site = await getSite().catch(() => null);
  return staticMetadata(defaults, site?.data.settings[`seo.pages.${key}`]);
}
