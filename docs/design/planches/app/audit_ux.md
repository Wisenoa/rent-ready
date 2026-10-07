# RentReady — Audit UI/UX & Architecture de l'Information
*Principal Product Designer / Staff UI-UX Designer & Senior Frontend Engineer*

---

## 0. Résumé exécutif & Constats fondamentaux

RentReady s'adresse aux propriétaires bailleurs indépendants français (1 à 10 logements). 
Le modèle mental du bailleur est limpide :
> **« Est-ce que tout va bien ce mois-ci ? »**  
> et, si non :  
> **« Qu'est-ce que je dois faire ? »**

L'audit approfondi mené en runtime réel (port 3344, résolutions Desktop 1440px, Laptop 1280px et Mobile 390px) révèle un produit au potentiel évident, mais lourdement pénalisé par :
1. **Une anxiété injustifiée à l'ouverture (Rollover Panic) :** Un bail démarré plus tôt dans l'année génère rétroactivement 10 à 12 lignes d'alertes écarlates (« 11 280 € en retard ! ») qui repoussent l'essentiel sous la ligne de flottaison.
2. **Une crise d'identité de l'Information Architecture :** Deux tableaux de bord concurrents dans la barre latérale (`/dashboard` et `/dashboard/owner`), et un écran `/billing` qui mélange le paiement du loyer par les locataires et la facturation SaaS Stripe (affichant un bandeau anxiogène « Abonnement résilié » au nouvel inscrit).
3. **Un Onboarding agressif et visuellement accidenté :** Modal auto-déclenché après 300ms, collision avec la bannière cookies et le toast, timer « 33% » fusionné dans la croix de fermeture (`33X`), et énumérations techniques brutes en anglais (`APARTMENT`, `UNFURNISHED`, `TRANSFER`).
4. **Le "Cimetière des zéros" à l'état vide :** Si l'utilisateur ferme le modal, il fait face à 4 cartes à zéro, un graphique vide avec « 0k » sur les axes, et aucune action évidente.

---

## 1. Screen Map (Cartographie des surfaces produit)

