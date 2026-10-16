# Lokna V3.3 — Inventaire et Audit Complet des Outils Gratuits

> **Date** : 16 octobre 2026  
> **Branche de travail** : `feat/free-tools-seo-v3-3` (basée sur `feat/premium-tools-v3-2` au commit `e12f066`)  
> **Auteur** : Équipe produit, technique, juridique et SEO Lokna  
> **Note méthodologique GSC** : L'accès direct à l'API Google Search Console n'étant pas configuré dans cet environnement d'exécution, la priorisation ci-dessous repose sur des **hypothèses d'intention de recherche qualifiées**, la proximité immédiate avec la boucle produit Lokna (*Bien → Locataire → Bail → Loyer dû → Paiement → Quittance*), et l'analyse de risque juridique.

---

## 1. Vue d'Ensemble du Parc d'Outils

Lokna propose désormais un ensemble de **16 outils gratuits et sans inscription**, intégralement refondus sous l'architecture V3.2/V3.3 :
- **Calculs arithmétiques stricts** via `decimal.js` (aucun arrondi binaire JS sur la monnaie ou les indices).
- **Architecture de composants unifiée** (`src/components/marketing/tools/*`).
- **Accessibilité WCAG 2.1 AA** (contrastes 4.5:1, libellés explicites, navigation clavier, zéro débordement horizontal à 375px).
- **Rigueur juridique française** (sources officielles Légifrance, Service-Public.fr, INSEE, ANIL, impots.gouv.fr).
- **SEO & Données structurées** : un seul `<h1>`, un seul `BreadcrumbList` via `@graph`, un `WebApplication` canonique, aucun contenu dupliqué ni cloaking.

---

## 2. Tableau de Priorisation et Matrice d'Alignement Produit

