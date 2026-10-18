# Décision V3.4

**NO-GO pour une commercialisation sans réserves.** Des corrections ciblées de fiabilité sont réalisées ; leur validation finale est consignée dans QA-REPORT. Aucun déploiement effectué ou autorisé par ce document.

## Blocages et risques restant à traiter

1. Quotas et plan canonique Starter/Pro absents du modèle utilisateur : le prix peut être correct sans que les limites vendues soient appliquées. Préparer le modèle et les règles de reprise, puis les vérifier sur une base de test.
2. Politique des anciens TRIAL sans date à approuver : leurs droits sont conservés. Il serait faux de dire que tous ces comptes expirent désormais automatiquement.
3. Paiements/annulations avec et sans échéance et révision puis annulation sont couverts. L’interaction simultanée avec toutes les modifications de bail et les suppressions doit encore être approfondie avant un engagement de fiabilité exhaustive.
4. Stripe, email, stockage, banque et ordonnanceur : code et tests locaux n’attestent pas la configuration opérationnelle. La recette d’exploitation doit être faite dans un environnement de test autorisé, puis un déploiement séparément approuvé.
5. Jeanbrun : simulation de neuf et hypothèses de foyer ; ancien et situations fiscales personnalisées hors périmètre du calcul. Ne pas présenter le comparatif comme une liquidation exacte d’impôt.
6. Les archives figent les montants et les octets PDF, mais toutes les identités historiques avant première génération ne sont pas photographiées. D’éventuelles archives émises avant correction du total acquitté doivent être identifiées et réémises explicitement, sans remplacement silencieux.
7. Checkout dans les dernières 48 h d’essai : demande refusée pour éviter une facturation anticipée. Un parcours de souscription anticipée différée demanderait une intégration dédiée.
8. Analytics : logs et événements consentis disponibles, mais agrégation, rétention et taux de conversion réels non démontrés. Pas de funnel d’utilisateurs uniques avant inscription.

## Ce qui est protégeable dès cette version

Refus sur panne d’abonnement, création unique de l’essai, aucune dépendance Stripe à l’inscription, paiement locataire via domaine canonique, traitement atomique des événements, contrôle serveur des mutations principales, historique locataire préservé en suppression courante, validation des baux, corrections fiscales et privacy, erreurs d’email sans fausse confirmation.

La décision peut devenir CONDITIONAL GO après revue des résultats QA, limitation explicite de la bêta et résolution des risques commerciaux retenus par l’équipe. Ce document ne vaut ni validation juridique générale ni autorisation de production.

## Recommandation V3.5

Commencer par les réserves bloquantes de fiabilité et de monétisation ci-dessus. Ensuite mesurer le parcours outil → inscription → bien → bail sur des cohortes consenties réelles avant d’optimiser l’acquisition. Conserver le design des outils et leurs URLs.

Dossier de preuve : [audit](AUDIT.md), [inventaire](FEATURE-INVENTORY.md), [parcours](GOLDEN-PATH.md), [abonnements](BILLING-AUDIT.md), [calculs](FINANCIAL-CORRECTNESS.md), [analytics](ANALYTICS-SPEC.md), [QA et captures](QA-REPORT.md).
