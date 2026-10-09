# 08 — Architecture du Maillage Interne (Internal Link Graph)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : 430 URLs publiques, graphe de liens extrait dans `data/internal_links.csv`

---

## 1. Diagnostic Chiffré du Graphe Existant

L'extraction systématique du code markdown des 119 articles et des templates de pages démontre un sous-maillage sévère :

| Métrique | Valeur mesurée | Constat technique |
| :--- | :---: | :--- |
| **Nombre total d'articles** | 119 | Corpus éditorial substantiel (plus de 150 000 mots au total) |
| **Articles avec liens in-content** | **12 (10,1 %)** | Seule une minorité infime renvoie vers d'autres pages |
| **Articles sans aucun lien in-content** | **107 (89,9 %)** | **Impasse de crawl et de transmission d'autorité (PageRank)** |
| **Total des liens internes dans le texte** | **31 liens** | 0,26 lien par article en moyenne |
| **Pages villes avec liens régionaux transversaux** | **0 / 200 (0 %)** | Aucune connexion entre villes voisines (ex: Paris ↔ Boulogne) |

---

## 2. Structure Cible : Les 5 Topic Clusters RentReady

Pour transformer un ensemble de pages isolées en un réseau thématique cohérent et puissant, RentReady doit structurer son arborescence en 5 clusters sémantiques étanches et interconnectés :

```text
                                  HOMEPAGE
                                     │
   ┌───────────────┬─────────────────┼─────────────────┬────────────────┐
   ▼               ▼                 ▼                 ▼                ▼
[CLUSTER 1]    [CLUSTER 2]       [CLUSTER 3]       [CLUSTER 4]      [CLUSTER 5]
Quittances &   Révision IRL &    Baux & Entrée     Charges &        Fiscalité &
Encaissement   Indices INSEE     dans les lieux    Dépôt Garantie   Rentabilité
```

### Cluster 1 : Quittances & Encaissement des Loyers (Cœur Métier)
- **Pilier / Hub :** [`/gestion-locative`](file:///home/ubuntu/rent-ready/src/app/(marketing)/gestion-locative/page.tsx)
- **Outils de conversion :**
  - [`/outils/generateur-quittance`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/generateur-quittance/page.tsx)
  - [`/outils/modele-quittance-loyer-pdf`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/modele-quittance-loyer-pdf/page.tsx)
  - [`/outils/lettre-relance-loyer`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/lettre-relance-loyer/page.tsx)
- **Articles satellites (38 articles) :** Tous les articles abordant l'obligation de quittance, les impayés, les délais de paiement du loyer et les relances amiables.
- **Règle de maillage :** Chaque article de ce groupe doit inclure au minimum :
  - 1 lien contextuel vers le modèle/générateur de quittance.
  - 1 lien vers la lettre de relance (si sujet sur impayé).
  - 1 lien retour vers le hub `/gestion-locative`.

### Cluster 2 : Révision de Loyer & Indices INSEE
- **Pilier / Outil central :** [`/outils/calculateur-irl`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-irl/page.tsx)
- **Articles satellites (12 articles) :** Explications de l'indice de référence des loyers, dates de publication trimestrielles, clauses d'indexation dans le bail.
- **Règle de maillage :** Chaque mention de « calcul IRL » ou de « révision annuelle » renvoie directement avec l'ancre exacte vers `/outils/calculateur-irl`.

### Cluster 3 : Baux, Contrats & Entrée dans les Lieux
- **Pilier / Hub :** [`/bail`](file:///home/ubuntu/rent-ready/src/app/(marketing)/bail/page.tsx)
- **Templates & Outils :**
  - `/templates/bail-vide`, `/templates/bail-meuble`
  - [`/outils/calculateur-preavis`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-preavis/page.tsx)
  - [`/outils/checklist-etat-lieux`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/checklist-etat-lieux/page.tsx)
- **Articles satellites (32 articles) :** Réglementation ALUR, colocation, clauses résolutoires, préavis réduit en zone tendue.

### Cluster 4 : Charges Locatives & Dépôt de Garantie
- **Outils centraux :**
  - [`/outils/calculateur-charges-locatives`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-charges-locatives/page.tsx)
  - [`/outils/calculateur-depot-garantie`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-depot-garantie/page.tsx)
- **Articles satellites (19 articles) :** Décrets 87-712 et 87-713, régularisation annuelle, retenues sur caution, justificatifs de travaux.

### Cluster 5 : Fiscalité & Rentabilité de l'Investissement
- **Outils centraux :**
  - [`/outils/simulateur-fiscalite-lmnp`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/simulateur-fiscalite-lmnp/page.tsx)
  - [`/outils/calculateur-rendement`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-rendement/page.tsx)
- **Articles satellites (18 articles) :** Déclaration 2044, régime micro-foncier vs réel, amortissement LMNP, déduction des dépenses de gestion.

---

## 3. Plan d'Implémentation Technique

### Étape 1 : Amélioration du composant CTA éditorial (`src/lib/editorial-cta.ts`)
Au lieu de renvoyer systématiquement vers un fallback générique `/register`, mapper la catégorie de l'article avec l'outil gratuit idoine :
- Catégorie `loyers` → Encart interactif « Générer une quittance conforme » (`/outils/modele-quittance-loyer-pdf`).
- Catégorie `gestion` & `indices` → Encart « Simulez votre augmentation IRL » (`/outils/calculateur-irl`).
- Catégorie `baux` → Encart « Téléchargez le contrat type conforme ALUR » (`/templates/bail-vide`).

### Étape 2 : Bloc de maillage géographique latéral (`RelatedCities`)
Créer un composant réutilisable dans `src/app/(marketing)/gestion-locative/[ville]/page.tsx` affichant :
*« Gestion locative dans les villes à proximité : [Ville A], [Ville B], [Ville C] »* (ex: 5 communes du même département ou de la même zone d'encadrement).