| Outil | URL | Intention cible (hypothèse) | Utilité réelle | Proximité Lokna | Potentiel conv. | Risque jur./réglementaire | Priorité V3.3 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Générateur de quittance** | `/outils/generateur-quittance` | Transactionnelle / Document | Maximale (obligation art. 21) | Cœur (boucle quittance) | Très élevé | Élevé (distinction charges/reçu partiel) | **P0 (Cœur)** |
| **Calculateur IRL** | `/outils/calculateur-irl` | Calculatoire / Annuelle | Maximale (index INSEE officiel) | Cœur (révision annuelle bail) | Élevé | Moyen (clause bail, non rétroactivité) | **P0 (Cœur)** |
| **Charges locatives** | `/outils/calculateur-charges-locatives` | Calculatoire / Annuelle | Maximale (régularisation annuelle) | Cœur (solde charges bail) | Élevé | Élevé (décret 1987, TEOM, prorata) | **P0 (Cœur)** |
| **Modèle quittance PDF** | `/outils/modele-quittance-loyer-pdf` | Navigationnelle / Modèle | Élevée (comprendre les clauses) | Cœur (complémentaire générateur) | Élevé | Élevé (mentions obligatoires) | **P1** |
| **Lettre de relance loyer** | `/outils/lettre-relance-loyer` | Juridique / Recouvrement | Élevée (retard de paiement) | Cœur (gestion des impayés) | Élevé | Critique (art. 1344 CC, interdiction frais) | **P1** |
| **Calculateur de loyer & prorata** | `/outils/calculateur-loyer` | Transactionnelle / Calcul | Élevée (entrée/sortie + encadrement) | Forte (fixation du loyer) | Élevé | Élevé (loi ELAN +20 %, jours réels) | **P1** |
| **Dépôt de garantie** | `/outils/calculateur-depot-garantie` | Juridique / Calculatoire | Élevée (plafonds & restitution) | Forte (fin de bail & litiges) | Moyen | Critique (art. 22 loi 1989, pénalité 10 %) | **P1** |
| **Calculateur de préavis** | `/outils/calculateur-preavis` | Juridique / Calendrier | Élevée (délais quantième à quantième) | Forte (transition locative) | Moyen | Élevé (art. 15, zone tendue, justificatifs) | **P1** |
| **Congé pour vente** | `/outils/generateur-conge-vente` | Juridique / Formalisme | Forte (motif vente 6 mois avant) | Moyenne (fin de détention) | Moyen | Très critique (préemption, nullité) | **P2** |
| **Checklist état des lieux** | `/outils/checklist-etat-lieux` | Opérationnelle / Terrain | Élevée (grille décret 2016-382) | Forte (entrée / sortie) | Moyen | Élevé (vétusté vs dégradation) | **P2** |
| **Surface habitable (Boutin)** | `/outils/calculateur-surface-habitable` | Technique / Mesurage | Forte (art. R. 156-1 CCH & art. 3-1) | Moyenne (référencement du bien) | Moyen | Élevé (sanction baisse loyer si > 5 %) | **P2** |
| **Rendement locatif** | `/outils/calculateur-rendement` | Décisionnelle / Invest | Forte (brut, net, cash-flow) | Amont (avant acquisition) | Moyen | Faible (estimation indicative) | **P3** |
| **Simulateur prêt immobilier** | `/outils/simulateur-pret-immobilier` | Financière / Financement | Moyenne (tableau amortissement) | Amont (financement) | Faible | Faible (taux indicatifs) | **P3** |
| **Fiscalité LMNP** | `/outils/simulateur-fiscalite-lmnp` | Arbitrage fiscal | Forte (Micro-BIC vs Réel) | Aval (comptabilité / déclaration) | Moyen | Élevé (art. 39 C CGI, amortissement) | **P3** |
| **Plus-value immobilière** | `/outils/calculateur-plus-value` | Patrimoniale / Vente | Forte (abattements 22/30 ans) | Aval (cession du patrimoine) | Faible | Élevé (art. 150 VB, forfaits, surtaxe) | **P3** |
| **Simulateur loi Jeanbrun** | `/outils/simulateur-loi-jeanbrun` | Prospective fiscale | Modérée (dispositif 9 ans) | Écosystème bailleur privé | Faible | Moyen (distinction en vigueur / prospectif) | **P3** |

---

## 3. Fiches d'Audit Détaillées des 16 Outils

