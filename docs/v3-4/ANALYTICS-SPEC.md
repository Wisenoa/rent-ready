# Analytics — contrat V3.4

## Inventaire du code initial

| Système | Envois initiaux / destination | Usage constaté | Consentement / risque |
| --- | --- | --- | --- |
| Analytics marketing | page-view interne : URL entière, referrer, UTM, UA, IP | composant monté dans (marketing), absent du groupe (outils) | non conditionné ; données individualisées des calculateurs dans query possibles |
| Homepage tracker | événements Plausible + beacon sur le même page-view | les événements envoyés n’étaient pas compris par le handler pageview | contrat divergent ; commentaire affirmant abusivement l’exemption générale de consentement |
| Plausible | window.plausible conditionnel | aucun chargement de script trouvé dans le code audité | fonctionnement effectif non établi, doublon de pageview possible si script auto ajouté |
| PostHog | getPostHog, client serveur optionnel | aucun appelant trouvé dans src | code présent ≠ collecte active ; configuration réelle non vérifiée |
| Vercel Analytics | composant seulement si VERCEL | site prévu dans Docker ; présence de la dépendance ne prouve pas un export | URL automatique non filtrée dans le code initial |
| Web Vitals | track Vercel + logs dev | métriques techniques, sans destination effective démontrée | soumis à consentement et environnement Vercel explicite |
| Onboarding track | AuditLog, événements client arbitraires | V2 et ancien wizard émettaient IDs/loyer et metadata non validée | pas de consentement / liste blanche |
| First touch | colonnes User, parser cookie rr_ft | composant émetteur absent, documenté comme cassant autrefois les pages ville | aucun funnel attribuable opérationnel démontré |

## Contrat retenu

Une destination interne pour les événements du navigateur, `/api/analytics/page-view`, avec zod et liste blanche d’événements. Le endpoint n’enregistre ni IP, ni user-agent, ni referrer, ni query string. Les routes publiques sont filtrées ; les slugs dynamiques sont remplacés par [slug], les chemins privés sont abandonnés. Les 16 noms d’outils sont une enum, jamais un texte de formulaire.

Collecte facultative : décision version V3.4 explicite, horodatée et conservée 180 jours, synchronisée en cookie pour les événements serveur. Une navigation ne prolonge jamais cette durée : seul le délai restant est synchronisé, puis le cookie est retiré à expiration. L’ancien accord à une bannière parlant seulement de cookies nécessaires n’est pas réutilisé comme accord à la mesure. Retrait depuis `/politique-cookies`, effectif avant réouverture de la bannière. Le produit reste utilisable en cas de refus, stockage navigateur désactivé ou panne du collecteur.

Le cookie source_tool ne contient que le slug d’un outil ; écrit après clic vers l’inscription, avec consentement, pendant 30 jours. Il permet une attribution d’activation au compte, pas une identité visiteur intersites. Aucun fournisseur n’est présumé exempté de consentement.

| Événement | Déclenchement | Données permises / déduplication |
| --- | --- | --- |
| pageview | navigation publique, chemin changé | chemin filtré ; une émission par montage/navigation ; pas de query |
| tool_viewed | page publique d’un des 16 outils | slug ; une émission par navigation |
| tool_started | première interaction de formulaire consentie | slug ; une fois par navigation |
| tool_completed | après interaction, résultat valide présent dans le DOM et absence de contrôle invalide | slug ; une fois, délai 600 ms ; exemples initiaux non comptés sans interaction |
| tool_document_downloaded | génération PDF réussie puis téléchargement initié dans QuittanceTool partagé | slug ; chaque téléchargement réussi ; ne prétend pas mesurer les impressions des autres générateurs |
| tool_cta_clicked | lien de l’outil vers register activé | slug ; clic, pas inscription |
| signup_completed | register-actions retourne réellement un utilisateur créé | AuditLog, compte, source_tool si consentement ; pas sur simple clic |
| property_created / tenant_created / lease_created | écriture réussie de l’action ou de l’API de création | AuditLog, compte, source_tool ; aucun montant, adresse ou ID de ressource |
| payment_recorded | action de paiement réussie, y compris marquer payé | AuditLog, compte, source_tool ; aucune somme ; pas les callbacks externes sans consentement navigateur |
| receipt_generated | premier PDF rendu, persisté et lié au paiement | AuditLog ; aucun événement sur simple réutilisation idempotente de l’archive |
| onboarding_* | étapes du wizard existant | étape, durée bornée, variante, booléens skipped ; aucun contenu de formulaire ; événement client déclaratif, pas preuve d’activation |
| homepage_* | interactions existantes | nom validé, chemin public ; anciennes propriétés arbitraires non transmises |

## Exploitation et limites

Les visites/interactions sont des logs JSON internes ; les étapes produit consenties sont des AuditLog de type PRODUCT_ANALYTICS. Aucun export PostHog ou tableau de conversion n’est inventé. Les taux exigent une collecte de logs durable, une politique de rétention opérationnelle et l’analyse des cohortes consenties. Les visites ne portent pas d’identifiant visiteur : on peut compter les événements, pas calculer un taux d’utilisateurs uniques dédupliqués sur plusieurs sessions.

Le rattachement au compte existe après inscription. La déduplication de montage est locale au composant ; les rechargements et clics répétés sont de nouveaux événements. Aucun exactly-once analytics n’est promis en cas de crash entre écriture métier et événement facultatif. Les inscriptions directes à Better Auth hors register-actions et les écritures financières par tous les fournisseurs ne constituent pas des événements du funnel navigateur actuel.

Tests : analytics-v34.test (refus, filtrage et données privées), tools-v34.spec (consentement, interaction réelle et résultat), tests SSR/SEO pour la conservation du contenu initial. Voir QA-REPORT pour l’exécution.
