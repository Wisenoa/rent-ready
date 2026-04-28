import type { Metadata } from "next";
// ISR: guides are static reference content — revalidate weekly
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, BookOpen, Download } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Guides Propriétaire Bailleur — Modèles gratuits,IRL, Bail 2026 | RentReady",
    description:
      "Guides gratuits pour propriétaires : modèle de bail, quittance, dépôt de garantie, révision IRL, lettre de relance. Téléchargez et utilisez immédiatement — sans inscription.",
    url: "/guides",
    ogType: "website",
  });
}

const guides = [
  {
    slug: "modele-bail",
    title: "Modèle de bail gratuit",
    excerpt:
      "Téléchargez notre modèle de bail de location conforme à la loi du 6 juillet 1989. Bail vide, bail meublé, bail mobilité — tous les types de contrat.",
    icon: FileText,
    href: "/guides/modele-bail",
    category: "Bail",
  },
  {
    slug: "quittance-loyer",
    title: "Comment faire une quittance de loyer",
    excerpt:
      "Guide complet : quand et comment délivrer une quittance de loyer, mentions obligatoires, modèle gratuit à télécharger. Obligatoire sur demande du locataire.",
    icon: FileText,
    href: "/guides/quittance-loyer",
    category: "Quittance",
  },
  {
    slug: "depot-garantie",
    title: "Dépôt de garantie : règles 2026",
    excerpt:
      "Dépôt de garantie location : montant maximum (1 ou 2 mois), modalités de restitution, déductibilité des dégradations. Tout ce que le propriétaire doit savoir.",
    icon: BookOpen,
    href: "/guides/depot-garantie",
    category: "Garantie",
  },
  {
    slug: "irl-2026",
    title: "Révision de loyer IRL 2026",
    excerpt:
      "Indice de référence des loyers (IRL) 2026 : dernière valeur officielle INSEE, comment calculer la révision de loyer annuelle, délai et méthode正确e.",
    icon: BookOpen,
    href: "/guides/irl-2026",
    category: "IRL",
  },
  {
    slug: "relance-loyer",
    title: "Lettre de relance pour loyer impayé",
    excerpt:
      "Modèle de lettre de relance pour loyers impayés. Téléchargez le modèle gratuit, modifiez selon votre situation et envoyez en recommandé.",
    icon: FileText,
    href: "/guides/relance-loyer",
    category: "Impaye",
  },
];

function GuidesPageJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Guides", url: "https://www.rentready.fr/guides" },
    ]),
    buildItemListSchema({
      name: "Guides pratiques pour propriétaire bailleur",
      description:
        "Guides gratuits pour propriétaires bailleurs : modèle de bail, quittance de loyer, dépôt de garantie, révision IRL, lettre de relance.",
      url: "https://www.rentready.fr/guides",
      items: guides.map((guide) => ({
        name: guide.title,
        description: guide.excerpt,
        url: `https://www.rentready.fr${guide.href}`,
      })),
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function GuidesPage() {
  return (
    <>
      <GuidesPageJsonLd />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl text-balance">
            Guides pratiques — Propriétaire Bailleur
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Téléchargez nos modèles et guides gratuits pour gérer votre location
            en toute conformité. Bail, quittance, révision de loyer,
            recouvrement — tout est là.
          </p>
        </header>

        <section className="mb-12 grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <article
                key={guide.slug}
                className="group rounded-xl border border-stone-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {guide.category}
                  </span>
                </div>

                <h2 className="mb-2 text-lg font-semibold text-stone-900 group-hover:text-blue-700">
                  <Link href={guide.href}>{guide.title}</Link>
                </h2>

                <p className="mb-4 text-sm leading-relaxed text-stone-600">
                  {guide.excerpt}
                </p>

                <Link
                  href={guide.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {guide.slug === "modele-bail" ? (
                    <>
                      <Download className="size-4" />
                      Télécharger le guide
                    </>
                  ) : (
                    <>
                      Lire le guide
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Link>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Générez vos documents automatiquement
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            With RentReady, créez quittances, baux et courriers en quelques clics.
            Essai gratuit 14 jours — aucune carte bancaire requise.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l'essai gratuit
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </article>
    </>
  );
}
