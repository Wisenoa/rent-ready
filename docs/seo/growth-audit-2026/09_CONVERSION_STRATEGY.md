# 09 — Conversion SEO → produit

## 1. CTA actuels (mesurés dans le contenu principal de chaque page)
| Famille | Pages | Lien contextuel vers `/register` | Vers un outil | Vers `/gestion-locative` | Vers `/pricing` | Ancre `/register` dominante |
| --- | --- | --- | --- | --- | --- | --- |
| Blog | 119 | 119 | 6 | 0 | 1 | « Créer un compte gratuit » (identique partout) |
| Outils | 17 | 13 | 15 | 0 | 11 | « Démarrer l'essai gratuit 14 jours » |
| Modèles | 23 | 23 | 4 | 0 | 10 | « Essai gratuit 14 jours », « Générer avec Lokna → » |
| Glossaire | 30 | 30 | 8 | 1 | 0 | « Commencer l'essai gratuit » |
| Pages locales | 200 | 200 | 150 | 200 | 0 | « Essai gratuit 14 jours », « Générer ma quittance — gratuit » |
| Guides | 5 | 5 | 0 | 0 | 0 | « Essai gratuit 14 jours » |

**Lecture :** le CTA vers l'inscription est partout, mais il est **générique**. Les contenus informatifs n'envoient presque jamais vers l'outil qui répond au besoin (6 articles sur 119), qui est pourtant l'étape naturelle.

## 2. Parcours recommandés
| Parcours | Aujourd'hui | Proposé |
| --- | --- | --- |
| Outil → inscription | CTA générique « essai gratuit » | CTA lié au résultat de l'outil : après une quittance, « Recevoir chaque mois la quittance ou le reçu calculé automatiquement ». Données pré-remplies à l'inscription si le consentement le permet ; sinon, simple lien |
| Guide → outil | absent dans 113 articles sur 119 | Un lien contextuel par article vers l'outil du cluster, à l'endroit où le lecteur en a besoin |
| Guide → fonctionnalité | absent | Un encadré factuel en fin d'article : ce que Lokna fait sur ce sujet, avec un lien vers `/features#…`. Pas de publicité dans le corps du texte |
| Page locale → produit | CTA présents, mais promesses fausses (Open Banking) | Corriger les promesses d'abord (doc 07) |
| Page commerciale → essai | `/`, `/gestion-locative`, `/pricing` | Rendre `/comparatif/logiciel-gestion-locative` accessible ; corriger la FAQ de `/pricing` (OCR, Factur-X, relances automatiques non vérifiés) |

## 3. Règles de ton
- **Le CTA répond au besoin de la page :** quittance → automatiser les quittances ; impayé → être alerté et relancer ; IRL → être prévenu de la date de révision.
- **Un CTA principal par page,** après la réponse et non avant.
- **Aucune promesse non vérifiée dans le produit** (règle de `AGENTS.md` §37).

## 4. Mesure et observabilité (état vérifié)
| Élément | État | Preuve |
| --- | --- | --- |
| Google Search Console | **Propriété vérifiée par DNS** (enregistrement TXT `google-site-verification=…` sur lokna.fr). **Données non accessibles dans cet audit** | `host -t TXT lokna.fr` |
| Analytics de pages vues | `src/components/analytics.tsx` (layout `(marketing)`) envoie un beacon à `/api/analytics/page-view`, qui fait seulement un **`console.log` dans les logs du conteneur**. Ces logs disparaissent à chaque recréation et ne sont agrégés nulle part. **L'adresse IP est journalisée** | `src/app/api/analytics/page-view/route.ts` ; logs `lokna-app` |
| Événements de la homepage | `trackHomepageEvent` envoie `{event, properties}`, mais la route ne lit que `path`, `referrer` et `utm_*` : **le nom de l'événement est perdu** | `src/lib/analytics/homepage-tracker.ts` |
| Plausible, PostHog, GA | Absents en production (`NEXT_PUBLIC_POSTHOG_KEY`, `POSTHOG_API_KEY`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` non définies) ; Vercel Analytics retiré hors Vercel | `docker exec lokna-app` |
| Événement d'inscription | **Aucun.** On peut compter les comptes créés en base, mais pas les attribuer à une page d'entrée | — |
| Usage des outils | Non mesuré | — |

**Conséquence :** aujourd'hui, **aucune conversion SEO n'est mesurable.** On ne peut pas dire quelle page amène des inscrits.

**Proposition, à valider juridiquement avant toute mise en place** (consentement, CNIL) :
1. **Search Console :** donner l'accès à l'équipe et exporter chaque mois les requêtes et pages. C'est sans impact sur le consentement.
2. **Mesure d'audience exemptée de consentement :** un outil configuré selon les conditions de la CNIL (par exemple Plausible ou Matomo en mode exempté, sans IP complète conservée). Il remplacerait les `console.log`, et la journalisation de l'IP serait revue.
3. **Événements nommés :** `tool_used` (outil), `tool_result_cta_click`, `signup_started`, `signup_completed`, avec la page d'entrée stockée de façon minimale, par exemple dans un champ `signupSource` du compte, sans traceur tiers.
4. **Tableau de bord mensuel :** impressions et clics par cluster (Search Console), puis outils utilisés, puis inscriptions par page d'entrée.
