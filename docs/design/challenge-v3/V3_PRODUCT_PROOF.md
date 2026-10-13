# V3 — preuve produit

## Origine des captures

Les images montrent les routes existantes `/dashboard` et `/billing`, avec leurs composants réels et leur logique serveur. Aucun dashboard n’a été généré, aucun écran produit n’a été dessiné pour le marketing et aucune route de démonstration n’a été ajoutée à l’application.

Une instance PostgreSQL éphémère a été créée dans le worktree, sur `127.0.0.1:65433`, base `lokna_challenge_v3`. Les binaires serveur ont été extraits dans le dossier ignoré `scripts/tmp/challenge-v3`, sans installation système ni modification d’un service existant. Le schéma a été appliqué exclusivement à cette base neuve. Un compte fictif s’est inscrit par le formulaire réel.

Le script `scripts/challenge-v3-product-capture.mjs` refuse toute autre URL de base de données. Les identifiants d’authentification de démonstration sont fournis par environnement et ne sont pas enregistrés dans les sources.

## Scénario

| Logement fictif | Loyer | Charges | Attendu | Reçu | Situation |
| --- | ---: | ---: | ---: | ---: | --- |
| Appartement Rivoli | 800 € | 50 € | 850 € | 850 € | Réglé |
| Studio des Tilleuls | 700 € | 50 € | 750 € | 750 € | Réglé |
| Appartement de la Cour | 850 € | 50 € | 900 € | 0 € | Échéance passée |
| **Total** | | | **2 500 €** | **1 600 €** | **900 € à percevoir** |

La fixture `src/data/gestion-locative-demo.json` est partagée par l’outil de capture et la landing. Les montants de la démonstration sont dérivés par `settlePeriodPayments` et additionnés avec `Decimal`, sans calcul monétaire flottant dans le composant client.

## Fonctionnalités vérifiées dans le code

| Message présenté | Implémentation examinée |
| --- | --- |
| Logement, locataire et bail reliés | `prisma/schema.prisma`, pages `properties`, `tenants`, `leases` et dossier `properties/[id]` |
| Loyers attendus, reçus et restant à percevoir | `src/app/(dashboard)/dashboard/page.tsx`, `FinancialSummary`, requêtes `dashboard-stats` |
| Retard identifiable et actions possibles | `dashboard/arrears-section.tsx`, `src/lib/queries/arrears.ts`, `ReminderButton`, `MarkPaidButton` |
| Journal et quittances téléchargeables | `billing/page.tsx`, `QuittanceButton`, route `api/transactions/[id]/receipt/download` |
| Quittance après règlement intégral, reçu avant | `src/lib/domain/period-settlement.ts`, `src/lib/actions/quittance-actions.tsx`, `src/lib/services/rent-payments.ts` |
| Date, calcul et validation de révision IRL | `leases/[id]/revision`, `src/lib/actions/irl-actions.ts`, `src/lib/domain/lease-revision.ts` |
| Tarifs affichés | `src/data/entity.ts` et `src/lib/stripe.ts` : Starter 9 €/mois, Pro 15 €/mois |
| Inscription sans carte bancaire | Formulaire et action d’inscription, contrôle réel jusqu’au dashboard décrit dans le rapport QA |

## Ce que fait la démonstration

Les onglets changent uniquement la capture et son explication. Les actions « Relancer », « Enregistrer » et « Télécharger » visibles dans les images appartiennent au véritable produit ; les images ne sont pas des contrôles interactifs. La page annonce explicitement les données fictives et l’absence d’opération exécutée.

Le premier écran identifie un loyer de 900 € manquant et les deux actions possibles. Le second montre que les deux loyers réglés donnent accès aux quittances, tandis que le troisième reste dû. Le paiement partiel est expliqué sans inventer un état d’interface supplémentaire.

Les captures originales, leur provenance et les résultats du contrôle produit se trouvent dans [product-captures](product-captures/). Le contrôle de téléchargement utilise une quittance fictive, une seconde lecture des mêmes octets et le refus du document pour un loyer non réglé ; voir [rapport QA](V3_QA_REPORT.md).

## Limites du produit relevées

Deux défauts existants ont été observés dans les captures sources : la synthèse financière étroite du dashboard peut faire chevaucher les montants, et le formulaire de paiement affiche parfois les identifiants du bail et de la période au lieu de leurs libellés. Les captures mobiles livrées se concentrent sur le bloc de retard lisible et le journal mobile. Les captures sources complètes et du formulaire sont conservées pour rendre ces limites vérifiables.

La durée de l’essai présente également une limite : `register-actions.ts` initialise la date après la création du client Stripe. Sans Stripe configuré, le compte accède au dashboard en statut TRIAL mais sans date de fin. La V3 ne reprend donc pas la promesse de 14 jours. La navigation, l’inscription et les tarifs partagés restent dans leur périmètre existant.

Ces défauts méritent une correction produit distincte. La V3 ne modifie aucun composant global ni aucune règle métier pour les masquer.
