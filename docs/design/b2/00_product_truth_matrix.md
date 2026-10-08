# Matrice de Vérité Produit RentReady (B.2 Product Truth Matrix)

> **Règle absolue :** Aucun claim `UNPROVEN`, `FALSE` ou `UNKNOWN` ne doit apparaître dans la copy, les héros ou les maquettes B.2. Tout ce qui est affirmé sur la landing page doit être étayé par une implémentation prouvée dans le code source ou le runtime.

**Date d'audit :** 8 octobre 2026  
**Auditeur :** Principal Product Designer & Staff Product Engineer  
**Périmètre :** Codebase RentReady (`src/app/`, `src/lib/`, `src/config/`, `prisma/schema.prisma`)

---

## 1. Synthèse de conformité

| Statut | Définition | Règle d'usage B.2 |
| :--- | :--- | :--- |
| **PROVEN** | Code source vérifié, logique métier exécutée et testée en production/CI. | Utilisable sans restriction avec formulation exacte. |
| **PARTIAL** | Logique métier existante côté backend ou flux manuel, mais pas automatisé de bout en bout ou UI non exposée. | Utilisable uniquement avec la nuance opérationnelle exacte (ex: « en 1 clic » et non « automatique »). |
| **UNPROVEN** | Mentionné dans un texte marketing passé, mais sans infrastructure ou code attestant la réalité technique. | **STRICTEMENT INTERDIT** dans B.2. Remplacer par formulation neutre et vérifiable. |
| **FALSE** | Contredit par le code réel ou totalement absent de la solution. | **STRICTEMENT BANI**. |
| **UNKNOWN** | Non auditable ou dépendance externe non configurée. | **STRICTEMENT BANI**. |

---

## 2. Matrice d'audit détaillée

