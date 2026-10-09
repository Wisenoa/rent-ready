# RentReady — Matrice de Vérité Produit & Revue des Allégations

**Règle absolue :** Tout ce qui figure sur la homepage de production doit correspondre strictement à une implémentation vérifiée dans la codebase (`src/app/`, `src/lib/`, `prisma/`). Les fonctionnalités inexistantes ou inaccessibles sont bannies (`FALSE`/`UNKNOWN`). Les fonctionnalités partiellement implémentées ou manuelles sont formulées avec rigueur (`PARTIAL`).

---

## 1. Revue Détaillée des Allégations Marketing

| # | Promesse commerciale | Statut | Fichier source (Evidence) | Formulation autorisée en production (Final Copy) | Risques & Décision technique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Essai gratuit 14 jours** | **PROVEN** | `src/lib/actions/register-actions.ts:92`<br>`src/lib/stripe.ts:92` | « 14 jours d'essai gratuit sur chaque formule. » | **CONSERVER**. Le statut `TRIAL` est attribué pour 14 jours dès l'inscription. |
| **2** | **Sans carte bancaire** | **PROVEN** | `src/app/register/register-form.tsx:17-21`<br>`src/lib/actions/register-actions.ts:20-65` | « Sans carte bancaire requise. » | **CONSERVER**. L'inscription ne demande que nom, email et mot de passe. |
| **3** | **Configuration en 3 minutes** | **UNKNOWN** | Aucun chrono ou tracking objectif dans le code | *Supprimé* | **SUPPRIMÉ**. Durée arbitraire non prouvable pour tout utilisateur. |
| **4** | **Quittances automatiques envoyées par email** | **FALSE** | `src/lib/actions/quittance-actions.tsx:39-46` : « *NOT SENT BY EMAIL... landlord downloads from billing screen* » | « Quittances conformes générées en 1 clic dès encaissement. Téléchargement PDF immédiat. » | **INTERDIT d'écrire envoi email automatique**. Le bailleur télécharge ou le locataire consulte son espace. |
| **5** | **Distinction Quittance vs Reçu de paiement partiel** | **PROVEN** | `src/lib/domain/period-settlement.ts`<br>`src/lib/quittance-generator.tsx:423`<br>Loi 89-462 art. 21 | « Quittance de loyer délivrée dès paiement intégral. Reçu d'acompte avec solde restant dû en cas de versement partiel (loi du 6 juillet 1989 art. 21). » | **CONSERVER**. Différenciateur majeur, rigoureusement implémenté dans le domaine. |
| **6** | **Révision annuelle IRL INSEE** | **PROVEN** | `src/lib/irl-calculator.ts`<br>`src/lib/actions/irl-actions.ts`<br>Loi 89-462 art. 17-1 | « Calcul de la révision légale selon la série officielle INSEE (série n° 001515333). Application en un clic. » | **CONSERVER**. Indices historiques et récents (T2-2023 à T2-2026) intégrés et testés. |
| **7** | **Alerte d'échéance IRL** | **PROVEN** | `src/app/api/cron/revision-check/route.ts` | « Notification 30 jours avant la date anniversaire pour ne pas oublier d'appliquer votre révision IRL. » | **CONSERVER**. Cron fonctionnel détectant les baux à 30 jours de leur date d'anniversaire. |
| **8** | **Rapprochement bancaire intelligent** | **PARTIAL** | `src/lib/domain/bank-reconciliation.ts`<br>`src/app/api/webhooks/bank/route.ts` | « Détection des virements de loyers et calcul automatique des écarts au centime près. » | **CONSERVER AVEC NUANCE**. Ne pas survendre un Open Banking magique en self-service direct. |
| **9** | **Export comptable CSV** | **PROVEN** | `src/app/api/e-reporting/export/route.ts:230-259` | « Export CSV de vos encaissements pour votre comptable ou votre déclaration fiscale. » | **CONSERVER**. Export CSV complet et testé. |
| **10** | **Export FEC certifié** | **FALSE** | `grep -rni "fec" src/` retourne 0 résultat | *Banni* | **BANI**. RentReady exporte des flux CSV, pas un Fichier des Écritures Comptables normé A.47 A-1. |
| **11** | **Factur-X / E-reporting B2C 2026** | **UNPROVEN** | Présent dans l'ancienne FAQ mais non prêt pour la production | *Supprimé de la FAQ homepage* | **SUPPRIMÉ**. Retiré de la homepage de production pour éviter d'induire en erreur les bailleurs. |
| **12** | **Simulateur fiscal Jeanbrun 2026** | **UNPROVEN** | Présent dans l'ancienne FAQ mais absent du runtime applicatif | *Supprimé de la FAQ homepage* | **SUPPRIMÉ**. Retiré de la FAQ pour préserver la stricte vérité produit. |
| **13** | **Tarifs des abonnements** | **PROVEN** | `src/lib/stripe.ts:26-99`<br>`src/data/entity.ts` | • Starter : 9 €/mois (ou 89 €/an) jusqu'à 3 logements.<br>• Pro : 15 €/mois (ou 149 €/an) jusqu'à 10 logements. | **CONSERVER**. Montants et limites gravés dans Stripe et vérifiés par les tests CI. |
| **14** | **Hébergement OVHcloud France Gravelines** | **UNPROVEN** | Dockerfile et Vercel sans mention géographique garantie | « Données hébergées en conformité RGPD, transmissions chiffrées en TLS 1.3 et stockage sécurisé. » | **NE PAS CITER DE VILLE**. Formulation conforme RGPD sans allégation d'infrastructure non garantie. |
| **15** | **Certification de conformité globale** | **FALSE** | Aucune autorité ne délivre de label « Logiciel certifié loi 1989 » | Citer les textes précis : *art. 21* et *art. 17-1* | **SUPPRIMER les badges généraux « Conforme Loi 1989 »**. Préférer la conformité documentée des règles. |

---

## 2. Décisions de Rédaction Définitives

1. **H1 Définitif :**  
   *« Gérez vos locations sans tableur. »*
2. **Sous-titre Définitif :**  
   *« Le logiciel pour propriétaires bailleurs : suivi des loyers, quittances prêtes en un clic et rappels de révision IRL. Vous n'intervenez que si une action est nécessaire. »*
3. **Micro-proof CTA :**  
   *« 14 jours d'essai gratuit · Sans carte bancaire »*
4. **Titre de la section cadre légal :**  
   *« Des documents justes, des règles claires. »*
5. **Signature de marque (Aha Moment) :**  
   *« Tout ce qui va bien devient silencieux. »*