| Route | Rôle & Raison d'être | Utilisateur | Job Principal | Action Primaire | Actions Secondaires | Information Majeure | État Vide | Mobile (390px) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/dashboard` | Vue d'ensemble mensuelle & exceptions | Bailleur | Savoir si tout est payé ce mois-ci | Traiter les retards / Encaisser | Consulter KPIs, voir activités | Loyers attendus vs perçus, alertes retards | Graphiques vides, KPIs à 0, pas d'orientation | Périodes empilées, 100% scroll retards |
| `/dashboard/owner` | Vue macro patrimoine & rentabilité | Bailleur | Analyser la performance financière | Vue détaillée | Filtres temporels | Revenus, charges, faux calcul ROI 200k, "NOI" | Cartes à 0, ROI "—" | Cartes étirées, graphs coupés |
| `/properties` | Liste du parc immobilier | Bailleur | Voir ses biens et leur statut locatif | Ajouter un bien | Créer un bail, Modifier bien | Nom, type, adresse, locataire en place, loyer | Illustration "Aucun bien", bouton Assistant | Cartes 1 colonne, espace blanc résiduel |
| `/properties/[id]` | Fiche complète d'un logement (Home base) | Bailleur | Piloter tout ce qui concerne ce bien | Modifier le bien | Voir le bail, ajouter locataire | Bail actif, locataire, loyer, équipements | N/A (bien existant) | Vue tabulée ou empilée |
| `/tenants` | Répertoire des locataires | Bailleur | Gérer les contacts & dossiers locataires | Ajouter un locataire | Créer un bail, contacter | Nom, bien occupé, contact, statut de paiement | Illustration "Aucun locataire" | Cartes 1 colonne |
| `/tenants/[id]` | Fiche détaillée du locataire | Bailleur | Historique des paiements & contact | Modifier locataire | Inviter au portail, voir quittances | Coordonnées, bail en cours, historique loyers | Aucun historique si récent | 1 colonne, tableau scrollable |
| `/leases` | Liste des contrats de location | Bailleur | Suivre les baux actifs et échus | Créer un bail | Filtrer par statut | Bien, locataire, loyer HC, charges, statut | Tableau vide | Tableau compressé ou tronqué |
| `/leases/[id]` | Fiche de synthèse du contrat | Bailleur | Consulter les clauses financières et IRL | Modifier le bail | Enregistrer paiement, révision IRL | Loyer, charges, dépôt, historique paiements | N/A | Cartes KPIs empilées |
| `/leases/new` | Formulaire de création de bail | Bailleur | Enregistrer un nouveau bail | Créer le bail | Annuler | Bien, locataire, loyer, dates, mode de règlement | Redirection silencieuse si pas de bien | Formulaire très long, labels serrés |
| `/billing` | Suivi des encaissements & quittances | Bailleur | Pointer les loyers reçus et émettre reçus | Enregistrer un paiement | Marquer payé, télécharger quittance | Total encaissé, total en attente, tableau paiements | Bannière "Abonnement résilié", 0 quittance | Header tronqué, boutons superposés |
| `/expenses` | Suivi des charges déductibles | Bailleur | Saisir les dépenses d'entretien | Ajouter une dépense | Scanner facture (OCR) | Date, prestataire, catégorie, montant, bien | "Aucune dépense", CTA scan | Cartes KPIs 1 colonne, tableau compressé |
| `/maintenance` | Tickets d'intervention locataires | Bailleur | Répondre aux incidents techniques | Mettre à jour statut | Filtrer par statut | Titre incident, bien, locataire, priorité, statut | "Aucune demande de maintenance" | Badge et sélecteur OPEN tronqués |
| `/fiscal` | Simulateur d'optimisation fiscale | Bailleur | Comparer Micro-BIC, Réel et Jeanbrun | Lancer simulation | Exporter rapport | Paramètres financiers saisis manuellement | Formulaire pré-rempli avec valeurs d'exemple | 1 colonne, sliders compressés |
| `/settings/profile` | Profil légal du bailleur | Bailleur | Renseigner l'adresse pour les quittances | Enregistrer | Modifier téléphone | Nom, prénom, adresse légale bailleur | Champs vides | Formulaire fluide 1 colonne |

---

## 2. Scorecard UX /10 (Évaluation rigoureuse & mesurée)

| Dimension | Note | Observation & Justification factuelle |
| :--- | :---: | :--- |
| **Visual Design** | **4.5 / 10** | Contraste brutal entre la sidebar sombre navy (`oklch(0.20 0.04 260)`) et le body beige clair. Boutons d'action sombres trop lourds. |
| **Navigation** | **3.0 / 10** | Dédoublement aberrant `/dashboard` vs `/dashboard/owner`. `/billing` utilisé pour les loyers des locataires. Pas de fil d'Ariane. |
| **Information Architecture** | **3.5 / 10** | Éclatement artificiel de la relation Bien → Locataire → Bail en silos disjoints. Absence d'un vrai "Home Base" par logement. |
| **Dashboard** | **3.0 / 10** | Aucun calme : 10 lignes rouges d'arriérés au moindre bail rétroactif. Jargon financier américain inadapté ("NOI"). |
| **Onboarding** | **3.5 / 10** | Modal surgissant après 300ms, collision avec toast et bannière cookies, glitch `33X`, 6 champs demandés immédiatement. |
| **Property Management** | **4.5 / 10** | Cartes isolées dans un vide horizontal de 1000px sur grand écran. Boutons d'action imbriqués dans des liens `<a>`. |
| **Lease Management** | **4.0 / 10** | Énumérations brutes non traduites (`UNFURNISHED`, `TRANSFER`). Placeholders de date au format américain `mm/dd/yyyy`. |
| **Payments** | **3.5 / 10** | Masqué sous `/billing`. Bannière terrifiante "Abonnement résilié". Bouton "Marquer payé" répété sur chaque ligne. |
| **Documents** | **5.0 / 10** | Moteur PDF fonctionnel, mais pas de gestionnaire de documents centralisé. Quittances dispersées dans des tableaux. |
| **Forms** | **4.0 / 10** | Demande trop d'informations trop tôt (code postal, ville, type, pièces, surface, etc. en étape 1). Manque de defaults intelligents. |
| **Empty States** | **3.0 / 10** | Cimetière de zéros et graphiques vides affichant des axes "0k". Aucun guidage vers la première action à forte valeur. |
| **Error Handling** | **4.5 / 10** | Messages d'erreurs parfois en anglais ou issus directement des validateurs Zod sans reformulation métier. |
| **Mobile (390px)** | **3.0 / 10** | Cartes KPIs étirées sur 4 écrans de hauteur, collision textuelle dans le header `/billing`, tableau de transactions dégradé. |
| **Accessibility (a11y)** | **4.5 / 10** | Éléments interactifs imbriqués (`<button>` dans `<a>`), états financiers indiqués parfois uniquement par la couleur. |
| **Consistency** | **4.0 / 10** | Deux wizards d'onboarding concurrents (V1 et V2). Couleurs d'accent incohérentes (bleu 600, indigo 600, émeraude). |
| **Trust** | **4.0 / 10** | Estimation fictive de patrimoine à 200 000 € par logement. Bannière d'abonnement résilié sans raison. Jargon déconnecté. |

