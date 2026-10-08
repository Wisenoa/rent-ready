# DOCUMENT 09 — SYSTÈME DE CONTENU SEO & ENTONNOIR NARRATIF B.1
## La Chaîne « Article → Tool → Action → RentReady », Pages Villes & Balisage Structuré

---

### 1. La Chaîne d'Acquisition Intégrée : « Article $\rightarrow$ Tool $\rightarrow$ Action $\rightarrow$ RentReady »

Dans une stratégie de référencement naturel efficace, le contenu purement passif (un long article de 2 000 mots sans aucune interaction) génère un taux de rebond supérieur à 75%. À l'inverse, un outil isolé sans explications juridiques est mal indexé par les moteurs de recherche.

Le système B.1 matérialise une chaîne de conversion en 4 maillons indissociables :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. L'ARTICLE (Explique & Éduque)                                            │
│    Résout la requête du bailleur : cadre légal, dates limites, formules.    │
│    Typographie soignée, respiration éditoriale, citations du Code civil.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. LE TOOL (Permet d'agir immédiatement dans le corps de l'article)        │
│    Simulateur interactif intégré au cœur du texte (pas besoin de changer    │
│    d'onglet ou de télécharger un tableur).                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. L'ACTION (Produit un résultat tangible)                                  │
│    L'utilisateur saisit son loyer, calcule l'indice exact et obtient le     │
│    montant révisé avec le texte légal à notifier.                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. RENTREADY (Propose d'automatiser la suite logique)                       │
│    Passerelle contextuelle : enregistrement du bail, alerte 30 jours avant  │
│    la prochaine échéance, émission de l'avenant certifié.                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Typologie des Gabarits SEO dans le Système B.1

Le système B.1 prend en charge trois grands formats de pages de contenu organique :

#### A. Le Guide Pratique Long-Form (Exemple : `/guides/irl-2026`)
* **Hiérarchie :**  
  - En-tête éditorial avec date de dernière vérification juridique (*« Mis à jour le 5 octobre 2026 selon la publication INSEE »*) ;
  - Cartouche de synthèse rapide (*« En bref : que retenir en 3 points »*) ;
  - Corps de texte avec intertitres H2 et H3 clairs ;
  - Tableaux des indices historiques (T1 2022 à T2 2026) avec chiffres tabulaires ;
  - Encadré d'attention juridique sur l'interdiction de hausse pour les passoires thermiques (DPE F et G, loi Climat & Résilience) ;
  - Module FAQ structuré en accordéon accessible.

#### B. La Page Locale Programmatique (Exemple : `/gestion-locative/nantes`)
* **Spécificités territoriales :**  
  - Rappel du statut de zone tendue (arrêté préfectoral de Loire-Atlantique) ;
  - Loyer médian de marché constaté (`12,50 €/m²` à Nantes) ;
  - Démarches locales spécifiques (déclaration de mise en location éventuelle) ;
  - Outil de pointage local adapté.

#### C. Les Modèles de Documents & Décharges (Exemple : `/templates/quittance`)
* **Rigueur légale :**  
  - Prévisualisation nette du document conforme ;
  - Explication des mentions obligatoires imposées par l'Article 21 de la Loi du 6 juillet 1989 ;
  - Téléchargement direct ou automatisation via l'espace RentReady.

---

### 3. Bibliothèque de Composants Éditoriaux B.1

Pour éviter la monotonie des longs pavés de texte sans recourir à des artifices graphiques criards :
1. **L'Encadré de Citation Légale (`LegalCallout`) :**  
   Fond albâtre, filet minéral gauche de 3px en vert forêt d'atelier (`#1E3A2F`), typographie encre avec référence de l'article de loi en petit corps SemiBold.
2. **Le Cartouche de Synthèse (`KeyTakeaway`) :**  
   Fond calcaire adouci (`#ECEAE4`), liseré discret, liste à puces végétales, permettant au lecteur pressé de capter la règle en 15 secondes.
3. **Le Module Mini-Simulateur Inclusif (`InlineCalculator`) :**  
   Intégré au fil du texte entre deux sections H2 pour transformer la lecture en action concrète.
4. **L'Accordéon FAQ Ergonomique :**  
   Question en Plus Jakarta Sans 16px Medium, chevron interactif discret, réponse immédiate sans animation superflue.

---

### 4. Balisage Structuré Schema.org & Accessibilité des Robots

Chaque page SEO B.1 s'accompagne d'une architecture de métadonnées JSON-LD validée :
* `BreadcrumbList` : Fil d'Ariane navigable pour les moteurs de recherche ;
* `HowTo` : Découpage méthodique des étapes de révision de loyer ou d'édition de quittance pour affichage en *Rich Snippets* Google ;
* `WebApplication` : Déclaration de l'outil gratuit avec sa gratuité explicite (`offers: { price: "0" }`) ;
* `FAQPage` : Balisage des questions-réponses pour capturer la position zéro sur les requêtes d'intention informationnelle.
