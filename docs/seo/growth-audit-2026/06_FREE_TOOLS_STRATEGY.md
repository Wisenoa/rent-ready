# 06 — Outils gratuits

## État actuel
Lokna publie 16 outils (`/outils/*`), chacun avec une page serveur et un composant client `calculator-client.tsx` de 114 à 463 lignes. Les intitulés des pages mentionnent tous des outils interactifs.

**Constats vérifiés**
- **`/outils/generateur-quittance` :**
  - il génère un PDF dans le navigateur (`@react-pdf/renderer`) ;
  - **il ne gère pas le paiement partiel** : pas de reçu, pas de solde restant dû ;
  - il demande un e-mail qui n'est envoyé nulle part (`quittance-generator-form.tsx:225` et `:254`) ;
  - il additionne les montants en flottants (`parseFloat`) ;
  - sa FAQ contient 2 obligations non prévues par la loi (doc 02 §5).
- **Deux pages pour un même besoin :** `/outils/modele-quittance-loyer-pdf` et `/templates/recu-loyer` doublonnent le générateur.
- **Calculateur IRL :** indices à jour jusqu'au T2 2026 (`src/lib/irl-calculator.ts`). **Le T3 2026 est publié mi-octobre** : il faut une procédure trimestrielle de mise à jour.
- **4 outils sous 310 mots :** plus-value, congé pour vente, LMNP, prêt.

## Évaluation (outils existants et candidats)

**Échelle :** 1 (faible) à 5 (fort). **SEO** = intention et concurrence observées ; **Conv.** = lien avec l'usage de Lokna ; **Diff.** = possibilité de faire mieux que les SERP actuelles ; **Effort** : 1 léger, 5 lourd.

| Outil | Intention / besoin | Concurrence SERP | Fonctionnalités attendues | Effort | Risque juridique | SEO | Conv. | Diff. | Décision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Générateur de quittance et reçu partiel** (existant) | Produire le document du mois | Selectra, BailFacile, 123loger | Quittance conforme, **reçu de paiement partiel avec solde**, loyer et charges séparés, PDF, plusieurs mois | 2 | Moyen (mentions de l'art. 21) | 5 | 5 | **5** (paiement partiel non mis en avant par les générateurs vus ; à confirmer page par page) | **P1 : refondre** |
| **Calculateur de révision IRL** (existant) | Calculer le nouveau loyer | service-public, PAP | Trimestre de référence, date anniversaire, alerte « révision non demandée depuis plus d'un an », lettre de notification | 2 | Moyen (art. 17-1) | 4 | 4 | 4 (lettre prête + rappel annuel dans Lokna) | **P1 : enrichir** |
| **Lettre de relance / mise en demeure** (existant) | Relancer un impayé | CAF, Luko, BailFacile | 3 tons, montant et période, mentions de la mise en demeure | 1 | Élevé (doit rester un modèle, sans conseil juridique) | 4 | 5 | 3 | **P1 : consolider** (fusionner modèle et guide) |
| **Prorata de loyer** (à créer) | Premier ou dernier mois | BailFacile, Omni, Luko | Méthode jours réels / 30 jours, charges au prorata, montant arrondi au centime (Decimal) | 1 | Faible | 3 | 3 | 3 | **P2 : créer** |
| **Régularisation des charges** (à créer) | Comparer provisions et dépenses réelles | BailFacile, Manda, SeLoger | Provisions versées sur 12 mois, dépenses par catégorie, solde, lettre au locataire avec décompte | 3 | Moyen (décret 87-713, délai d'un mois) | 4 | 4 | 4 | **P2 : créer** |
| Calculateur de dépôt de garantie (existant) | Plafond et restitution | — | Plafond vide ou meublé, délai de restitution, pénalité de retard | 1 | Faible | 3 | 2 | 2 | P2 : enrichir (restitution) |
| Calendrier des loyers / échéancier (à créer) | Planifier l'année | peu d'outils | Échéances, révision, régularisation, export ICS | 2 | Faible | 2 | 4 | 3 | P3 : à tester |
| Calculateur de rendement (existant) | Investisseur | SeLoger, Dougs, JD2M | Brut, net, cash-flow | — | Faible | 3 | 1 | 1 | Maintenir, ne pas investir |
| Plus-value, LMNP, prêt, Jeanbrun (existants) | Fiscalité, investissement | Spécialistes | — | — | **Élevé** (fiscal) | 2 | 1 | 1 | **Geler** ; vérifier les règles fiscales ou désindexer |
| Checklist état des lieux / modèle (existants) | Entrée et sortie | bailpdf, BailFacile | Pièce par pièce, comparaison entrée/sortie | 2 | Moyen (décret 2016-382) | 3 | 2 | 2 | P3 : fusionner les deux pages |
| Modèles de bail (existants) | Rédiger un bail | très forte | Contrat type du décret 2015-587 | — | Élevé | 3 | 2 | 1 | Maintenir ; vérifier la conformité au contrat type |

## Recommandation
**L'outil à développer en premier est la refonte du générateur de quittance**, pour trois raisons :
1. **Récurrence :** c'est l'intention la plus fréquente d'un bailleur, avec un besoin chaque mois.
2. **Vérité produit :** c'est exactement ce que Lokna fait (`settlePeriodPayments`) ; l'outil peut réutiliser la règle serveur au lieu de dupliquer un calcul.
3. **Différenciation :** aucun des générateurs vus dans les SERP ne met en avant le paiement partiel. C'est à confirmer en testant chacun avant d'en faire un argument.

**Spécification courte (P1)**
- Saisie du bailleur, du locataire, du logement, de la période, du loyer et des charges, puis **d'un ou plusieurs versements**.
- Calcul par la règle du produit (`settlePeriodPayments`, en Decimal) : **quittance si soldé, reçu de paiement partiel avec solde restant dû sinon**.
- PDF avec les intitulés du PDF produit (`src/lib/quittance-generator.tsx`).
- **Pas d'e-mail demandé.** En sortie, une proposition : « Recevoir la quittance de chaque mois automatiquement » → `/register` avec les données pré-remplies, si le consentement le permet (doc 09).
- Une seule URL (`/outils/generateur-quittance`). Les autres pages quittance redirigent en 301 ou renvoient vers celle-ci.

**Ensuite :**
- **IRL :** lettre de notification de la révision, et rappel « vous avez un an pour la demander » (art. 17-1).
- **Prorata, puis régularisation des charges.**
