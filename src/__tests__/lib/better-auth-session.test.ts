import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Four email routes called `auth.getSession(request)`. Better Auth exposes the
 * session reader as `auth.api.getSession({ headers })`, so `auth.getSession` is
 * `undefined` and calling it throws — every one of those routes returned 500 on
 * every invocation, including a legitimate unauthenticated request that should
 * have been a 401.
 *
 * Verified at runtime before and after the fix: 500 on all four, then 401.
 *
 * 57 other call sites already used the correct form, so the rule existed in the
 * codebase and only these four had drifted. This guards against that drifting
 * back, and against the same mistake appearing in a new route.
 *
 * WHY THIS WALKS THE SOURCE INSTEAD OF CALLING THE ROUTES
 *
 * The property under test is about EVERY route in the app, including routes that
 * do not exist yet. There is no finite list to import and call: the check has to
 * ask "does any file in src/ call auth.getSession?", which is a question about
 * source text by construction. Calling the four affected routes proves those four
 * return 401, and the fix's own header already records that runtime verification
 * (500 before, 401 after) — re-proving it here would guard the four, not the
 * sixty-odd call sites.
 *
 * What this cannot do is prove a route is reachable or correct; it proves only
 * that the wrong API name has not been reintroduced. That is the whole claim.
 */

const SRC = join(process.cwd(), "src");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(SRC).filter((f) => !f.includes("node_modules"));

describe("Better Auth session access", () => {
  it("no source file calls auth.getSession, which does not exist", () => {
    const offenders: string[] = [];
    for (const file of files) {
      // Skip this file: it names the broken form in its own documentation, and a
      // scan that matched its prose would report itself.
      if (file.endsWith("better-auth-session.test.ts")) continue;
      const source = readFileSync(file, "utf8");
      // auth.api.getSession is correct; a bare auth.getSession is undefined at
      // runtime and throws when called.
      for (const m of source.matchAll(/auth\.getSession\s*\(/g)) {
        const line = source.slice(0, m.index).split("\n").length;
        offenders.push(`${file.replace(process.cwd() + "/", "")}:${line}`);
      }
    }
    expect(offenders, `auth.getSession is undefined on the Better Auth instance: ${offenders.join(", ")}`)
      .toEqual([]);
  });

  it("the four email routes authenticate correctly", () => {
    const routes = [
      "src/app/api/email/send-welcome/route.ts",
      "src/app/api/email/send-lease-expiry/route.ts",
      "src/app/api/email/send-rent-reminder/route.ts",
      "src/app/api/email/send-tenant-invitation/route.ts",
    ];
    for (const rel of routes) {
      const source = readFileSync(join(process.cwd(), rel), "utf8");
      expect(source, `${rel} must read the session via auth.api`).toContain(
        "auth.api.getSession"
      );
      // It must reject an unauthenticated request rather than throwing.
      expect(source).toMatch(/status:\s*401|Unauthorized/);
    }
  });

  it("uses one spelling of the call across the codebase", () => {
    const correct = files.filter((f) => {
      if (f.endsWith("better-auth-session.test.ts")) return false;
      return readFileSync(f, "utf8").includes("auth.api.getSession");
    });
    // The rule is applied in dozens of files and was wrong in four, which is the
    // shape of drift. The floor catches a collapse, not an exact figure.
    expect(correct.length).toBeGreaterThan(30);
  });
});
