# Audit de la homepage en production

Production au 13 octobre 2026, commit `fd946af`. Captures : `captures/before/` (1440, 768, 390 et 360 px).

## Ce qui fonctionne
- **Le bon principe produit :** « Tout ce qui va bien devient silencieux ». Il est fidèle au dashboard réel.
- **La distinction quittance / reçu de paiement partiel**, bien expliquée.
- **Un CTA clair et des tarifs exacts** (9 € et 15 €, tirés des plans Stripe).
- **Des données structurées valides :** Organization, WebSite et FAQPage.

## Défauts
| Thème | Constat |
| --- | --- |
| Première impression | Un H1 centré, une démo en carte blanche sous le titre, puis des sections centrées en cartes. Ça se lit comme un template, sans effet produit ni émotion. |
| Promesses non vérifiables | « Lokna rapproche chaque virement du loyer prévu » : aucune connexion bancaire n'existe dans l'interface. « Analyse de conformité des baux » (offre Pro) : la route API existe, mais aucun écran ne l'appelle. « Relances en 1 clic » et « Export CSV » sont présentés comme des avantages Pro, alors qu'aucune fonctionnalité n'est réservée à une formule. « Lokna vous prévient 30 jours avant » l'échéance IRL : la route cron existe, mais rien ne prouve qu'elle est planifiée. |
| Démo | La démo est interactive, mais son bouton « Régulariser les 400 € » simule une action de paiement. |
| Hiérarchie | Le texte courant fait 11 à 13 px, et une démo très dense tient dans 1000 px. |
| Mobile | La démo est tronquée (« Vire… », « 1… ») et l'étiquette « DÉMONSTRATION INTERACTIVE » passe à la ligne. |
| Maillage | Aucun lien vers `/gestion-locative`, `/villes`, `/features` ni `/blog`. Le pied de page compte 3 liens d'outils. |
| Accessibilité | Lighthouse a11y 86, et l'audit axe échoue (attributs ARIA interdits, contrastes `#7C8782`). |
| Performance mobile | Lighthouse (4G simulée) : score 75 à 79, LCP 4,2 s. |

## Ce qui est conservé
URL, métadonnées, données structurées, les 4 questions de la FAQ (figées par `homepage-b3-migration.test.ts`), le principe « l'exception demande votre attention », les événements d'analyse `homepage_*` et les tarifs tirés de `PLANS`.
