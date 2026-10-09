# 03 — Audit des Contenus Éditoriaux (119 Articles de Blog)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : 119 articles publiés sous `/blog/*`, gérés dans `src/data/articles.ts` et `articles-meta.ts`

---

## 1. Vue d'Ensemble du Corpus

- **Volume total :** 119 articles uniques indexés dans le sitemap.
- **Taille moyenne :** Entre 1 200 et 2 800 mots par article.
- **Architecture de stockage :**
  - Métadonnées légères dans [`src/data/articles-meta.ts`](file:///home/ubuntu/rent-ready/src/data/articles-meta.ts) (utilisées pour le build sans charger les corps).
  - Contenu markdown complet dans [`src/data/articles.ts`](file:///home/ubuntu/rent-ready/src/data/articles.ts) (631 Ko).
- **Rendu :** Prégénération statique avec révalidation toutes les heures (`revalidate = 3600`).
- **Précision juridique :**
  - Excellente rigueur globale : citations de la loi du 6 juillet 1989, loi ALUR, décrets 87-712/713 sur les charges récupérables.
  - Aucune allégation spéculative trouvée (0 mention de "Jeanbrun" ou "Factur-X" dans les articles).

---

## 2. Défaillance Majeure : Le Désert de Maillage Interne In-Content

L'analyse programmatique des 119 articles révèle une anomalie critique :

| Métrique de maillage interne | Valeur mesurée | Constat |
| :--- | :---: | :--- |
| **Articles avec liens internes in-content** | **12 / 119 (10,1 %)** | Seul 1 article sur 10 dirige le lecteur vers une autre page |
| **Articles SANS AUCUN lien interne in-content** | **107 / 119 (89,9 %)** | **90 % des articles sont des impasses documentaires** |
| **Nombre total de liens internes dans le texte** | **31 liens** | Ratio dérisoire de 0,26 lien par article en moyenne |

### Conséquences SEO et Business :
1. **Perte de PageRank interne :** L'autorité acquise par les articles bien positionnés ne diffuse pas vers les pages monétaires (`/pricing`, `/outils/calculateur-irl`, `/outils/modele-quittance-loyer-pdf`).
2. **Fuite d'utilisateurs qualifiés :** Un propriétaire qui lit un guide de 2 000 mots sur la révision IRL ne trouve aucun lien cliquable vers le calculateur interactif de révision IRL.

---

## 3. Défaillance de Conversion : Le CTA Éditorial Générique

Dans [`src/app/(marketing)/blog/[slug]/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/blog/[slug]/page.tsx) et [`src/lib/editorial-cta.ts`](file:///home/ubuntu/rent-ready/src/lib/editorial-cta.ts) :
- Les articles intègrent un token `[CTA : Anticipez les impayés et gérez automatiquement vos relances avec RentReady]`.
- Cependant, le code indique explicitement :
  > *« Mapping each article to the tool its subject deserves — IRL → the IRL calculator, bail → the right template — is NOT done here and is not claimed. »*
- Tous les articles renvoient vers le même bouton générique `/register` sans étape intermédiaire vers l'outil gratuit adapté au sujet traité.

---

## 4. Répartition Thématique des 119 Articles

| Thématique | Nombre d'articles | Outil ou Modèle RentReady à associer systématiquement |
| :--- | :---: | :--- |
| **Loyers & Encaissement** | 38 | `/outils/modele-quittance-loyer-pdf` & `/outils/lettre-relance-loyer` |
| **Baux & Contrats** | 32 | `/templates/bail-vide`, `/templates/bail-meuble`, `/outils/calculateur-preavis` |
| **Révision IRL** | 12 | `/outils/calculateur-irl` |
| **Fiscalité & Déclarations** | 18 | `/outils/simulateur-fiscalite-lmnp` & Export comptable |
| **Charges & Dépôts de garantie**| 19 | `/outils/calculateur-charges-locatives` & `/outils/calculateur-depot-garantie` |
