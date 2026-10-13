# Mouvement V2.1

**Bibliothèque :** Motion for React (`framer-motion` 12, déjà présente dans le projet) via `LazyMotion` en mode `strict` avec les fonctionnalités `domMax` chargées après l'hydratation (`MotionRoot`).
**Règle d'accessibilité :** `MotionConfig reducedMotion="user"`. Toutes les animations CSS sont coupées sous `prefers-reduced-motion`.
**Propriétés animées :** uniquement `transform`, `opacity`, `clip-path` et `filter`.

| Moment | Mouvement | Technique | Durées |
| --- | --- | --- | --- |
| Hero, chargement | Les lignes de fond du registre glissent en place ; la phrase du H1 monte et se met au point (transformation + flou, jamais invisible) ; le panneau entre en profondeur (perspective, `rotateX` 16° → 0) ; la barre « reçu » se remplit ; les lignes du suivi se posent l'une après l'autre. | CSS, fonctionne avant l'hydratation et sans JS | 1,4 s / 0,72 s / 0,95 s / 1,1 s / 110 ms d'écart |
| Hero, en direct | Une fois le panneau visible : 1,5 s sur « Paiement partiel », puis le solde de 350 € arrive. Les montants comptent (Reçu → 2 070 €, Reste dû → 0 €), la ligne d'Emma reçoit sa coche qui se dessine, son statut glisse vers « Réglé le 18 oct. · Quittance prête », l'événement défile en pied de panneau, la barre atteint 100 % et « prêtes. » se souligne. Boutons Pause / Reprendre / « Rejouer le mois » (rejoue depuis le 1er). | `HeroDemo` (minuteries), `Amount` (rAF), `AnimatePresence`, coche en CSS | environ 2 s |
| Hero, sortie | Le panneau s'incline vers l'arrière en quittant l'écran (desktop). | `animation-timeline: view()` | lié au défilement |
| Un mois avec Lokna | Progression de la liste des étapes sur une ligne de lecture (60 % de la hauteur sur desktop, 78 % sur téléphone) → état du panneau. Filet de progression amorti par ressort, pastille de date qui glisse (`layoutId`), montants qui comptent, coche, bascule terracotta / vert, document (quittance ou reçu de paiement partiel) qui sort de sous le panneau. | `useScroll`, `useMotionValueEvent`, `useSpring`, `layoutId`, `AnimatePresence` | ressort 140/28 |
| Fonctionnalités | Indicateur d'onglet qui glisse ; le panneau affiché monte (18 px, échelle 0,985 → 1) ; ses lignes se posent l'une après l'autre. | `layoutId`, `animate`, CSS en cascade | 0,45 s ; 70 ms d'écart |
| Photographies | Ouverture en obturateur (`clip-path` 16 % → 0) avec l'image qui se pose (échelle 1,14 → 1), puis parallaxe de ±5 %. | `useScroll` + `useTransform` ; `IntersectionObserver` | 1,1 s / 1,4 s |
| Micro-interactions | Bouton : ombre au survol, pression à 0,98, flèche qui avance de 4 px. Liens : soulignement qui s'épaissit. Navigation : trait qui se dessine de gauche à droite. FAQ : réponse qui se déplie (`::details-content`, Chrome). | CSS | 200 à 320 ms |

## Garde-fous
- **Contenu jamais conditionné par une animation :** le serveur rend chaque état. Les révélations ne masquent un bloc qu'après hydratation et seulement s'il est sous la ligne de flottaison.
- **Pas de rembobinage visible :** le hero joue en avant à partir de ce qui est déjà affiché ; seul « Rejouer » revient au 1er.
- **Défilement natif :** pas de détournement ni de section à hauteur artificielle. La section signature est plus courte qu'en V2 (étapes de 150 px environ au lieu de 60 à 78 % de la hauteur d'écran).
- **Aucune boucle infinie.**
- **Animation du hero :** elle dure environ 2 s ; on peut la mettre en pause et la rejouer.
- **CLS :** 0,001 mesuré avec bridage du réseau et du processeur (contre 0,227 en V2).

Vidéos : `videos/homepage-v2-1-desktop.webm`, `videos/homepage-v2-1-mobile.webm`. Images : `captures/hero/` (séquence du hero), `captures/story/` (5 états).
