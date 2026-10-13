# Implémentation

Branche `challenge/claude-final`, worktree `/home/ubuntu/lokna-claude`, partie de `master` (`719dae1`, qui contient la version Gemini). Rien n'est fusionné, poussé ni déployé.

## Fichiers
| Fichier | Changement |
| --- | --- |
| `src/app/(marketing)/gestion-locative/page.tsx` | Page réécrite (puis ajout de trois photos, voir Assets). Server Component, sans état client. Métadonnées, JSON-LD (SoftwareApplication + FAQPage), sections. |
| `src/components/marketing/gestion-locative/example-month.ts` | Nouveau. Mois fictif : seules les entrées (loyer, charges, versements) sont écrites. Dû, reste et type de document viennent de `settlePeriodPayments` (Decimal, aucun flottant). |
| `src/components/marketing/gestion-locative/month-ledger.tsx` | Nouveau. Le registre d'octobre : 5 colonnes à partir de `lg`, ligne compacte en dessous. |
| `src/components/marketing/gestion-locative/receipt-sheets.tsx` | Nouveau. Quittance et reçu partiel abrégés, avec les intitulés exacts du PDF (`src/lib/quittance-generator.tsx`). |
| `src/components/marketing/gestion-locative/faq-data.ts` | Réécrit. FAQ visible et données structurées depuis une seule source. Les prix viennent de `PLANS`. |
| `src/components/marketing/gestion-locative/Gestion*.tsx`, `index.ts` | Supprimés (version Gemini, utilisés uniquement par cette page). |
| `public/images/challenge/*` | Supprimés (6 images Gemini, plus aucune référence). |
| `scripts/take-screenshot.mjs` | Supprimé, remplacé par `scripts/capture-gestion-locative.mjs`. |
| `src/__tests__/e2e/gestion-locative-landing.spec.ts` | Réécrit pour la nouvelle page. |
| `src/components/smart-header-cta.tsx` | Bouton « Essai gratuit » de la navigation : indigo et ombre → vert forêt `#1E3A2F`, comme la navigation de la page d'accueil. Concerne toutes les pages marketing, outils et modèles. |
| `src/components/landing/glass-nav.tsx` | Les liens passent dans le menu sous 1024 px (ils se cassaient sur deux lignes à 768 px). |
| `src/components/landing/marketing-footer.tsx` | `stone-500` → `stone-600` sur la ligne de copyright (contraste 4,46:1 → AA). Corrige aussi l'audit axe de `/pricing` et `/features`. |

## Vérifié dans le code avant d'écrire chaque phrase
- Tarifs et limites : `src/data/entity.ts` (Starter 9 €/mois, 3 logements, 89 €/an ; Pro 15 €/mois, 10 logements, 149 €/an).
- Essai de 14 jours : `register-actions.ts` fixe `trialEndsAt` à la création du client Stripe. Stripe est configuré en production (présence de la clé vérifiée, valeur non lue). Inscription sans carte.
- Quittance seulement au solde, reçu partiel avant, paiements en plusieurs fois : `period-settlement.ts`, `quittance-actions.tsx`.
- Quittance générée à l'enregistrement du paiement, non envoyée par e-mail : `quittance-outcome.ts`. Aucun envoi automatique trouvé.
- Relance par e-mail en 3 tons, avec retour d'échec réel : `reminder-outcome.ts`.
- Révision IRL calculée puis validée par le bailleur : `irl-actions.ts` (`computeRentRevision` / `applyRentRevision`).
- Espace locataire avec quittances et signalement : `portal-actions.tsx` (`sendTenantInvitation`, `getPortalQuittances`, `createMaintenanceTicket`).
- Non affirmé faute de preuve d'usage dans l'interface : états des lieux générés, Factur-X, OCR, relance automatique, synchronisation bancaire.

## Assets
Reprises de Codex V2 (`challenge/lokna-codex-20261013`, lues sans modifier cette branche) et renommées :

| Fichier | Source V2 | Emplacement | Poids servi (AVIF, q75) |
| --- | --- | --- | --- |
| `public/images/gestion-locative/logement-entree.webp` | `hero.webp` | cycle, à droite du texte ; pleine largeur en 3:2 sur mobile | 31 Ko (640 w) à 65 Ko (1080 w) |
| `public/images/gestion-locative/cles-et-dossier.webp` | `keys-and-documents.webp` | sous le texte quittance/reçu, desktop uniquement | 26 à 46 Ko |
| `public/images/gestion-locative/cour-porte-ouverte.webp` | `courtyard-entry.webp` | fonctionnalités, à gauche, collante ; 3:2 sur mobile, 16:9 en tablette, 4:5 sur desktop | 62 à 114 Ko |

Toutes passent par `next/image` : `fill` dans un conteneur à ratio fixe (pas de CLS), `sizes` adaptés à la grille, chargement paresseux. Aucune n'est au-dessus de la ligne de flottaison, donc le LCP reste le H1 texte. Aucune image générée.

## Captures
`node scripts/capture-gestion-locative.mjs <url> docs/design/lokna-final/captures` produit, pour 1440 / 768 / 390 / 360 px, le premier écran, la page complète et chaque section. Le bandeau cookies est fermé avant la capture.
