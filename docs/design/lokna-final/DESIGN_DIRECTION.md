# Direction : le registre du mois

## L'idée
Un propriétaire ne pense pas en « fonctionnalités ». Il pense en mois : qui a payé, qui n'a pas payé, quelle quittance envoyer. Le produit lui-même est construit ainsi (`MonthHeader`, grand livre, rétraction des lignes réglées, cf. `docs/design/BPLUS_V21_SYSTEM.md`) avec ce principe : *ce qui va bien se tait, l'exception demande votre attention*.

La page reprend donc le langage visuel de ce que le bailleur manipule réellement, à savoir **le registre et les documents**, au lieu d'un langage de template SaaS.

## Choix assumés
- **Les preuves restent des artefacts du métier** : le registre d'octobre (preuve produit) et la paire quittance / reçu partiel (explication d'une règle), en HTML, nets et lisibles sur mobile.
- **Trois photographies de Codex V2 pour la chaleur** (ajout du 13 octobre, après validation de la base). Aucune n'est dans le hero, pour que le registre reste visible dès le premier écran. Elles alternent avec le texte : intérieur à droite du cycle, clés et dossier sous le texte des documents (desktop seulement), porte sur cour à gauche des fonctionnalités, collante à côté de la liste. Angles droits et aucune légende décorative, pour rester dans la logique des filets.
- **Le serif a une fonction.** Newsreader est réservé à ce qui relève du document : « Octobre 2026 », « Quittance de loyer ». C'est Lokna qui parle en sans (Inter), comme sur la page d'accueil validée.
- **Des filets, pas de cartes.** Filet épais en tête de registre, filets fins entre les lignes, double filet sous le total, comme dans un livre de comptes. Les seules « cartes » sont les deux feuilles de papier, parce que ce sont des feuilles.
- **Couleur sémantique et rare.** Le vert forêt pour la marque et les actions. Le sauge pour « réglé ». Une seule couleur chaude, terracotta `#A63F17`, réservée à l'exception (paiement partiel). Elle n'apparaît nulle part ailleurs.
- **Renvois numérotés.** Les annotations ①②③ sous le registre expliquent le produit comme on annote un document, au lieu d'une grille de trois bénéfices.
- **Boutons rectangulaires** (`rounded-md`), cohérents avec la page d'accueil. Pas de pilules, pas d'ombres, pas de dégradés, pas de badges, pas d'icônes décoratives.

## Parcours (chaque section répond à une question)
| Section | Question du visiteur |
| --- | --- |
| H1 + registre d'octobre | Qu'est-ce que c'est, pour qui, à quoi ça ressemble ? |
| « Vous décrivez la location une fois » (`#cycle-mensuel`) | Que dois-je saisir, que fait-il seul ? Pourquoi pas mon tableur ? |
| Quittance ou reçu | Que se passe-t-il si mon locataire paie en partie ? |
| Le reste de la gestion (`#fonctionnalites`) | Et les relances, l'IRL, le locataire ? |
| Questions fréquentes | Mes objections restantes. |
| Commencez par un logement (`#tarifs`) | Combien ça coûte, comment commencer ? |
| Outils et villes (`#simulateurs`) | Index : outils gratuits et pages locales (SEO). |

Supprimé par rapport aux versions précédentes : barre de confiance, comparatif agence, section « patrimoine », grille de 8 fonctionnalités, tableau de tarifs à cartes, comparatif tableur séparé (son idée est intégrée au paragraphe du cycle).

## Texte
H1 : **« La gestion locative, mois par mois, sans tableur. »** Le mot-clé est en tête, l'idée de la page est dans « mois par mois » et la promesse vérifiable dans « sans tableur ». Aucun superlatif, aucun chiffre non sourcé. L'action principale partout : « Commencer l'essai gratuit » → `/register`.
