# DOCUMENT 08 — STRATÉGIE DES OUTILS GRATUITS & ENTONNOIR D'ACQUISITION B.1
## Architecture des Simulateurs IRL & Quittance, Règle d'Utilité Immédiate & Passerelle Produit

---

### 1. Pourquoi les Outils Gratuits sont Cruciaux pour RentReady

La grande majorité des bailleurs privés ne découvrent pas RentReady en cherchant *« logiciel de gestion locative SaaS »*. Ils découvrent RentReady à l'occasion d'un besoin ponctuel urgent sur Google :
* *« comment réviser mon loyer avec l'indice IRL »* ;
* *« modèle quittance de loyer gratuite légale »* ;
* *« calcul régularisation charges locatives »*.

Si l'outil gratuit ressemble à une page marketing agressive avec 3 bannières publicitaires et un formulaire de calcul caché tout en bas après 800px de blabla, le visiteur repart immédiatement.

Dans le système B.1, les outils gratuits obéissent à un principe d'ergonomie strict :
> **L'utilité avant le discours : le calculateur commence dès le premier pixel de l'écran.**

---

### 2. Audit des Outils Réellement Présents dans le Répertoire

L'inspection du code source de RentReady révèle l'existence effective de plusieurs outils complets :

| Outil dans le Codebase | Route Active | Données & Formule Métier Vérifiées | Statut B.1 |
| :--- | :--- | :--- | :--- |
| **Calculateur IRL** | `/outils/calculateur-irl` | Série officielle INSEE métropole (série 001515333) de 2021 à 2026. Formule : $L_{nouveau} = L_{actuel} \times \frac{IRL_{nouveau}}{IRL_{ancien}}$. | **Outil Pilote Majeur n°1** |
| **Générateur de Quittance** | `/outils/generateur-quittance` | Ventilation loyer / charges, mention paiement intégral, conformité Article 21 Loi du 6 juillet 1989. | **Outil Pilote Majeur n°2** |
| **Calculateur Charges** | `/outils/calculateur-charges-locatives` | Décompte provisions vs dépenses réelles, régularisation annuelle. | Outil secondaire validé |
| **Dépôt de Garantie** | `/outils/calculateur-depot-garantie` | Plafonnement légal 1 mois (nu) / 2 mois (meublé), restitution. | Outil secondaire validé |
| **Simulateur LMNP** | `/outils/simulateur-fiscalite-lmnp` | Amortissement vs Micro-BIC (abattement 50%). | Outil patrimonial |

---

### 3. Architecture d'une Page Outil B.1 (Structure en 4 Blocs)

Une page d'outil gratuit en B.1 se compose invariablement des 4 étapes suivantes :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. L'EN-TÊTE ÉPURÉ & LA QUESTION MÉTIER                                     │
│    Fil d'Ariane sobre · Titre clair · Date d'actualisation officielle INSEE │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. LE MODULE DE SAISIE INTERACTIF (Immédiat)                                │
│    Champs ergonomiques larges · Sélection de trimestre · Montant en euros   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. LE RÉSULTAT CHIFFRÉ & LA FORMULE LÉGALE DÉTAILLÉE                       │
│    Nouveau loyer mis en valeur · Ventilation du gain · Référence légale     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. LA PASSERELLE CONTEXTUALISÉE RENTREADY                                  │
│    Valeur ajoutée directe : « Mémoriser ce bail et surveiller la révision » │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. La Passerelle Contextualisée : De l'Outil Ponctuel au Logiciel Quotidien

L'erreur des formulaires gratuits est d'afficher un bouton générique : *« Créez un compte RentReady »*. Le visiteur n'a aucune raison d'obtempérer : il a obtenu son chiffre et s'apprête à fermer l'onglet.

Dans B.1, la passerelle produit répond exactement à la tâche que le bailleur s'apprête à faire manuellement :

#### Cas du Calculateur IRL :
* **Résultat affiché :** *« Votre loyer passe de 800,00 € à 808,32 € (+8,32 €/mois) selon l'IRL T2 2026. »*
* **La Passerelle B.1 (Cartouche en fond albâtre et vert d'atelier) :**
  > **Ne perdez plus jamais une révision annuelle.**  
  > En droit français, une révision de loyer non réclamée à date anniversaire est **définitivement perdue** pour l'année écoulée (pas de rétroactivité).  
  > *RentReady enregistre la date de votre bail, vous alerte automatiquement 30 jours avant l'échéance et génère le courrier de révision conforme prêt à l'envoi.*  
  > `[Bouton Vert Forêt : Enregistrer ce bail sur RentReady — Gratuit]`

#### Cas du Générateur de Quittance :
* **Résultat affiché :** Quittance légale générée au format standard conforme à l'article 21 de la Loi de 1989.
* **La Passerelle B.1 :**
  > **Éditer une quittance chaque mois vous prend 15 minutes ?**  
  > *RentReady rapproche automatiquement vos virements bancaires et met à disposition de votre locataire sa quittance déchargée sans aucune intervention manuelle de votre part.*  
  > `[Bouton Vert Forêt : Automatiser mes quittances mensuelles]`

---

### 5. Conception Mobile des Outils (390px / 360px)

Sur mobile, la contrainte ergonomique est maximale :
* Les champs de saisie numérique utilisent l'attribut natif `inputMode="decimal"` pour ouvrir directement le pavé numérique de l'OS sous le pouce.
* Les boutons de sélection rapide de trimestres (ex. `T2 2026`, `T1 2026`, `T4 2025`) s'affichent sous forme de segment horizontal tactile à cibles de 44px.
* Le résultat s'actualise en temps réel au fil de la frappe sans rechargement de page.
