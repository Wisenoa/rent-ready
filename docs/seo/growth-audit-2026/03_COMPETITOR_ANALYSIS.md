# 03 — Concurrents

**Méthode et limites**
- **SERP :** observées avec l'outil de recherche de la session (moteur non Google, localisé aux États-Unis), le 13/10/2026. Ce sont des **indications sur les types de pages qui se classent**, pas des positions Google France : aucune position n'est revendiquée.
- **Architecture :** chaque concurrent a été mesuré à partir de son sitemap public (`evidence/comp.mjs`, 25 sitemaps lus au maximum par site), avec un échantillon de pages lues.
- **Volumes de recherche :** non disponibles.

## 1. Qui apparaît sur quelles requêtes

| Requête | Types de pages en tête | Acteurs vus |
| --- | --- | --- |
| logiciel gestion locative | Comparatifs et annuaires | La Fabrique du Net, Capterra, GetApp, Manda (comparatif), investissement-locatif.com |
| logiciel gestion locative gratuit | Comparatifs « gratuits », fiches d'annuaire | La Fabrique du Net, Capterra (TurboTenant, Stessa), Gererseul (comparatif 2025) |
| gestion locative en ligne / particulier | Pages d'accueil d'éditeurs | BailFacile, Gererseul, Smartloc, Immobilier Loyer, adProprio, Emjysoft |
| quittance de loyer (modèle, PDF) | Générateurs et modèles | Selectra, BailFacile (`/documents/quittance-loyer`), 123loger, CallMePower, modele-lettre-gratuit, SeLoger, Gererseul |
| révision loyer IRL / calcul | Pages officielles, puis calculateurs | **service-public.fr**, justice.fr, PAP (`/bailleur/calcul-revision-loyer`), BailFacile (guides IRL), La Finance pour Tous |
| calcul augmentation loyer | Guides | Manda, bailpdf, immobilier-danger |
| régularisation charges locatives | Guides et calculateurs | BailFacile, SeLoger, Manda (calculateur), LocService, Gererseul |
| relance loyer impayé | Modèles de lettre | Luko, LocService, BailFacile (`/documents/loyer-impaye`), JD2M, **CAF (modèle officiel)**, SeLoger |
| rentabilité locative | Simulateurs | SeLoger, JD2M, Dougs, Legalstart |
| prorata loyer | Calculateurs | BailFacile, Omni Calculator, Luko, macalculatriceenligne |

**Conclusion :** sur les requêtes « outil » ou « modèle », les vrais concurrents SEO sont des **médias et des assureurs** (Selectra, SeLoger, Luko, PAP, LocService) et **BailFacile**. Sur les requêtes de marque, ce sont les logiciels (Rentila, Gererseul, Smartloc). Sur les sujets juridiques, **service-public.fr** et les sites officiels dominent : Lokna doit les citer, pas les concurrencer frontalement.

## 2. Architecture des concurrents (sitemaps publics)

| Site | URL | Sections principales | Lecture |
| --- | --- | --- | --- |
| **bailfacile.fr** | 1 777 | `/guides` 1 209 · `/actualites` 368 · `/gestion-locative/*` 126 · `/documents` 38 | **Concurrent n° 1 à étudier.** Les pages « documents » sont des générateurs de 1 500 à 3 200 mots (avenant, attestation de loyer, restitution du dépôt…). Les pages ville ont des **sous-pages réglementaires locales** (`/gestion-locative/marseille/permis-de-louer-marseille`, `/toulouse/preavis-logement-toulouse`). |
| gererseul.com | 2 004 | `/actualite-immobiliere` 1 034, rubriques par étape (« avant / pendant ma location », « soucis avec le locataire ») | Volume éditorial, arborescence par moment de vie du bail |
| rentila.com | 475 | `/blog` 318 · `/support` 153 | Le centre d'aide est indexé et sert aussi d'acquisition |
| manda.fr | 69 998 | `/agence-immobiliere` 31k · `/estimation-loyer` 30k · `/encadrement-des-loyers` 5k | Pages programmatiques **alimentées par des données** (loyers, encadrement) |
| lokt.fr | 316 | `/prix-m2` 169 · `/blog` 74 · `/rendement-locatif` 22 | Pages locales fondées sur des **données de prix** |
| bailpdf.com | 216 | `/guides` 129 · `/etat-des-lieux` 24 · `/contrat-de-bail` 12 | Modèles spécialisés |
| jedeclaremonmeuble.com · qlower.com | 530 · 821 | Contenus LMNP et fiscalité | Niche fiscale (meublé) |
| immobilierloyer.com | 5 731 | `/forum` 5 535 | Forum communautaire indexé |
| smartloc.fr | — | sitemap non lisible | — |

