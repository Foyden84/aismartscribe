import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig, devices } from "@playwright/test";

// Load .env.local into process.env so @clerk/testing's clerkSetup() can read
// the publishable + secret keys — Playwright doesn't load it natively.
function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(__dirname, ".env.local"), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!match) continue;
      const [, key, raw] = match;
      if (process.env[key]) continue;
      process.env[key] = raw.replace(/^["'](.*)["']$/, "$1");
    }
  } catch {
    // .env.local may be absent in CI.
  }
}
loadEnvLocal();

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: require.resolve("./tests/e2e/global-setup"),
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
