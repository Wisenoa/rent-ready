# Mouvement

Le CSS vit dans `src/components/marketing/home/home.module.css`. Aucune bibliothèque n'est ajoutée : framer-motion est présent dans le dépôt mais n'est pas utilisé ici.

| Moment | Ce qui bouge | Pourquoi | Durée |
| --- | --- | --- | --- |
| Hero, au chargement | Le panneau monte de 18 px et apparaît ; la barre « reçu » se remplit jusqu'à 83 % ; les trois lignes se posent l'une après l'autre. | Le mois prend vie. Le texte, le CTA et le LCP (le paragraphe) ne sont jamais animés. | 700 ms, barre 1100 ms (départ à 450 ms), lignes espacées de 110 ms |
| Un mois avec Lokna | Changement d'état du panneau : la barre glisse vers le nouveau pourcentage, les fonds de ligne passent au terracotta ou en sortent. L'étape lue prend sa couleur et un filet vertical. | Montrer le passage d'un état de paiement à l'autre. | 700 ms barre, 450 ms lignes, 400 ms étapes |
| Onglets | Le panneau apparaît en fondu en montant de 8 px ; un trait guide s'allonge devant l'onglet actif. | Confirmer le changement de vue. | 350 ms, 300 ms |
| Révélations au scroll | Photos, lignes avant/après et points « pour qui » apparaissent en montant de 28 px, espacés de 90 ms. | Accompagner la lecture. | 700 ms |
| CTA | La flèche avance de 2 px au survol. | Micro-retour d'interaction. | 150 ms |

## Garde-fous
- **Pas de contenu caché par défaut :** `Reveal` ne masque un bloc qu'après hydratation, et seulement s'il est sous la ligne de flottaison. Sans JS, ou si le bloc est déjà visible, rien n'est caché.
- **`prefers-reduced-motion: reduce` :** animations et transitions coupées, blocs révélés visibles, défilement vers une date instantané au lieu de fluide. C'est vérifié par Playwright (« with reduced motion, content is visible »).
- **Pas de layout shift :** l'animation passe par `transform` et `opacity`, les images sont dans des boîtes à ratio fixe. CLS mesuré à 0.
- **Rien d'infini :** aucune boucle et aucun détournement du scroll. La synchronisation de l'histoire passe par un `IntersectionObserver` sur une ligne de lecture, à mi-écran sur desktop et juste sous le panneau collant sur mobile.

Vidéos : `videos/story-desktop.webm` et `videos/story-mobile.webm`.
