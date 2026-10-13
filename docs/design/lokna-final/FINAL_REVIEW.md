# Revue finale

## Captures (`captures/`)
| Largeur | Premier écran | Page complète | Sections |
| --- | --- | --- | --- |
| 1440 | `hero-1440.png` | `page-1440.png` | `ledger`, `cycle`, `documents`, `fonctionnalites`, `tarifs`, `annexes` `-1440.png` |
| 768 | `hero-768.png` | `page-768.png` | idem `-768.png` |
| 390 | `hero-390.png` | `page-390.png` | idem `-390.png` |
| 360 | `hero-360.png` | `page-360.png` | idem `-360.png` |

Débordement horizontal mesuré : 0 px aux quatre largeurs.

## Passe critique : « est-ce que ça ressemble encore à un template IA ? »
Première implémentation, capturée puis jugée sur pièce :
1. **Trois sections construites sur le même gabarit** (titre à gauche, liste filetée à droite). C'est le rythme d'un template. → Le comparatif tableur, redondant avec le cycle, est supprimé. Les tarifs passent dans le bandeau vert final. « Le reste de la gestion » devient un registre 2 × 2 sous un titre pleine largeur.
2. **Registre mobile en 5 lignes par logement**, trop long à lire. → Ligne compacte : logement et locataire, le seul montant utile (« reçu » ou « reste dû »), puis une ligne de situation.
3. **Registre à 5 colonnes écrasé à 768 px.** → Il ne s'affiche en colonnes qu'à partir de 1024 px.
4. **Bouton indigo de la navigation** : hors marque, ce qui faisait le plus « SaaS générique » à l'écran. → Vert forêt, comme sur la page d'accueil.
5. **Typographie française** : deux-points renvoyés en début de ligne, « 9 / €/mois » et « 89- / 462 » coupés. → Espaces insécables.
6. **Lignes réglées trop hautes** à cause d'un renvoi qui passait à la ligne. → Renvoi intégré à la ligne, hauteur réduite. Le calme du produit est rendu.

Après corrections, la page ne contient ni surtitre, ni badge, ni icône décorative, ni dégradé, ni ombre (hors les deux feuilles de papier), ni carte de fonctionnalité, ni photo d'ambiance. Les deux objets graphiques sont ceux du métier : un registre et deux documents.

Risque assumé : sans photographie, la chaleur repose sur le crème, le sauge, le serif des documents et les prénoms des locataires. Si l'équipe trouve la page trop sobre, l'ajout pertinent serait une **vraie** photographie de propriétaire, et non une image générée.

## Tests exécutés
| Contrôle | Résultat |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 erreur |
| `pnpm exec eslint` (repo entier) | 0 erreur. 13 avertissements, tous dans des fichiers non modifiés. |
| `pnpm vitest run` après build | 77 fichiers verts, 1030 tests verts. 87 ignorés : suites `.db` qui exigent PostgreSQL. |
| `pnpm build` | Succès. `/gestion-locative` statique, ISR 1 h, 1,05 kB de JS propre à la page. |
| Playwright `gestion-locative-landing.spec.ts` (9 tests) | Vert : SEO, JSON-LD, CTA → `/register` (200), ancres de navigation, montants du registre, 50 villes, FAQ au clavier, 0 débordement à 360 / 390 / 768. |
| Playwright `accessibility.spec.ts` (axe, WCAG AA) | Vert sur `/gestion-locative`, `/pricing`, `/features`. Les deux dernières échouaient avant la correction du footer. |
| `pnpm seo:all` | 0 erreur. Avertissement `no-h1` faux positif, voir `SEO_QA.md`. |

Non exécuté : Lighthouse. Aucune mesure LCP/CLS chiffrée n'a été faite. Structurellement, le LCP est le H1 en texte (aucune image), les dimensions sont toutes réservées et il n'y a ni animation ni JS client propre à la page.

## Problèmes connus hors périmètre
- **Accessibilité de `/` (page d'accueil)** : axe signale `aria-prohibited-attr` et des contrastes dans `HomeNavbar` / `HomeFooter`, composants que je n'ai pas modifiés. Ce problème existait avant.
- **`FEATURE_LIST`** (`entity.ts`, JSON-LD de tout le site) annonce « états des lieux », « Factur-X et e-reporting ». Je ne l'ai pas modifié parce qu'il est partagé, mais ces promesses méritent d'être vérifiées.
- **Essai de 14 jours** : la date de fin n'est posée que si la création du client Stripe réussit (`register-actions.ts`). Si Stripe échoue, le compte reste en essai sans échéance.
- **Mesure de conversion** : les CTA ne sont pas tracés. `trackHomepageEvent` porte des noms d'événements propres à la page d'accueil, et les réutiliser ici fausserait ses statistiques.
- **Disque** : le build a d'abord échoué (`ENOSPC`, disque plein à cause d'autres projets). Sur instruction, les worktrees inutilisés `lokna-codex`, `lokna-gemini` et `lokna-codex-work` ont été supprimés. Leurs branches sont intactes.
