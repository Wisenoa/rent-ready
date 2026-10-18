# Parcours bailleur

## Parcours réel

1. `/register` : nom, email, mot de passe. register-actions valide ; Better Auth écrit utilisateur/credentials, fixe une fois la fin d’essai. Connexion email puis `/dashboard`. Stripe n’est pas appelé.
2. Dashboard vide : « Ajouter mon premier logement », PropertyForm. Il ne faut pas tester l’ancien libellé « Aucun bien », absent de cette version.
3. `/properties` ou détail du bien : bien puis ajout du locataire via TenantForm. L’assistant V2 existe aussi : bien → locataire → bail, trois formulaires puis confirmation. Aucun nouveau wizard.
4. `/leases/new` : bien et locataire sélectionnés, loyer HC 850 €, provisions 70 €, dates, dépôt, jour de paiement. La création du bail et les échéances jusqu’au mois courant partagent une transaction. Le PDF de bail est un effet séparé et n’est pas garanti sans stockage.
5. `/billing` : période attendue 920 €, échéance au 5. Formulaire de paiement lié à la période réelle ; le serveur recalcule le solde et vérifie les relations.
6. Paiement 500 € : reçu partiel, 420 € encore collectables. Paiement complémentaire 420 € : mois soldé, quittance possible. Aucun reçu partiel déjà archivé n’est remplacé.
7. Adresse du bailleur requise dans `/settings/profile` avant première quittance. La création d’un compte ne prétend pas avoir ces coordonnées. Téléchargement PDF réel depuis la ligne de paiement ou la bibliothèque.

L’interface impose des formulaires distincts ; aucune durée d’activation n’est revendiquée sans mesure chronométrée. Le premier résultat est l’échéance effectivement enregistrée, pas une animation de succès. Le test golden-path crée bien, locataire et bail dans les formulaires existants ; le test multi-biens utilise aussi les vraies API puis contrôle les pages et les PDF. Ces deux niveaux sont distingués dans QA-REPORT.

## Sources de vérité

- Property et Tenant appartiennent à User ; Lease lie les deux.
- Transaction porte deux rôles existants : échéance si paidAt est null, encaissement sinon. Les rapprochements passent par services/rent-payments et les fonctions de règlement de période.
- Le reste à payer et le statut de retard se déduisent du domaine, pas d’un flag UI autonome.
- Decimal pour les montants ; receiptRentAmount/receiptChargesAmount figent les sommes dues au moment du paiement.
- Document.transactionId est unique ; ReceiptCounter numérote par bailleur. Les PDF déjà archivés sont renvoyés à la nouvelle demande.
- L’utilisateur de session est le scope. Un ID d’enfant fourni par le navigateur ne suffit pas à autoriser l’accès.

## Matrice

| Cas | Comportement attendu / retenu | Couverture |
| --- | --- | --- |
| 850 + 70, paiement 920 | mois soldé, quittance | billing-v34.db + navigateur |
| 500 puis 420 | reçu/solde 420 puis quittance ; ancienne archive intacte | reliability-v34.spec + domaine existant |
| 1 000 sur 920 | refus avec solde, aucune affectation automatique | rent-payment-door et tests de plafond existants |
| 0 / négatif | refus serveur | validations / services existants |
| doublon/concurrence | Serializable avec reprise bornée P2034/conflit de commit, CAS et index de période ; webhook événement et intent uniques | rent-generation-concurrency.db, billing-v34.db |
| annulation | ligne financière conservée et solde rouvert | cancel-payment.db, payment-history-v34.db (révision puis annulation, annulations simultanées, paiement sans échéance) |
| révision loyer/charges | mois déjà encaissés figés | rent-revision.db, charges-revision.db ; billing-v34.db vérifie modification API et rollback |
| retard et deux logements | solde et états indépendants, relance sans faux succès | reliability-v34.spec |
| février, bissextile, fin de bail, année suivante | bornes des périodes | rent-periods, multi-month, lease-expiry.db, month-rollover.db |
| étranger au bail/échéance/document | refus sans fuite | suites authorization, cross-owner-child-ids, portail et navigateur |

Les résultats exécutés, et les limites de couverture navigateur, sont consignés dans QA-REPORT.md. Un test unitaire n’est jamais présenté comme une validation du fournisseur de production.
