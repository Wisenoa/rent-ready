# 04 — Audit des Pages Géographiques / Villes (200 URLs Programmatiques)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : 200 pages générées par les 4 familles de routes basées sur `src/data/cities.json`

---

## 1. Inventaire des 4 Familles Programmatiques

| Famille d'URL | Nombre d'URLs | Intention visée | Données locales utilisées |
| :--- | :---: | :--- | :--- |
| `/gestion-locative/[ville]` | 50 | « gestion locative [ville] » | Loyer moyen au m² (12 villes), zone tendue |
| `/bail/[ville]` | 50 | « bail de location [ville] » | Mentions loi Alur, encadrement des loyers |
| `/quittances/[ville]` | 50 | « quittance de loyer [ville] » | Texte national loi 1989 + nom de la ville |
| `/assurance-loyer-impaye/[ville]` | 50 | « assurance loyer impayé [ville] » | Taux indicatif de sinistralité local |

---

## 2. Constats & Risques SEO (Google Doorway Pages)

### Constat 1 : Données locales incomplètes (38 villes sans loyer moyen)
Dans [`src/app/(marketing)/gestion-locative/[ville]/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/gestion-locative/%5Bville%5D/page.tsx#L32-L45) :
- Le tableau `AVG_RENT_DATA` ne contient des statistiques que pour **12 villes** (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille, Rennes, Grenoble).
- Pour les 38 autres villes (ex: Saint-Étienne, Toulon, Angers, Brest, Amiens, etc.), les blocs statistiques sont vides ou génériques.

### Constat 2 : Risque Doorway Pages (Pages satellites)
Google définit les *doorway pages* comme des séries de pages ciblant des variations géographiques sans valeur ajoutée locale distincte.
- Pour `/quittances/[ville]` : La loi du 6 juillet 1989 (art. 21) régit les quittances de façon strictement nationale et uniforme. Une page « quittance de loyer Perpignan » n'a aucune règle juridique différente d'une page « quittance de loyer Reims ».
- Pour `/assurance-loyer-impaye/[ville]` : RentReady n'est pas courtier en assurance GLI locale.

### Constat 3 : Absence de maillage régional latéral
Les pages villes pointent toutes vers le hub racine national (`/gestion-locative`, `/bail`), mais aucune ne relie les villes d'une même région (ex: Paris ne renvoie pas vers Boulogne, Saint-Denis ou Versailles ; Lille ne renvoie pas vers Roubaix ou Tourcoing).

---

## 3. Recommandations Stratégiques

1. **Prioriser les villes sous encadrement effectif des loyers (Top 12) :**  
   Concentrer la valeur sur les villes où la réglementation locale est réellement spécifique (Paris, Lille, Lyon, Villeurbanne, Bordeaux, Montpellier) avec l'intégration des plafonds préfectoraux officiels.
2. **Ne créer aucune nouvelle famille de ville :**  
   Ne pas étendre ce format à d'autres intentions tant que la valeur ajoutée locale n'est pas prouvée.
3. **Mettre en place un maillage régional latéral :**  
   Ajouter sur chaque page ville un bloc de maillage contextuel reliant les communes voisines du même département ou région.
