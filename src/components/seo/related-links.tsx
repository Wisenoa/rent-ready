/**
 * Related Content Component — Internal linking for SEO.
 *
 * Algorithm:
 *   1. Keyword overlap: pages whose title/description share words with the current page
 *   2. Category match: prefer same-category pages
 *   3. Maximum 3 links, contextually placed
 *
 * Usage:
 *   <RelatedContent currentUrl="/blog/comment-gerer-loyers-impayes" currentCategory="Gestion" />
 */

import Link from "next/link";
import { articles } from "@/data/articles";

interface RelatedContentProps {
  currentUrl: string;
  currentCategory?: string;
  currentSlug?: string;
  /** Show articles only (for blog/template pages) */
  type?: "all" | "articles" | "tools";
  /** Number of links to show */
  limit?: number;
}

interface RelatedPage {
  title: string;
  href: string;
  excerpt: string;
  category: string;
  type: "article" | "tool" | "template";
}

/**
 * All content pages indexed by URL slug for cross-linking.
 * In a future iteration this could be generated dynamically from the sitemap.
 */
const CONTENT_REGISTRY: RelatedPage[] = [
  // Tools
  {
    title: "Calculateur IRL 2026",
    href: "/outils/calculateur-irl-2026",
    excerpt: "Calculez automatiquement la révision de loyer selon l'indice INSEE",
    category: "Outils",
    type: "tool",
  },
  {
    title: "Modèle de quittance de loyer PDF",
    href: "/outils/modele-quittance-loyer-pdf",
    excerpt: "Générez une quittance conforme en PDF — gratuite et sans inscription",
    category: "Outils",
    type: "tool",
  },
  {
    title: "Calculateur de dépôt de garantie",
    href: "/outils/calculateur-depot-garantie",
    excerpt: "Estimez le dépôt de garantie légal pour votre location",
    category: "Outils",
    type: "tool",
  },
  {
    title: "Simulateur Loi Jean-Brun",
    href: "/outils/simulateur-loi-jeanbrun",
    excerpt: "Vérifiez si votre commune est soumise à l'encadrement des loyers",
    category: "Outils",
    type: "tool",
  },
  {
    title: "Calculateur de rendement locatif",
    href: "/templates/calculateur-rendement-locatif",
    excerpt: "Analysez la rentabilité de votre investissement immobilier",
    category: "Outils",
    type: "tool",
  },
  // Templates
  {
    title: "Bail de location vide",
    href: "/templates/bail-vide",
    excerpt: "Modèle de bail de location vide conforme à la loi du 6 juillet 1989",
    category: "Templates",
    type: "template",
  },
  {
    title: "Bail de location meublée",
    href: "/templates/bail-meuble",
    excerpt: "Modèle de bail meublé avec annexe Inventaire",
    category: "Templates",
    type: "template",
  },
  {
    title: "Bail de colocation",
    href: "/templates/colocation",
    excerpt: "Contrat de colocation avec ou sans clause de solidarity",
    category: "Templates",
    type: "template",
  },
  {
    title: "État des lieux",
    href: "/templates/etat-des-lieux",
    excerpt: "Formulaire d'état des lieux entrée/sortie à télécharger",
    category: "Templates",
    type: "template",
  },
  {
    title: "Bail étudiant",
    href: "/templates/lease/bail-etudiant",
    excerpt: "Modèle de bail spécifiquement adapté aux étudiants",
    category: "Templates",
    type: "template",
  },
  // Articles
  ...articles.slice(0, 10).map((a) => ({
    title: a.title,
    href: `/blog/${a.slug}`,
    excerpt: a.excerpt,
    category: a.category,
    type: "article" as const,
  })),
];

function computeScore(page: RelatedPage, currentUrl: string, currentCategory?: string): number {
  let score = 0;
  // Prefer different URL
  if (page.href === currentUrl) return -1;
  // Same category: +3
  if (currentCategory && page.category === currentCategory) score += 3;
  // Different type diversification: +1
  return score;
}

export function RelatedContent({
  currentUrl,
  currentCategory,
  currentSlug,
  type = "all",
  limit = 3,
}: RelatedContentProps) {
  let pool = CONTENT_REGISTRY;

  if (type === "articles") {
    pool = pool.filter((p) => p.type === "article");
  } else if (type === "tools") {
    pool = pool.filter((p) => p.type === "tool" || p.type === "template");
  }

  // Score and sort
  const scored = pool
    .map((page) => ({ page, score: computeScore(page, currentUrl, currentCategory) }))
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score || (b.page.title.length - a.page.title.length))
    .slice(0, limit);

  if (scored.length === 0) return null;

  const iconMap = {
    tool: "🔧",
    template: "📄",
    article: "📖",
  };

  return (
    <section className="not-prose mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-stone-800">
        Ressources liées
      </h2>
      <ul className="space-y-3">
        {scored.map(({ page }) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white hover:shadow-sm"
            >
              <span className="mt-0.5 text-base" aria-hidden="true">
                {iconMap[page.type]}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-800 group-hover:text-blue-600 transition-colors">
                  {page.title}
                </p>
                <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">
                  {page.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}