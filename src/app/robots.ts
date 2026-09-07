import type { MetadataRoute } from "next";
import { serverEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: new URL("/sitemap.xml", serverEnv.NEXT_PUBLIC_SITE_URL).toString(),
    host: serverEnv.NEXT_PUBLIC_SITE_URL,
  };
}
