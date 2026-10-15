/**
 * The shared breadcrumb: visible separators on the light backgrounds every
 * page uses, an icon-only home link large enough to tap, and the
 * BreadcrumbList JSON-LD unchanged.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { Breadcrumb } from "@/components/seo/Breadcrumb";

const items = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur IRL", href: "/outils/calculateur-irl", isCurrentPage: true },
];
const html = renderToStaticMarkup(<Breadcrumb items={items} />);

describe("fil d'Ariane", () => {
  it("draws its separators in a colour that shows on cream, not in cream", () => {
    const separators = [...html.matchAll(/<svg[^>]*lucide-chevron-right[^>]*>/g)].map((m) => m[0]);
    expect(separators).toHaveLength(2);
    for (const svg of separators) {
      expect(svg).toContain("text-stone-500");
      expect(svg).not.toMatch(/text-cream|text-white/);
      expect(svg).toContain('aria-hidden="true"');
    }
  });

  it("gives the icon-only home link a 24 px target and a name", () => {
    expect(html).toMatch(/<a[^>]*class="[^"]*min-h-6 min-w-6[^"]*"[^>]*href="\/"|<a[^>]*href="\/"[^>]*class="[^"]*min-h-6 min-w-6/);
    expect(html).toContain('<span class="sr-only">Accueil</span>');
  });

  it("keeps the links and marks the current page", () => {
    expect(html).toContain('href="/outils"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Fil d&#x27;Ariane"');
  });

  it("emits the same BreadcrumbList JSON-LD", () => {
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((e: { name: string }) => e.name)).toEqual(["Accueil", "Outils", "Calculateur IRL"]);
    expect(ld.itemListElement[1].item).toBe("https://lokna.fr/outils");
    expect(ld.itemListElement[2].item).toBeUndefined();
  });
});
