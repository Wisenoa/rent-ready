import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles de RentReady, conformément au RGPD.",
};

function PolitiqueConfidentialiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "RentReady — Politique de Confidentialité",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/politique-confidentialite",
        description:
          "Politique de confidentialité de RentReady. Protection des données personnelles conformément au RGPD, gestion locative SaaS.",
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
            name: "Politique de Confidentialité",
            item: "https://www.rentready.fr/politique-confidentialite",
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

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PolitiqueConfidentialiteJsonLd />
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Politique de Confidentialité
      </h1>
      <p className="mt-4 text-sm text-stone-400">
        Dernière mise à jour : mars 2026
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-stone-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:mb-3">
        <section>
          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données collectées sur le site
            rentready.fr est la société RentReady SAS, [adresse du siège
            social]. Délégué à la protection des données (DPO) :{" "}
            <a href="mailto:dpo@rentready.fr" className="text-blue-600 underline underline-offset-2">dpo@rentready.fr</a>
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Nous collectons les catégories de données suivantes :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Propriétaires bailleurs :</strong> nom, prénom, adresse
              email, mot de passe (haché), adresse postale, numéro de
              téléphone, coordonnées bancaires (via Open Banking en lecture
              seule, aucun RIB stocké).
            </li>
            <li>
              <strong>Locataires :</strong> nom, prénom, adresse postale,
              email, téléphone, montant du loyer et des charges.
            </li>
            <li>
              <strong>Données transactionnelles :</strong> montants des loyers,
              dates de paiement, quittances et reçus générés.
            </li>
            <li>
              <strong>Données techniques :</strong> adresse IP, type de
              navigateur, cookies de session.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Finalités du traitement</h2>
          <p>Les données sont traitées pour les finalités suivantes :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Gestion des comptes utilisateurs et authentification</li>
            <li>Génération automatique de quittances et reçus conformes à la loi du 6 juillet 1989</li>
            <li>Détection automatique des loyers via Open Banking (DSP2)</li>
            <li>Calcul de la révision annuelle des loyers (IRL INSEE)</li>
            <li>Gestion de la maintenance locative</li>
            <li>Facturation de l&apos;abonnement via Stripe</li>
            <li>Préparation du e-reporting B2C (obligation 2027)</li>
          </ul>
        </section>

        <section>
          <h2>4. Base juridique</h2>
          <p>
            Le traitement des données repose sur l&apos;exécution du contrat
            d&apos;abonnement (article 6.1.b du RGPD), le respect d&apos;obligations
            légales (article 6.1.c — obligations fiscales et comptables), et
            le consentement de l&apos;utilisateur pour les cookies non essentiels
            (article 6.1.a).
          </p>
        </section>

        <section>
          <h2>5. Durée de conservation</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Données de compte :</strong> conservées pendant toute la
              durée de l&apos;abonnement, puis supprimées 3 ans après la clôture du
              compte (délai de prescription civile).
            </li>
            <li>
              <strong>Quittances et documents fiscaux :</strong> conservés 10
              ans conformément aux obligations comptables françaises (article
              L123-22 du Code de commerce).
            </li>
            <li>
              <strong>Données de connexion bancaire :</strong> aucune donnée
              bancaire n&apos;est stockée. La synchronisation s&apos;effectue en lecture
              seule via un agrégateur certifié DSP2.
            </li>
            <li>
              <strong>Logs techniques :</strong> 12 mois maximum.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Sous-traitants et transferts</h2>
          <p>Vos données peuvent être traitées par les sous-traitants suivants :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Vercel</strong> (hébergement) — Serveurs UE (eu-west)
            </li>
            <li>
              <strong>NeonDB / Supabase</strong> (base de données PostgreSQL)
              — Serveurs UE
            </li>
            <li>
              <strong>Stripe</strong> (paiements) — Certifié PCI DSS Level 1
            </li>
            <li>
              <strong>Bridge API / Powens</strong> (Open Banking) — Agréé
              ACPR, serveurs en France
            </li>
            <li>
              <strong>OpenAI</strong> (OCR factures via Vercel AI SDK) — Les
              données transmises ne sont pas utilisées pour l&apos;entraînement des
              modèles
            </li>
          </ul>
          <p className="mt-2">
            Aucun transfert de données hors de l&apos;Espace économique européen
            n&apos;est effectué sans les garanties appropriées (clauses contractuelles
            types de la Commission européenne).
          </p>
        </section>

        <section>
          <h2>7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants sur vos
            données personnelles :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Droit d&apos;accès (article 15)</li>
            <li>Droit de rectification (article 16)</li>
            <li>Droit à l&apos;effacement / droit à l&apos;oubli (article 17)</li>
            <li>Droit à la limitation du traitement (article 18)</li>
            <li>Droit à la portabilité des données (article 20)</li>
            <li>Droit d&apos;opposition (article 21)</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits :{" "}
            <a href="mailto:dpo@rentready.fr" className="text-blue-600 underline underline-offset-2">dpo@rentready.fr</a>
          </p>
          <p className="mt-2">
            En cas de litige, vous pouvez introduire une réclamation auprès de
            la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :
            <a href="https://www.cnil.fr" className="ml-1 text-blue-600 underline underline-offset-2" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
          </p>
        </section>

        <section>
          <h2>8. Cookies</h2>
          <p>
            RentReady utilise uniquement des cookies strictement nécessaires :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>better-auth.session_token</strong> — Cookie de session
              d&apos;authentification (strictement nécessaire, exempté de
              consentement)
            </li>
            <li>
              <strong>sidebar_state</strong> — Préférence d&apos;affichage du menu
              (fonctionnel)
            </li>
          </ul>
          <p className="mt-2">
            Aucun cookie publicitaire, de traçage ou d&apos;analyse tiers n&apos;est
            déposé.
          </p>
        </section>

        <section>
          <h2>9. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données : chiffrement TLS en transit,
            hachage des mots de passe (bcrypt), isolation des données par
            utilisateur (multitenancy), et accès restreint aux bases de
            données de production.
          </p>
        </section>
      </div>
    </article>
    </>
  );
}
