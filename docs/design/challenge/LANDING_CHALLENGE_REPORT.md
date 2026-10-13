# Challenge landing page Lokna — rapport

## Résultat

La route `/gestion-locative` présente maintenant Lokna comme un outil de gestion locative destiné aux bailleurs qui gèrent eux-mêmes un petit parc. La page suit un parcours concret — logement, locataire, bail, loyer attendu, paiement reçu, document — et mène vers l’inscription ou la page tarifaire.

La composition reprend le crème et le vert forêt de Lokna avec des titres serif, une mise en page éditoriale et trois photographies originales. Le hero place le bénéfice et les actions avant le visuel. Sur mobile, le texte et les boutons précèdent une image recadrée en pleine largeur. Les sections suivantes expliquent le cycle de gestion et les règles de paiement, puis présentent les outils et les réponses pratiques sans fausse interface produit.

## Copywriting et fidélité au produit

- H1 : « Le bon suivi, du bail à la quittance. »
- Le sous-titre explique que Lokna rassemble logements, locataires, baux, loyers attendus, paiements et documents.
- Les appels à l’action conduisent à `/register` et `/pricing`.
- Le parcours distingue le loyer attendu, le paiement reçu et le document correspondant.
- La FAQ indique qu’un paiement partiel conserve un solde dû et ne donne pas lieu à une quittance. Une quittance est générée après enregistrement du paiement intégral, à la demande du bailleur.
- Les prix sont repris des données tarifaires de l’application (`formatEntryPrice` et `formatProPrice`). Aucun témoignage, avis, chiffre d’usage ou certification n’a été ajouté.
- Les pages locales sont conservées dans une divulgation repliée afin de préserver l’accès aux liens sans dominer la page.

## Direction visuelle et images

Les images sont des photos éditoriales originales, générées pour cette page puis encodées en WebP. Elles servent à situer le produit dans le quotidien d’un bailleur, sans imiter l’interface réelle de Lokna.

| Fichier | Dimensions | Taille | Rôle |
| --- | ---: | ---: | --- |
| `public/images/gestion-locative/hero.webp` | 1536 × 1024 | 198 516 octets | Appartement lumineux et clés : ancrage du hero dans le logement réel. |
| `public/images/gestion-locative/keys-and-documents.webp` | 1122 × 1402 | 114 180 octets | Clés et dossier sur un bureau : préparation et suivi des documents. |
| `public/images/gestion-locative/courtyard-entry.webp` | 1122 × 1402 | 236 014 octets | Entrée d’immeuble et cour : relier la gestion au lieu loué. |

Intentions données au générateur :

1. **Hero** — photographie éditoriale réaliste d’un salon parisien clair et habité, tons crème et bois, clés visibles sur une console, lumière naturelle, espace calme, cadrage horizontal avec zone de composition exploitable.
2. **Clés et documents** — nature morte photographique verticale de clés et d’un dossier papier vierge sur un bureau en bois, soleil doux, palette chaude et neutre, sans texte lisible ni interface.
3. **Entrée et cour** — photographie verticale d’une entrée d’immeuble français ouvrant sur une cour paisible, détails architecturaux chaleureux, lumière naturelle, même palette crème et sauge.

Les trois fichiers totalisent environ 536 Ko. Ils sont servis par `next/image` : le hero est prioritaire, les deux autres images sont différées et les trois déclarent des tailles adaptées aux breakpoints. Next optimise les ressources en AVIF dans l’aperçu de production local.

## Captures

Les captures « avant » proviennent de la page existante et de la homepage consultées avant modification. Les captures « après » ont été prises dans Chromium contre le serveur standalone construit localement.

