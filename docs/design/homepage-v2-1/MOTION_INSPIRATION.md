# Inspiration motion

Méthode : 10 sites ouverts dans Chromium (Playwright, 1280 × 800). Pour chacun, 3 images du chargement (0,25 s, 0,9 s, 2,2 s) et 5 positions de défilement, plus un relevé du DOM : éléments sticky, `animation-timeline`, `will-change`, `clip-path`, vidéos et canvas. Les pages Framer Gallery, Framer Awards et Framer Blog ont été lues, mais elles listent des sites sans décrire leurs techniques. Les références retenues viennent donc de l'observation directe.

| Référence | Technique observée | Ce que Lokna en retient |
| --- | --- | --- |
| [linear.app](https://linear.app) | Écran vide, puis le titre apparaît vers 0,9 s ; l'interface produit monte et s'éclaircit sous le titre. | Le hero met en scène le produit. Chez Lokna, le titre ne passe jamais par l'invisible (transformation + flou uniquement). |
| [attio.com](https://attio.com) | Titre qui passe du gris au noir ; liste latérale sticky (« Build pipeline… ») synchronisée au défilement, le panneau de droite change de vue. 6 éléments sticky. | Structure de « Un mois avec Lokna » : dates collantes et panneau synchronisé au scroll. |
| [mercury.com](https://mercury.com) | Photo du hero puis zoom sur l'écran au défilement ; accordéon sticky dont le panneau produit s'anime. | Inclinaison du panneau du hero à la sortie de l'écran (animation pilotée par le défilement, en CSS). |
| [framer.com](https://framer.com) | Saisie au clavier dans le champ du hero ; zoom de l'interface au défilement ; 75 éléments `will-change`. | Un événement produit qui se joue dans le hero (le paiement qui arrive). |
| [ramp.com](https://ramp.com) | Compteurs « agents at work today » qui défilent ; reçus qui s'assemblent dans le hero. | Montants qui comptent jusqu'à leur nouvelle valeur. |
| [stripe.com](https://stripe.com/fr) | Fond en canvas animé, cartes produit animées, `animation-timeline` utilisé. | Animation pilotée par le défilement en CSS natif, quand le navigateur la supporte. Dégradés refusés. |
| [qonto.com](https://qonto.com/fr) | Titre empilé (« Compte pro. / Financement. / Facturation électronique. »), vidéo produit en main. | Titre en deux phrases parallèles. |
| [pennylane.com](https://www.pennylane.com/fr) | Interface produit posée sur une photo ; mosaïque de cartes produit. | Rien de nouveau (c'est le cliché évité en V2). |
| [spotlight.i-d.co](https://spotlight.i-d.co/ellefanning) (Framer Award « Storytelling ») | Récit éditorial : images sticky, très grande typographie, défilement lissé par Lenis. | Rythme éditorial et révélation des photos au scroll. Pas de défilement détourné (Lenis refusé). |
| [panton.vitra.com](https://www.panton.vitra.com) (Framer Award « Animations ») | Page d'une seule hauteur d'écran, animation géométrique. | Hors sujet pour un SaaS ; noté pour mémoire. |

Documentation technique : [motion.dev — scroll animations](https://motion.dev/docs/react-scroll-animations), pour la distinction déclenché/lié au scroll, `useScroll({ target, offset })`, `useSpring` sur la progression, `ScrollTimeline` natif et `IntersectionObserver` mutualisé.

## Retenu
- **Récit sticky synchronisé au défilement** (Attio, Mercury).
- **Événement produit en direct dans le hero** (Framer, Ramp).
- **Chiffres qui comptent** (Ramp).
- **Inclinaison au scroll en CSS natif** (Stripe, Mercury).
- **Photo qui s'ouvre comme un obturateur, avec un léger parallaxe** (i-D).
- **Indicateurs d'onglet et de date qui glissent d'un élément à l'autre** (Linear, Attio).

## Refusé
Défilement lissé ou détourné, curseur personnalisé, boutons magnétiques, dégradés animés, vidéo en lecture automatique, logos clients.
