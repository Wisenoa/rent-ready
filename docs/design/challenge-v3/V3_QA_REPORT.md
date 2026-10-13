# V3 — rapport QA

## État de livraison

La V3 est implémentée et prête à l’évaluation visuelle dans `/home/ubuntu/lokna-codex-work`, branche `challenge/lokna-codex-20261013`. Les modifications V2, ses images et ses anciens rapports sont conservés. La livraison Git utilise cette branche dédiée. Aucun déploiement, changement d’infrastructure ou accès à une base de production n’a été effectué.

## PASS

| Contrôle exécuté | Résultat |
| --- | --- |
| `pnpm exec tsc --noEmit` | Exit 0 sur les sources finales |
| `pnpm lint` | Exit 0 ; 13 avertissements dans des fichiers existants non modifiés |
| ESLint ciblé sur page, composants, test et scripts V3 | Exit 0, sans avertissement |
| `pnpm test` | 77 fichiers passés, 14 ignorés ; 1 030 tests passés, 87 ignorés |
| `pnpm build` | Exit 0 ; 492 pages générées, sans connexion à une base pendant le build |
| Playwright sur le build standalone final | **5 tests passés**, 18,4 secondes |
| Responsive | Aucun débordement horizontal à 360, 390, 768 et 1440 px ; captures réelles à chaque largeur |
| Produit responsive | Source mobile sélectionnée à 360/390/768 px, source desktop à 1440 px ; images Next optimisées et chargées |
| Navigation de démonstration | Clic, flèches, Home/End, sélection, focus et panneau actif contrôlés |
| Accessibilité du contenu V3 | 8 audits axe-core WCAG 2.1 A/AA : 4 largeurs × 2 panneaux, **0 violation** ; reduced motion activé |
| SEO | Canonical, title, robots, H1 unique et JSON-LD contrôlés dans le navigateur |
| CTA | Inscription, tarifs et ancres vérifiés ; FAQ et pages locales accessibles |
| Inscription réelle | `/gestion-locative → /register → /dashboard`, compte fictif dans la base locale isolée, sans carte bancaire |
| Quittance réelle | HTTP 200, PDF de 12 133 octets ; seconde lecture identique et un seul document archivé |
| Loyer non réglé | Téléchargement refusé avec HTTP 400 |
| Captures publiques | 24 PNG copiés à l’identique dans `public/challenge/v3` ; HTTP 200 et `image/png` vérifiés pour chacun |
| Liens secondaires | Calculateur IRL, générateur de quittance, tarifs, villes et page locale Paris : HTTP 200 |
| Diff | `git diff --check` sans erreur |

Le test clavier initial lançait les touches avant l’hydratation sur le serveur de développement. Une vérification après hydratation a confirmé le fonctionnement du contrôle ; le test attend désormais une interaction observable avant les assertions de focus. Les cinq tests ont ensuite été exécutés sur le build final.

## FAIL — limites vérifiées

1. **Initialisation de l’essai sans Stripe.** L’inscription réussit, mais `trialEndsAt` reste nul. Le code existant initialise la date après la création du client Stripe ; les clés Stripe ont volontairement été absentes du test. Le contrôle produit retourne exit 1 et conserve cet échec dans [product-qa.json](product-captures/product-qa.json). La durée « 14 jours » a été retirée des textes de la landing ; les textes partagés des autres parcours ne sont pas réécrits ici.
2. **Console sans session simulée.** Deux ressources partagées répondent 404 : `/api/auth/session`, demandé par `SmartHeaderCta`, et `/_vercel/insights/script.js`. L’audit sans mock ne relève aucune exception JavaScript de page. Les 404 sont conservés dans [whole-page-qa.json](product-captures/whole-page-qa.json) ; ils ne sont pas assimilés à une absence d’erreur console.
3. **Accessibilité de la page complète.** À 390 et 1440 px, axe-core relève quatre textes de contraste insuffisant dans le footer partagé : copyright et trois liens légaux. Le contenu V3 passe les huit audits, mais le contrôle du document entier est **FAIL**. Le footer et ses classes sont identiques à la V2 et n’ont pas été modifiés.
4. **Écrans produit sources.** La synthèse financière du dashboard mobile peut faire chevaucher les montants ; le formulaire de paiement peut montrer les identifiants du bail et de la période. Les captures sources rendent ces défauts vérifiables. Les extraits mobiles intégrés utilisent les blocs lisibles de retard et du journal, sans retoucher l’interface.

Les limites partagées ont été établies par audit réel et inspection des fichiers inchangés : `smart-header-cta.tsx`, `marketing-footer.tsx`, `register-actions.ts` et `subscription-gate.tsx`. Aucun composant global n’a été modifié pour rendre les contrôles artificiellement verts.

## NOT VERIFIED

- Stripe Checkout, email, banque, stockage externe et expiration réelle d’un abonnement de production : aucun fournisseur n’a été sollicité.
- 14 fichiers / 87 tests ignorés par la suite Vitest : ils ne sont pas présentés comme réussis.
- Parcours complet de paiement partiel dans l’interface : non exécuté ici. La démonstration utilise un retard sans versement ; la règle reçu/quittance a été inspectée dans le code et couverte par la suite de tests du domaine.
- INP de visiteurs réels, Core Web Vitals en production et conversion : absence de mesure terrain et aucun déploiement.
- Safari, Firefox, lecteur d’écran et validation distante Google des données structurées : non exécutés.

