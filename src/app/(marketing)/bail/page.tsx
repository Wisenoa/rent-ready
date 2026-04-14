import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
title: "Gestion des baux — Créer, suivre et renouveler vos contrats | RentReady",
description:
"Logiciel de gestion des baux : création de contrats, renouvellement, préavis, documents légaux. Simplifiez la gestion de vos locations. Essai gratuit.",
keywords: [
"gestion baux",
"contrat location",
"bail location",
"renouvellement bail",
"préavis locatif",
"modèle bail",
"document location",
],
openGraph: {
title: "Gestion des baux — RentReady",
description:
"Créez, suivez et renouvellez vos contrats de location facilement. Gestion légale et automatisée.",
type: "website",
url: "https://www.rentready.fr/bail",
siteName: "RentReady",
images: [
{
url: "https://www.rentready.fr/og-image.png",
width: 1200,
height: 630,
alt: "RentReady — Gestion des baux",
},
],
},
twitter: {
card: "summary_large_image",
title: "Gestion des baux — RentReady",
description:
"Créez, suivez et renouvellez vos contrats de location facilement. Gestion légale et automatisée.",
images: ["https://www.rentready.fr/og-image.png"],
},
alternates: {
canonical: "https://www.rentready.fr/bail",
},
};

const features = [
{
title: "Création de bail guidée",
description:
"Générez des contrats conformes à la loi. Assistant étape par étape pour ne rien oublier.",
icon: "📝",
},
{
title: "Documents joints intégrés",
description:
"Loyer, charges, caution, inventaire — tous les éléments du bail dans un seul document.",
icon: "📎",
},
{
title: "Suivi des échéances",
description:
"Fin de bail, préavis, renouvellement — soyez alerté automatiquement à chaque étape.",
icon: "📅",
},
{
title: "Portail locataire",
description:
"Votre locataire accède à son bail, signe électroniquement et consulte les documents.",
icon: "✍️",
},
{
title: "Archivage sécurisé",
description:
"Tous vos baux stockés en ligne, accessibles à tout moment, sauvegardés automatiquement.",
icon: "🔒",
},
{
title: "Export PDF légal",
description:
"Téléchargez vos baux en PDF conformes, prêts à être envoyés ou archivés.",
icon: "📄",
},
];

const steps = [
{
step: "1",
title: "Renseignez les informations",
description:
"Locataire, bien, loyer, charges, durée — remplissez les champs essentiels.",
},
{
step: "2",
title: "Ajoutez les annexes",
description:
"État des lieux, inventaire, règlement de copropriété — joignez tous les documents.",
},
{
step: "3",
title: "Générez le contrat",
description:
"Le bail conforme est créé automatiquement. Vérifiez et validez.",
},
{
step: "4",
title: "Partagez au locataire",
description:
"Le locataire consulte et signe électroniquement via son portail.",
},
];

const faqData = [
  {
    question: "Comment créer un bail de location conforme ?",
    answer:
      "Avec RentReady, vous utilisez un modèle de bail conforme à la loi du 6 juillet 1989. L'assistant vous guide étape par étape pour saisir les informations essentielles : identité des parties, description du bien, loyer, charges, dépôt de garantie, durée et clauses obligatoires.",
  },
  {
    question: "Le bail créé est-il juridiquement valide ?",
    answer:
      "Oui. Nos modèles de bail sont élaborés en collaboration avec des juristes spécialisés en droit locatif et mis à jour à chaque évolution législative (Loi Alur, Loi ÉLAN, etc.). Ils respectent les mentions obligatoires et les annexes requises.",
  },
  {
    question: "Puis-je personnaliser les clauses du bail ?",
    answer:
      "Absolument. Vous pouvez ajouter des clauses spécifiques : animaux acceptés, travaux à la charge du propriétaire, etc. Chaque clause est vérifiée pour sa conformité légale avant insertion.",
  },
  {
    question: "Comment renouveler un bail arrivant à échéance ?",
    answer:
      "RentReady vous alerte automatiquement 3 mois avant l'échéance de votre bail. Vous pouvez alors renouveler le contrat pour la même durée ou le convertir (par exemple, bail vide vers bail meublé), avec mise à jour automatique du loyer si l'IRL le permet.",
  },
];

function BailJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "RentReady — Gestion des baux",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/bail",
        description:
          "Créez, suivez et renouvelez vos contrats de location facilement. Modèles de baux conformes loi Alur et ÉLAN, assistant guidée, signature électronique.",
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
        },
        featureList: [
          "Création de bail guidée conforme loi 1989",
          "Suivi automatique des échéances",
          "Signature électronique locataire",
          "Export PDF légal",
          "Archivage sécurisé",
          "Alertes renouvellement",
        ],
      },
      {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@rentready.fr",
          availableLanguage: "French",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Gestion des baux RentReady",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function BailPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailJsonLd />

<article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
{/* Hero */}
<header className="mb-16 text-center">
<h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
Gérez vos baux
<br />
sans paperasse.
</h1>
<p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
Créez, suivez et renouvelez vos contrats de location en quelques clics.
Fini les bourses de documents éparpillés et les calculs manuels.
</p>
</header>

{/* Features grid */}
<section className="mb-20">
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
{features.map((feature) => (
<div
key={feature.title}
className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
>
<div className="mb-3 text-3xl">{feature.icon}</div>
<h3 className="mb-2 text-lg font-semibold text-stone-900">
{feature.title}
</h3>
<p className="text-sm text-stone-600">{feature.description}</p>
</div>
))}
</div>
</section>

{/* Process */}
<section className="mb-20">
<h2 className="mb-8 text-2xl font-bold text-stone-900">
Comment ça marche ?
</h2>
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
{steps.map((item) => (
<div key={item.step} className="rounded-xl border border-stone-200 bg-white p-6">
<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
{item.step}
</div>
<h3 className="mb-2 text-base font-semibold text-stone-900">
{item.title}
</h3>
<p className="text-sm text-stone-600">{item.description}</p>
</div>
))}
</div>
</section>

{/* Legal compliance */}
<section className="mb-20 rounded-2xl bg-blue-50 p-8 sm:p-10">
<h2 className="mb-4 text-xl font-bold text-stone-900">
Conformité légale garantie
</h2>
<p className="mb-6 text-stone-700">
Nos modèles de bail sont conformes à la loi du 6 juillet 1989 et aux
évolutions légales récentes (encadrement des loyers, état des lieux,
dépôt de garantie, etc.).
</p>
<ul className="grid gap-3 sm:grid-cols-2">
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>Loi Alur</span>
</li>
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>Loi ÉLAN</span>
</li>
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>Encadrement des loyers</span>
</li>
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>État des lieux obligatoire</span>
</li>
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>Diagnostic énergétique (DPE)</span>
</li>
<li className="flex items-center gap-2 text-sm text-stone-600">
<span className="text-emerald-600">✓</span>
<span>Clause résolutoire</span>
</li>
</ul>
</section>

{/* CTA */}
<section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
<h2 className="text-2xl font-bold sm:text-3xl">
Créez votre premier bail en 10 minutes
</h2>
<p className="mx-auto mt-3 max-w-xl text-stone-300">
Modèle prêt à remplir, assistant guidé, signature électronique incluse.
</p>
<Link
href="/register"
className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
>
Essai gratuit 14 jours
</Link>
</section>

{/* Internal links */}
<nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
<Link
href="/locations"
className="text-blue-600 hover:underline"
>
Gestion des locations →
</Link>
<Link
href="/quittances"
className="text-blue-600 hover:underline"
>
Génération de quittances →
</Link>
<Link
href="/pricing"
className="text-blue-600 hover:underline"
>
Tarifs →
</Link>
</nav>
</article>

<FinalCta />
</div>
);
}