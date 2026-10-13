# 01 — Synthèse

**Audit du 13/10/2026 sur la production `7503d2e`.**
- **Code :** dépôt complet.
- **Crawl de production :** 431 URL, robots.txt respecté.
- **SERP observées :** outil de recherche de la session (moteur non Google). Aucune position Google n'est revendiquée.
- **Concurrents :** sitemaps publics de 10 sites.
- **Non disponibles :** volumes de recherche et données Search Console.

## 1. Où en est Lokna
- **Une base technique saine :** 417 URL au sitemap, toutes en 200 ; un H1 par page ; JSON-LD valide partout ; `index, follow` cohérent ; homepage et `/gestion-locative` sur des requêtes distinctes.
- **Un site très large pour sa taille, mais dilué :**
  - **48 % du sitemap = 200 pages ville** presque identiques : 0,3 à 0,4 % de texte propre à chaque page, similarité moyenne de 0,76 à 0,86 entre deux pages d'une même famille.
  - **Une même intention répartie sur 10 à 34 URL :** quittance 14 (+ 50 pages ville), relance/impayé 21, bail 34, IRL 13.
- **Des promesses que le produit ne tient pas :** synchronisation bancaire « Open Banking DSP2 » sur **109 pages** (aucun écran ne permet de connecter une banque) ; FAQ Pro de `/pricing` (OCR, Factur-X, relance automatique) ; deux obligations non prévues par la loi dans la FAQ du générateur de quittance. **C'est le premier risque**, pour la confiance comme pour le référencement des contenus de type YMYL (juridique et financier).
- **Défauts techniques ciblés :**
  - canonical de `/entretien` vers une route privée ;
  - 9 liens cassés dans le glossaire ;
  - 4 pages orphelines ;
  - 67 pages inaccessibles depuis la homepage (dont tous les comparatifs) ;
  - 7 maquettes `/design-preview` indexables ;
  - un doublon d'article.
- **Aucune conversion SEO n'est mesurable :** pas d'analytics persistant, pas d'événement d'inscription, données Search Console non partagées (la propriété existe, vérifiée par DNS).

## 2. Où sont les opportunités
1. **Les outils sont l'avantage le plus difficile à copier.** Lokna possède les règles métier réelles : paiement partiel → reçu, solde → quittance, IRL sourcé. Aucun des générateurs de quittance vus dans les SERP ne met en avant le paiement partiel (à confirmer en testant chacun).
2. **Consolider avant de produire.** Un cluster quittance avec une page forte vaut mieux que 14 pages qui se concurrencent.
3. **Mailler vers l'outil :** 6 articles sur 119 seulement renvoient vers un outil.

## 3. Ce que les concurrents font mieux
- **BailFacile :** une URL par document, très complète (1 500 à 3 200 mots) ; des pages ville uniquement quand une règle locale existe.
- **Manda et lokt :** des pages locales fondées sur des données réelles.
- **service-public.fr et PAP :** ils dominent l'IRL. Il faut les citer, pas les copier.

## 4. Décisions recommandées
| Question | Réponse |
| --- | --- |
| Page à améliorer en premier | `/outils/generateur-quittance` (refonte avec reçu de paiement partiel) |
| Outil à développer ensuite | Prorata de loyer (rapide), puis régularisation des charges (différenciant) |
| Cluster éditorial à attaquer | Quittances, puis relance/impayés, puis IRL |
| Problèmes techniques à corriger | Promesses non vérifiées, canonical de `/entretien`, liens du glossaire, `/design-preview`, pages inaccessibles |
| Contenus à consolider | Pages ville (sur données Search Console), puis clusters quittance, relance, bail, IRL, dépôt de garantie, charges |
| Liens internes à ajouter | Article → outil du cluster → fonctionnalité → `/register` ; hubs vers `/comparatif` et `/templates/lease` |

Le plan détaillé et les 10 premières tâches sont dans `10_ROADMAP_90_DAYS.md`. Chaque constat est relié à une preuve dans `evidence/` et dans `SEO_OPPORTUNITIES.csv`.
