# 09 — Audit des Parcours de Conversion & Product-Led SEO

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : Parcours d'acquisition organique depuis la SERP jusqu'à l'activation dans le produit

---

## 1. Cartographie des 4 Entrées Organiques Principales

```text
1. RECHERCHE BESOIN URGENT ──► Page Outil (/outils/*) ──────┐
2. RECHERCHE JURIDIQUE      ──► Guide Blog (/blog/*)        ├──► PASSAGE À L'ACTION ──► Inscription (/register) ──► Activation Produit
3. RECHERCHE BENCHMARK      ──► Page Comparatif (/comparatif)│    (Automatisation)      (14j gratuits sans CB)  (1er bien configuré)
4. RECHERCHE LOCALE         ──► Page Ville (/gestion-locative)┘
```

---

## 2. Diagnostic des Ruptures de Conversion Identifiées dans le Code

| Point d'entrée | Expérience actuelle constatée | Rupture de conversion | Gravité |
| :--- | :--- | :--- | :---: |
| **Générateur de quittance** ([`/outils/generateur-quittance`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/generateur-quittance/page.tsx)) | L'utilisateur génère et télécharge sa quittance en PDF. | **ZÉRO CTA vers le produit.** Aucune incitation à automatiser les quittances suivantes. L'utilisateur repart sans laisser de trace. | **CRITIQUE** |
| **Modèle lettre relance** ([`/outils/lettre-relance-loyer`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/lettre-relance-loyer/page.tsx)) | L'utilisateur remplit le formulaire et copie le texte de relance. | **ZÉRO CTA vers le produit.** Aucune proposition de surveiller automatiquement les encaissements bancaires pour ne plus avoir à relancer manuellement. | **CRITIQUE** |
| **Calculateur charges** ([`/outils/calculateur-charges-locatives`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-charges-locatives/page.tsx)) | Calcul de régularisation des charges locatives. | **ZÉRO CTA.** Aucune passerelle vers le suivi des charges réelles dans RentReady. | **MAJEUR** |
| **119 Articles de Blog** ([`src/lib/editorial-cta.ts`](file:///home/ubuntu/rent-ready/src/lib/editorial-cta.ts)) | Token `[CTA : ...]` en bas d'article. | Bouton générique « Créer un compte » déconnecté du sujet de l'article (ex: un article sur l'état des lieux renvoie vers une inscription brute). | **MAJEUR** |
| **Page Comparatif** ([`/comparatif/logiciel-gestion-locative`](file:///home/ubuntu/rent-ready/src/app/(marketing)/comparatif/logiciel-gestion-locative/page.tsx)) | Grille comparant RentReady à « Apfer » et « Tecoo ». | Perte de crédibilité immédiate chez le bailleur qui constate des noms fictifs. | **CRITIQUE** |

---

## 3. Le Modèle « Product-Led SEO » Vertueux

RentReady ne doit jamais dégrader l'expérience de ses outils gratuits par des paywalls intrusifs ou des formulaires obligatoires avant résultat.

### La méthode en 3 étapes : « Utilité immédiate → Démonstration de gain → Transition fluide »

1. **Utilité immédiate (Zero-friction) :**  
   L'utilisateur obtient la réponse à sa question instantanément et gratuitement (calcul du montant révisé, quittance prête à imprimer, calcul du préavis).
2. **L'accroche d'automatisation (The Automation Hook) :**  
   Juste en dessous du résultat obtenu, un encart visuel discret mais percutant explique la valeur de la récurrence :
   > *« Cette quittance de 750 € est conforme. Plutôt que de la refaire à la main chaque mois, laissez RentReady détecter le virement bancaire et l'envoyer automatiquement à votre locataire. »*
3. **Pré-remplissage à l'onboarding (Stateful Continuity) :**  
   Lorsque l'utilisateur clique sur *« Automatiser pour le mois prochain »*, les paramètres déjà saisis dans l'outil (nom du locataire, montant du loyer, adresse du bien) sont transmis en mémoire locale (`localStorage` ou paramètres d'URL sécurisés) vers l'onboarding de RentReady.
   - Résultat : Le premier bien et le premier bail sont déjà pré-configurés dès la première connexion !

---

## 4. Métriques de Conversion Cibles à Suivre

Une fois Google Search Console et Plausible configurés :
- **Taux de complétion des outils gratuits :** % de visiteurs uniques utilisant un simulateur.
- **Taux de clic sur l'accroche d'automatisation :** % d'utilisateurs d'outils cliquant vers `/register`.
- **Taux d'activation J+1 :** % d'inscrits ayant finalisé la configuration d'un premier bien immobilier dans les 24 heures.