## Performance V2 / V3

Deux builds de production locaux ont été utilisés. La V2 a été reconstruite depuis le commit de cette branche `aad3e24`, dans une copie temporaire située à l’intérieur du worktree, puis supprimée. La V3 utilise les sources finales. Même Chromium, viewport 1440 × 900, DPR 1, boucle locale, consentement déjà enregistré, session anonyme simulée de façon identique et aucun ralentissement réseau. Chaque serveur reçoit un préchargement avant **3 navigations dans des contextes navigateur neufs**. Les compilations sont terminées pendant la mesure comparative.

| Mesure | V2 | V3 |
| --- | ---: | ---: |
| LCP, 3 mesures | 140 / 132 / 148 ms | 136 / 168 / 144 ms |
| LCP médian local | **140 ms** | **144 ms** |
| CLS observé | 0 | 0 |
| `load`, médiane | 218 ms | 217,2 ms |
| Transfert des ressources initiales, hors HTML | 811 057 octets | 797 597 octets |
| JavaScript encodé reçu | 380 709 octets | 382 264 octets |
| Images optimisées initiales reçues | 148 729 octets | 132 847 octets |

Le JavaScript reçu augmente de 1 555 octets ; les images initiales diminuent de 15 882 octets. Les captures produit WebP 2× totalisent 167 526 octets avant optimisation Next.js. Les PNG d’évaluation sont des livrables publics séparés et ne sont pas chargés dans la landing.

Ces résultats décrivent un aperçu local avec cache d’optimisation échauffé. Ils ne sont ni un résultat Lighthouse ni une garantie de LCP/INP sur un réseau public. Sources : [V2](captures/v2/performance.json), [V3](captures/v3/performance.json). Les contrôles de largeur, métadonnées et ressources en erreur sont conservés dans `captures/v2/measurements.json` et `captures/v3/measurements.json`.

La page apporte deux preuves utiles supplémentaires. Sa hauteur desktop passe de 4 979 à 5 130 px ; à 390 px, de 7 118 à 7 737 px. Cette augmentation est documentée pour permettre une comparaison de la longueur, sans confondre richesse de preuve et meilleure conversion.

## Revue visuelle

Les captures V2 ont été prises avant modification aux quatre largeurs. Les captures V3 finales viennent du serveur standalone construit. Le hero, la page entière, les deux vues de démonstration, les fonctionnalités et le comparatif sont disponibles aux quatre largeurs dans `captures/v3/`.

La revue a porté sur les quatre compositions, le cadrage immobilier, la netteté des captures, les montants, les retours à la ligne, la lisibilité mobile et les tableaux. La capture desktop du hero a été remplacée par une fenêtre produit plus étroite et les captures produit ont été reprises en 2×. Le problème de barre fixe dans les premières captures de sections a été corrigé dans l’outil de capture, sans modifier la page.

Les copies publiques sont accessibles à `/challenge/v3/<nom-du-fichier>.png` sur un serveur qui sert ce checkout. Aucun fichier n’a été publié sur la production.

## Fichiers modifiés et créés

- Page : `src/app/(marketing)/gestion-locative/page.tsx`
- Composants dédiés : `src/components/landing/product-screenshot.tsx`, `src/components/landing/rent-tracking-demo.tsx`
- Fixture fictive : `src/data/gestion-locative-demo.json`
- Test : `src/__tests__/e2e/gestion-locative-landing.spec.ts`
- Outils : `scripts/challenge-v3-capture.mjs`, `scripts/challenge-v3-product-capture.mjs`, `scripts/challenge-v3-product-qa.mjs`
- 5 WebP produit : `public/images/gestion-locative/v3/`
- Captures V2/V3 et mesures : `docs/design/challenge-v3/captures/`
- Captures produit sources, PDF fictif et résultats : `docs/design/challenge-v3/product-captures/`
- 24 copies PNG : `public/challenge/v3/`
- Les cinq rapports : `docs/design/challenge-v3/V3_*.md`

Le fichier `src/data/routes.ts` réécrit par le générateur de build a été restauré pour éviter les modifications de dates sans rapport avec la mission.

## Reproduire les contrôles

La landing peut être contrôlée avec :

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3004 pnpm exec playwright test src/__tests__/e2e/gestion-locative-landing.spec.ts --project=chromium --workers=1
node scripts/challenge-v3-capture.mjs v3
```

Les deux outils produit exigent la base locale réservée `postgresql://lokna_demo@127.0.0.1:65433/lokna_challenge_v3` et un mot de passe de démonstration fourni par `CHALLENGE_DEMO_PASSWORD`. L’outil de capture vise le serveur local de développement à 3005 ; l’outil QA accepte uniquement 3004 ou 3005. Il retourne intentionnellement exit 1 tant que l’initialisation d’essai échoue. Les clés de fournisseurs doivent rester absentes. Les captures sont datées d’octobre 2026 : si elles sont régénérées à une autre date, leur légende de période doit être mise à jour.

`SOUL.md` est absent de ce checkout ; `IDEA.md`, `AGENTS.md`, les documents de marque et le code réel ont été examinés.
