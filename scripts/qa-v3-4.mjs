#!/usr/bin/env node
/** Run QA against an explicitly selected disposable local database, without provider credentials. */
import { readFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";

const database = process.env.TEST_DATABASE_URL;
if (!database) throw new Error("TEST_DATABASE_URL is required; never infer a QA database from .env");
const url = new URL(database);
if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || !/^\/(lokna_v34|rentready_test_[a-z0-9_]+)$/.test(url.pathname)) {
  throw new Error("QA requires a loopback PostgreSQL URL and a disposable lokna_v34/rentready_test_* database");
}
const env = { ...process.env };
// Next loads .env.production during build. Blank every file-backed setting
// before it starts, then supply only the isolated local configuration.
for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
  if (!existsSync(file)) continue;
  for (const match of readFileSync(file, "utf8").matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)) env[match[1]] = "";
}
for (const key of Object.keys(env)) {
  if (/STRIPE|RESEND|POSTHOG|SENTRY|MINIO|UPSTASH|OPENAI|GOOGLE_CLIENT|SMTP|BANK|POWENS|BRIDGE/.test(key)) env[key] = "";
}
Object.assign(env, {
  DATABASE_URL: database, NEXT_PUBLIC_SITE_URL: "https://lokna.fr",
  BETTER_AUTH_SECRET: "local-qa-only-not-a-production-secret-v34",
  BETTER_AUTH_URL: "http://localhost:3044", NEXT_PUBLIC_APP_URL: "http://localhost:3044",
  NEXT_PUBLIC_AUTH_URL: "http://localhost:3044", NEXT_DIST_DIR: ".next-dev",
  PLAYWRIGHT_BASE_URL: "http://localhost:3044", NEXT_TELEMETRY_DISABLED: "1",
});
const [task = "test", ...args] = process.argv.slice(2);
const commands = {
  test: ["vitest", "run"], typecheck: ["tsc", "--noEmit"], lint: ["eslint"],
  e2e: ["playwright", "test"], migrate: ["prisma", "migrate", "deploy"],
  dev: ["next", "dev", "--hostname", "127.0.0.1", "--port", "3044"],
  start: ["next", "start", "--hostname", "127.0.0.1", "--port", "3044"],
};
const command = task === "build" ? ["run", "build"] : commands[task] ? ["exec", ...commands[task]] : null;
if (!command) throw new Error("Unknown QA task");
if (task === "build" || task === "start") delete env.NEXT_DIST_DIR;
const child = spawn("pnpm", [...command, ...args], { stdio: "inherit", env });
child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", error => { console.error(error.message); process.exit(1); });
