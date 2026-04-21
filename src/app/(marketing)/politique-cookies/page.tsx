import type { Metadata } from "next";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Politique de Cookies — RentReady",
    description:
      "Politique de gestion des cookies de RentReady. Utilisation des cookies, consentement, et vos choix pour une navigation respectueuse de votre vie privee.",
    url: "/politique-cookies",
    ogType: "template",
  });
}

function PolitiqueCookiesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "RentReady — Politique de Cookies",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/politique-cookies",
        description:
          "Politique de cookies de RentReady. Explication des cookies utilises, finalites et droits des utilisateurs conforme au RGPD.",
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
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.rentready.fr/recherche?q={search_term_string}",
          "query-input": "required name=search_term_string",
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
            name: "Politique de Cookies",
            item: "https://www.rentready.fr/politique-cookies",
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

export default function PolitiqueCookiesPage() {
  return (
    <>
      <PolitiqueCookiesJsonLd />
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Politique de Cookies
        </h1>
        <p className="mt-4 text-sm text-stone-400">
          Derniere mise a jour : mars 2026
        </p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-stone-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:mb-3">
          <section>
            <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocke sur votre appareil
              (ordinateur, tablette, smartphone) lors de votre visite sur notre
              site. Les cookies permettent a RentReady de fonctionner
              correctement, de securiser votre session et de memoriser vos
              preferences.
            </p>
          </section>

          <section>
            <h2>2. Cookies utilises sur RentReady</h2>
            <p>
              Nous utilisons uniquement des cookies strictement necessaires au
              fonctionnement du service. Aucun cookie publicitaire, de
              tracage ou d&apos;analyse tiers n&apos;est depose.
            </p>

            <h3 className="mt-4 text-base font-medium text-stone-700">
              Cookies strictement necessaires
            </h3>
            <table className="mt-3 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-2 font-medium text-stone-700">Nom</th>
                  <th className="py-2 font-medium text-stone-700">Finalite</th>
                  <th className="py-2 font-medium text-stone-700">Duree</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2 font-mono text-xs text-stone-600">
                    better-auth.session_token
                  </td>
                  <td className="py-2">
                    Maintien de votre session d&apos;authentification. Essentiel
                    pour vous connecter a votre espace bailleur.
                  </td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs text-stone-600">
                    sidebar_state
                  </td>
                  <td className="py-2">
                    Memorise l&apos;etat plie/deplie du menu lateral dans votre
                    tableau de bord.
                  </td>
                  <td className="py-2">1 an</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>3. Consentement et refus des cookies</h2>
            <p>
              Conformement a la reglementation francaise et europeenne (RGPD,
              Directive ePrivacy), les cookies strictement necessaires ne
              necessitent pas votre consentement prealable car ils sont
              indispensables au fonctionnement du service que vous avez demande.
            </p>
            <p className="mt-3">
              Si vous souhaitez limiter ou supprimer les cookies, vous pouvez
              le faire a tout moment depuis les parametres de votre navigateur.
              La procedure varie selon le navigateur :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/fr/kb/cookies-permis-ou-bloques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Safari (macOS / iOS)
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="mt-3">
              La desactivation des cookies peut alterer le fonctionnement de
              certaines parties du site, notamment la connexion a votre compte.
            </p>
          </section>

          <section>
            <h2>4. Cookies tiers</h2>
            <p>
              RentReady n&apos;utilise aucun cookie tiers (publicitaires, analytiques
              ou de reseaux sociaux). Nous ne partageons aucune donnee de
              navigation avec des tiers.
            </p>
          </section>

          <section>
            <h2>5. Traceurs autres que les cookies</h2>
            <p>
              Nous n&apos;utilisons pas de technologies de tracage autres que les
              cookies strictement necessaires. Nous n&apos;utilisons pas d&apos;empreinte
              digitale (fingerprinting), de pixels espions ni de scripts de
              suivi tiers.
            </p>
          </section>

          <section>
            <h2>6. Votre accord pour les services tiers</h2>
            <p>
              Certains services integres a RentReady peuvent deposer leurs
              propres cookies :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Stripe</strong> — Lors du paiement par carte, Stripe
                peut deposer des cookies pour la securite des transactions.
                Voir la{" "}
                <a
                  href="https://stripe.com/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  politique de cookies de Stripe
                </a>
                .
              </li>
              <li>
                <strong>Bridge / Powens</strong> — Lors de la connexion de
                votre compte bancaire pour la detection automatique des loyers,
                l&apos;API Bridge peut deposer des cookies de securite. Voir la{" "}
                <a
                  href="https://www.powens.com/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2"
                >
                  politique de cookies de Powens
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Vos droits</h2>
            <p>
              Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de
              rectification et de suppression des donnees vous concernant. Pour
              toute question sur notre utilisation des cookies :
            </p>
            <p className="mt-2">
              Email :{" "}
              <a
                href="mailto:dpo@rentready.fr"
                className="text-blue-600 underline underline-offset-2"
              >
                dpo@rentready.fr
              </a>
            </p>
            <p className="mt-2">
              Pour plus de details sur la protection de vos donnees personnelles,
              consultez notre{" "}
              <a
                href="/politique-confidentialite"
                className="text-blue-600 underline underline-offset-2"
              >
                Politique de Confidentialite
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
