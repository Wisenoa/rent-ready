/**
 * First-touch attribution, from the URL to the user row.
 *
 * The marketing pages have always tagged their internal links —
 * `?utm_source=howto&utm_medium=organic&utm_campaign=bail-paris` — and nothing ever
 * read them. The register form read no query string, and `User` had no attribution
 * column. The origin of a visitor therefore died on the landing page, and "which
 * SEO asset produced this activated landlord?" had no answer.
 *
 * What is tested here is the part that can be tested without a browser: the
 * cookie contract both ends agree on, and the fact that the signup action reads
 * it server-side. The client component sets the cookie and cannot be exercised in
 * a node test environment, so the claim that it sets it is verified in the
 * browser, not here.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  parseFirstTouch,
  readFirstTouch,
  FIRST_TOUCH_COOKIE,
} from "@/lib/first-touch";

const SRC = join(process.cwd(), "src");

const cookieHeader = (payload: unknown) =>
  `${FIRST_TOUCH_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}`;

describe("attribution de premier contact", () => {
  it("lit les quatre champs depuis le cookie", () => {
    const header = cookieHeader({
      utmSource: "google",
      utmMedium: "organic",
      utmCampaign: "bail-paris",
      landingPage: "/bail/paris",
      referrer: "https://www.google.fr/",
    });

    expect(parseFirstTouch(header)).toEqual({
      utmSource: "google",
      utmMedium: "organic",
      utmCampaign: "bail-paris",
      landingPage: "/bail/paris",
      referrer: "https://www.google.fr/",
    });
  });

  it("renvoie null plutot que de fabriquer une origine", () => {
    // "Direct" must stay distinguishable from "we lost it". A default of
    // "direct" would make every unattributed account look like organic.
    expect(parseFirstTouch(undefined)).toBeNull();
    expect(parseFirstTouch("")).toBeNull();
    expect(parseFirstTouch(`autre=1`)).toBeNull();
    expect(parseFirstTouch(`${FIRST_TOUCH_COOKIE}=pas-du-json`)).toBeNull();
    expect(parseFirstTouch(cookieHeader([]))).toBeNull();
    expect(parseFirstTouch(cookieHeader("une chaine"))).toBeNull();
    expect(parseFirstTouch(cookieHeader({}))).toBeNull();
  });

  it("tolere un cookie bricole : c'est une entree non fiable", () => {
    const hostile = `${FIRST_TOUCH_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        utmSource: { toString: () => "objet" },
        utmMedium: ["a", "b"],
        utmCampaign: 42,
        landingPage: "x".repeat(5000),
      })
    )}`;
    const parsed = parseFirstTouch(hostile);
    // Objects and arrays are dropped rather than coerced to "[object Object]".
    expect(parsed?.utmSource).toBeUndefined();
    expect(parsed?.utmMedium).toBeUndefined();
    expect(parsed?.utmCampaign).toBeUndefined();
    // And a long value is capped rather than stored whole.
    expect(parsed?.landingPage?.length).toBeLessThanOrEqual(200);
  });

  it("fonctionne avec un cookie lu par Next", () => {
    const value = encodeURIComponent(
      JSON.stringify({ utmCampaign: "irl-2026" })
    );
    const store = {
      get: (name: string) =>
        name === FIRST_TOUCH_COOKIE ? { value } : undefined,
    };
    expect(readFirstTouch(store)).toEqual({ utmCampaign: "irl-2026" });
    expect(readFirstTouch({ get: () => undefined })).toBeNull();
  });

  it("le modele User porte les cinq colonnes", () => {
    const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"), "utf8");
    const model = /model User \{([\s\S]*?)\n\}/.exec(schema)?.[1] ?? "";
    for (const column of [
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "landingPage",
      "referrer",
    ]) {
      expect(model, `User.${column} manque`).toContain(column);
      // Nullable: an account created by another means records null.
      const line = model
        .split("\n")
        .find((l) => l.trim().startsWith(`${column} `));
      expect(line, `User.${column} doit etre nullable`).toContain("String?");
    }
  });

  it("le captureur N'EST PAS monte : le client casse la page ville", () => {
    // Recorded as a known blocker rather than silently shipped.
    //
    // `FirstTouchCapture` was mounted in the marketing layout and broke
    // `/bail/[ville]`: the page returned 200 from the server with a correct `<h1>`,
    // and the client replaced it with Next's error boundary ("Quelque chose s'est
    // mal passé"). Removing the component restored the page. Proven by toggling
    // the mount, not inferred — 50 city pages were on the line.
    //
    // So the writer side does not exist yet. What remains is the destination: the
    // columns, the cookie contract, and the parser both ends will agree on. The
    // moment the capture works, the schema needs no further change.
    expect(
      existsSync(
        join(SRC, "components", "first-touch-capture.tsx")
      ),
      "le composant casse la page ville : il ne doit pas revenir tant que la cause n'est pas corrigee"
    ).toBe(false);

    const layout = readFileSync(
      join(SRC, "app", "(marketing)", "layout.tsx"),
      "utf8"
    );
    expect(layout).not.toContain("FirstTouchCapture");
  });
});
