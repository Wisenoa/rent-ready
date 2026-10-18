# Abonnements, essais et Stripe

## États et séparation des contrôles

Authentification : Better Auth et utilisateur de base existant. Autorisation : scope propriétaire sur chaque ressource. Droit commercial : ACTIVE, ou TRIAL non expiré. PAST_DUE, CANCELLED, EXPIRED et état inconnu sont refusés. Le moment exact trialEndsAt est déjà expiré.

La page `/billing` reste accessible au bailleur authentifié pour souscrire et consulter ses données. Ce droit ne donne pas accès aux mutations de biens, locataires, baux et paiements : ces endpoints vérifient indépendamment subscription-access. Les documents historiques restent accessibles au propriétaire. Les outils publics ne reçoivent aucun paywall.

Une erreur Prisma/session ne donne aucun accès par défaut. SubscriptionGate ne capture pas les exceptions de Next.js : redirect reste hors try/catch, selon la [documentation Next 15](https://nextjs.org/docs/15/app/api-reference/functions/redirect). Les guides locaux `node_modules/next/dist/docs` sont absents dans cette installation Next 15.5.9.

## Essai

Le hook user.create de Better Auth fixe TRIAL et création + 14 jours. getCurrentUser est une lecture. L’inscription n’appelle plus Stripe et aucune tâche de customer ne peut réécrire les droits. Checkout ne crée plus une nouvelle période de 14 jours ; il utilise la date restante seulement quand Stripe accepte encore un trial_end suffisamment éloigné. Le SDK Stripe 21 documente un minimum de 48 h. Pendant cette dernière fenêtre, la demande est refusée avec une explication : elle ne raccourcit pas l’essai et ne crée aucun paiement anticipé. Après expiration, checkout sans nouvel essai. Référence : [Checkout Session, subscription_data](https://docs.stripe.com/api/checkout/sessions/create).

Exception historique explicite : TRIAL avec date null conserve les droits antérieurs. Aucune date n’est ajoutée rétroactivement. Il faut décider la reprise de ces comptes avant d’affirmer que tous les essais ont une expiration. Aucun statut inconnu ne bénéficie de cette exception.

## Transitions et effets externes

- Session de checkout abonnement : on consulte l’abonnement actuel chez Stripe ; le seul retour navigateur ne change aucun droit.
- Subscription created/updated/deleted et invoice failed/paid : même synchronisation, utilisateur sérialisé par verrou PostgreSQL. Un événement ancien d’un abonnement remplacé n’annule pas le nouveau.
- active → ACTIVE ; trialing → TRIAL ; past_due/unpaid/incomplete → PAST_DUE ; canceled → CANCELLED ; incomplete_expired/paused/inconnu → EXPIRED.
- Aucun changement de statut n’est propagé aux organisations dont l’utilisateur est simplement membre : cette relation ne prouve pas la propriété de leur abonnement.
- Marqueur StripeWebhookEvent et mutations sont dans la même transaction. Doublon → déjà traité. Échec de base ou Stripe → rollback et HTTP 500, donc réessayable.
- Rent checkout : payment_status=paid, EUR, montant positif en centimes, PaymentIntent requis, relation échéance/locataire vérifiée. Paiement partiel/multiple reste traité par le domaine existant. Cas incertain ou solde devenu incompatible : erreur et rapprochement manuel requis.
- Achat ponctuel : mode payment, prix du catalogue configuré, userId serveur, métadonnées autorisées. Pas d’octroi avant preuve paid.

## Vérification et limites

billing-v34.db.test exécute la déduplication concurrente et le rollback sur PostgreSQL réel, Stripe étant simulé. subscription-gate.test exécute les refus et pannes. Le navigateur vérifie les états et les endpoints directs. billing-boundaries-v34.test vérifie aussi signature absente/invalide, erreur réessayable et la fenêtre des 48 h. Voir QA-REPORT pour les résultats réellement obtenus.

Restent : quotas Starter/Pro non modélisés côté User ; politique des essais historiques ; risque de souscriptions concurrentes à des plans différents ; annulation/reprise et configuration des vrais prix à confirmer dans un environnement Stripe de test autorisé. Aucun appel Stripe réel ni modification d’abonnement réel pendant cet audit.
