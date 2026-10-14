import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  FileSignature,
  FileText,
  Home,
  Landmark,
  LineChart,
  Mail,
  PiggyBank,
  Receipt,
  Ruler,
  Scale,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SchemaMarkup, breadcrumbSchema } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebSiteSchema, buildGraphSchema } from "@/lib/seo/structured-data";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Outils Immobiliers Gratuits 2026 — Calculateurs & Générateurs",
    description:
      "Accédez à nos calculateurs immobiliers gratuits 2026 : révision IRL, rendement, dépôt de garantie, charges locatives. Outils professionnels pour propriétaires bailleurs.",
    url: "/outils",
    ogType: "website",
  });
}

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type ToolGroup = { id: string; title: string; intro: string; tools: Tool[] };

/**
 * Grouped by what the landlord is doing, not by widget type. Each tool appears
 * once (the IRL calculator used to be listed twice). Descriptions say what the
 * tool does today — the lease and inventory pages are read online, no file is
 * produced.
 */
const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "loyer",
    title: "Loyer, charges et dépôt",
    intro: "Fixer et faire évoluer ce que paie le locataire.",
    tools: [
      { title: "Calculateur de révision IRL", description: "Le nouveau loyer avec l'indice de référence des loyers publié par l'INSEE, et l'historique des indices.", href: "/outils/calculateur-irl", icon: TrendingUp },
      { title: "Calculateur de loyer", description: "Estimez un loyer selon la surface et le prix au m², en zone tendue ou non.", href: "/outils/calculateur-loyer", icon: Home },
      { title: "Charges locatives", description: "Le coût de vos charges et la provision mensuelle à demander au locataire.", href: "/outils/calculateur-charges-locatives", icon: Calculator },
      { title: "Dépôt de garantie", description: "Le montant maximum selon le type de bail, vide ou meublé.", href: "/outils/calculateur-depot-garantie", icon: ShieldCheck },
    ],
  },
  {
    id: "documents",
    title: "Quittances et courriers",
    intro: "Les documents à remettre au locataire ou à lui envoyer.",
    tools: [
      { title: "Générateur de quittance", description: "Une quittance PDF conforme à la loi du 6 juillet 1989, sans inscription.", href: "/outils/generateur-quittance", icon: Receipt },
      { title: "Modèle de quittance PDF", description: "Remplissez les montants et téléchargez la quittance du mois.", href: "/outils/modele-quittance-loyer-pdf", icon: FileText },
      { title: "Lettre de relance", description: "Rappel amiable, relance formelle ou mise en demeure, prête à copier.", href: "/outils/lettre-relance-loyer", icon: Mail },
      { title: "Congé pour vente", description: "La lettre de congé pour vendre le logement, à envoyer en recommandé.", href: "/outils/generateur-conge-vente", icon: FileSignature },
      { title: "Calculateur de préavis", description: "La durée de préavis selon le bail, le motif et la zone.", href: "/outils/calculateur-preavis", icon: CalendarClock },
    ],
  },
  {
    id: "bail",
    title: "Bail et état des lieux",
    intro: "Préparer l'entrée et la sortie du locataire.",
    tools: [
      { title: "Checklist état des lieux", description: "Pièce par pièce, les points à vérifier à l'entrée et à la sortie.", href: "/outils/checklist-etat-lieux", icon: ClipboardCheck },
      { title: "Surface habitable", description: "La surface au sens de la loi Boutin, à reporter dans le bail.", href: "/outils/calculateur-surface-habitable", icon: Ruler },
      { title: "Modèles de bail", description: "Bail vide, meublé, mobilité, colocation : les clauses à consulter en ligne.", href: "/templates", icon: FileText },
      { title: "Modèle d'état des lieux", description: "La grille d'entrée et de sortie, pièce par pièce.", href: "/templates/etat-des-lieux", icon: ClipboardCheck },
    ],
  },
  {
    id: "investissement",
    title: "Investissement et fiscalité",
    intro: "Estimer avant d'acheter, de vendre ou de déclarer.",
    tools: [
      { title: "Rendement locatif", description: "Rendement brut et net de votre investissement.", href: "/outils/calculateur-rendement", icon: PiggyBank },
      { title: "Prêt immobilier", description: "La mensualité et le tableau d'amortissement de votre prêt.", href: "/outils/simulateur-pret-immobilier", icon: Landmark },
      { title: "Plus-value immobilière", description: "Une estimation de la plus-value et de l'impôt à la revente.", href: "/outils/calculateur-plus-value", icon: LineChart },
      { title: "Fiscalité LMNP", description: "Micro-BIC ou régime réel pour une location meublée.", href: "/outils/simulateur-fiscalite-lmnp", icon: Scale },
    ],
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
];

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

function OutilsJsonLd() {
  const data = buildGraphSchema(
    buildOrganizationSchema(),
    buildWebSiteSchema("Outils Immobiliers Gratuits — Lokna", "/outils"),
    breadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
    ])
  );
  return <SchemaMarkup data={data} breadcrumbRenderedByComponent />;
}

export default function OutilsPage() {
  return (
    <>
      <OutilsJsonLd />

      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-8 sm:pt-14">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mt-6 max-w-3xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-sage-700">
              Gratuits, sans créer de compte
            </p>
            <h1 className="mt-3 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink text-balance sm:text-[2.8rem]">
              Outils Immobiliers Gratuits pour Propriétaires
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-ink-muted">
              Calculateurs, générateurs et modèles pour gérer votre location en
              toute conformité. Aucun compte requis : tous les outils sont
              gratuits et accessibles immédiatement.
            </p>
            <nav aria-label="Catégories d'outils" className="mt-7 flex flex-wrap gap-2">
              {TOOL_GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[13.5px] text-ink transition-colors hover:border-sage-300 hover:bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  {group.title}
                </a>
              ))}
            </nav>
          </header>

          <div className="mt-14 space-y-16">
            {TOOL_GROUPS.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-20">
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <h2 id={`${group.id}-title`} className="text-[1.45rem] font-semibold tracking-[-0.02em] text-ink">
                    {group.title}
                  </h2>
                  <p className="text-[14px] text-ink-muted">{group.intro}</p>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li key={tool.href} className="flex">
                        <Link
                          href={tool.href}
                          className="group flex w-full flex-col rounded-xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(21,36,31,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-[0_18px_40px_-28px_rgba(6,24,18,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sage-50 text-forest">
                            <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                          </span>
                          <span className="mt-4 text-[16px] font-semibold text-ink">{tool.title}</span>
                          <span className="mt-1.5 flex-1 text-[14px] leading-6 text-ink-muted">{tool.description}</span>
                          <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium text-forest">
                            Ouvrir l&apos;outil
                            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <section className="mt-20 grid gap-6 rounded-2xl bg-forest px-6 py-10 text-cream sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-[1.6rem] font-semibold tracking-[-0.02em]">
                Ces calculs, chaque mois, pour tous vos logements
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-cream/80">
                Lokna tient le suivi des loyers attendus et reçus, calcule le
                reste dû et prépare quittances et reçus. La révision IRL se
                calcule depuis le bail.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/register"
                className="rounded-md bg-cream px-5 py-3 text-[15px] font-medium text-forest transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/gestion-locative"
                className="rounded-md border border-cream/30 px-5 py-3 text-[15px] font-medium text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                Découvrir Lokna
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}