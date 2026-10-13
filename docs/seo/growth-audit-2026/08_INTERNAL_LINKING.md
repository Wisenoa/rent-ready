# 08 — Maillage interne

Source : graphe de liens du crawl (`evidence/crawl_pages.csv`, colonnes `internal_inlinks` et `contextual_inlinks`).
- **Lien contextuel :** lien situé dans `<main>`.
- **Lien de navigation :** lien de l'en-tête ou du pied de page.

## Constats
| Constat | Preuve |
| --- | --- |
| Le pied de page porte presque tout le maillage : `/guides/modele-bail`, `/guides/quittance-loyer` et `/outils/generateur-quittance` ont environ 395 liens entrants, mais seulement **3 à 7 contextuels** | `crawl_analysis.txt`, TOP linked |
| `/outils/calculateur-charges-locatives` : 396 liens entrants, **2 contextuels** | idem |
| La plupart des articles n'ont qu'**un lien entrant**, depuis `/blog` | LEAST linked |
| **67 pages inaccessibles depuis `/`** : tout `/assurance-loyer-impaye`, tout `/comparatif`, `/templates/lease/*` et 4 orphelines | DEPTH |
| 9 liens cassés et 8 liens vers des redirections, tous dans le glossaire | BROKEN, LINKS TO REDIRECTS |
| Les articles n'envoient presque pas vers les outils : 6 / 119 ont un lien contextuel vers un outil | `09_CONVERSION_STRATEGY.md` §1 |
| Les articles ne mentionnent jamais le produit : 0 / 119 lien contextuel vers `/gestion-locative`, 1 vers `/pricing`. Tous ont le même CTA « Créer un compte gratuit » | idem |
| `/` liste 20 liens internes (V2.1), dont `/gestion-locative` avec l'ancre « logiciel de gestion locative » | crawl `/` |

## Architecture proposée (parcours réels, routes existantes)

```
Article ou guide du cluster
  → outil du cluster (lien contextuel, là où le lecteur a besoin de calculer ou de produire le document)
    → fonctionnalité Lokna qui automatise la même chose
      → /register

Exemples :
/blog/loyer-impaye-que-faire-guide → /outils/lettre-relance-loyer → /features (relances en 3 tons) → /register
/guides/irl-2026                   → /outils/calculateur-irl      → /features (révision proposée puis validée) → /register
/quittances                        → /outils/generateur-quittance → /gestion-locative (quittance au paiement) → /register
```

## Règles
1. **Chaque page pilier** reçoit un lien contextuel de chacune de ses secondaires, avec une ancre descriptive (« calculer la révision IRL », pas « cliquez ici ») ; elle renvoie vers ses secondaires et vers son outil.
2. **Chaque outil** renvoie vers sa page pilier (« comprendre la règle ») et vers la fonctionnalité correspondante.
3. **Rendre accessibles :**
   - `/comparatif` depuis `/gestion-locative` et `/pricing` ;
   - `/templates/lease` depuis `/templates` et `/guides/modele-bail` ;
   - `/assurance-loyer-impaye` depuis le cluster impayés, si la page est conservée.
4. **Orphelines :**
   - `/templates/bail-professionnel`, `/templates/contrat-de-location` et `/templates/repartition-charges` : à lier depuis `/templates` ;
   - `/entretien` : à corriger (canonical vers une route privée), puis à rattacher à `/features` ou à consolider.
5. **Glossaire :** remplacer les 9 liens cassés et les 8 liens vers des redirections par les URL finales.
6. **Pied de page :** le garder court (hubs et légal). Le maillage vers les pages profondes doit être contextuel.
7. **Pas de liens artificiels :** un lien n'est ajouté que si la page cible répond à la question du paragraphe qui le porte.