## 3. Ce qu'ils font mieux que Lokna
1. **Un document par intention.** Chez BailFacile, une URL par document (`/documents/quittance-loyer`, `/documents/loyer-impaye`), riche et unique. Lokna répartit la même intention sur 5 à 20 URL (doc 02 §4).
2. **Des pages locales fondées sur une différence réelle**, réglementaire (permis de louer, préavis réduit en zone tendue) ou chiffrée (Manda, lokt). Les pages ville de Lokna changent surtout le nom de la ville (0,3 % de texte propre).
3. **Des sources officielles citées et datées** (PAP, service-public) sur l'IRL et les charges.
4. **Une couverture du cycle de vie du bail** (entrée, en cours, incidents, sortie) chez Gererseul, avec une navigation par moment.

## 4. Ce que Lokna peut faire que les autres ne font pas
- **Des outils branchés sur les règles du produit** : `settlePeriodPayments` (paiement partiel → reçu, solde → quittance) et `calculateRentRevision`, avec les indices IRL datés et sourcés jusqu'au T2 2026. Aucun des générateurs gratuits vus dans les SERP ne met en avant le **paiement partiel** (reçu de paiement partiel conforme à l'article 21), pourtant au cœur de la question « que faire si mon locataire ne paie pas tout ». C'est à confirmer en testant chaque outil.
- **Le passage de l'outil au produit sans ressaisie** (doc 09) : la quittance générée gratuitement peut devenir le premier logement dans Lokna.

## Sources consultées (13/10/2026)
- **Comparatifs et annuaires :** [La Fabrique du Net, gratuits](https://www.lafabriquedunet.fr/logiciels/gestion/gestion-locative/gestion-locative-gratuit) · [Manda, comparatif 2026](https://manda.fr/ressources/articles/comparatif-des-meilleurs-logiciels-de-gestion-locative) · [Capterra](https://www.capterra.fr/directory/30219/lease-management/software)
- **Éditeurs :** [BailFacile](https://www.bailfacile.fr/) · [Gererseul](https://www.gererseul.com/) · [Rentila](https://www.rentila.com/) · [lokt.fr](https://lokt.fr/) · [Smartloc](https://www.smartloc.fr/)
- **Quittance :** [Selectra](https://selectra.info/demenagement/location/quittance-loyer) · [BailFacile, document](https://www.bailfacile.fr/documents/quittance-loyer) · [123loger](https://www.123loger.com/quittance-loyer) · [SeLoger](https://edito.seloger.com/conseils-d-experts/louer/quittance-de-loyer-modele-gratuit-article-20374.html)
- **IRL et révision :** [service-public F13723](https://www.service-public.gouv.fr/particuliers/vosdroits/F13723?lang=fr) · [PAP](https://www.pap.fr/bailleur/calcul-revision-loyer) · [justice.fr](https://www.justice.fr/fiche/indice-reference-loyers-irl) · [Manda, augmentation de loyer](https://www.manda.fr/ressources/articles/augmentation-de-loyer-condition-calcul-et-marche-a-suivre)
- **Charges :** [BailFacile](https://www.bailfacile.fr/guides/regularisation-charges-locatives) · [SeLoger](https://edito.seloger.com/calculer-regularisation-charges-locatives-article-17180.html) · [Manda](https://www.manda.fr/regularisation-charges-locatives-alur-forfait)
- **Impayés :** [CAF, modèle de relance](https://www.caf.fr/sites/default/files/medias/701/site/Partenaires/Logement%20Adil%20Kit%20Impay%C3%A9/Mod%C3%A8le%20courrier%20relance%20cas%20premier%20impay%C3%A9.pdf) · [Luko](https://www.fr.luko.eu/assurance-habitation/pno/mise-en-demeure-loyer-impaye/) · [BailFacile](https://www.bailfacile.fr/documents/loyer-impaye)
- **Rentabilité :** [SeLoger](https://edito.seloger.com/conseils-d-experts/investir/simulateur-calcul-rendement-locatif-rapide-precis-article-20870.html) · [Dougs](https://www.dougs.fr/outils-simulation/rentabilite-locative/) · [JD2M](https://www.jedeclaremonmeuble.com/simulateur-rentabilite-locative/)
- **Prorata :** [BailFacile](https://www.bailfacile.fr/guides/calcul-prorata-loyer) · [Omni Calculator](https://www.omnicalculator.com/fr/finance/calculateur-loyer-au-prorata)
- **Particulier, sans agence :** [adProprio](https://lespepitestech.com/node/34385) · [Immobilier Loyer](https://www.immobilierloyer.com/location/gestion-locative-en-ligne/choisir-logiciel-gestion-locative-en-ligne/)