### 1. Générateur de quittance (`/outils/generateur-quittance`)
- **Fonction principale** : Génération immédiate d'une quittance de loyer PDF ou d'un reçu d'acompte partiel, avec aperçu papier temps réel.
- **Intention** : *« générateur quittance loyer gratuit », « faire une quittance de loyer », « quittance en ligne sans inscription »*.
- **Cible** : Propriétaire bailleur particulier en gestion autonome émettant sa quittance mensuelle.
- **État avant V3.3** : Téléchargement PDF souvent en échec sur mobile ; pas de gestion des paiements partiels (le bouton générait une fausse quittance libératoire en violation de l'art. 21) ; dépendance à un script externe non typé.
- **Refonte V3.3** :
  - Module `src/lib/tools/quittance-document.ts` avec discrimination stricte `isQuittance: boolean` (si partiel → *Reçu de paiement partiel de loyer* avec solde restant dû).
  - Composant partagé `QuittanceTool.tsx` avec `DocumentSheet` (aperçu papier en direct).
  - Génération PDF client via `@react-pdf/renderer` chargé paresseusement (chunk isolé).
  - Support du prorata calendaire (jours occupés sur total du mois).
  - Aucun paywall, aucune collecte d'e-mail, aucune mention trompeuse.

### 2. Modèle de quittance PDF (`/outils/modele-quittance-loyer-pdf`)
- **Fonction principale** : Trame commentée clause par clause et outil de génération intégrée pour les bailleurs cherchant un modèle PDF conforme.
- **Intention** : *« modèle quittance loyer pdf », « exemple quittance loyer gratuit », « trame quittance de loyer vierge »*.
- **Cible** : Bailleur souhaitant vérifier les mentions obligatoires et imprimer ou remplir un modèle type.
- **Anti-cannibalisation avec le générateur** : La page adopte un angle pédagogique et juridique (*« Anatomie d'une quittance conforme »*, décryptage des 7 mentions obligatoires selon la loi de 1989), tout en intégrant le formulaire interactif pour satisfaire l'intention d'obtention immédiate sans redirection.

### 3. Calculateur de révision IRL (`/outils/calculateur-irl`)
- **Fonction principale** : Révision légale annuelle du loyer à partir des indices officiels de l'INSEE.
- **Intention** : *« calculateur irl », « calcul révision loyer », « augmentation loyer insee »*.
- **Cible** : Propriétaire bailleur à la date anniversaire du contrat de bail.
- **État V3.2/V3.3** : Rendu SSR complet du calcul avec le dernier indice publié (T3 2026 = 148,06), formule détaillée `Loyer × Indice N ÷ Indice N-1`, rappel de l'interdiction de rétroactivité (loi ALUR) et gel des passoires thermiques F/G depuis le 24 août 2022.

### 4. Calculateur de charges locatives (`/outils/calculateur-charges-locatives`)
- **Fonction principale** : Régularisation annuelle des provisions pour charges contre dépenses réelles récupérables.
- **Intention** : *« calcul charges locatives », « régularisation des charges », « charges récupérables propriétaire »*.
- **Cible** : Bailleur établissant le décompte annuel de charges de copropriété ou de maison individuelle.
- **État V3.2/V3.3** : Règle stricte écartant les forfaits de charges (baux meublés/mobilité au forfait non régularisables) ; dissociation de la taxe foncière (seule la TEOM hors frais de gestion est récupérable) ; prorata calendaire en jours d'occupation.

### 5. Lettre de relance de loyer (`/outils/lettre-relance-loyer`)
- **Fonction principale** : Rédaction conforme d'un rappel amiable ou d'une mise en demeure en LRAR pour loyer impayé.
- **Intention** : *« lettre relance loyer impayé », « mise en demeure loyer modèle », « relance retard loyer »*.
- **Cible** : Bailleur confronté à un retard ou à un impayé partiel de loyer.
- **État avant V3.3** : Modèles génériques intégrant parfois des « frais de relance » illégaux (interdits par l'article 4 p de la loi du 6 juillet 1989).
- **Refonte V3.3** :
  - Module `src/lib/tools/lettre-relance.ts`.
  - Deux paliers procéduraux clairs : relance amiable (courrier simple / e-mail) et mise en demeure formelle en LRAR (citant l'article 1344 du Code civil et l'article 24 de la loi de 1989).
  - Décompte précis du solde (loyer appelé, charges, versements déjà intervenus, solde restant).
  - Rappel explicite de la nullité de toute clause de pénalités ou de frais postaux facturés au locataire.

### 6. Congé pour vente (`/outils/generateur-conge-vente`)
- **Fonction principale** : Générateur de notification de congé pour vendre avec calcul du délai légal de 6 mois ou 3 mois et droit de préemption.
- **Intention** : *« lettre congé pour vente », « modèle préavis vente propriétaire », « préemption locataire vente »*.
- **Cible** : Bailleur souhaitant vendre son logement libre de tout occupant au terme du bail.
- **État avant V3.3** : Aucun calcul de date limite ; préemption appliquée par erreur aux meublés ; absence des alinéas obligatoires de l'art. 15 II.
- **Refonte V3.3** :
  - Module `src/lib/tools/conge-vente.ts`.
  - Calcul automatique de la date limite impérative de réception par le locataire (6 mois en vide, 3 mois en meublé) de quantième à quantième selon l'art. 641 du CPC.
  - Alerte visuelle immédiate si la date du jour dépasse la date limite de réception.
  - En location vide : intégration intégrale des 5 premiers alinéas de l'article 15 II et mention de la notice d'information obligatoire (arrêté du 13 décembre 2017).

### 7. Calculateur de loyer & prorata (`/outils/calculateur-loyer`)
- **Fonction principale** : Calcul du prorata de loyer temporis (entrée/sortie) et estimation du loyer au m² avec vérification de l'encadrement préfectoral (+20 %).
- **Intention** : *« calcul prorata loyer », « prorata loyer entrée cours de mois », « loyer au m2 encadrement »*.
- **Cible** : Bailleur accueillant un locataire en milieu de mois ou fixant le montant du loyer initial.
- **État avant V3.3** : Faux prorata divisant arbitrairement par 30 même pour les mois de 31 ou 28 jours ; mélange entre seuils de décence et encadrement des loyers.
- **Refonte V3.3** :
  - Module `src/lib/tools/loyer-prorata.ts`.
  - Deux conventions explicites : jours calendaires réels (28, 29, 30 ou 31 jours) ou convention bancaire du trentième (30 jours).
  - Mode loyer au m² avec détection du seuil d'indécence (< 9 m²) et plafond préfectoral majoré (+20 % du loyer de référence, art. 140 loi ELAN).

### 8. Calculateur de dépôt de garantie (`/outils/calculateur-depot-garantie`)
- **Fonction principale** : Plafond légal à l'entrée et décompte de restitution à la sortie (délais de 1 ou 2 mois, retenue de 20 % en copropriété, pénalité de retard de 10 %/mois).
- **Intention** : *« calcul dépot de garantie », « restitution caution propriétaire délai », « retenue dépot de garantie copropriété »*.
- **Cible** : Bailleur à la signature du bail ou lors de la restitution des clés.
- **État avant V3.3** : Affirmation erronée que le meublé était limité à 1 mois en zone tendue ; omission de l'interdiction totale de dépôt en bail mobilité ; omission de la pénalité légale de retard.
- **Refonte V3.3** :
  - Module `src/lib/tools/depot-garantie.ts`.
  - Respect scrupuleux des articles 22, 25-6 et 25-17 de la loi de 1989 (vide = 1 mois HC, meublé = 2 mois HC partout en France, mobilité = 0 €).
  - Restitution sous 1 mois si état des lieux conforme, 2 mois si différences.
  - Déduction maximale de 20 % en copropriété dans l'attente de l'arrêté des comptes.
  - Calcul de la pénalité de 10 % du loyer mensuel HC par mois commencé de retard.

### 9. Calculateur de préavis de location (`/outils/calculateur-preavis`)
- **Fonction principale** : Détermination de la durée du préavis (1, 3 ou 6 mois) et calcul de la date exacte d'expiration de quantième à quantième.
- **Intention** : *« calcul préavis location », « préavis 1 mois zone tendue », « durée préavis bailleur »*.
- **Cible** : Locataire ou bailleur préparant la résiliation du bail.
- **État avant V3.3** : Mots parasites en anglais/espagnol (*"reasons de santé"*, *"unemployment"*) ; règles du bailleur et du locataire confondues.
- **Refonte V3.3** :
  - Module `src/lib/tools/preavis.ts`.
  - Distinction nette entre congé émanant du locataire (3 mois en vide ramené à 1 mois en zone tendue ou sur motifs légaux justifiés avec justificatif obligatoire dès l'envoi, 1 mois en meublé/mobilité) et congé émanant du bailleur (6 mois en vide, 3 mois en meublé, motif légal obligatoire).
  - Règle de quantième à quantième (art. 641 CPC) : expiration le jour correspondant du mois cible, ou dernier jour du mois en cas de mois plus court.

### 10. Checklist d'état des lieux (`/outils/checklist-etat-lieux`)
- **Fonction principale** : Grille de contrôle pièce par pièce conforme aux mentions obligatoires du décret n° 2016-382 du 30 mars 2016.
- **Intention** : *« checklist état des lieux », « points vérifier état des lieux entrée », « modèle état des lieux conforme »*.
- **Cible** : Propriétaire et locataire réalisant l'état des lieux contradictoire sur place.
- **État avant V3.3** : Liste informelle non structurée, absence des compteurs et des clés, confusion entre vétusté et dégradation.
- **Refonte V3.3** :
  - Module `src/lib/tools/etat-des-lieux.ts`.
  - Relevé des compteurs (électricité PDL, eau, gaz PCE) et inventaire des clés.
  - Distinction réglementaire entre bon état, usure normale (vétusté non imputable) et dégradation à imputer.
  - Rappel des délais de recours (10 jours pour compléter l'EDL d'entrée, 1er mois de chauffe pour les radiateurs, art. 3-2 loi 1989).

### 11. Calculateur de surface habitable (`/outils/calculateur-surface-habitable`)
- **Fonction principale** : Mesurage de la surface habitable selon la loi Boutin (art. R. 156-1 CCH) et contrôle du seuil d'erreur de 5 % ouvrant droit à diminution du loyer (art. 3-1).
- **Intention** : *« calcul surface habitable », « surface loi boutin », « différence surface bail 5 pourcent »*.
- **Cible** : Propriétaire préparant la rédaction du bail ou réalisant le métré de son bien.
- **État avant V3.3** : Confusion totale entre surface Carrez (ventes en copropriété) et surface Boutin (locations) ; prise en compte erronée des balcons et caves.
- **Refonte V3.3** :
  - Module `src/lib/tools/surface-habitable.ts`.
  - Déduction stricte des hauteurs sous plafond < 1,80 m et exclusion formelle des annexes non habitables (balcons, terrasses, caves, combles non aménagés).
  - Contrôle automatique de l'écart avec la surface inscrite au bail : alerte si écart > 5 % (1/20e) avec calcul de la baisse mensuelle de loyer proportionnelle exigible par le locataire.

### 12. Rendement locatif (`/outils/calculateur-rendement`)
- **Fonction principale** : Simulation du rendement brut, acte en main et net de charges avec impact de la vacance locative.
- **Intention** : *« calcul rendement locatif », « rentabilité locative brute nette », « calcul cash flow immobilier »*.
- **Cible** : Investisseur immobilier analysant une opportunité d'achat ou le bilan de son parc.
- **Refonte V3.3** :
  - Module `src/lib/tools/rendement-locatif.ts`.
  - Formules explicites affichées à l'écran.
  - Décomposition entre coût d'acquisition net vendeur et coût total acte en main (notaire + travaux).
  - Déduction des charges d'exploitation réelles (taxe foncière, PNO, charges non récupérables, vacance locative en mois).

### 13. Simulateur de prêt immobilier (`/outils/simulateur-pret-immobilier`)
- **Fonction principale** : Mensualités constantes, assurance emprunteur et tableau d'amortissement annuel sur 5 à 30 ans.
- **Intention** : *« simulateur prêt immobilier », « calcul mensualité crédit immobilier », « tableau amortissement prêt »*.
- **Cible** : Investisseur préparant son financement bancaire.
- **Refonte V3.3** :
  - Module `src/lib/tools/pret-immobilier.ts`.
  - Formule actuarielle exacte en `Decimal` évitant les erreurs de cumul d'intérêts sur 20 ou 25 ans.
  - Génération du tableau d'amortissement année par année (capital remboursé, intérêts, assurance, capital restant dû).

### 14. Plus-value immobilière (`/outils/calculateur-plus-value`)
- **Fonction principale** : Estimation de la plus-value nette imposable et des impôts (IR 19 %, PS 17,2 %, surtaxe) après abattements pour durée de détention.
- **Intention** : *« calcul plus value immobilière », « abattement durée détention plus value », « impôt vente résidence secondaire »*.
- **Cible** : Propriétaire bailleur envisageant l'arbitrage ou la vente d'un bien locatif.
- **Refonte V3.3** :
  - Module `src/lib/tools/plus-value.ts`.
  - Barèmes officiels des articles 150 VB et 150 VC du CGI (forfait frais acquisition 7,5 %, forfait travaux 15 % dès 5 ans).
  - Abattements progressifs distincts : exonération d'IR à 22 ans, exonération de prélèvements sociaux à 30 ans.
  - Barème de la taxe sur les plus-values élevées (> 50 000 € net IR) avec lissage (art. 1609 nonies G CGI).

### 15. Fiscalité LMNP (`/outils/simulateur-fiscalite-lmnp`)
- **Fonction principale** : Comparatif d'imposition entre Micro-BIC (50 %) et Régime Réel Simplifié avec plafonnement de l'amortissement (art. 39 C CGI).
- **Intention** : *« simulateur fiscalité lmnp », « lmnp réel ou micro bic », « calcul amortissement lmnp »*.
- **Cible** : Propriétaire loueur en meublé non professionnel.
- **Refonte V3.3** :
  - Module `src/lib/tools/fiscalite-lmnp.ts`.
  - **Correction fiscale majeure** : application des prélèvements sociaux (17,2 %) sur la base nette après amortissement (et non sur le brut).
  - Application stricte de la règle de l'article 39 C : l'amortissement ne peut créer de déficit BIC ; l'excédent est ventilé en réserve d'amortissement reportable sans limitation de durée.

### 16. Simulateur loi Jeanbrun (`/outils/simulateur-loi-jeanbrun`)
- **Fonction principale** : Simulation comparative d'un amortissement dégressif sur 9 ans (5,5 % / 4,5 % / 3,5 %) face au Micro-BIC et au LMNP classique.
- **Intention** : *« simulateur loi jeanbrun », « statut bailleur privé amortissement », « jeanbrun vs lmnp »*.
- **Cible** : Propriétaire bailleur suivant les évolutions législatives pour l'investissement locatif nu.
- **Refonte V3.3** :
  - Module `src/lib/tools/loi-jeanbrun.ts`.
  - Mention expresse du caractère prospectif / indicatif du barème pour respecter scrupuleusement la règle d'honnêteté marketing (aucune affirmation infondée sur une loi non promulguée).
  - Comparatif chiffré sur 9 ans avec économie d'impôt réelle.

---

## 4. Synthèse des Défauts Éliminés en V3.3

1. **Générateurs factices & faux boutons** : Tous les boutons « Télécharger », « Calculer » et « Copier » sont désormais branchés sur des moteurs réels (`@react-pdf/renderer` pour les quittances, modules `Decimal` pour les calculs, presse-papier navigateur pour les courriers).
2. **Textes parasites étrangers** : Élimination complète de tous les résidus d'espagnol (*"definido"*, *"mejora"*, *"depósito"*) et d'anglais (*"prepare your projet"*, *"unemployment"*).
3. **Erreurs juridiques critiques** :
   - Fin de la délivrance de fausses quittances en cas d'acompte partiel → émission automatique d'un *Reçu de paiement partiel*.
   - Fin des clauses de frais de relance illégaux dans les courriers d'impayés.
   - Intégration du droit de préemption et des 5 alinéas légaux de l'article 15 II dans le congé pour vente.
   - Respect de l'interdiction de dépôt de garantie en bail mobilité.
4. **Schémas JSON-LD dupliqués** : Remplacement des schémas clients multiples par une émission unique et propre via `buildGraphSchema` côté serveur (1 seul `WebApplication`, 1 seul `BreadcrumbList`).
5. **Débordement mobile (375px)** : Tous les tableaux, formulaires et panneaux de résultats ont été conçus en mobile-first avec `min-w-0`, `tabular-nums` et sans barres de défilement horizontal.
