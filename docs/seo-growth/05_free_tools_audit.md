# 05 — Audit des Outils Gratuits (16 Outils sous `/outils/*`)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : Hub `/outils` et les 16 outils interactifs en libre accès

---

## 1. Inventaire et État de la Conversion

| Outil | Problème utilisateur résolu | Précision juridique | Bouton / CTA Inscription | Statut Conversion |
| :--- | :--- | :---: | :---: | :---: |
| **`/outils/calculateur-irl`** | Calcule l'augmentation légale INSEE | Conforme (Série 001515333) | **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/modele-quittance-loyer-pdf`**| Modèle PDF loi 1989 prêt à remplir | Conforme (Art. 21) | **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/generateur-quittance`** | Génère une quittance en ligne | Conforme | **NON (0 CTA)** | **RUPTURE MAJEURE** |
| **`/outils/lettre-relance-loyer`** | Rédige une lettre de relance impayé | Conforme (Procédure amiable) | **NON (0 CTA)** | **RUPTURE MAJEURE** |
| **`/outils/calculateur-charges-locatives`**| Régularisation annuelle des charges| Conforme (Décrets 87) | **NON (0 CTA)** | **RUPTURE MAJEURE** |
| **`/outils/calculateur-depot-garantie`** | Plafond légal de la caution | Conforme (1 mois nu / 2 meublé)| **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/calculateur-loyer`** | Calcul loyer et encadrement | Conforme | **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/calculateur-preavis`** | Durée préavis (1 mois vs 3 mois) | Conforme (Zone tendue/motif) | **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/calculateur-rendement`** | Calcul rentabilité brute et nette | Financièrement exact | **NON (0 CTA)** | **RUPTURE MAJEURE** |
| **`/outils/calculateur-surface-habitable`**| Différence Carrez / Boutin | Conforme | **NON (0 CTA)** | À OPTIMISER |
| **`/outils/checklist-etat-lieux`** | Grille d'état des lieux | Conforme (Décret 2016) | **OUI** (`/register`) | OPÉRATIONNEL |
| **`/outils/generateur-conge-vente`** | Congé pour vente ou reprise | Conforme (Art. 15 loi 1989) | **NON (0 CTA)** | À OPTIMISER |
| **`/outils/simulateur-fiscalite-lmnp`** | Comparatif micro-BIC vs réel | Fiscalement exact | **NON (0 CTA)** | À OPTIMISER |
| **`/outils/simulateur-pret-immobilier`**| Calcul mensualité et coût crédit | Financièrement exact | **NON (0 CTA)** | PÉRIPHÉRIQUE |
| **`/outils/calculateur-plus-value`** | Calcul abattements durée détention | Fiscalement exact | **NON (0 CTA)** | PÉRIPHÉRIQUE |

---

## 2. Le Paradoxe des Outils : Forte Utilité, Zéro Passerelle Produit

Le générateur de quittances (`/outils/generateur-quittance`) et le modèle de lettre de relance (`/outils/lettre-relance-loyer`) résolvent **exactement** le problème pour lequel RentReady a été créé.

Pourtant, un utilisateur qui génère sa quittance ou sa lettre de relance :
1. Télécharge son document gratuitement.
2. Ne voit **aucun encart** lui proposant : *« Enregistrez ce bien sur RentReady pour automatiser la quittance du mois prochain sans ressaisir vos coordonnées. »*
3. Quitte le site sans convertir.

---

## 3. Modèle Product-Led SEO Cible

Pour chaque outil gratuit, le parcours doit respecter la promesse de libre accès (zéro paywall ni blocage d'email pour voir le résultat), tout en proposant la continuité naturelle dans RentReady :

```text
Recherche Google ("calculateur irl 2026")
  ↓
Page Outil (/outils/calculateur-irl)
  ↓
Calcul immédiat sans inscription (Ex: +16,36 €/mois)
  ↓
Encart de passage à l'action contextuel :
« Programmer le rappel automatique pour la révision d'octobre 2027 ? »
  ↓
Création de compte 14 jours gratuits sans CB (/register)
  ↓
Saisie du premier logement dans le produit
```
