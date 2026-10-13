# Implémentation

Branche `challenge/claude-homepage-v2`, worktree `/home/ubuntu/lokna-homepage`, partie de `fd946af` (commit en production). Rien n'est poussé, fusionné ni déployé. `/gestion-locative` n'est pas modifiée.

## Fichiers
| Fichier | Changement |
| --- | --- |
| `src/app/page.tsx` | Nouvelle composition. Métadonnées, revalidation et données structurées (Organization, WebSite, FAQPage) inchangées. `<main id="main">` pour que le lien d'évitement du layout racine fonctionne. |
| `src/components/marketing/home/month-script.ts` | Nouveau, serveur uniquement. Le mois d'octobre : seules les entrées (loyers, charges, versements, date de rappel) sont écrites. Dû, reçu, reste, état et document viennent de `settlePeriodPayments` (Decimal). Les montants sont formatés côté serveur. |
| `month-types.ts` | Types partagés, sans decimal.js, importables côté client. |
| `MonthPanel.tsx` | Le panneau « suivi du mois ». Composant serveur, réutilisé dans le hero et dans l'histoire. Mode `compact` sur mobile. |
| `MonthStory.tsx` | Client. Section signature : `IntersectionObserver` sur une ligne de lecture et boutons de date. |
| `FeatureTabs.tsx` | Client. Onglets ARIA (flèches, Home, End). Les panneaux sont rendus côté serveur. |
| `Reveal.tsx` | Client. Révélation au scroll, sans jamais masquer le rendu initial. |
| `home.module.css` | Tout le mouvement et le support de `prefers-reduced-motion`. |
| `HomeNavbar`, `HomeHero`, `HomeShift`, `HomeMonth`, `HomeFeatures`, `HomeForWho`, `HomePricing`, `HomeFaq`, `HomeFinalCTA`, `HomeFooter` | Sections réécrites. La FAQ passe en `<details>` natif, sans JS. Le pied de page compte 17 liens internes, contre 10 avant. |
| `faq-data.ts` | Mêmes 4 questions. Réponses corrigées : export CSV situé dans « Analyse fiscale », plus de promesse « Lokna automatise ces vérifications ». |
| `HomeDemo`, `HomeProductMoments`, `HomeTrust`, `HomeTools` | Supprimés, sans autre usage. |
| `src/__tests__/e2e/homepage.spec.ts` | Remplace `homepage-b3-flow.spec.ts`, qui testait la démo et l'interrupteur mensuel/annuel supprimés. |
| `scripts/capture-homepage.mjs` | Captures à 1440, 768, 390 et 360 px, page entière et par section. |

## Vérifié dans le code avant chaque affirmation
- **Paiement partiel → reçu, solde → quittance :** `period-settlement.ts`.
- **Objets d'e-mail des trois tons de relance**, possibles seulement après échéance, avec retour d'échec : `sendPaymentReminder` dans `transaction-actions.tsx`.
- **Révision IRL :** `calculateRentRevision`, IRL T4 2024 = 144,64 et T4 2025 = 145,78. Le loyer passe de 640 € à 645,04 €.
- **Espace locataire :** « Mes quittances », « Mes demandes », « Nouvelle demande » (`/portal/[token]`).
- **Export CSV :** `/fiscal/export` (« Exporter CSV »).
- **Tarifs :** `PLANS` (9 € et 89 €, 15 € et 149 €). Essai de 14 jours sans carte : `register-actions.ts`.
- **Non affirmé :** rapprochement bancaire, analyse de conformité des baux, alerte IRL automatique, fonctionnalités réservées au Pro.

## Assets
Les trois photos de `/gestion-locative` sont réutilisées, sans nouveau fichier. Aucune image n'a été générée : aucun outil de génération ni Codex n'est disponible dans cet environnement.
