# V3 — revue de conversion

## Ce que le visiteur comprend

La première phrase nomme la gestion locative. Le texte explique immédiatement les informations suivies et les situations à repérer. La photographie conserve l’univers immobilier, tandis que le véritable écran réduit l’incertitude sur le logiciel que le propriétaire va utiliser.

Le CTA « Essayer Lokna » mène à `/register`. L’action « Voir le suivi en action » mène à la démonstration sur la même page. Le tarif d’entrée reste visible, avec un lien `/pricing`. Après les fonctionnalités et les réponses pratiques, le CTA final reprend le même parcours.

La réassurance repose sur des éléments vérifiables : application réelle, tarifs issus des données du projet, inscription sans carte, règles de document explicites et outils gratuits accessibles. La durée de 14 jours n’est plus promise sur cette landing, car son initialisation dépend du succès de Stripe dans le code existant. Aucun témoignage, volume d’utilisateurs, certification, promesse de gain de temps ou taux de conversion n’est ajouté.

## Pourquoi deux vues de démonstration

La situation du mois montre une exception précise plutôt qu’un tableau de chiffres décoratif. La seconde vue répond à la question « Où sont mes quittances ? ». Les montants reçus et les sommes dues restent distincts. Le visiteur peut explorer les deux vues au clavier sans s’inscrire.

Le comparatif explique quand un suivi relié aux documents devient utile. Il reconnaît qu’Excel peut servir à construire un suivi sur mesure. Il ne prétend pas que le tableur est incapable de calculer et ne chiffre aucun gain.

## Parcours contrôlés

Les destinations du hero, du CTA final, de la page tarifaire, des outils et du maillage local sont contrôlées dans la vérification navigateur. Le formulaire d’inscription est également testé contre la base locale isolée jusqu’au dashboard ; le contrôle de date d’essai a révélé un échec documenté. Les résultats exacts sont dans [V3_QA_REPORT.md](V3_QA_REPORT.md).

Un achat Stripe, un email, une connexion bancaire et un abonnement de production ne sont pas nécessaires pour évaluer cette landing et n’ont pas été exécutés.

## Recommandations après évaluation

1. Initialiser la date d’essai indépendamment de Stripe et corriger les deux défauts produit repérés sur mobile et dans les sélecteurs de paiement.
2. Corriger l’endpoint de session de la navigation et le contraste du footer, puis réparer l’intégration analytics partagée avant de mesurer un funnel d’acquisition fiable.
3. Observer ensuite le parcours visite → consultation du suivi → inscription → premier logement → premier bail → premier paiement. Comparer les comportements réels avant de conclure sur la conversion.

L’amélioration de conversion reste une hypothèse de design. Aucun score visuel ni mesure de chargement local ne prouve une hausse des inscriptions.