---

## 3. Top 10 UX Failures (Classées par gravité)

### 1. [UX-P0] La panique du saut de mois (« Rollover Panic »)
* **Screen :** `/dashboard`
* **Observation :** Dès qu'un bail actif a une date de début antérieure au mois en cours, `ensureRentPeriods` matérialise tous les mois impayés. Le tableau de bord affiche alors jusqu'à 12 énormes lignes rouges : *« 12 périodes en retard — 11 280,00 € à recouvrer »*.
* **Conséquence utilisateur :** Panique immédiate. Le propriétaire ne peut même pas voir si le mois en cours est réglé car la vue d'ensemble est noyée sous les faux arriérés.
* **Evidence :** Capture `06_dashboard_with_data_desktop_1440.png`.
* **Recommandation :** Prioriser la vue mensuelle : « Ce mois-ci (Octobre 2026) : 1/2 loyers encaissés ». Regrouper l'historique antérieur dans un bloc dédié « Régularisation antérieure » avec option 1-clic « Tout marquer à jour jusqu'à ce mois ».

### 2. [UX-P0] Schizophrénie de navigation : Double dashboard & `/billing` trompeur
* **Screen :** Navigation principale
* **Observation :** La sidebar propose à la fois « Tableau de bord » (`/dashboard`) et « Espace Propriétaire » (`/dashboard/owner`). De plus, le suivi des loyers est rangé sous `/billing`, qui affiche un bandeau rouge écarlate *« Abonnement résilié »*.
* **Conséquence utilisateur :** Perte de repères totale. L'utilisateur ne sait pas quel dashboard regarder, et prend peur en pensant que son compte RentReady est suspendu.
* **Evidence :** Captures `06_dashboard_with_data_desktop_1440.png`, `07_owner_dashboard_desktop_1440.png`, `15_billing_payments_desktop_1440.png`.
* **Recommandation :** Supprimer `/dashboard/owner` et rediriger vers un `/dashboard` unique et puissant. Rebaptiser la section loyers en « Loyers & Paiements » (`/loyers`) et isoler l'abonnement SaaS dans les paramètres.

