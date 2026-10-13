# Contrôle qualité V2.1

## Captures
- `captures/before/` : V2 (`e762da9`, build de production local).
- `captures/after/` : V2.1 (build de production local).
- Les deux à 1440, 768, 390 et 360 px : premier écran (4,5 s après le chargement, la démo du hero achevée), page complète et sections.
- `captures/hero/` : séquence du hero ; `captures/story/` : 5 états de « Un mois avec Lokna » à 1440 et 390 px.
- Vidéos : `videos/`.
- Les captures pleine page montrent les panneaux sticky à leur position de fin de défilement, d'où un espace vide au-dessus d'eux. C'est un artefact de capture ; les images en viewport (`story/`) montrent le rendu réel.

## Revue visuelle (2 passes)
1. **Le hero ne se jouait jamais quand l'hydratation était lente** (règle « rembobiner seulement avant 1,4 s »). → La démo part de l'état affiché et joue en avant.
2. **Coches absentes après des changements d'état rapides** (montage/démontage avec `AnimatePresence`). → Coche et pastille en couches CSS superposées.
3. **Sur téléphone, l'étape lue passait sous le panneau collant.** → Ligne de lecture à 78 % de l'écran sur téléphone.
4. **« Reste dû 0,00 € » restait en terracotta.** → Passe au vert quand le solde est nul.
5. **La bannière cookies devenait l'élément LCP** (à 4,2–5,8 s sur un téléphone bridé, en V2 comme en V2.1). → Phrase du H1 en un seul bloc, qui reste le plus grand élément.

Débordement horizontal : 0 px aux 4 largeurs.

## Tests
| Contrôle | Résultat |
| --- | --- |
| `tsc --noEmit` | 0 erreur |
| `eslint` (dépôt) | 0 erreur, 13 avertissements dans des fichiers non modifiés |
| Vitest | 861 réussis, 256 ignorés (DB et HTML rendu sans serveur) |
| `next build` | OK. `/` statique, ISR 1 h. JS de la page 3,75 → 12,8 kB ; premier chargement de `/` 204 → 157 kB ; JS partagé 185 → 106 kB |
| Playwright sur build de prod (homepage, marketing, axe, `/gestion-locative`) | 40 réussis, 1 échec : axe sur `/quittances` (contraste `#79716b`), page non modifiée et qui échoue aussi sur lokna.fr |
| SEO du HTML rendu | Title, description (156), canonical, robots, 1 H1, 7 H2, 16 H3, JSON-LD Organization + WebSite + FAQPage (6), 20 liens internes |

## Performance (Lighthouse 12.1, build de production local, V2 et V2.1 mesurées dans la même session)

| | V2 | V2.1 |
| --- | --- | --- |
| Mobile, simulé (profil par défaut), 3 derniers passages | perf 78 à 79 · LCP 3,7 s · TBT 420 à 440 ms | perf 81 à 86 · LCP 2,9 à 3,0 s · TBT 340 à 500 ms |
| Desktop | perf 99 · LCP 1,0 s | perf 100 · LCP 0,8 s |
| Poids total | 679 Ko | 485 Ko |
| Accessibilité / Bonnes pratiques / SEO | 100 / 96 / 100 | 100 / 100 / 100 |
| LCP observé, téléphone bridé (CPU ×4, 1,6 Mb/s, 150 ms, Playwright) | 5,2 s (bannière cookies) | **1,36 s** (H1) |
| CLS observé, même bridage | **0,227** (changement de police) | **0,001** |

**LCP ≤ 2,5 s :**
- **Atteint en mesure bridée :** 1,36 s.
- **Pas atteint dans l'estimation simulée de Lighthouse :** 2,9 à 3,0 s. Dans cette trace, le LCP observé coïncide avec le FCP (0,19 s) ; l'estimation simulée ajoute tout le JS demandé avant ce moment (React et Next, environ 190 Ko compressés).

**INP :** non mesuré (pas de données terrain). TBT utilisé comme indicateur.

**Lighthouse en bridage appliqué :** les mesures ont été trop instables pour être retenues (un passage à 20 s).

## Limites
- **Données de recherche :** aucun volume de recherche ni de données Search Console.
- **Inclinaison du panneau au scroll :** sans effet sur Firefox et Safari anciens (`animation-timeline`), le panneau reste à plat.
- **Dépliement animé de la FAQ :** Chrome uniquement.
- **Sentry :** quand un DSN sera défini, il s'initialisera juste après le chargement de la page au lieu d'avant ; une erreur survenue dans les toutes premières millisecondes peut lui échapper.
- **Police Inter (`display: optional`) :** sur une première visite très lente, la police de secours ajustée reste affichée pour cette visite.
