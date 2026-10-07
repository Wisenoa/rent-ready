# Autopsie Visuelle Anti-AI — RentReady
**Mission :** De-stylization without de-branding  
**Surfaces auditées :** Dashboard (`/dashboard`), Property Home Base (`/properties/[id]`), Billing (`/billing`), Leases list (`/leases`), Lease detail (`/leases/[id]`), Lease creation (`/leases/new`), Primitives Design System.

---

## 1. Inventaire quantitatif des AI Design Tells actuels

| AI Design Tell (Marqueur d'IA) | Fréquence mesurée | Périmètre impacté | Diagnostic |
| :--- | :---: | :---: | :--- |
| **Encre noire quasi pure (`#151413`)** | **278** occurrences | 19 fichiers | Costume d'imprimerie / presse d'art appliqué à tous les textes, bordures et boutons. |
| **Filets & bordures architecturales (`border-[#151413]/...`)** | **104** occurrences | 18 fichiers | Béquille graphique créant un cloisonnement excessif et un aspect gravure. |
| **Fond papier chaud / crème (`#F8F6F0`, `#FAF8F3`, `#F2EFE9`)** | **83** occurrences | 16 fichiers | Métaphore du registre notarial / papier vergé. Fausse sophistication. |
| **Monospace omniprésent (`font-mono`)** | **37** occurrences | 11 fichiers | Utilisé pour signifier "comptabilité", "date d'arrêté" et "code source" sans besoin réel. |
| **Majuscules avec tracking espacé (`uppercase tracking-wider`)** | **35** occurrences | 13 fichiers | Marqueur par excellence de maquette Claude/GPT (eyebrows sur chaque bloc). |
| **Terracotta / orange brûlé (`#C2410C`)** | **25** occurrences | 13 fichiers | Choisi pour s'harmoniser avec le crème plutôt que pour encoder un statut d'action clair. |
| **Vert sombre "botanique" (`#166534`)** | **20** occurrences | 11 fichiers | Vert "comptable / quiet luxury" sur-utilisé pour le calme. |
| **Slogans & microcopy conceptuelle** | **18** occurrences | 9 fichiers | « Grand livre », « Journal des écritures », « Conditions du bail », « Silence visuel ». |
| **Serif éditoriale (`font-serif` / Newsreader)** | **16** occurrences | 9 fichiers | Titres de mois, titres de biens, en-têtes façon magazine littéraire. |
| **Angles vifs forcés (`rounded-none` / absence de radius)** | **5** occurrences | 5 fichiers | Posture rigide pour faire "logiciel sérieux". |

---

## 2. Autopsie Visuelle par Surface

### Surface 1 : Dashboard (`/dashboard`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **Titre du mois en Serif (`Newsreader`, 3xl-4xl)** | D. AI DESIGN TELL | Théâtralise la date comme un en-tête de gazette. Occupe un espace vertical massif sur mobile. | **REMOVE** → Passer en Sans-serif standard (`font-sans text-xl sm:text-2xl font-semibold text-foreground`). |
| **Eyebrow « MOIS EN COURS · ARRÊTÉ AU... »** | D. AI DESIGN TELL | Tic typographique IA pour donner une allure technique sans ajouter d'information utile. | **REMOVE** → Supprimer l'eyebrow ; la date actuelle suffit ou se place en sous-titre naturel. |
| **Fond d'écran global Warm Paper (`#F8F6F0`)** | D. AI DESIGN TELL | Costume de feuille de papier calque. L'utilisateur utilise un SaaS moderne, pas un livre relié. | **REMOVE** → Fond d'application neutre et propre (`#FBFBFA` ou variable standard `--background`). |
| **Grand Livre Synthèse (Attendus / Reçus / Solde)** | A. PRODUCT SIGNAL | Cœur informationnel de RentReady : triade financière mensuelle essentielle pour le bailleur. | **KEEP** → Conserver les 3 métriques et le pourcentage, mais en sans-serif tabulaire épuré. |
| **Chiffres financiers en Monospace pur** | C. DECORATIVE SIGNAL | Le mono donne un look de terminal bancaire des années 80. | **REDUCE** → Remplacer par sans-serif avec `tabular-nums font-semibold`. |
| **Bandeau situation « Tout est à jour » (Vert)** | B. BRAND SIGNAL | Expression de la sérénité : se rétracte et confirme que tout est en ordre sans fanfare. | **KEEP** → Conserver le principe de confirmation discrète, avec token de succès standard. |
| **Bandeau situation « X € restant à percevoir » (Orange)** | A. PRODUCT SIGNAL | Alerte financière immédiate avec montant exact et lien vers l'action. | **KEEP** → Conserver, mais alléger les 4 signaux cumulés (bordure, fond, dot, texte orange). |
| **Ligne de loyer RentRow — État Réglé (42px)** | B. BRAND SIGNAL | **SIGNATURE RENTREADY** : Rétraction mécanique à 42px quand payé, zéro distraction. | **KEEP** → Conserver la rétraction stricte ; supprimer le fond crème et la bordure encre. |
| **Ligne de loyer RentRow — État Partiel / Retard** | B. BRAND SIGNAL | **SIGNATURE RENTREADY** : Déploiement proportionné pour expliquer l'anomalie et proposer l'action. | **KEEP** → Conserver le déploiement et l'action contextuelle, simplifier l'emballage. |
| **Section Eyebrow « VOS LOGEMENTS (X) »** | D. AI DESIGN TELL | Petit label en capitales espacées au-dessus d'un titre standard. | **REMOVE** → Remplacer par un titre naturel : `Logements`. |
| **Boutons de circulation noire (`bg-[#151413]`)** | C. DECORATIVE SIGNAL | Contraste agressif noir d'encre cherchant un effet "galerie d'art". | **REDUCE** → Utiliser les styles interactifs standards de l'application. |

---

### Surface 2 : Lease Creation (`/leases/new` & `standalone-lease-form.tsx`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **En-tête de page « NOUVEAU CONTRAT » + Serif 4xl** | D. AI DESIGN TELL | Près de 200px de chrome inutile avant le premier champ sur mobile. | **REMOVE** → Supprimer l'eyebrow, titre compact `Créer un bail`, premier champ visible immédiatement. |
| **Section 1 Eyebrow « 1. CADRE DE LA LOCATION »** | D. AI DESIGN TELL | Cérémonial de formulaire Cerfa déguisé en édition d'art. | **REMOVE** → Titre de section sobre `1. Logement et locataire` ou simple séparation de flux. |
| **Labels de champs en Majuscules Espacées (`text-xs uppercase tracking-wider`)** | D. AI DESIGN TELL | Réduit la lisibilité des formulaires, donne un aspect rigide et artificiel. | **REMOVE** → Labels naturels en minuscules capitalisées (`text-sm font-medium text-foreground`). |
| **Cartouche global avec fond beige `#FAF8F3` et bordure noire** | C. DECORATIVE SIGNAL | Enferme le formulaire dans un grand rectangle opaque lourd. | **REMOVE** → Structure sur fond propre, cartes légères ou séparations douces. |
| **Calcul en direct Loyer + Charges = Total** | A. PRODUCT SIGNAL | Rassurance financière immédiate de ce qui sera réclamé au locataire. | **KEEP** → Conserver le calcul direct `Decimal` avec présentation sobre. |
| **Garde-fou légal Plafond Dépôt de garantie (Loi 1989)** | A. PRODUCT SIGNAL | Valeur ajoutée métier indiscutable : empêche une faute juridique du bailleur. | **KEEP** → Conserver avec son bouton d'ajustement en 1 clic. |
| **Progressive Disclosure IRL & Clauses** | A. PRODUCT SIGNAL | Évite d'encombrer le formulaire des clauses optionnelles. | **KEEP** → Conserver le volet replié par défaut pour l'indexation. |
| **Affichage des erreurs de validation sous les inputs** | A. PRODUCT SIGNAL | Nécessaire pour guider l'utilisateur en cas de saisie invalide. | **KEEP** → Conserver l'accessibilité native `role="alert"` et le message clair. |

---

### Surface 3 : Property Home Base (`/properties/[id]`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **Nom du bien en Serif 3xl (`font-serif`)** | D. AI DESIGN TELL | Traite le nom d'un studio étudiant comme le titre d'une revue littéraire. | **REMOVE** → Passer en Sans-serif solide (`text-2xl font-semibold tracking-tight`). |
| **Eyebrows et métadonnées en uppercase tracking** | D. AI DESIGN TELL | Éparpillement de micro-labels en capitales. | **REMOVE** → Typographie textuelle normale. |
| **Baromètre mensuel de situation (`PropertySituationBar`)** | A. PRODUCT SIGNAL | Donne instantanément l'état du mois pour ce bien : réglé vs exception. | **KEEP** → Conserver la ventilation nu + charges et l'action contextuelle ; alléger l'emballage. |
| **Registre des documents (`DocumentRegister`)** | A. PRODUCT SIGNAL | Remplacement efficace de la card soup par un tableau linéaire de 42px. | **KEEP** → Conserver le registre linéaire ; enlever le fond `#FAF8F3` et les filets d'encre lourds. |
| **Badges de statut à puces multiples** | C. DECORATIVE SIGNAL | Accumulation de badges pour le type, la surface, le nombre de pièces, l'occupation. | **REDUCE** → Regrouper les métadonnées techniques en texte secondaire sobre `Appartement · 42 m² · 2 pièces`. |
| **Historique des quittances réelles émises** | A. PRODUCT SIGNAL | Accès direct aux attestations réelles (Art. 21 loi 89). | **KEEP** → Conserver avec le bouton d'action direct. |

---

### Surface 4 : Billing (`/billing`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **Titre « Paiements & Quittances » en Serif 4xl** | D. AI DESIGN TELL | Titre démesuré avec sous-titre éditorial pompeux (« Grand livre des écritures... »). | **REMOVE** → Titre Sans-serif direct `Paiements et quittances` sans prose pompeuse. |
| **Eyebrow « TRÉSORERIE · MARS 2026 »** | D. AI DESIGN TELL | Marqueur récurrent de tableau de bord IA. | **REMOVE** → Supprimer l'eyebrow ; la période est déjà visible dans la synthèse. |
| **Synthèse de Trésorerie (Attendus / Reçus / Solde)** | A. PRODUCT SIGNAL | Lecture financière instantanée indispensable. | **KEEP** → Conserver la triade financière, la jauge et les compteurs de quittances/reçus. |
| **Tableau d'écritures du journal** | A. PRODUCT SIGNAL | Liste claire des transactions du mois avec locataire, bien, statut et quittance. | **KEEP** → Conserver le tableau desktop et la dégradation mobile, nettoyer les filets et contrastes. |
| **Bannière d'exception « Attention requise · Acompte perçu »** | B. BRAND SIGNAL | **SIGNATURE RENTREADY** : L'exception domine l'attention avec montant exact et reste dû. | **KEEP** → Conserver l'attention ciblée sans saturation criarde. |

---

### Surface 5 : Leases List (`/leases`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **Titre « Registre des Baux » en Serif 4xl** | D. AI DESIGN TELL | Titre cérémonial rappelant les archives de notaire. | **REMOVE** → Titre Sans-serif naturel `Baux`. |
| **Eyebrow « CONTRATS LOCATIFS »** | D. AI DESIGN TELL | Redondant avec le titre et purement décoratif. | **REMOVE** → Supprimer. |
| **Tableau de baux linéaire** | A. PRODUCT SIGNAL | Permet de scanner le statut, le loyer HC, les provisions, le locataire et le dernier paiement. | **KEEP** → Conserver la table de registre sans le chrome crème/encre. |
| **Actions directes (« Voir le bail »)** | A. PRODUCT SIGNAL | Accès au détail du bail sans friction. | **KEEP** → Conserver. |

---

### Surface 6 : Lease Detail (`/leases/[id]`)

| ELEMENT | CATEGORY | WHY | DÉCISION |
| :--- | :---: | :--- | :--- |
| **Titre du bail avec typographie d'affiche** | D. AI DESIGN TELL | Disposition asymétrique cherchant à créer une mise en page d'article de presse. | **REMOVE** → Remplacer par une présentation fonctionnelle et hiérarchisée. |
| **Ruban des conditions financières** | A. PRODUCT SIGNAL | Récapitule loyer, charges, dépôt et statut de l'indexation IRL en un coup d'œil. | **KEEP** → Conserver le ruban mais en design épuré neutre. |
| **Grand livre des règlements du bail** | A. PRODUCT SIGNAL | Historique des 24 derniers loyers avec accès aux quittances correspondantes. | **KEEP** → Conserver l'historique complet. |

---

## 3. Synthèse des Suppressions & Conversions

| Type de choix esthétique | Règle appliquée dans le Pass Anti-AI |
| :--- | :--- |
| **Typographie** | 98%+ de l'interface en **Sans-serif (`Inter`)**. Suppression totale de `Newsreader` dans les écrans authentifiés. Le nom de la page et des biens redevient un instrument d'orientation, pas une pièce de musée. |
| **Monospace** | Réservé uniquement aux montants et soldes tabulaires (`tabular-nums`) pour aligner centimes et chiffres. Suppression du mono sur les dates, labels, badges et téléphones. |
| **Eyebrows & Surtitres** | **PURGE TOTALE**. Tous les faux surtitres en capitales espacées sont supprimés. Les titres se suffisent à eux-mêmes. |
| **Couleur de fond** | Abandon complet du crème / papier chaud (`#F8F6F0`, `#FAF8F3`). Adoption d'une base neutre, moderne, propre et lumineuse (`#FAFAFA` / `#FFFFFF`). Aucune métaphore de papeterie. |
| **Couleurs d'accent** | Neutralisation du terracotta esthétique (`#C2410C`) et du vert sombre stylisé. Utilisation exclusive de couleurs sémantiques universelles : succès sobre, attention mesurée, neutre pour le calme. |
| **Bordures & Filets** | Suppression de 50%+ des traits de séparation. Remplacement par le regroupement logique, le blanc tournant et des délimitations très discrètes. |
| **Formulaire Mobile** | Réduction massive de la hauteur de l'en-tête (gain estimé : >150px) pour que le premier champ apparaisse immédiatement au-dessus de la ligne de flottaison sur 390px. |