### 3. [UX-P0] Collision visuelle et friction frontale à l'onboarding
* **Screen :** `/dashboard` (premier lancement)
* **Observation :** Un modal surgit 300ms après la création de compte, masquant l'écran, pendant qu'apparaissent un toast en bas à droite et un bandeau cookies géant au centre. En haut à droite du modal, le texte de progression `33%` est collé au bouton de fermeture, créant l'artefact `33X`. Le champ "Type de bien" affiche `APARTMENT`.
* **Conséquence utilisateur :** Sensation de bug et d'agression visuelle. L'utilisateur clique sur la croix pour fermer et se retrouve perdu.
* **Evidence :** Capture `04_dashboard_onboarding_modal_desktop.png`.
* **Recommandation :** Remplacer le pop-up agressif par un parcours d'activation intégré directement sur le dashboard, avec 3 champs clairs : Nom du bien, Adresse, Loyer attendu.

### 4. [UX-P1] Le « Cimetière des zéros » à l'état vide
* **Screen :** `/dashboard` (après fermeture du wizard)
* **Observation :** 4 cartes affichant "0", un graphique Recharts vide avec des repères "0k", et une carte "Activité récente" désespérément blanche.
* **Conséquence utilisateur :** Sensation de vide et d'abandon. Le propriétaire ne sait pas quelle action démarrer.
* **Evidence :** Capture `05_dashboard_empty_desktop.png`.
* **Recommandation :** Afficher un état vide proactif : « Bienvenue ! Ajoutez votre premier logement en 2 minutes pour automatiser vos quittances et suivre vos loyers » avec un CTA unique et rassurant.

### 5. [UX-P1] Énumérations techniques brutes et formats américains
* **Screen :** `/leases/new`, `/onboarding-wizard`, `/maintenance`
* **Observation :** Les menus déroulants et statuts affichent des valeurs de base de données non traduites : `APARTMENT`, `UNFURNISHED`, `TRANSFER`, `OPEN`, et les dates affichent le format américain `mm/dd/yyyy`.
* **Conséquence utilisateur :** Impression d'inachèvement et de manque de sérieux juridique.
* **Evidence :** Captures `14_lease_new_desktop_1440.png`, `17_maintenance_list_desktop_1440.png`.
* **Recommandation :** Remplacer toutes les énumérations par du français métier impeccable (« Appartement », « Location vide », « Virement bancaire », « Ouvert ») et forcer le format de date français `jj/mm/aaaa`.

### 6. [UX-P1] Métriques financières fictives et jargon corporate
* **Screen :** `/dashboard/owner`
* **Observation :** Le produit invente une valorisation patrimoniale en multipliant le nombre de biens par 200 000 €, calcule un ROI fictif de 2.3% et utilise l'acronyme corporate américain « NOI » (Net Operating Income).
* **Conséquence utilisateur :** Rupture immédiate de confiance. Un bailleur connaît le prix auquel il a acheté son bien.
* **Evidence :** Capture `07_owner_dashboard_desktop_1440.png`.
* **Recommandation :** Bannir toute invention de chiffre. Ne présenter que des données réelles et vérifiées (Loyers perçus, Dépenses réelles, Solde net).

### 7. [UX-P1] Dégradation sévère et empilement vertical sur Mobile (390px)
* **Screen :** Mobile sur `/dashboard` et `/billing`
* **Observation :** Les 4 cartes KPIs s'empilent verticalement, occupant 4 hauteurs d'écran avant de pouvoir voir le premier loyer. Dans `/billing`, le bouton « + Enregistrer un paiement » vient s'écraser contre le texte de description.
* **Conséquence utilisateur :** Impossible pour un bailleur nomade de vérifier ses loyers sur son smartphone en 5 secondes.
* **Evidence :** Captures `06_dashboard_with_data_mobile_390.png`, `15_billing_payments_mobile_390.png`.
* **Recommandation :** Grille compacte 2x2 pour les métriques mobiles, repositionnement fluide des boutons d'actions, passage en liste de cartes condensées plutôt qu'en tableau étiré.

