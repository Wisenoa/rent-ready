# Spécification de la Démonstration Produit Interactive (B.2)

> **Principe fondamental :** La démonstration produit n'est pas une vidéo pré-enregistrée ni une animation en boucle décorative. C'est un composant interactif réel reproduisant fidèlement la mécanique métier de RentReady :  
> **ATTENTION $\rightarrow$ ACTION $\rightarrow$ RESOLVED $\rightarrow$ CALM**.

---

## 1. Les 4 États de la Machine à États Produit

```
┌────────────────────────┐
│  1. ÉTAT ATTENTION     │  Le mois en cours comporte 3 logements :
│  (Avant interaction)   │  2 sont réglés et silencieux (Paris, Nantes).
│                        │  Lyon 3e affiche 1 200 € reçus sur 1 600 € : anomalie ambre « Reste 400 € dû ».
└───────────┬────────────┘
            │
            │  L'utilisateur clique sur « Régulariser les 400 € »
            ▼
┌────────────────────────┐
│  2. ÉTAT ACTION        │  Bouton de confirmation ou envoi de relance activé.
│  (Micro-interaction)   │  Feedback visuel immédiat (240ms transition).
└───────────┬────────────┘
            │
            │  Enregistrement du versement complémentaire (conforme au code `settleRentPeriod`)
            ▼
┌────────────────────────┐
│  3. ÉTAT RESOLVED      │  Le solde restant passe à 0,00 €.
│  (Régularisation)      │  Le reçu partiel se convertit en « Quittance de solde intégrale (PDF) ».
│                        │  Le statut vire au vert forêt apaisé `#1E3A2F`.
└───────────┬────────────┘
            │
            │  Rétractation de la ligne développée (durée 240ms cubic-bezier)
            ▼
┌────────────────────────┐
│  4. ÉTAT CALM          │  Les 3 logements sont désormais alignés au même niveau silencieux.
│  (Silence retrouvé)    │  Apparition de la signature : « Tout ce qui va bien devient silencieux. »
└────────────────────────┘
```

---

## 2. Données Réelles Utilisées pour la Démonstration

Les montants et baux sont strictement conformes aux modèles Prisma et aux règles de la loi du 6 juillet 1989 :

### Logement 1 : T2 Paris 11e (Bastille) — État CALME
- **Locataire :** Thomas Delmas
- **Bail :** Signé le 15/09/2023 · Loyer nu 980,00 € + Provisions charges 120,00 €
- **Total exigible :** 1 100,00 €
- **Total reçu :** 1 100,00 € le 3 octobre
- **Statut visuel :** Pastille verte discrète, texte `#5A6660`, quittance n° 2026-10-0042 téléchargeable.

### Logement 2 : T3 Lyon 3e (Part-Dieu) — L'EXCEPTION
- **Locataire :** Sarah Merand
- **Bail :** Signé le 01/02/2024 · Loyer nu 1 420,00 € + Provisions charges 180,00 €
- **Total exigible :** 1 600,00 €
- **Total reçu :** 1 200,00 € par virement le 4 octobre
- **Solde manquant :** **400,00 €**
- **Statut visuel initial (ATTENTION) :**
  - Bordure accent ambre `#D97706` / fond `#FEF3C7` (modéré).
  - Badge : `Paiement partiel · Reste 400,00 € dû`.
  - Document : `Reçu de paiement partiel généré (art. 21 loi 89-462)` avec solde restant mentionné.
  - Actions disponibles :
    1. Bouton secondaire : `Relancer par email (1 clic)`
    2. Bouton primaire : `Régulariser les 400 €`
- **Statut visuel après action (RESOLVED) :**
  - Total reçu : 1 600,00 € le 5 octobre.
  - Solde manquant : 0,00 €.
  - Document : `Quittance de loyer intégrale générée (PDF)`.
  - Bordure ambre disparue, ligne compactée.

### Logement 3 : Studio Nantes (Graslin) — État CALME
- **Locataire :** Antoine Roche
- **Bail :** Signé le 01/07/2025 · Loyer nu 580,00 € + Charges 70,00 €
- **Total exigible :** 650,00 €
- **Total reçu :** 650,00 € le 4 octobre
- **Statut visuel :** Pastille verte discrète, quittance n° 2026-10-0043 prête.

---

## 3. Spécification Technique de la Motion & Accessibilité

- **Durée de transition :** `240ms`
- **Courbe d'accélération :** `cubic-bezier(0.16, 1, 0.3, 1)` (signature de décélération naturelle B.1).
- **Règle d'or :** L'animation n'est PAS un spectacle permanent. Elle se déclenche **uniquement** lors d'une interaction utilisateur pour expliquer la cause et la conséquence d'un changement d'état.
- **Support `prefers-reduced-motion` :**
  - Si l'utilisateur a activé la réduction de mouvement, la transition d'effacement et de redimensionnement de hauteur est désactivée (`transition: none !important`), et le statut change instantanément sans déplacement d'éléments.
- **Compréhension sans interaction :**
  - Même si le visiteur ne clique sur aucun bouton, la disposition initiale montre explicitement les 2 logements calmes vs le logement en anomalie avec la mention claire « Reste 400 € dû ». L'utilité du logiciel est comprise en 5 secondes même sur capture statique ou sans JavaScript.
