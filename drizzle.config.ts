import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "drizzle-kit";

// Load .env.local manually — drizzle-kit doesn't use Next.js's env loader.
function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  try {
    const content = readFileSync(resolve(__dirname, ".env.local"), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      // Strip surrounding quotes if present.
      const value = rawValue.replace(/^["'](.*)["']$/, "$1");
      process.env[key] = value;
    }
  } catch {
    // .env.local is optional in CI; drizzle-kit commands there pass vars inline.
  }
}

loadEnvLocal();

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL is not set — populate .env.local or set it in your shell",
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
});
