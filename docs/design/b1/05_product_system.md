# DOCUMENT 05 — SYSTÈME PRODUIT & GRAMMAIRE DES SURFACES B.1
## Règle « Calm ≠ Card », Architecture Home Base & Densité Logicielle Quotidienne

---

### 1. La Règle Fondatrice de Surface : `CALM ≠ CARD`

L'erreur majeure de la quasi-totalité des logiciels SaaS modernes est de traiter chaque donnée comme une « carte » indépendante. Dans un patrimoine locatif de 5, 10 ou 20 biens, transformer chaque ligne de loyer en une carte blanche volumineuse avec bordure et padding de 24px crée un sentiment d'encombrement massif, d'épuisement cognitif et de lenteur opératoire.

Dans le système B.1, nous posons un axiome d'ingénierie d'interface catégorique :
> **Un loyer réglé n'a pas besoin d'une jolie boîte blanche pour annoncer qu'il est réglé.**

#### Quand une surface (Card) est-elle autorisée ?
Une surface délimitée avec fond blanc albâtre et bordure n'est permise que dans 4 cas précis :
1. **L'exception active :** Le loyer partiel ou impayé qui réclame un arbitrage immédiat.
2. **Le conteneur de focalisation :** Le formulaire de création ou de révision en cours de frappe.
3. **Le cartouche de synthèse financière globale :** Le récapitulatif du mois (`Attendus / Reçus / Solde`).
4. **L'objet physique autonome :** La fiche d'un logement (Home Base) dans la vue globale du patrimoine.

Pour tout le reste (loyers à jour, baux sains, quittances générées), l'information vit dans le **flux naturel d'un registre comptable**, structurée par :
* Un alignement typographique horizontal rigoureux ;
* Un filet d'imprimerie doux de 1px (`#E5E2DA`) ;
* Une hauteur de ligne standardisée de **40px à 44px** ;
* Une micro-typographie tabulaire (`tabular-nums`).

---

### 2. Le Cycle d'Attention en 4 Temps

Le produit RentReady traduit visuellement le cycle de vie financier de chaque lot locatif :

| Temps | État Visuel | Hauteur | Traitement Graphique | Comportement Utilisateur |
| :--- | :--- | :--- | :--- | :--- |
| **1. CALME** *(À jour)* | Ligne de registre compacte | **42px** | Fond transparent sur calcaire ou blanc sans relief. Badge sauge feutré *« Réglé »*. Montant en vert sauge discret. | **Zéro friction.** L'œil du propriétaire glisse dessus en un quart de seconde sans s'arrêter. |
| **2. ATTENTION** *(Exception)* | Surface déployée tactile | **88px – 110px** | Carte sur fond ambre très pâle (`#FDF6ED`), filet ambre (`#F5D6B5`). Ventilation : *« Reçu 450 € / Reste 400 € »*. | **Focalisation immédiate.** L'anomalie est contextualisée sans dramatisation. |
| **3. ACTION** *(Arbitrage)* | Déclencheur tactile direct | **32px** (Hauteur bouton) | Bouton pilule en vert forêt d'atelier (`#1E3A2F`) ou ambre contrasté : *« Pointer le solde »* ou *« Relancer »*. | **Une seule décision.** L'action se fait sur place sans quitter la page ni ouvrir 3 sous-onglets. |
| **4. RESOLVED** *(Résolu)* | Rétraction feutrée | **$\rightarrow$ 42px** | Transition de hauteur douce (240ms cubic-bezier), fondu du fond ambre vers le blanc calme. Badge devenant *« Réglé »*. | **Satisfaction silencieuse.** Le silence revient dans le registre. |

---

### 3. Architecture « Home Base » du Logement

Dans RentReady, le logement physique est la boussole mentale du propriétaire. On ne gère pas des « contrats » abstraits dans le vide : on gère un studio rue de la Paix ou un T3 à Nantes.

La **Home Base** d'un bien réunit dans un ordre hiérarchique indiscutable :
1. **Identité physique du bien :** Adresse, surface, typologie, statut d'occupation (*« Occupé · Bail signé le 15/09/2024 »*).
2. **Locataire en titre & Communication :** Nom, coordonnées vérifiées, présence d'un garant certifié.
3. **Pointage financier du mois en cours :** Montant du loyer, charges forfaitaires ou réelles, statut de l'arrêté en cours.
4. **Registre documentaire chronologique :** Remplacement de la traditionnelle *card soup* de documents par une table d'archives ordonnée :
   - Bail signé numériquement ;
   - État des lieux d'entrée ;
   - Attestation d'assurance annuelle (avec date d'échéance) ;
   - Historique des 12 dernières quittances émises (téléchargeables en 1 clic).

---

### 4. Formulaires de Saisie : L'exemple du Bail

Le formulaire de création de bail illustre la rupture de B.1 avec les formulaires oppressants :
* **Décloisonnement en blocs aérés :** Au lieu d'enfermer le propriétaire dans une fenêtre modale étriquée de 500px avec ascenseur, le formulaire s'articule en 3 sections naturelles :
  1. *Les parties* (Bailleur & Locataire) ;
  2. *Les conditions financières* (Loyer nu, charges, date d'exigibilité) ;
  3. *Les garanties légales* (Dépôt de garantie, cautionnaire).
* **Le Cartouche Légal Vivant :** À droite (sur desktop) ou en pied de bloc (sur mobile), un panneau récapitulatif calcule en temps réel le respect du plafond légal de la Loi du 6 juillet 1989 :
  - Location vide : maximum 1 mois de loyer hors charges (`Dépôt max : 750,00 €`) ;
  - Location meublée : maximum 2 mois de loyer hors charges (`Dépôt max : 1 500,00 €`).
* **Gestion des erreurs (Inline Validation) :** Les champs invalides ne crient pas en rouge agressif : ils affichent un filet garance doux `#F6C4C0` et une explication claire sous l'intitulé (*« Le montant du loyer doit être supérieur à 0 € »*).

---

### 5. L'Épreuve Mobile (390px & 360px)

Sur smartphone, B.1 refuse l'empilement vertical de grosses cartes.
* **Le Dashboard 10 logements sur 390px :**  
  Les 8 logements réglés occupent chacun une bande horizontale de 44px affichant sur une seule ligne :  
  `[Ville / Rue] ───────── [850 €] · [Réglé ✓]`.  
  Les 2 logements avec anomalie occupent 84px chacun avec la ventilation du solde dû.  
  Résultat : **l'intégralité du patrimoine est visible en moins de 2 scrolls légers du pouce**, contre plus de 9 scrolls dans l'ancien système de cartes.
