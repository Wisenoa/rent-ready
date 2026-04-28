import type { Metadata } from "next";
// ISR: template library is static reference content — revalidate weekly
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, Check } from "lucide-react";
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
      "Modèles Gratuits de Location 2026 | Bail, Quittance, Courrier | RentReady",
    description:
      "Téléchargez gratuitement nos modèles de bail, quittances de loyer, lettres de relance et plus. Documents conformes loi 1989, personnalisables et gratuits.",
    url: "/templates",
    ogType: "website",
  });
}

const templateCategories = [
  {
    name: "Baux de location",
    description: "Contrats conformes à la loi du 6 juillet 1989 pour tous les types de location.",
    templates: [
      { slug: "bail-vide", title: "Bail vide", desc: "Contrat de location vide 3 ans, conforme loi 1989." },
      { slug: "bail-meuble", title: "Bail meublé", desc: "Contrat meublé 1 an, inventaire inclus." },
      { slug: "bail-mobilite", title: "Bail mobilité", desc: "Location meublée 1-10 mois, sans dépôt de garantie." },
      { slug: "bail-colocation", title: "Bail colocation", desc: "Contrat pour plusieurs locataires, clause de solidité." },
      { slug: "bail-commercial", title: "Bail commercial", desc: "Location de locaux commerciaux, bail 3/6/9 ans." },
    ],
  },
  {
    name: "Documents de location",
    description: "Quittances, états des lieux et courriers pour gérer votre location.",
    templates: [
      { slug: "etat-des-lieux", title: "État des lieux", desc: "Checklist Entrée/Sortie, avec grille de dégradations." },
      { slug: "recu-loyer", title: "Quittance de loyer", desc: "Modèle gratuit avec mentions obligatoires." },
      { slug: "relance-loyer-impaye", title: "Lettre de relance", desc: "Modèle de relance pour loyer impayé." },
      { slug: "augmentation-de-loyer", title: "Révision de loyer", desc: "Lettre de notification d'augmentation IRL." },
    ],
  },
  {
    name: "Congés et préavis",
    description: "Congés donné par le propriétaire ou le locataire, avec préavis.",
    templates: [
      { slug: "conge-proprietaire", title: "Congé propriétaire", desc: "Donner congé à son locataire : motifs et délais." },
      { slug: "conge-locataire", title: "Congé locataire", desc: "Résilier son bail : préavis et modèle de lettre." },
    ],
  },
  {
    name: "Calculateurs",
    description: "Outils gratuits pour calculer loyer, rentabilité et charges.",
    templates: [
      { slug: "calculateur-rendement-locatif", title: "Rendement locatif", desc: "Calculez votre rentabilité brute et nette." },
    ],
  },
];

function TemplatesPageJsonLd() {
  const allItems = templateCategories.flatMap((cat) =>
    cat.templates.map((t) => ({
      name: t.title,
      description: t.desc,
      url: `https://www.rentready.fr/modeles/${t.slug}`,
    }))
  );
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Modèles", url: "https://www.rentready.fr/modeles" },
    ]),
    buildItemListSchema({
      name: "Modèles gratuits de location",
      description:
        "Modèles de bail, quittances, lettres de relance et documents pour propriétaires — tous gratuits et conformes au droit français.",
      url: "https://www.rentready.fr/templates",
      items: allItems,
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function TemplatesPage() {
  return (
    <>
      <TemplatesPageJsonLd />
      <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl text-balance">
            Modèles gratuits de location
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
            Téléchargez nos modèles gratuits pour la gestion locative : bail de
            location, quittance de loyer, lettre de relance et plus. Documents
            conformes au droit français, personnalisables en ligne.
          </p>
        </header>

        {templateCategories.map((category) => (
          <section key={category.name} className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="size-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-stone-900">
                {category.name}
              </h2>
            </div>
            <p className="mb-6 text-sm text-stone-500">{category.description}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => (
                <Link
                  key={template.slug}
                  href={`/templates/${template.slug}`}
                  className="group rounded-xl border border-stone-200/60 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="size-4" />
                    </div>
                    <ArrowRight className="size-4 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                  </div>
                  <h3 className="mb-1 font-semibold text-stone-900 group-hover:text-blue-700">
                    {template.title}
                  </h3>
                  <p className="text-sm text-stone-500">{template.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="mt-16 rounded-2xl border border-stone-200/60 bg-gradient-to-br from-stone-50 to-stone-100/50 p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Check className="size-7" />
          </div>
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Besoin de plus ? Utilisez RentReady
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            Créez vos documents en quelques clics, sans manipulation de fichiers.
            Quittances automatiques, baux générés, signature électronique — tout
            dans un seul outil.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Essai gratuit 14 jours
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              Voir les tarifs
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