### 8. [UX-P2] Éclatement des données : Absence du « Logement comme Home Base »
* **Screen :** `/properties`, `/tenants`, `/leases`, `/billing`
* **Observation :** Pour savoir ce qui se passe sur son « T2 Voltaire », le propriétaire doit ouvrir l'onglet Biens (adresse), puis Baux (loyer), puis Locataires (coordonnées), puis Paiements (quittances).
* **Conséquence utilisateur :** 4 transitions de pages pour gérer un seul appartement.
* **Evidence :** Cartographie des routes et composants actuels.
* **Recommandation :** Faire de la fiche bien (`/properties/[id]`) le centre névralgique de chaque logement : locataire actuel, bail, statut du loyer du mois, quittances récentes et maintenance réunis.

### 9. [UX-P2] Inflation d'actions secondaires et surcharge cognitive
* **Screen :** `/dashboard`, `/billing`
* **Observation :** Chaque ligne de retard présente deux gros boutons noirs côte à côte : `[Relancer]` et `[Encaisser ->]`. Sur 10 lignes, l'écran est pollué par 20 boutons noirs identiques sans aucune hiérarchie.
* **Conséquence utilisateur :** Fatigue visuelle, risque de clic erroné, absence de priorité guidée.
* **Evidence :** Capture `06_dashboard_with_data_desktop_1440.png`.
* **Recommandation :** 1 action principale par item critique, actions secondaires rangées dans un menu contextuel discret ou une modale dédiée.

### 10. [UX-P3] Violation HTML et piège d'accessibilité (Bouton dans un Lien)
* **Screen :** `/properties`
* **Observation :** La carte de propriété est englobée dans une balise `<Link href="...">`, mais contient en son en-tête `<PropertyActions>` qui rend des `<button>`.
* **Conséquence utilisateur :** Violation des standards HTML (`<a>` ne peut pas contenir `<button>`), comportements erratiques au clavier et avertissements d'hydratation console.
* **Evidence :** Fichier `PropertiesPageClient.tsx` lignes 110-135.
* **Recommandation :** Séparer le clic de navigation sur la carte et le menu d'actions secondaire indépendant.

---

## 4. Audit du Design System & Grammaire Proposée

### État actuel des tokens et composants
* **Palette :** Contraste artificiel entre la barre latérale dark navy (`oklch(0.20 0.04 260)`) et le fond beige chaud (`oklch(0.975 0.004 90)`).
* **Couleurs d'accent :** Dispersion complète dans le code : `indigo-600`, `blue-600`, `emerald-600`, `amber-600`, `teal`.
* **Typographie :** Tailles disparates, absence d'échelle stricte, graisses variables sans logique hiérarchique.
* **Surfaces & Bordures :** Présence de classes obsolètes ou artificielles (« Liquid Glass », « AI pulse ») qui alourdissent le CSS sans servir le produit.

### Nouvelle Grammaire UI RentReady (« Clarté & Sérénité »)
1. **Échelle de surfaces :**
   * Fond de page : Blanc cassé architectural chaud (`#FBFBFA` / `zinc-50/50`)
   * Cartes & conteneurs : Blanc pur (`#FFFFFF`) avec micro-bordure douce (`border-zinc-200/70`) et ombre subtile (`shadow-[0_1px_3px_rgba(0,0,0,0.05)]`)
   * Barre latérale : Fond blanc chaud unifié avec l'application, suppression du bloc navy oppressant pour respirer comme Notion, Stripe ou Linear.
2. **Grammaire des états financiers :**
   * **Payé / À jour :** Vert émeraude reposant (`text-emerald-800 bg-emerald-50/80 border-emerald-200/60`)
   * **Attendu / En cours :** Gris zinc neutre (`text-zinc-700 bg-zinc-100/80 border-zinc-200/60`)
   * **Retard / Action requise :** Ambre / Rose retenu (`text-amber-800 bg-amber-50/90 border-amber-200/70`) — jamais de rouge flash criard pour 2 jours de décalage.
3. **Hiérarchie d'action :**
   * **Action Primaire (1 seule par contexte clé) :** Bouton noir intense ou bleu nuit profond, typo médium, coins arrondis 8px.
   * **Action Secondaire :** Contour discret, texte zinc-700.
   * **Actions contextuelles de liste :** Micro-boutons d'action clairs ou menu trois points.

