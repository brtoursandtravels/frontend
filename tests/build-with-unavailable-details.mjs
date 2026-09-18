import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { blogListResponseSchema, blogDetailResponseSchema, packageListResponseSchema, packageDetailResponseSchema } from "../src/lib/contracts.ts";

// Production regression: listings succeed, but every detail endpoint is unavailable
// during the build. No real API, database or production credentials are used.
const root = fileURLToPath(new URL("../", import.meta.url));
const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const distDir = ".next-build-check";
const tour = {
  id: "test-package", slug: "complete-char-dham-yatra", title: "Complete Char Dham test package",
  summary: "A test itinerary for the production build regression.", days: 12, nights: 11,
  startingCity: "Ahmedabad", destinations: [], categories: [], highlights: [],
  startingPrice: null, cover: null, isDemo: false,
};
const article = {
  id: "test-post", slug: "test-travel-guide", title: "Test travel guide", excerpt: "A test guide to planning a journey.",
  category: null, cover: null, publishedAt: "2026-09-18T00:00:00Z", readingMinutes: 2, author: null, isDemo: false,
};
const meta = { page: 1, pageSize: 48, total: 1 };
packageListResponseSchema.parse({ data: [tour], meta });
blogListResponseSchema.parse({ data: [article], meta });
let phase = "build";
const detailRequests = [];
const listingRequests = [];
const api = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  const send = (body, status = 200) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
  };
  const detail = /^\/api\/v1\/(packages|blog)\/([^/]+)$/.exec(url.pathname);
  if (detail && detail[2] !== "categories") {
    detailRequests.push({ path: url.pathname, phase });
    if (phase === "build") return send({ error: { code: "API_UNAVAILABLE", message: "Simulated detail outage", requestId: "build-test" } }, 503);
    if (detail[2] === "does-not-exist") return send({ error: { code: "PACKAGE_NOT_FOUND", message: "Missing package", requestId: "build-test" } }, 404);
    if (detail[1] === "packages") {
      return send(packageDetailResponseSchema.parse({ data: {
        ...tour, slug: detail[2], overview: "The API is back and this package was rendered on demand.",
        inclusions: [], exclusions: [], importantInformation: null, transportInformation: null,
        accommodationNotes: null, cancellationRules: null, brochure: null, media: [], itinerary: [], departures: [], relatedPackages: [],
        seo: { title: "Live package SEO title", description: "Live package SEO description" },
      } }));
    }
    return send(blogDetailResponseSchema.parse({ data: {
      ...article, contentHtml: "<p>The API is back and this article was rendered on demand.</p>",
      tags: [], relatedArticles: [], relatedPackages: [], seo: { title: "Live blog SEO title", description: "Live blog SEO description" },
    } }));
  }
  if (url.pathname === "/api/v1/site") return send({ data: { settings: {}, menus: [] } });
  if (url.pathname === "/api/v1/packages" || url.pathname === "/api/v1/blog") {
    listingRequests.push(url.pathname);
    return send({ data: url.pathname.endsWith("packages") ? [tour] : [article], meta: { ...meta, pageSize: Number(url.searchParams.get("pageSize") || 48) } });
  }
  if (url.pathname.startsWith("/api/v1/pages/")) return send({ error: { code: "PAGE_NOT_FOUND", message: "No custom content", requestId: "build-test" } }, 404);
  return send({ data: [], meta: { ...meta, total: 0 } });
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const apiOrigin = `http://127.0.0.1:${api.address().port}`;
const env = {
  ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", NEXT_DIST_DIR: distDir,
  INTERNAL_API_BASE_URL: `${apiOrigin}/api/v1`, NEXT_PUBLIC_SITE_URL: "https://website.example.test",
  NEXT_PUBLIC_API_BASE_URL: "/api/v1", API_PROXY_TARGET: apiOrigin,
};
// Mirror Vercel's build mode (without changing project environment files).
env.VERCEL = "1";
let web;
let build;
try {
  build = spawn(process.execPath, [nextBin, "build"], { cwd: root, env, stdio: "inherit", windowsHide: true });
  const [exitCode] = await once(build, "exit");
  assert.equal(exitCode, 0, "The production build must succeed while detail APIs are unavailable");
  assert.ok(listingRequests.includes("/api/v1/packages"), "Test must exercise a healthy package listing");
  assert.ok(listingRequests.includes("/api/v1/blog"), "Test must exercise a healthy blog listing");
  assert.deepEqual(detailRequests, [], "No package or blog detail API may be called during the build");

  const manifest = JSON.parse(await readFile(new URL(`../${distDir}/prerender-manifest.json`, import.meta.url), "utf8"));
  for (const path of ["/packages/[slug]", "/blog/[slug]"]) {
    assert.ok(manifest.dynamicRoutes[path], `${path} must support runtime generation`);
    assert.notEqual(manifest.dynamicRoutes[path].fallback, false, `${path} must accept newly added slugs`);
  }
  assert.equal(manifest.routes[`/packages/${tour.slug}`], undefined);
  assert.equal(manifest.routes[`/blog/${article.slug}`], undefined);
  console.log("PASS: build succeeds with detail APIs unavailable; all detail routes are generated on demand.");

  phase = "runtime";
  const portProbe = createServer();
  portProbe.listen(0, "127.0.0.1");
  await once(portProbe, "listening");
  const port = portProbe.address().port;
  await new Promise((resolve) => portProbe.close(resolve));
  web = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: root, env, stdio: "inherit", windowsHide: true });
  const origin = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;
  let ready = false;
  while (Date.now() < deadline) {
    ready = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(1000) }).then((result) => result.ok).catch(() => false);
    if (ready) break;
    await delay(100);
  }
  assert.ok(ready, "Production server must start");
  for (const [path, title, content] of [
    [`/packages/${tour.slug}`, "Live package SEO title", "this package was rendered on demand"],
    ["/packages/newly-added-package", "Live package SEO title", "this package was rendered on demand"],
    [`/blog/${article.slug}`, "Live blog SEO title", "this article was rendered on demand"],
  ]) {
    const response = await fetch(origin + path, { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(content), `Missing live content: ${path}`);
    assert.ok(html.includes(`<title>${title}</title>`), `Missing dynamic metadata: ${path}`);
  }
  const missing = await fetch(`${origin}/packages/does-not-exist`);
  const missingHtml = await missing.text();
  assert.ok(missing.status === 404 || missingHtml.includes('name="robots" content="noindex"'), "Missing packages must retain not-found handling");
  console.log("PASS: existing and newly added packages, blog metadata and missing-package handling work after build-time API downtime.");
} finally {
  for (const child of [build, web]) {
    if (child && child.exitCode === null && child.signalCode === null) {
      const exit = once(child, "exit");
      child.kill();
      await exit;
    }
  }
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
}
