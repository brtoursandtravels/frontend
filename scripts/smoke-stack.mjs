import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const frontendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.resolve(
  process.env.API_PROJECT_DIR ?? path.join(frontendDir, "..", "tours_and_travels_api"),
);
const children = [];

function launch(entry, cwd, env = {}) {
  const child = spawn(process.execPath, [entry], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  children.push(child);
  return child;
}

async function waitFor(url, attempts = 40) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error("HTTP " + response.status + " from " + url);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw lastError ?? new Error("Timed out waiting for " + url);
}

try {
  launch(path.join(apiDir, "dist", "server.js"), apiDir);
  const ready = await (await waitFor("http://127.0.0.1:4000/ready")).json();
  if (ready.data?.database !== "reachable") {
    throw new Error("API readiness did not confirm the database.");
  }

  const site = await (
    await waitFor("http://127.0.0.1:4000/api/v1/site")
  ).json();
  const primaryLabels =
    site.data?.menus
      ?.find((menu) => menu.key === "primary")
      ?.items.map((item) => item.label) ?? [];
  const expectedLabels = [
    "Home",
    "About Us",
    "Tours / Packages",
    "Gallery",
    "Contact Us",
    "Blog",
  ];
  if (expectedLabels.some((label) => !primaryLabels.includes(label))) {
    throw new Error("API did not return the expected primary navigation.");
  }

  launch(path.join(frontendDir, ".next", "standalone", "server.js"), frontendDir, {
    PORT: "3000",
    HOSTNAME: "127.0.0.1",
    INTERNAL_API_BASE_URL: "http://127.0.0.1:4000/api/v1",
    NEXT_PUBLIC_API_BASE_URL: "/api/v1",
    NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  });
  const response = await waitFor("http://127.0.0.1:3000/packages");
  const html = await response.text();
  if (
    !html.includes("Complete Char Dham Yatra") ||
    !html.includes("Kashmir Valley Retreat")
  ) {
    throw new Error("SSR response did not contain the seeded package catalogue.");
  }
  console.log("Stack smoke passed: MariaDB -> Prisma -> Express -> Next.js SSR.");
} finally {
  for (const child of children.reverse()) {
    if (!child.killed) child.kill("SIGTERM");
  }
}
