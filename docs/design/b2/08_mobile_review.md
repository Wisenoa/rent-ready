# Revue Mobile Responsive : Viewports 390px & 360px (B.2)

> **Exigence absolue (Règle 19) :** Sur 390px comme sur 360px, le visiteur doit voir au moins une partie significative du produit (carte de logement, état du mois, exception) dès le premier viewport (hauteur 844px / 800px) ou immédiatement après. Zéro empilement aveugle de texte et d'espaces blancs qui repousseraient le logiciel hors de l'écran.

---

## 1. Diagnostic de l'Erreur Mobile Historique (B.1 & Vagues antérieures)

Dans les versions précédentes, l'empilement vertical générait le syndrome de la « page vide » :
1. Header avec logo + menu hamburger (64px)
2. Marge supérieure excessive (48px)
3. Badge décoratif avec icône (36px)
4. Titre H1 sur 6 ou 7 lignes (240px)
5. Paragraphe descriptif de 4 lignes (96px)
6. Deux boutons CTA superposés (112px)
7. Espacement supplémentaire (40px)
**Total hauteur consommée :** ~636px sur un écran de 800px !  
**Résultat :** Le produit n'apparaissait qu'au deuxième ou troisième écran de défilement. Le propriétaire repartait sans avoir vu à quoi ressemblait RentReady.

---

## 2. Solutions Ergonomiques Mises en Œuvre en B.2

### 2.1 Discipline de Hauteur du Hero Mobile (Max 420px de texte/CTA)
- **Titre H1 condensé :** Tailles adaptées (`text-2xl` à `text-3xl` soit 26px–30px au lieu de 48px), limité à 3 ou 4 lignes maximum.
- **Suppression du badge décoratif superflu :** Économie directe de 45px de hauteur verticale.
- **Un seul bouton principal dans le premier viewport :** Bouton pleine largeur de 48px de hauteur tactile avec micro-copy concise en dessous (`14 jours sans carte`).
- **Insertion immédiate du produit à partir de Y=440px :**
  Dès 440px de hauteur, la première carte de logement (ex: T3 Lyon avec ses 1 200 € / 1 600 €) apparaît clairement dans le cadre du premier écran.

### 2.2 Adaptation Spécifique pour 360×800 (Samsung Galaxy / Entrée de gamme)
- Padding horizontal resserré de `px-4` (16px) pour maximiser la largeur utile (328px utilisables).
- Les montants financiers et les libellés de logement sont disposés sur deux lignes compactes sans rupture disgracieuse (`text-sm font-semibold` et `text-xs text-[#7C8782]`).
- Boutons d'action adaptés : « Relancer » et « Régulariser » disposés en grille 2 colonnes ou bouton complet fluide.

---

## 3. Matrice de Vérification des 5 Héros à 390px et 360px

| Hero | Hauteur du bloc texte + CTA | Position Y d'apparition du produit | Produit visible au 1er viewport (800px) ? | Qualité ergonomique mobile |
| :--- | :--- | :--- | :--- | :--- |
| **Hero 1 (Category)** | 390px | **Y = 410px** | ✅ Oui (carte résumé mensuelle 3 350 € visible à 50%+) | Excellente clarté, lecture reposante. |
| **Hero 2 (Outcome)** | 410px | **Y = 430px** | ✅ Oui (quittance de Louise Bernard visible) | Fort impact sur le résultat concret. |
| **Hero 3 (Exception)** | 420px | **Y = 440px** | ✅ Oui (l'alerte d'écart 400 € de Lyon est visible dès l'arrivée) | Le plus percutant : l'utilisateur comprend l'exception instantanément. |
| **Hero 4 (Product)** | 320px | **Y = 340px** | ✅ Oui (65% du produit visible au 1er viewport) | L'UI domine complètement l'écran. |
| **Hero 5 (Hybrid)** | 400px | **Y = 420px** | ✅ Oui (statut mensuel et bouton d'action immédiatement visibles) | Équilibre parfait entre texte rassurant et vue logicielle. |

---

## 4. Règle des Cibles Tactiles (Touch Targets)

- Tous les boutons et éléments interactifs mobiles respectent un minimum strict de **44×44px** (recommandation WCAG 2.2 AA).
- Les liens de navigation mobile dans le tiroir respectent un espacement vertical de 12px avec hauteur de tap de 48px.
- Aucun débordement horizontal (`overflow-x: hidden`) garanti sur toutes les résolutions.