| # | Fonctionnalité / Claim marketing | Statut | Preuve dans le code (Evidence) | Formulation autorisée (Safe Wording) | Risque & Pièges à éviter |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Quittances automatiques** | **PARTIAL** | `src/lib/actions/quittance-actions.tsx:39-46` : « *NOT SENT BY EMAIL. Issuing a receipt here does not email it to the tenant. Deliberate for beta: landlord downloads from billing screen* ». La génération PDF est idempotente et déclenchée par action utilisateur ou API. | « Quittance de loyer conforme générée en 1 clic dès encaissement. Téléchargement PDF immédiat. » | Ne JAMAIS écrire « Quittances envoyées automatiquement chaque mois par email ». Le bailleur génère et transmet, ou le locataire consulte son portail. |
| **2** | **Distinction Quittance vs Reçu de paiement partiel** | **PROVEN** | `src/lib/actions/quittance-actions.tsx:20-25`, `src/lib/domain/period-settlement.ts`, `src/lib/quittance-generator.tsx:423` : Un paiement intégral génère une « Quittance », un paiement partiel génère un « Reçu de paiement partiel » avec le solde restant dû (art. 21 loi 89-462). | « Distinction légale stricte : quittance pour solde intégral, reçu d'acompte avec solde restant en cas de versement partiel. » | Atout de différenciation majeur vs concurrents qui émettent des fausses quittances intégrales pour des paiements partiels. |
| **3** | **Envoi d'email automatique de quittance** | **FALSE** | `src/lib/actions/quittance-actions.tsx:39` : aucun webhook ni cron n'expédie silencieusement la quittance au locataire par email sans validation. | « Téléchargement du PDF ou mise à disposition sur l'espace locataire sécurisé. » | Risque juridique et opérationnel si un document fiscal/juridique partait sans le contrôle du bailleur. |
| **4** | **Relances de loyer par email** | **PROVEN** | `src/lib/actions/transaction-actions.tsx:250-280`, `src/emails/payment-reminder.tsx` : Envoi par Resend avec 3 tons paramétrables (cordial, formel, mise en demeure légale). | « Relance des retards de paiement en un clic : modèle cordial, formel ou mise en demeure juridique. » | L'envoi est déclenché par le propriétaire (bouton explicite), ce n'est PAS un robot autonome d'envoi non contrôlé. |
| **5** | **Révision de loyer IRL** | **PROVEN** | `src/lib/irl-calculator.ts`, `src/lib/actions/irl-actions.ts`, article 17-1 loi du 6 juillet 1989. Calcul : `Loyer × (Nouvel IRL / IRL réf)`. Saisie trimestrielle validée. | « Calcul instantané de la révision légale selon l'indice IRL officiel de l'INSEE. Application en un clic. » | Le bailleur valide l'application de la révision ; le loyer n'augmente pas dans le dos du propriétaire. |
| **6** | **Alertes d'échéance IRL** | **PROVEN** | `src/app/api/cron/revision-check/route.ts` : Cron qui détecte les baux à 30 jours de leur date anniversaire et génère une notification dans l'application. | « Notification 30 jours avant la date anniversaire pour ne jamais oublier d'appliquer votre révision IRL. » | Préciser « notification dans l'application » plutôt que « courrier recommandé automatique ». |
| **7** | **Données INSEE en temps réel** | **PARTIAL** | `src/lib/irl-calculator.ts:40-67` : Les indices IRL sont transcrits depuis la série INSEE `001515333` jusqu'au T2-2026 (`148.37`). Pas d'appel HTTP temps réel à une API INSEE publique, mais une table validée et maintenue. | « Indices officiels de référence des loyers (IRL) de l'INSEE intégrés et mis à jour. » | Ne PAS prétendre à un « branchement API direct en direct de Bercy/INSEE ». Les valeurs sont certifiées conformes à la série officielle. |
| **8** | **Export comptable CSV** | **PROVEN** | `src/app/api/e-reporting/export/route.ts:230-259` : Export au format CSV structuré (`Période,Locataire,Bien,Loyer,Charges,Total,Date paiement,Type reçu,N° reçu`). | « Export CSV de vos encaissements et loyers pour votre comptable ou déclaration fiscale. » | Export réel, propre et fonctionnel. |
| **9** | **« Export FEC » / « FEC certifié »** | **FALSE** | `grep -rni "fec" src/` retourne 0 occurrence dans le code fonctionnel. Il n'existe aucun générateur de Fichier des Écritures Comptables à 18 colonnes (norme A.47 A-1 du LPF). | **PROHIBÉ**. Utiliser uniquement « Export CSV des encaissements ». | Faute grave si un bailleur promet à son expert-comptable un FEC normé alors que c'est un CSV des flux de loyers. |
| **10** | **Open Banking / Rapprochement bancaire** | **PARTIAL** | `src/app/api/webhooks/bank/route.ts`, `src/lib/domain/bank-reconciliation.ts` : Intégration Bridge API (DSP2). Rapprochement intelligent basé sur le solde restant dû et tolérance centime/seuil 50 €. Gestion d'idempotence et replays. Pas de flux de connexion bancaire en self-service direct dans l'UI courante. | « Rapprochement bancaire intelligent : identification des virements de loyers et détection automatique des écarts. » | Ne PAS afficher « Connectez 500 banques en 10 secondes » tant que le tunnel de connexion Bridge Connect n'est pas intégré dans le dashboard utilisateur. |
| **11** | **Plafonds des plans (Starter vs Pro)** | **PROVEN** | `src/lib/stripe.ts:26-99`, `src/app/(marketing)/pricing/page.tsx` :  <br>• **Starter** : 9 €/mois (89 €/an), jusqu'à 3 logements.<br>• **Pro** : 15 €/mois (149 €/an), jusqu'à 10 logements. | « Plan Starter à 9 €/mois (jusqu'à 3 logements) · Plan Pro à 15 €/mois (jusqu'à 10 logements, avec révision IRL et analyse IA). » | Les prix et plafonds sont gravés dans les ID Stripe et vérifiés par les tests de contrat tarifaire. |
| **12** | **Analyse IA de baux locatifs** | **PROVEN** | `src/app/api/ai/analyze-lease/route.ts`, `src/lib/ai/lease-analyzer.ts` : Appel OpenAI GPT-4o avec schéma Zod strict (`risks`, `compliance`, `missingClauses`, `irlCompliant`, `depositCompliant`, etc.). | « Analyse assistée par IA de vos contrats de bail : détection des clauses non conformes ou à risque. » | Ne pas promettre une « rédaction automatique d'actes d'avocat certifiés ». C'est un outil d'audit et d'alerte sur les clauses. |
| **13** | **Hébergement « OVHcloud France Gravelines »** | **UNPROVEN** | `Dockerfile`, `docker-compose.prod.yml`, `.env.example` : Le code supporte Docker, Postgres et Vercel. Aucune configuration d'infrastructure ne prouve un hébergement exclusif à Gravelines. | « Données hébergées en conformité RGPD, transmissions sécurisées TLS 1.3 et stockage chiffré. » | Ne pas citer une ville ou un data center spécifique non documenté dans l'infrastructure de déploiement réelle. |
| **14** | **« Garant légal certifié » / Garantie loyer impayé (GLI)** | **FALSE** | `src/data/articles.ts` traite de la GLI à titre informatif. Il n'y a aucun courtier GLI ni module de caution solidaire intégrée dans l'application. | **PROHIBÉ**. Zéro mention sur la landing page. | Invention pure du rapport précédent ; aucun tiers d'assurance n'est branché. |
| **15** | **Portail locataire** | **PROVEN** | `src/app/portal/[token]/page.tsx`, `src/app/portal/[token]/quittances.tsx` : Espace accessible sans mot de passe via jeton sécurisé, permettant au locataire de télécharger ses quittances et de consulter son historique. | « Espace locataire dédié : accès direct et sécurisé pour télécharger ses quittances en toute autonomie. » | Très forte valeur ajoutée, 100% prouvée par le code et les tests E2E. |
| **16** | **Suivi du cycle mensuel et gestion des exceptions** | **PROVEN** | `src/lib/domain/generate-rent-periods.ts`, `src/lib/domain/period-settlement.ts`, `src/app/(dashboard)/billing/page.tsx` : Gestion des états : à échoir, en attente, partiel, réglé, retard. | « Suivi mensuel automatique : ce qui est réglé s'archive, seule l'anomalie (retard, versement partiel) reste à l'écran. » | C'est le cœur même du produit et de la différenciation RentReady. |

---

## 3. Règles d'écriture pour l'équipe de rédaction B.2

1. **Pas d'automatisation fantôme :** Lorsqu'une action nécessite un clic du bailleur (générer la quittance, envoyer la relance, appliquer la révision), dire « en 1 clic », « d'un simple clic » ou « assisté », jamais « automatique en arrière-plan ».
2. **Vocabulaire quotidien :** Utiliser *logement, bailleur, locataire, loyer, charges, quittance, reçu d'acompte, retard, révision IRL*. Bannir formellement *intendance foncière, arrêté, décharge, grand livre, patrimoine administré*.
3. **Pas de promesses institutionnelles abusives :** Ne jamais utiliser « certifié par l'État », « FEC homologué », « agréé Trésor Public ». Citer les textes de référence avec exactitude (*loi du 6 juillet 1989, article 21, article 17-1*).
4. **Tarifs transparents :** Starter (9 €/mois / 89 €/an / 3 biens max) et Pro (15 €/mois / 149 €/an / 10 biens max).
