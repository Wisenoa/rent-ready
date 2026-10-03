/**
 * A React component that renders itself recurses until the stack is exhausted.
 *
 * Two of these shipped:
 *
 *   `/outils/calculateur-caution`      DepositCalculatorClient → itself
 *   `/outils/calculateur-rendement`    YieldCalculatorClient   → itself
 *
 * The symptom in production was not an exception. It was a page that streamed
 * until it hit the heap limit: 8.7 MB of HTML and 714 `<h1>` elements for a
 * single URL. The tool looked "sort of working" in dev because the error only
 * appears after the recursion is deep enough to be visible, and because the
 * failure mode is size, not crash.
 *
 * Both are the same slip: a wrapper component declares the page chrome
 * (breadcrumb, heading, prose) and then renders the interactive part. The
 * author wrote the wrapper's own name where the inner component's name belonged.
 *
 * The check below is deliberately structural rather than clever: it locates the
 * body of a component by brace-matching from its opening brace, so a component
 * never "contains" a sibling that happens to be defined after it.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

/** Body of `function Name(...) { … }`, found by matching braces. */
function componentBody(source: string, name: string): string | null {
  const decl = new RegExp(
    `(?:export\\s+)?function\\s+${name}\\s*\\([^)]*\\)\\s*(?::[^{]+)?\\{`
  ).exec(source);
  if (!decl) return null;

  let depth = 0;
  for (let i = source.indexOf("{", decl.index); i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(decl.index, i + 1);
    }
  }
  return null;
}

const FILES = walk(SRC).filter((f) => !f.includes("__tests__"));

describe("no component renders itself", () => {
  it("finds no self-recursive component in src/", () => {
    const offenders: string[] = [];

    for (const file of FILES) {
      const source = readFileSync(file, "utf8");
      const names = [
        ...source.matchAll(/(?:export\s+)?function\s+([A-Z]\w*)\s*\(/g),
      ].map((m) => m[1]);

      for (const name of names) {
        const body = componentBody(source, name);
        if (!body) continue;

        // <Name /> or <Name>…</Name> directly inside its own body.
        const selfClosing = new RegExp(`<${name}\\s*/>`).test(body);
        const paired = new RegExp(`<${name}(\\s[^>]*)?>`).test(body);
        const selfPaired = paired && new RegExp(`</${name}>`).test(body);

        if (selfClosing || selfPaired) {
          const line = source
            .slice(0, source.indexOf(body))
            .split("\n").length;
          offenders.push(
            `${relative(process.cwd(), file)}:${line} — ${name} renders <${name} />`
          );
        }
      }
    }

    expect(
      offenders,
      `A component rendering itself will exhaust the stack:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("the known crash stays fixed", () => {
    // Named explicitly so a regression names the page a landlord would hit.
    // `/outils/calculateur-rendement` shipped with `YieldCalculatorClient`
    // rendering itself: the page streamed to ~8.7 MB of HTML and 714 `<h1>`
    // before the heap gave out. The wrapper renders the inner calculator.
    const yieldCalc = readFileSync(
      join(SRC, "app", "(marketing)", "outils", "calculateur-rendement",
        "calculator-client.tsx"),
      "utf8"
    );
    const yieldBody = componentBody(yieldCalc, "YieldCalculatorClient");
    expect(yieldBody, "no YieldCalculatorClient wrapper").toContain(
      "YieldCalculatorInner"
    );
    expect(yieldBody).not.toContain("<YieldCalculatorClient />");

    // The page `/outils/calculateur-caution` was deleted and 301s to
    // `/outils/calculateur-depot-garantie`, so this is the URL it must serve.
    const redirect = readFileSync(
      join(process.cwd(), "next.config.ts"),
      "utf8"
    );
    expect(redirect).toMatch(
      /source:\s*['"]\/outils\/calculateur-caution['"][\s\S]{0,120}destination:\s*['"]\/outils\/calculateur-depot-garantie['"]/
    );
  });
});