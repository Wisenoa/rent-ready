import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — RentReady",
  description:
    "Conditions générales d'utilisation de RentReady, plateforme de gestion locative en ligne.",
  alternates: {
    canonical: "https://www.rentready.fr/cgu",
  },
  openGraph: {
    title: "Conditions Générales d'Utilisation — RentReady",
    description:
      "Conditions générales d'utilisation de RentReady, plateforme de gestion locative en ligne.",
    url: "https://www.rentready.fr/cgu",
    type: "website",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "CGU RentReady",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conditions Générales d'Utilisation — RentReady",
    description:
      "Conditions générales d'utilisation de RentReady, plateforme de gestion locative en ligne.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
};

function CguJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "RentReady — Conditions Générales d'Utilisation",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/cgu",
        description:
          "Conditions générales d'utilisation de RentReady, plateforme SaaS de gestion locative pour propriétaires bailleurs en France.",
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
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.rentready.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Conditions Générales d'Utilisation",
            item: "https://www.rentready.fr/cgu",
          },
        ],
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

export default function CguPage() {
  return (
    <>
      <CguJsonLd />
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="mt-4 text-sm text-stone-400">
        Dernière mise à jour : mars 2026
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-stone-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:mb-3">
        <section>
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
            l&apos;accès et l&apos;utilisation de la plateforme RentReady, éditée par
            RentReady SAS. En créant un compte, l&apos;utilisateur accepte
            l&apos;intégralité des présentes CGU.
          </p>
        </section>

        <section>
          <h2>2. Description du service</h2>
          <p>
            RentReady est un logiciel en ligne (SaaS) de gestion locative
            destiné aux propriétaires bailleurs indépendants gérant de 1 à 10
            biens immobiliers. Le service propose :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>La génération automatique de quittances de loyer et de reçus de paiement partiel conformes à la loi n° 89-462 du 6 juillet 1989</li>
            <li>Le calcul automatique de la révision annuelle des loyers (IRL) basé sur les données de l&apos;INSEE</li>
            <li>La détection automatique des virements entrants via Open Banking (DSP2)</li>
            <li>Un portail locataire pour le téléchargement de quittances et la déclaration d&apos;incidents</li>
            <li>L&apos;extraction automatique des factures artisans par intelligence artificielle (OCR)</li>
            <li>La préparation au format Factur-X et au e-reporting B2C (réforme 2027)</li>
          </ul>
        </section>

        <section>
          <h2>3. Inscription et compte utilisateur</h2>
          <p>
            L&apos;inscription est ouverte à toute personne physique majeure ou
            personne morale (SCI, SARL) résidant en France. L&apos;utilisateur
            s&apos;engage à fournir des informations exactes et à maintenir la
            confidentialité de ses identifiants. Tout accès au compte avec les
            identifiants de l&apos;utilisateur est réputé effectué par celui-ci.
          </p>
        </section>

        <section>
          <h2>4. Abonnement et tarification</h2>
          <p>
            Le service est accessible moyennant un abonnement mensuel de
            15 € TTC ou annuel de 150 € TTC (soit 2 mois offerts). Un essai
            gratuit de 14 jours est proposé sans engagement ni carte bancaire.
          </p>
          <p className="mt-2">
            Le paiement est géré par Stripe. L&apos;abonnement se renouvelle
            automatiquement sauf résiliation par l&apos;utilisateur depuis son
            espace personnel avant la date d&apos;échéance. La résiliation prend
            effet à la fin de la période en cours.
          </p>
        </section>

        <section>
          <h2>5. Obligations de l&apos;utilisateur</h2>
          <p>L&apos;utilisateur s&apos;engage à :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Utiliser le service conformément à sa destination et à la législation en vigueur</li>
            <li>Ne pas transmettre de données inexactes ou frauduleuses</li>
            <li>Vérifier les documents générés automatiquement avant leur envoi aux locataires</li>
            <li>Respecter les obligations légales du propriétaire bailleur (assurance, déclarations fiscales, diagnostics obligatoires)</li>
          </ul>
        </section>

        <section>
          <h2>6. Responsabilité</h2>
          <p>
            RentReady SAS met tout en œuvre pour assurer la fiabilité du
            service et la conformité des documents générés avec la législation
            française en vigueur. Toutefois, le service est fourni « en
            l&apos;état » et RentReady SAS ne saurait être tenue responsable :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Des erreurs résultant d&apos;informations inexactes saisies par l&apos;utilisateur</li>
            <li>Des interruptions temporaires du service liées à la maintenance ou à des circonstances extérieures</li>
            <li>Des dysfonctionnements des services tiers (Open Banking, Stripe, hébergeur)</li>
            <li>Des conséquences fiscales ou juridiques découlant d&apos;une mauvaise utilisation du service</li>
          </ul>
          <p className="mt-2">
            L&apos;utilisateur reste seul responsable de ses obligations
            déclaratives auprès de l&apos;administration fiscale.
          </p>
        </section>

        <section>
          <h2>7. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des éléments du service (code source, interface,
            algorithmes, marques, logos) est la propriété exclusive de
            RentReady SAS. L&apos;abonnement confère uniquement un droit d&apos;usage
            personnel et non transférable.
          </p>
        </section>

        <section>
          <h2>8. Protection des données</h2>
          <p>
            Le traitement des données personnelles est détaillé dans notre{" "}
            <a
              href="/politique-confidentialite"
              className="text-blue-600 underline underline-offset-2"
            >
              Politique de Confidentialité
            </a>
            . L&apos;utilisateur peut exercer ses droits RGPD en contactant{" "}
            <a href="mailto:dpo@rentready.fr" className="text-blue-600 underline underline-offset-2">dpo@rentready.fr</a>.
          </p>
        </section>

        <section>
          <h2>9. Résiliation</h2>
          <p>
            L&apos;utilisateur peut résilier son abonnement à tout moment depuis
            son espace de facturation. RentReady SAS se réserve le droit de
            suspendre ou de résilier un compte en cas de violation des
            présentes CGU, notamment en cas d&apos;utilisation frauduleuse du
            service.
          </p>
          <p className="mt-2">
            En cas de résiliation, les données de l&apos;utilisateur sont
            conservées pendant 3 ans (conformément à la durée de prescription
            civile), sauf demande d&apos;effacement anticipé.
          </p>
        </section>

        <section>
          <h2>10. Modification des CGU</h2>
          <p>
            RentReady SAS se réserve le droit de modifier les présentes CGU.
            Les utilisateurs seront informés par email 30 jours avant l&apos;entrée
            en vigueur des modifications. La poursuite de l&apos;utilisation du
            service après cette date vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2>11. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de
            litige, et après tentative de résolution amiable, les tribunaux
            compétents de Paris seront seuls compétents.
          </p>
        </section>
      </div>
    </article>
    </>
  );
}
