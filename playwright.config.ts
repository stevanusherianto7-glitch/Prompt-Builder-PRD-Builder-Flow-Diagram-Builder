import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5175",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev --port 5175",
    url: "http://localhost:5175",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
