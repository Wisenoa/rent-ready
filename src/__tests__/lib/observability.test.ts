import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "src");

/**
 * Error reporting was configured and inert.
 *
 * `next.config.ts` passed `tunnelRoute: '/api/sentry-error'` to
 * `withSentryConfig`. That option does not exist in Sentry 10 — neither
 * `tunnelRoute` nor `tunnelUrl` is part of `SentryBuildOptions`, and `tsc`
 * rejects both, which is how the mistake stayed invisible to `pnpm lint` and to
 * `pnpm test` (the file is Next config, not type-checked against Sentry's type at
 * test time). The route it pointed at did not exist either, so it answered 404.
 *
 * The practical answer to "a user hit a 500, would we know?" was: no, and nothing
 * would have said so.
 *
 * The invariant here is narrower and deliberately so: the tunnel route must
 * exist, and it must never drop an event silently. Whether a DSN is configured is
 * an environment question this test cannot answer — `.env` is not in CI.
 */
describe("error reporting is not silently inert", () => {
  const TUNNEL = join(SRC, "app", "api", "sentry-error", "route.ts");

  it("ships the tunnel route the config refers to", () => {
    expect(
      existsSync(TUNNEL),
      "src/app/api/sentry-error/route.ts is missing — the config points at it"
    ).toBe(true);
  });

  it("does not configure a Sentry option that does not exist", () => {
    const raw = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    // Comments name the option on purpose — they explain why it is absent — so
    // only executable code is checked.
    const code = raw
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/\/\/[^\n]*/g, " ");

    // Sentry 10 removed the build-time tunnel option. `tsc` rejects it in the
    // config file itself, but nothing caught it while it was there: an
    // unrecognised key is ignored at runtime rather than refused.
    expect(
      code,
      "Sentry 10 has no tunnelUrl/tunnelRoute build option; remove it"
    ).not.toMatch(/tunnelUrl|tunnelRoute/);
  });

  it("never drops an event without leaving a trace", () => {
    const source = readFileSync(TUNNEL, "utf8");

    // The failure branch has to record something. An event forwarded to a
    // non-existent DSN, or an upstream that refuses, must be visible in logs.
    const logs = source.match(/console\.(error|warn)/g) ?? [];
    expect(
      logs.length,
      "the tunnel must log when it cannot forward — a silent drop is the defect"
    ).toBeGreaterThanOrEqual(3);
  });

  it("says which DSN variable it needs", () => {
    const source = readFileSync(TUNNEL, "utf8");
    expect(source, "the tunnel must read a DSN from the environment").toMatch(
      /process\.env\.(SENTRY_DSN|NEXT_PUBLIC_SENTRY_DSN)/
    );
  });
});

// Imported late so the constants above read top-down.
import { join as _join } from "path";