# Contrôle qualité

## Revue visuelle
Captures : `captures/before/` (production) et `captures/after/` (build de production local), à 1440, 768, 390 et 360 px. `captures/story/` montre les 5 états de la section signature à 1440 et 390 px. Vidéos : `videos/`.

**Passe 1, corrigée :**
- étapes de l'histoire grisées par opacité, contraste insuffisant → couleurs AA et filet actif ;
- panneau collant trop haut sur mobile → mode compact ;
- tiret des onglets décalant le texte ;
- appel final non pleine largeur ;
- vide entre « avant/après » et « Un mois » ;
- H1 cassé en trois lignes.

**Passe 2, corrigée :**
- contraste des résumés d'onglets inactifs ;
- H1 trop large à 1440 px ;
- deux liens d'évitement, dont un vers une cible absente.

Débordement horizontal : 0 px aux quatre largeurs.

## Tests
| Contrôle | Résultat |
| --- | --- |
| `tsc --noEmit` | 0 erreur |
| `eslint` (dépôt) | 0 erreur, 13 avertissements dans des fichiers non modifiés |
| Vitest | 861 réussis, 256 ignorés (suites DB et HTML rendu sans serveur) |
| `next build` | OK. `/` statique, ISR 1 h, 3,75 kB de JS propre à la page (contre 5,95 kB avant) |
| Playwright `homepage.spec.ts` (12 tests) | Tous verts : message, chiffres du hero, histoire au scroll et aux boutons, onglets au clavier, tarifs, FAQ, liens, 360/390/768 px, mouvement réduit |
| `marketing.spec.ts` (6) | Verts, dont « homepage loads without JS errors » |
| axe (`accessibility.spec.ts`, pages publiques) | `/` vert. Seul échec : `/quittances` (contraste), page non modifiée et qui échoue aussi en production |

## Mesures Lighthouse 12.1
Build de production local, comparé à la production actuelle. Mobile = profil par défaut (4G lente simulée, CPU ×4) ; 3 passages chacun.

| | Avant (prod) | Après |
| --- | --- | --- |
| Performance mobile | 75 / 79 / 75 | 76 / 79 / 79 |
| LCP mobile | 4,2 s | 3,7 s |
| TBT mobile | 330 à 450 ms | 410 à 540 ms |
| CLS | 0 | 0 |
| Desktop (perf / LCP) | 100 / 0,7 s | 99 / 1,0 s |
| Accessibilité | 86 | 100 (après correction du lien d'évitement) |
| SEO / bonnes pratiques | 100 / 96 | 100 / 96 |

Les mesures de performance ont été prises avant le dernier ajustement de taille du H1, qui ne change que le CSS.

**Objectif LCP ≤ 2,5 s non atteint en mobile simulé.** L'élément LCP est le paragraphe du hero (texte, aucune image), peint à 0,5 s sans bridage réseau. Le temps restant vient du JS partagé du site (chunk de 414 Ko, contenant Sentry), déjà présent avant. INP non mesuré (pas de données terrain) ; le TBT sert d'indicateur.

## Limites
- **Pas de nouvelle image :** aucun outil de génération ni Codex dans cet environnement.
- **Données terrain :** pas de Lighthouse sur un serveur de production réel ni de mesure CrUX.
- **Pages connectées :** non testées, faute de base de données dans cet environnement.
