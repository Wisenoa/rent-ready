# Implémentation V2.1

Branche `challenge/claude-homepage-v2`, worktree `/home/ubuntu/lokna-homepage`, sur V2 (`e762da9`). Rien n'est poussé, fusionné ni déployé. `/gestion-locative` n'est pas modifiée (aucun fichier de sa route ni de ses composants).

## Homepage (`src/components/marketing/home/`)
| Fichier | Changement |
| --- | --- |
| `MotionRoot.tsx`, `motion-features.ts` | Nouveaux. `LazyMotion` (fonctionnalités chargées à la demande) et `MotionConfig reducedMotion="user"`. |
| `LivePanel.tsx` (remplace `MonthPanel.tsx`) | Panneau du mois animé entre deux états : montants, coche, statut, pied d'événement. |
| `Amount.tsx` | Nouveau. Montant qui compte vers sa nouvelle valeur ; la chaîne canonique formatée côté serveur reste la valeur de départ et d'arrivée. |
| `HeroDemo.tsx` | Nouveau. Le solde qui arrive, avec Pause, Reprendre et Rejouer. |
| `MonthStory.tsx` | Réécrit. `useScroll` sur la liste, filet de progression, pastille de date en `layoutId`, document qui sort du panneau. Textes des étapes rendus côté serveur et passés en enfants. |
| `ParallaxPhoto.tsx` | Nouveau. Ouverture en obturateur et parallaxe. |
| `month-script.ts`, `month-types.ts` | Montants en centimes (pour l'animation), document émis à chaque étape, `HERO_SEQUENCE`. Toutes les valeurs viennent de `settlePeriodPayments`. |
| `HomeHero.tsx` | H1 avec la requête visible ; phrase en un seul bloc (élément LCP) ; démo en direct. |
| `HomeMonth`, `HomeShift`, `HomeForWho`, `HomeFeatures`, `HomeFinalCTA`, `HomeFaq`, `HomeNavbar`, `FeatureTabs` | Mouvement, liens contextuels, ligne d'outils gratuits, 3 étapes pour commencer. La photo de « Ce que vous refaites » est masquée sur téléphone. |
| `faq-data.ts` | 6 questions : ajout de « Existe-t-il une version gratuite ? » (prix tirés de `PLANS`) et de « Lokna remplace-t-il une agence ? ». |
| `home.module.css` | Tout le mouvement CSS et le support de `prefers-reduced-motion`. |
| `src/app/page.tsx` | Title « Gestion locative en ligne pour particuliers \| Lokna » (`absolute`), nouvelle description, `MotionRoot`. |

## Changements globaux (toutes les pages), justifiés par la performance
| Fichier | Changement | Effet mesuré |
| --- | --- | --- |
| `instrumentation-client.ts` | Le SDK Sentry n'est plus importé statiquement : il se charge seulement si `NEXT_PUBLIC_SENTRY_DSN` est défini (il ne l'est pas en production). | JS partagé : 185 → 106 kB. |
| `sentry.client.config.ts` | Supprimé : il initialisait le SDK une seconde fois et `@sentry/nextjs` le signale comme obsolète. Sa documentation a été reportée dans `instrumentation-client.ts`, et les références mises à jour dans `docs/`. | — |
| `src/app/layout.tsx` | Inter passe en `display: "optional"` ; JetBrains Mono et Newsreader ne sont plus préchargées ; `<Analytics />` de Vercel n'est rendu que sur Vercel (son script renvoyait 404 sur chaque page). | CLS 0,227 → 0,001 (avec bridage) ; 2 polices et 1 script en moins au démarrage. |
| `next.config.ts` | Commentaire Sentry mis à jour. | — |

## Tests
- `src/__tests__/e2e/homepage.spec.ts` : ajout du SEO (title, description, canonical, H1, lien vers `/gestion-locative`) et de la démo du hero (lecture jusqu'à 100 %, Rejouer, Pause).
- `src/__tests__/lib/homepage-b3-migration.test.ts` : la FAQ compte 6 questions.

## Assets
Aucune image nouvelle : les 3 photos de la V2 sont conservées. Pas de délégation à Codex, aucun visuel ne manquait.
