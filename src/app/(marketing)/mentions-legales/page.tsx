import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales de RentReady, logiciel de gestion locative pour propriétaires indépendants.",
};

export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Mentions Légales
      </h1>
      <p className="mt-4 text-sm text-stone-400">
        Dernière mise à jour : mars 2026
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-stone-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:mb-3">
        <section>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>rentready.fr</strong> est édité par la société
            RentReady SAS, au capital de [montant] €, immatriculée au Registre
            du Commerce et des Sociétés de [ville] sous le numéro SIREN
            [numéro], dont le siège social est situé au [adresse complète].
          </p>
          <p className="mt-2">
            Directeur de la publication : [Prénom Nom], en qualité de
            Président.
          </p>
          <p className="mt-2">
            Contact : <a href="mailto:contact@rentready.fr" className="text-blue-600 underline underline-offset-2">contact@rentready.fr</a>
          </p>
          <p className="mt-2">
            Numéro de TVA intracommunautaire : FR [numéro]
          </p>
        </section>

        <section>
          <h2>2. Hébergeur</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, États-Unis. Les données sont traitées et
            stockées sur des serveurs situés dans l&apos;Union européenne
            (région eu-west), conformément au Règlement Général sur la
            Protection des Données (RGPD).
          </p>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus du site (textes, graphismes,
            logiciels, photographies, images, sons, plans, noms, logos,
            marques, créations et œuvres protégeables diverses, bases de
            données, etc.) sont la propriété exclusive de RentReady SAS ou de
            ses partenaires. Toute reproduction, représentation, modification,
            publication, adaptation de tout ou partie des éléments du site,
            quel que soit le moyen ou le procédé utilisé, est interdite, sauf
            autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2>4. Données personnelles</h2>
          <p>
            Conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD)
            et à la loi n° 78-17 du 6 janvier 1978 modifiée (Loi Informatique
            et Libertés), les utilisateurs disposent d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, de limitation du traitement, de
            portabilité et d&apos;opposition concernant leurs données personnelles.
          </p>
          <p className="mt-2">
            Pour exercer ces droits, contactez :{" "}
            <a href="mailto:dpo@rentready.fr" className="text-blue-600 underline underline-offset-2">dpo@rentready.fr</a>
          </p>
          <p className="mt-2">
            Pour en savoir plus, consultez notre{" "}
            <a href="/politique-confidentialite" className="text-blue-600 underline underline-offset-2">
              Politique de Confidentialité
            </a>.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            Le site utilise des cookies strictement nécessaires au
            fonctionnement de l&apos;authentification et à la mémorisation des
            préférences utilisateur. Aucun cookie publicitaire ou de suivi
            tiers n&apos;est déposé. Le consentement de l&apos;utilisateur est recueilli
            via un bandeau conforme à la directive ePrivacy et au RGPD.
          </p>
        </section>

        <section>
          <h2>6. Limitation de responsabilité</h2>
          <p>
            RentReady SAS s&apos;efforce de fournir des informations aussi
            précises que possible. Toutefois, elle ne pourra être tenue
            responsable des omissions, des inexactitudes et des carences dans
            la mise à jour, qu&apos;elles soient de son fait ou du fait des
            tiers partenaires qui lui fournissent ces informations.
          </p>
        </section>

        <section>
          <h2>7. Droit applicable</h2>
          <p>
            Tout litige en relation avec l&apos;utilisation du site
            rentready.fr est soumis au droit français. Il est fait attribution
            exclusive de juridiction aux tribunaux compétents de Paris.
          </p>
        </section>
      </div>
    </article>
  );
}
