import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command:
        "npm --prefix ../tours_and_travels_api run build && npm --prefix ../tours_and_travels_api run test:e2e:seed && npm --prefix ../tours_and_travels_api run test:e2e:seed:public && npm --prefix ../tours_and_travels_api run start:test",
      url: "http://127.0.0.1:4100/api/v1/health",
      timeout: 180_000,
      reuseExistingServer: false,
    },
    {
      command: "node node_modules/next/dist/bin/next dev --port 3100",
      url: "http://localhost:3100",
      timeout: 180_000,
      reuseExistingServer: false,
      env: {
        INTERNAL_API_BASE_URL: "http://127.0.0.1:4100/api/v1",
        NEXT_PUBLIC_API_BASE_URL: "/api/v1",
        API_PROXY_TARGET: "http://127.0.0.1:4100",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3100",
        NEXT_DIST_DIR: ".next-e2e",
      },
    },
  ],
});
