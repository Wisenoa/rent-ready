# V3 — décisions de design

## Direction retenue

La V3 conserve le crème, le vert forêt, Newsreader, les photographies immobilières et les compositions éditoriales de la V2. La nouveauté principale est la présence du véritable logiciel dès le hero, puis une visite guidée de deux vues complémentaires. Les appréciations du challenge ne sont pas utilisées comme des mesures de conversion.

Le H1 devient « Votre gestion locative, en clair. » Il nomme l’usage immédiatement. Le sous-titre précise les logements, locataires, baux, paiements manquants et quittances. Le CTA principal mène à l’inscription ; l’action secondaire permet de voir le suivi avant de s’inscrire. La durée « 14 jours » a été retirée de cette page après découverte de sa dépendance à l’initialisation Stripe ; l’inscription sans carte a été réellement vérifiée.

## Composition

- **Hero :** photographie immobilière en arrière-plan et capture réelle du suivi, dans un cadre sobre. La capture desktop provient d’une fenêtre produit de 1100 px afin d’agrandir ses informations dans la composition. À moins de 1024 px, une véritable capture mobile remplace le desktop.
- **Parcours :** les six concepts logement → locataire → bail → loyer → paiement → document sont conservés, avec une explication plus courte.
- **Démonstration :** une section sauge présente le portefeuille fictif et permet de passer du retard aux quittances. Aucun bouton ne simule un paiement, une relance ou un téléchargement.
- **Fonctionnalités :** une composition asymétrique relie le dossier de location, les documents et la révision IRL. La photographie de cour reste principale ; le visuel clés/documents devient une petite ponctuation sur les grands écrans.
- **Comparatif :** trois tâches, deux workflows, aucune agence ni estimation de temps. Le mobile conserve les deux descriptions côte à côte sous chaque tâche.
- **Fin de parcours :** outils gratuits, FAQ, puis CTA final. Les villes restent accessibles dans une divulgation repliée.

Les idées retenues du brief Gemini sont la preuve produit dans le hero, la démonstration et la comparaison de workflows. La grille de huit fonctionnalités et le grand comparatif à trois colonnes n’ont pas été repris. Aucun emplacement Gemini en lecture seule n’a été fourni dans la mission V3 ; aucun fichier de son worktree n’a été consulté.

## Responsive et interaction

Les captures produit sont prises à une densité de 2 pixels par pixel CSS pour conserver la netteté du texte. `getImageProps` et `<picture>` permettent de choisir la capture mobile sans charger la capture desktop en parallèle. Les proportions sont réservées avant le chargement et les images hors hero sont différées. Référence : [Next.js 15 — art direction](https://nextjs.org/docs/15/app/api-reference/components/image#art-direction).

La visite guidée utilise deux onglets accessibles, le focus visible et les touches fléchées, Home et End. Le reste de la page reste un Server Component. Aucun carrousel automatique, animation d’entrée, vidéo ou dépendance n’est ajouté. Les interactions visuelles restent limitées aux couleurs des contrôles et à la petite rotation de l’icône FAQ conservée de la V2.

Le contrôle qualitatif du skill `anti-slop-design` a servi à revoir la clarté des actions, la typographie, la respiration, les interactions, l’accessibilité et le mobile. Ce contrôle interne n’est pas un score objectif de conversion.

## Images

Aucune nouvelle photographie n’a été générée pour satisfaire un quota. Les trois images originales de la V2 sont conservées. Les nouveaux assets sont exclusivement des captures réelles du produit, encodées en WebP sans perte puis servies par l’optimisation Next.js.

## Comparer les versions

| Largeur CSS | V2 | V3 |
| --- | --- | --- |
| 360 px | [Hero](captures/v2/hero-360.png) · [Page](captures/v2/page-360.png) | [Hero](captures/v3/hero-360.png) · [Page](captures/v3/page-360.png) |
| 390 px | [Hero](captures/v2/hero-390.png) · [Page](captures/v2/page-390.png) | [Hero](captures/v3/hero-390.png) · [Page](captures/v3/page-390.png) |
| 768 px | [Hero](captures/v2/hero-768.png) · [Page](captures/v2/page-768.png) | [Hero](captures/v3/hero-768.png) · [Page](captures/v3/page-768.png) |
| 1440 px | [Hero](captures/v2/hero-1440.png) · [Page](captures/v2/page-1440.png) | [Hero](captures/v3/hero-1440.png) · [Page](captures/v3/page-1440.png) |

Voir aussi les captures de démonstration, de quittances, de fonctionnalités et de comparatif dans `captures/v3/`.
