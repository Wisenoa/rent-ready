# Revue des versions existantes

Examiné le 13 octobre 2026 : production (`lokna.fr/gestion-locative`, code de `43bc68d`), Gemini (`52d81a1`, sur `master`), Codex V2 (`81b011f`) et Codex V3 (`5c575ea`). J'ai lu les captures desktop et mobile ainsi que le code de chaque version, puis j'ai vérifié chaque promesse dans le produit.

## Production
- **Fonctionne :** un texte honnête et précis (« qui doit payer, qui a payé, ce qui reste dû »), des réponses solides en FAQ et un maillage complet vers les 50 villes.
- **Artificiel ou faible :** boutons bleus hors marque, aucune preuve que le logiciel existe, un annuaire de villes au milieu du parcours de conversion.

## Gemini
- **Fonctionne :** une démonstration concrète du mois locatif, avec un paiement partiel, une relance et un reçu d'acompte. C'est la meilleure idée de produit du challenge.
- **Artificiel :** 11 sections, des badges partout (« Loi 1989 », « Temps réel »…), des grilles de cartes avec icônes, un widget flottant sur une photo et une façade haussmannienne « patrimoine » sans rapport avec un bailleur de deux studios.
- **Faux ou invérifiable :** comparatif d'agences « 7 à 10 % », « coffre-fort », « export 2044 / LMNP », « modèles de baux et états des lieux », « automatique au centime près ». Rien de tout cela n'est démontré dans le code.

## Codex V2
- **Fonctionne :** la respiration, la retenue et un texte juste sur le paiement partiel (« un paiement partiel garde son reçu et son solde dû »).
- **Artificiel :** des photos d'intérieurs de luxe générées par IA (parquet, fer forgé, cour pavée), des coins arrondis asymétriques, des surtitres en capitales espacées au-dessus de chaque titre serif.
- **Manque :** on ne voit jamais le logiciel. Les bénéfices restent abstraits.

## Codex V3
- **Fonctionne :** de vraies captures du produit, un scénario chiffré (3 logements, 900 € manquants) et des montants calculés avec `settlePeriodPayments`. C'est une bonne discipline.
- **Artificiel :** la capture flotte sur une photo de luxe (le cliché « dashboard sur photo ») et les captures sont illisibles à taille réelle, surtout sur mobile. Les onglets n'apportent pas d'information supplémentaire.
- **Bilan :** V3 a ajouté la preuve sous forme d'image décorative. C'est pour cela qu'elle paraît plus générique que V2.

## Problèmes communs
1. La photographie sert d'ambiance de standing, pas de preuve. Aucune image ne montre ce que vit un petit bailleur.
2. Les preuves produit sont soit simulées et interactives (Gemini), soit des images trop petites (V3). Aucune n'est un contenu lisible en tant que tel.
3. Les accumulations : surtitres, badges, cartes, sections.
4. La navigation partagée affiche un bouton indigo (`SmartHeaderCta`), reste de l'ancienne marque, sur toutes les versions.

## À garder
- Le scénario « 3 logements, un paiement incomplet » (Gemini, V3), calculé par la vraie règle (V3).
- La distinction quittance / reçu partiel comme argument central (V2).
- Le texte et la FAQ de production, réécrits mais aussi exacts.
- Le maillage vers les villes et les outils.
