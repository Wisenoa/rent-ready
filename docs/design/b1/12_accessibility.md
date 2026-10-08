# DOCUMENT 12 — ACCESSIBILITÉ WCAG 2.2 & PERFORMANCE CORE WEB VITALS B.1
## Rigueur d'Inclusion Numérique, Navigation Clavier & Budget de Performance

---

### 1. Engagements d'Accessibilité Numérique (WCAG 2.2 Niveau AA / AAA)

Un logiciel de gestion financière et juridique ne peut exclure aucun utilisateur, quel que soit son âge, son acuité visuelle, sa motricité ou son matériel.  
Le système B.1 intègre dès sa conception les exigences suivantes :

#### A. Contraste Typographique & Visuel
* **Texte courant et données financières :** Ratio supérieur à **12.8:1** sur le fond calcaire et **14.1:1** sur blanc (Exigence AAA satisfaite).
* **Textes secondaires et métadonnées :** Ratio supérieur à **5.2:1** (Exigence AA largement dépassée).
* **États et Badges sémantiques :** Les contrastes texte/fond des pastilles sauge (`5.38:1`) et ambre (`4.68:1`) respectent le seuil obligatoire de 4.5:1 sans exception.

#### B. Indépendance Stricte envers la Couleur (Non-reliance on Color Alone)
Aucune information critique n'est communiquée exclusivement par une nuance chromatique :
* Un loyer réglé associe la couleur sauge, une icône coche `✓` et le mot littéral *« Réglé »*.
* Une anomalie associe la couleur ambre, un symbole d'attention, la mention explicite du solde restant dû (*« Reste 400,00 € »*) et un libellé d'action direct (*« Pointer »*).
* Un utilisateur achromate ou consultant son écran en plein soleil d'été comprend l'état sans ambiguïté.

#### C. Cibles Tactiles Mobiles (Touch Targets $\ge$ 44px)
Sur smartphone (390px et 360px), aucun élément cliquable ne mesure moins de **44px par 44px** de surface interactive effective, évitant tout faux clic lors de la manipulation à une main dans les transports en commun.

#### D. Navigation Intégrale au Clavier & Anneau de Focus Visible
* Chaque bouton, lien, champ de formulaire et ligne interactive est navigable séquentiellement via la touche `Tab`.
* L'anneau de focalisation (`:focus-visible`) utilise un double contour haute visibilité :  
  `outline: 2px solid #1E3A2F; outline-offset: 2px;`  
  garantissant un repérage immédiat sans conflit avec les bordures minérales de l'interface.

---

### 2. Sémantique Accessible pour Lecteurs d'Écran (ARIA & DOM)

* **Grand Livre & Tableaux :** Utilisation exclusive des éléments HTML sémantiques `<table>`, `<thead>`, `<tbody>`, `<th> scope="col"`, `<td>`.
* **Exceptions Déployables :** Les cartes d'anomalies portent l'attribut `aria-expanded="true"` ou `"false"` et un identifiant `aria-controls`.
* **Résultats des Simulateurs Gratuits :** La zone de calcul du nouveau loyer est dotée de l'attribut `aria-live="polite"` pour annoncer le montant révisé dès la modification d'un paramètre sans interrompre la lecture vocale en cours.

---

### 3. Budget de Performance & Core Web Vitals

La noblesse éditoriale de B.1 ne se fait jamais au détriment de la vitesse de chargement. Le système applique un budget technique strict :

| Indicateur Web Vital | Objectif B.1 | Moyens Techniques Mis en Œuvre |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | **$< 1.2\text{ s}$** | Zéro vidéo en arrière-plan, zéro image lourde non optimisée, rendu serveur natif (SSR) du hero HTML/CSS pur. |
| **CLS (Cumulative Layout Shift)** | **$< 0.02$** | Tailles et ratios d'aspect réservés pour tous les blocs de données ; dimensions fixes des conteneurs de formulaire pour éviter les sauts de page. |
| **INP (Interaction to Next Paint)** | **$< 80\text{ ms}$** | Zéro bibliothèque d'animation lourde (pas de Framer Motion sur les pages publiques si le CSS natif suffit) ; transitions gérées par accélération matérielle (`transform`, `opacity`). |
| **Poids des Typographies** | **$< 70\text{ ko}$** | Sous-ensemble (subset) Latin strict de Plus Jakarta Sans en formats WOFF2 optimisés (graisses 400, 500, 600) via `next/font`. |
