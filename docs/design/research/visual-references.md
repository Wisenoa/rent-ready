# RECHERCHE VISUELLE — RÉFÉRENCES RÉELLES
## RentReady Visual Identity Exploration — Phase 1

### 1. Méthodologie et Sources Consultées

Pour dépasser le piège de l'assemblage d'adjectifs génériques (« moderne », « premium », « épuré ») et éviter les clichés génératifs (l'extrême crème/serif de B+ ou l'extrême grisaille shadcn de l'Anti-AI pass), cette recherche visuelle s'appuie sur des interfaces logicielles réelles, testées en production et documentées sur les plateformes de design de référence :

- **Mobbin (mobbin.com) :** Analyse des flux complets de facturation, de tables de données denses et de formulaires complexes (Stripe Dashboard, Qonto, Wise, Linear, Revolut Business).
- **SaaS Interface (saasinterface.com) :** Décomposition par typologie d'écran (Dashboards financiers, Tableaux d'opérations, Vues de détail, Formulaires de souscription/contrat).
- **Refero Design (refero.design) :** Étude des micro-interactions, des traitements d'exception et de la hiérarchie des surfaces.
- **SaaSUI Design (saasui.design) :** Décryptage des patterns de navigation latérale et de gestion de la densité.
- **Nielsen Norman Group (NN/g) :** Études empiriques sur la *Progressive Disclosure* (divulgation progressive) et la réduction de la charge cognitive dans les interfaces de gestion.

---

### 2. Décryptage des Patterns Clés en Production

#### A. Le traitement des flux financiers et de la facturation (Billing & Invoicing)
- **Stripe Dashboard / Billing :**
  - *Pattern observé :* Séparation radicale entre le total attendu et les anomalies. L'état normal est tabulaire, silencieux, avec typographie proportionnelle pour les libellés et alignement strict `tabular-nums` pour les montants.
  - *Leçon pour RentReady :* Ne jamais noyer une exception dans une cellule de tableau banale. Stripe isole les « Failed invoices » dans une zone d'alerte contextualisée dotée d'une action directe (« Retry », « Send reminder »).
- **Qonto Web & Mobile :**
  - *Pattern observé :* Fond neutre froid très clair, navigation sombre statutaire, cartes aux bordures fines (1px semi-transparent) avec rayons de courbure modérés (8px). Les flux entrants sont marqués d'un vert fonctionnel discret, les flux en attente ou rejets d'un ambre/rouge franc.
  - *Leçon pour RentReady :* Qonto évite la "card soup" en traitant la liste des transactions comme un ruban continu scindé par des séparateurs horizontaux discrets, plutôt que d'enfermer chaque transaction dans une boîte individuelle.
- **Wise (Rebrand 2023 / Koto) :**
  - *Pattern observé :* Contrastes assumés (noir profond, blanc pur, vert Wise vif `#9FE870` et fond neutre légèrement teinté `#E8EBE6`). Typographie d'action forte sans tomber dans le serif désuet.
  - *Leçon pour RentReady :* L'identité visuelle ne dépend pas d'un effet décoratif ; elle s'exprime par le contraste et l'énergie des couleurs fonctionnelles, associées à une clarté typographique chirurgicale.

#### B. La gestion de la haute densité sans fatigue visuelle
- **Linear :**
  - *Pattern observé :* Architecture de surfaces ton-sur-ton, division par filets quasi-invisibles (`rgba(255,255,255,0.06)` ou `rgba(0,0,0,0.06)` en light), typographie Inter avec graisse personnalisée (510) et tracking négatif maîtrisé sur les grands titres.
  - *Leçon pour RentReady :* La densité n'est pas l'ennemie de la beauté. En supprimant les marges superflues et les ombres portées lourdes, l'interface devient un instrument de travail précis et calme.
- **Pennylane (« Purse » Design System) :**
  - *Pattern observé :* Conçu pour des utilisateurs passant 8h par jour sur l'outil. Les données denses sont hiérarchisées par l'alignement et la couleur du texte (texte principal 900, secondaire 500), avec des badges sémantiques très compacts.
  - *Leçon pour RentReady :* Les propriétaires gérant 1 à 10 biens n'ont pas besoin d'un ERP, mais ils ont besoin de la même rigueur de lecture : montant attendu aligné à droite, statut en capsule compacte, action contextuelle au survol ou en fin de ligne.

#### C. La simplification progressive (Progressive Disclosure — NN/g)
- **Principe fondamental :** Présenter les données essentielles immédiatement ; dévoiler les détails secondaires et les actions complexes uniquement à la demande (clic, survol, dépliement).
- **Application observée sur Things 3 & Mercury :**
  - Ce qui est accompli/réglé s'estompe ou s'affiche sur une seule ligne basse (36-40px).
  - Ce qui nécessite une décision de l'utilisateur s'ouvre avec les options nécessaires sans changer de page ni ouvrir une modale bloquante.
  - *Signature RentReady :* Ce principe valide précisément la mécanique comportementale du produit : « Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. »

---

### 3. Pièges Visuels Identifiés & Erreurs à Éviter

1. **L'illusion du "Fintech Premium Cosplay" :**
   - Accumuler du fond parchemin `#F8F6F0`, des polices serif type Newsreader de 48px et du monospace rétro pour feindre la légitimité notariale.
   - *Verdict :* Rend le produit artificiel, lent à scanner et déconnecté d'un outil web contemporain.
2. **Le piège du "Generic shadcn Clone" :**
   - Adopter par défaut `#FAFAFA` + cartes blanches `rounded-lg border-neutral-200 shadow-sm` + police Inter standard sans hiérarchie réfléchie.
   - *Verdict :* Le produit ressemble à un millier d'autres templates de side-projects. Aucune mémorabilité ni fierté d'usage pour le bailleur indépendant.
3. **L'hyper-cardification ("Card Soup") :**
   - Enfermer chaque paragraphe, chaque loyer réglé et chaque ligne de tableau dans une carte blanche avec bordure et ombre.
   - *Verdict :* Sature la rétine de contours inutiles et brise la lecture continue des flux financiers.
