# Stratégie SEO de la homepage

| Rôle | Requête | Page |
| --- | --- | --- |
| Principale | **gestion locative en ligne** (pour particuliers / propriétaires) + marque Lokna | `/` |
| Secondaires (homepage) | suivi des loyers, quittance et reçu de paiement partiel, révision IRL, relance de loyer, gestion locative sans agence | `/` (sections et FAQ) |
| Déléguée | logiciel de gestion locative | `/gestion-locative`, avec le lien contextuel « logiciel de gestion locative » depuis la homepage |
| Déléguée | logiciel gestion locative gratuit | Réponse honnête dans la FAQ et liens vers `/outils` |
| Déléguée | quittance de loyer, modèle, calcul IRL, lettre de relance | `/quittances`, `/outils/generateur-quittance`, `/outils/calculateur-irl`, `/outils/lettre-relance-loyer` |
| Déléguée | gestion locative + ville | `/villes` puis `/gestion-locative/[ville]` |

## Mise en œuvre (HTML initial, rendu serveur)
- **Title :** « Gestion locative en ligne pour particuliers | Lokna » (51 car., `title.absolute`).
- **Description :** 156 car., capacités vérifiées dans le produit.
- **H1 unique :** « Gestion locative en ligne pour propriétaires particuliers — Vos loyers suivis. Vos quittances prêtes. ». La première partie, visible, porte la requête.
- **Structure :** 7 H2, 16 H3. Les textes des étapes, onglets et FAQ sont présents dans le HTML ; les onglets inactifs sont masqués par `hidden`, pas absents.
- **Données structurées :** Organization, WebSite, FAQPage (6 questions, dont « version gratuite » et « remplace-t-il une agence »).
- **Maillage :** 20 liens internes uniques en `<a href>`. Liens contextuels vers `/gestion-locative`, `/villes`, `/guides`, 4 outils et `/outils`, `/pricing`, `/features`, `/quittances`.
- **Contenu :** environ 1 500 mots rendus. Angle distinct de `/gestion-locative` : un mois raconté, les autres jours du mois, pour qui, comment commencer. Aucun paragraphe copié.
- **Inchangés :** canonical `https://lokna.fr`, robots `index, follow`, sitemap (non modifié).