---

## 5. Nouvelle Architecture de l'Information (Proposée)

### Structure actuelle (Fragmentée) :
```
Sidebar
├── Tableau de bord (/dashboard)
├── Espace Propriétaire (/dashboard/owner) [DOUBLON]
├── Biens (/properties)
├── Locataires (/tenants)
├── Baux (/leases)
├── Paiements (/billing) [CONFUSION STRIPE / LOYERS]
├── Dépenses (/expenses)
├── Maintenance (/maintenance)
└── Outils
    ├── Analyse Fiscale (/fiscal)
    └── Paramètres (/settings/profile)
```

### Nouvelle Architecture (Orientée Métier Bailleur) :
```
Navigation Principale
├── 1. Tableau de bord (/dashboard)
│      ↳ Vue mensuelle calme : « Est-ce que tout va bien ce mois-ci ? »
│      ↳ Actions prioritaires réelles (sans fausses alertes rétrospectives)
│      ↳ Résumé du mois : Encaissé vs Attendu
│      ↳ Accès direct par logement
│
├── 2. Logements (/properties) [HOME BASE]
│      ↳ Fiche logement unifiée : Bien + Locataire + Bail + Loyer du mois + Quittance
│
├── 3. Loyers & Quittances (/billing -> /loyers)
│      ↳ Vue purement dédiée à la collecte des loyers et l'émission des quittances
│      ↳ Plus de bandeau SaaS Stripe polluant
│
├── 4. Dépenses (/expenses)
│      ↳ Dépenses d'entretien et charges déductibles
│
└── 5. Demandes locataires (/maintenance)
       ↳ Suivi des pannes et signalements

Pied de Navigation / Profil
├── Mon compte & Coordonnées bailleur (/settings/profile)
└── Abonnement RentReady (/settings/billing)
```

---

## 6. Top 5 Redesign Targets & Sélection du 1er Vertical Slice

### Matrice de Priorisation :
| Cible | Fréquence (F) | Impact Utilisateur (I) | Impact Business (B) | Risque (R) | Score `(F × I × B) / R` | Priorité |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Tableau de bord (`/dashboard`)** | **5 / 5** | **5 / 5** | **5 / 5** | **2 / 5** | **62.5** | **#1 (Sélectionné)** |
| **2. Loyers & Paiements (`/billing`)** | 4 / 5 | 5 / 5 | 4 / 5 | 2 / 5 | 40.0 | #2 |
| **3. Premier Démarrage & Onboarding** | 3 / 5 | 5 / 5 | 5 / 5 | 2 / 5 | 37.5 | #3 |
| **4. Logement "Home Base" (`/properties/[id]`)** | 4 / 5 | 4 / 5 | 3 / 5 | 2 / 5 | 24.0 | #4 |
| **5. Formulaire de Bail (`/leases/new`)** | 2 / 5 | 4 / 5 | 3 / 5 | 1 / 5 | 24.0 | #5 |

---

## Décision & Mise en Œuvre Immédiate : Vertical Slice #1

Nous sélectionnons sans ambiguïté : **Le Tableau de Bord (`/dashboard`) et la Navigation Unifiée**.

### Objectifs du Redesign :
1. **Répondre en 3 secondes :** « Est-ce que tout va bien ce mois-ci ? »
2. **Éliminer la "Rollover Panic" :** Distinguer clairement les loyers du mois en cours des arriérés historiques rétroactifs.
3. **Éliminer le "Cimetière des zéros" :** Transformer l'état vide en guide d'accueil rassurant et actionnable.
4. **Supprimer le doublon `/dashboard/owner` :** Réunir le meilleur de la vue opérationnelle sans métriques bidons.
5. **Désencombrer la navigation :** Rendre la sidebar calme, harmonieuse et cohérente avec le design system moderne.