- [Homepage avant — 1440 px](captures/home-before-1440.png)
- [Gestion locative avant — pleine page, 1440 px](captures/gestion-before-1440.png)
- [Gestion locative avant — 390 px](captures/gestion-before-390.png)
- [Nouvelle page — pleine page, 1440 px](captures/gestion-after-1440.png)
- [Nouvelle page — hero, 1440 × 1000](captures/gestion-after-hero-1440.png)
- [Nouvelle page — 768 × 900](captures/gestion-after-768.png)
- [Nouvelle page — pleine page, 390 px](captures/gestion-after-390.png)
- [Nouvelle page — 360 × 780](captures/gestion-after-360.png)

## SEO et accessibilité

- URL conservée : `/gestion-locative`.
- Canonical vérifié : `https://lokna.fr/gestion-locative`.
- La page rend `index, follow`.
- Les données structurées existantes `WebSite`, `Organization`, `BreadcrumbList` et `SoftwareApplication` sont conservées.
- Le title et la description ont été réécrits pour décrire le produit et refléter la règle de quittance et le prix courant.
- Les ancres de navigation de la page et les liens des pages locales restent accessibles.
- axe-core sur le contenu de la page, avec les tags WCAG 2.1 A/AA : aucune violation détectée après correction du contraste des numéros d’étape.

## Vérifications exécutées

| Vérification | Résultat |
| --- | --- |
| `pnpm exec tsc --noEmit` | Réussi. |
| ESLint ciblé sur la page et le test Playwright | Réussi. |
| `pnpm lint` | Réussi, 0 erreur et 13 avertissements dans des fichiers non liés à cette page. |
| `pnpm test` | Réussi : 77 fichiers passés, 14 ignorés ; 861 tests passés, 256 ignorés. |
| Playwright, `gestion-locative-landing.spec.ts`, Chromium | 4 tests passés : promesse et SEO, liens et ancres, images et largeurs 360/390/768/1440 sans débordement, FAQ/liens locaux, audit axe-core. |
| `pnpm build` | Réussi avec une URL PostgreSQL de boucle locale réservée au build ; aucune base n’a été démarrée ni sollicitée. Next a généré 492 pages. |
| Aperçu standalone local | Route HTTP 200 ; title, canonical et robots vérifiés dans le navigateur. Trois ressources d’image optimisées ont répondu en AVIF. |
| `git diff --check` | Réussi. |

Le premier essai de build sans `DATABASE_URL` a échoué pendant la collecte des pages à cause de l’initialisation Prisma dans une route API existante, sans rapport avec cette page. Le build a ensuite réussi avec une URL factice de boucle locale, sans connexion à une base. Le build signale également des avertissements déjà présents concernant `metadata.viewport`, le runtime edge d’une autre route et la dépréciation Sentry.

Mesures du chargement faites en Chromium contre l’aperçu local sur boucle locale, et non avec Lighthouse ni depuis un réseau public : DOMContentLoaded 462 ms, événement `load` 902 ms, LCP 908 ms. Le navigateur a reçu trois ressources d’image AVIF totalisant environ 149 Ko. Ces mesures décrivent cet aperçu et ne constituent pas un engagement de performance en production.

## Limites restantes

- La page charge le script partagé Vercel Analytics `/_vercel/insights/script.js`, qui répond 404 dans l’aperçu local. Cette même URL répond aussi 404 sur `https://lokna.fr` ; c’est un problème partagé de l’intégration analytics existante, et non une erreur JavaScript propre à cette landing. Il n’a pas été modifié ici pour ne pas changer le comportement des autres pages marketing.
- Le CTA de navigation partagé conserve son style préexistant ; les appels à l’action dans la page utilisent la palette verte de Lokna.
- Aucun déploiement ni changement de base n’a été effectué. La livraison Git utilise la branche dédiée `challenge/lokna-codex-20261013`.

## Fichiers livrés

- Page : `src/app/(marketing)/gestion-locative/page.tsx`
- Vérifications Playwright : `src/__tests__/e2e/gestion-locative-landing.spec.ts`
- Images : `public/images/gestion-locative/*.webp`
- Captures avant/après : `docs/design/challenge/captures/`
- Rapport : `docs/design/challenge/LANDING_CHALLENGE_REPORT.md`
