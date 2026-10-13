# 07 — Pages locales

## Inventaire
| Famille | URL | Template | Accessible depuis `/` ? | Liens entrants (médiane) |
| --- | --- | --- | --- | --- |
| `/gestion-locative/[ville]` | 50 | `src/app/(marketing)/gestion-locative/[ville]/page.tsx` | oui (profondeur 2) | 2 |
| `/bail/[ville]` | 50 | `.../bail/[ville]/page.tsx` | oui (profondeur 3) | 1 |
| `/quittances/[ville]` | 50 | `.../quittances/[ville]/page.tsx` | oui (profondeur 2) | 1 |
| `/assurance-loyer-impaye/[ville]` | 50 | `.../assurance-loyer-impaye/[ville]/page.tsx` | **non** (hub non lié) | 1 |
| **Total** | **200**, soit 48 % du sitemap | | | |

## Ce qui varie réellement
- **Les 5 champs de `src/data/cities.json` :** slug, nom, département, région, population.
- **Un paragraphe de contexte** choisi parmi 4 variantes selon la tranche de population (`getCityContext`).
- **Des loyers au m² pour certaines villes**, attribués à « CLAMEU/SeLoger 2025 » : source introuvable, mentionnée sur 36 pages.
- **Un indicateur « zone tendue »** et un lien de préfecture.

## Mesure de similarité
`evidence/sim.mjs` compare des séquences de 5 mots, après avoir masqué le nom de la ville, la région, le département et les nombres.

| Famille | Similarité moyenne entre deux pages | Minimum | Maximum | Part du texte propre à la page | Mots |
| --- | --- | --- | --- | --- | --- |
| gestion-locative | 0,76 | 0,41 | **1,00** | **0,3 %** | 861–1 161 |
| bail | 0,77 | 0,43 | 1,00 | 0,4 % | 875–1 080 |
| quittances | 0,79 | 0,47 | 1,00 | 0,4 % | 764–891 |
| assurance-loyer-impaye | **0,86** | 0,64 | 1,00 | 0,3 % | 894–1 027 |

Entre familles, pour une même ville (Lyon), la similarité ne dépasse pas 0,05 : les 4 templates sont différents. **À l'intérieur d'une famille, en revanche, les pages sont quasi identiques.**

## Problèmes de contenu
- **`/gestion-locative/[ville]` et `/quittances/[ville]` :** promesse « Connectez votre compte bancaire… Open Banking (DSP2). Lokna détecte automatiquement les virements… », alors qu'aucun écran ne permet de connecter une banque.
- **`/assurance-loyer-impaye/[ville]` :** « La GLI rembourse jusqu'à 90 % ». Lokna ne vend pas de GLI : la page parle d'un produit tiers sans source. En plus, les 50 pages partagent la même description.
- **14 pages `/quittances/[ville]` :** « pequeños ».

## Diagnostic
- **Risque de « doorway pages » élevé.** Même gabarit, même texte, seul le nom de ville change, et aucune donnée locale vérifiable ou utile.
- **Les intentions locales s'y prêtent mal :**
  - « gestion locative + ville » appelle des agences, or Lokna n'en est pas une ;
  - « quittance + ville » n'a pas de sens local, la règle est nationale ;
  - « bail + ville » n'a de sens que là où une règle locale s'applique (encadrement des loyers, permis de louer, zone tendue).
- **Ce que font les concurrents :** BailFacile n'a de pages ville utiles que lorsqu'il y a une règle locale (`/marseille/permis-de-louer-marseille`, `/toulouse/preavis-logement-toulouse`) ; Manda et lokt s'appuient sur des données de prix.

## Recommandation (rien n'est désindexé sans validation)
**Avant toute décision :** exporter de Search Console (accès requis) les impressions et clics des 12 derniers mois par URL locale.
- **Règle proposée :** garder et enrichir une page qui a des clics ou une règle locale réelle ; consolider les autres.

| Famille | Action proposée | Détail |
| --- | --- | --- |
| `/assurance-loyer-impaye/[ville]` | **Consolider** vers `/assurance-loyer-impaye` (301), puis retirer du sitemap | Similarité 0,86, hors produit, aucune page n'est accessible depuis `/` |
| `/quittances/[ville]` | **Consolider** vers `/quittances` (301) | Aucune variation légale locale ; corriger d'abord le mot espagnol si les pages restent en ligne pendant la transition |
| `/bail/[ville]` | **Garder uniquement les villes où une règle locale s'applique** (encadrement des loyers, permis de louer), réécrites avec la règle, l'arrêté préfectoral et sa date ; 301 des autres vers `/templates/bail-vide` | La liste des villes concernées est à établir à partir des arrêtés en vigueur, à vérifier à la rédaction |
| `/gestion-locative/[ville]` | **Réduire** aux villes qui ont des clics, réécrites avec un contenu local vérifié : zone tendue, encadrement, permis de louer, délai de préavis réduit, ADIL locale. Retirer les promesses bancaires partout tout de suite | Les autres en 301 vers `/gestion-locative` |
| Toutes | **Ne pas créer de nouvelles villes** | — |

Un sitemap passant de 417 à environ 230 URL n'est pas une perte s'il ne retire que des pages quasi identiques. Le suivi des impressions totales dans Search Console servira de garde-fou.
