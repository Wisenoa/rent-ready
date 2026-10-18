# QA V3.4 — environnement et preuves

Base jetable PostgreSQL 16 démarrée en processus utilisateur dans `/tmp/lokna-v34`, écoute loopback port 55434, base `lokna_v34`. Aucune instance/volume Docker modifié ; une ancienne suite a tenté uniquement `docker logs rentready-pg`, conteneur absent (lecture facultative de logs). Pas d’accès aux données existantes ni d’email/achat Stripe réel. Les processus PostgreSQL/Next créés uniquement pour cette QA ont été arrêtés après validation ; fichiers de base et artefacts locaux restent dans /tmp. Aucun service préexistant n’a été arrêté ou redémarré. Les credentials externes sont retirés par scripts/qa-v3-4.mjs. La compilation n’utilise pas les valeurs de `.env.production` : le runner neutralise ses variables avant Next.

## Reproduction

Avec une base locale vide dédiée nommée `lokna_v34` ou `rentready_test_*` :

```sh
export TEST_DATABASE_URL='postgresql://lokna_test@127.0.0.1:55434/lokna_v34'
node scripts/qa-v3-4.mjs migrate
node scripts/qa-v3-4.mjs typecheck
node scripts/qa-v3-4.mjs lint
node scripts/qa-v3-4.mjs build
node scripts/qa-v3-4.mjs test
# Dans un autre terminal, serveur local de validation uniquement :
node scripts/qa-v3-4.mjs start
node scripts/qa-v3-4.mjs e2e golden-path.spec.ts reliability-v34.spec.ts tools-v34.spec.ts premium-tools.spec.ts --workers=1 --reporter=line
```

Ne pas mettre une base réelle derrière ce nom : ces tests créent et nettoient leurs fixtures. Le runner refuse une base distante ou un nom hors liste. Aucun test ne prouve une configuration de production.

## Exécutions intermédiaires réellement faites

- État initial : `pnpm test` avec DATABASE_URL explicitement isolée, 104 fichiers / 1 398 tests réussis.
- Nouveaux cas financiers avant correction : 10 échecs / 8 réussites, notamment zéro IRL, non-finis, seuil et déficit.
- Après correction financière ciblée : 3 fichiers / 88 tests réussis.
- Première extension complète : 106 fichiers / 1 431 tests réussis.
- Derniers tests ciblés financiers/email/privacy : 3 fichiers / 46 tests réussis.
- Première tentative Playwright : soumission GET avant hydratation reproduite, correction du formulaire. Deux tentatives suivantes ont mis en évidence un libellé de test obsolète puis une attente trop courte pendant compilation dev ; aucun succès E2E inventé.
- Un premier build a échoué sur les types du formulaire après durcissement du schéma, corrigés ; un autre sur l’origine canonique neutralisée trop largement par le runner QA, corrigé dans ce runner.
- Lint intermédiaire : 0 erreur, 13 avertissements (React Hook Form / imports inutilisés). Une invocation a été arrêtée car elle parcourait le répertoire temporaire de génération ; elle n’est pas comptée comme un succès.
- Les tests HTML serveur se désactivent pendant qu’un build remplace `.next/standalone` ; leur exécution finale doit donc suivre le build achevé.

- Régression quittance reproduite dans un vrai PDF : total acquitté 420 au lieu de 920 ; test action indépendant rouge à 570,55 au lieu de 970,55, puis correction. Contrôle ultérieur du texte français et du XML embarqué concordants.
- Deux répétitions de la suite ont révélé des conflits intermittents, dont un `DriverAdapterError: TransactionWriteConflict` au commit, non enveloppé en P2034. Leur échec n’est pas attribué à master. Correction de la reprise bornée et mutualisation avec les modifications de bail ; passe DB dédiée : 17 fichiers / 100 tests réussis. Tests du helper : quatre réussites, y compris refus des erreurs non réessayables et limite de huit tentatives.
- SEO statique comparé à une extraction en lecture seule de `a7879f0` : 69 avertissements avant/après, zéro erreur. Deux avertissements initialement ajoutés par les liens officiels ont été corrigés.

## Validation finale

Validation exécutée le 18 octobre 2026 sur le code des trois commits de correction ci-dessous, avec base isolée et fournisseurs réels neutralisés.

| Vérification | Résultat final |
| --- | --- |
| `node scripts/qa-v3-4.mjs typecheck` (`pnpm exec tsc --noEmit`) | Réussi, code 0 |
| `node scripts/qa-v3-4.mjs lint` (`pnpm exec eslint`) | Réussi, 0 erreur / 13 avertissements non bloquants |
| `node scripts/qa-v3-4.mjs test` (`pnpm exec vitest run`) | **111 fichiers / 1 481 tests réussis, 0 échec, 0 ignoré** ; 16 suites PostgreSQL, 171 assertions HTML réellement rendu |
| `node scripts/qa-v3-4.mjs build` (`pnpm run build`) | Réussi, code 0 ; 493 pages générées ; avertissements viewport et cache Webpack conservés |
| Playwright : quatre fichiers de la commande ci-dessus | **36 réussites / 0 échec**, Chromium, un worker, 1,4 min sur dernière passe |
| Golden path navigateur | Inscription → bien → locataire → bail → échéance → paiement partiel → complément → PDF ; formulaires réels dans golden-path.spec |
| Isolation / abonnement / pannes | Utilisateur B refusé sur ressources A et emails ; états essai/expiré/actif/annulé/past-due, endpoints directs ; pannes Stripe/email/PDF/stockage injectées aux frontières ou configuration absente selon le scénario |
| 16 outils + responsive / préremplissage | 16 pages mobiles 375 px : HTTP 200, un H1, canonical inchangé, absence d’erreur JS et de débordement ; interactions et liens préremplis IRL/charges/quittance/LMNP ; dashboard, facturation et formulaire à 375/390/768/1440 px, focus clavier et fermeture modale |
| PDF réels SaaS | PDFDocument.load : une page ; texte français extrait des fichiers par pypdf temporairement installé dans /tmp ; reçu 500, solde 420, quittance 920 = 850 + 70 ; XML embarqué GrandTotalAmount=920.00 ; première archive inchangée ; seconde génération idempotente |
| PDF des outils | Deux tests conservés avec vrai moteur react-pdf, en plus des tests de rendu simulé explicitement distincts |
| `pnpm seo:all` | 0 erreur ; metadata 0 avertissement, lint SEO 69, JSON-LD 0 ; mêmes 69 avertissements sur extraction initiale de master |
| Revue Git / secrets | `git diff --check` propre ; aucun nouveau secret détecté ; pas de changement de schéma/migration, dépendance, .env, Docker Compose, Caddy ou Facturama |

La suite Playwright globale hors de ces quatre fichiers n’a pas été exécutée ; les 36 scénarios ciblés sont la couverture revendiquée. Une inspection visuelle a confirmé les captures mobile, tablette, desktop et du formulaire. Douze captures sont produites dans `test-results/v34-{dashboard,billing,form}-{375,390,768,1440}.png` ; cinq exemples sont conservés dans [screenshots](screenshots/), dont [dashboard mobile](screenshots/v34-dashboard-375.png), [tablette](screenshots/v34-dashboard-768.png), [desktop](screenshots/v34-dashboard-1440.png), [formulaire mobile](screenshots/v34-form-375.png) et [facturation mobile](screenshots/v34-billing-375.png).

Les PDF de test restent dans la sortie Playwright du scénario multi-biens (`partial.pdf`, `full.pdf`). La lecture du XML prouve la concordance du montant testé, pas une certification générale Factur-X. Les fichiers financiers sont des fixtures jetables, pas des données de production.

Commits de correction, sur master :
- `85ea329` — consentement et minimisation analytics ;
- `5bd3e4f` — règles fiscales 2026 et validation des baux ;
- `0c2fb86` — abonnements, autorisations, historique financier, PDF, activation et responsive.

## Limites

Les scénarios Stripe sont simulés avec le SDK et la base réelle, jamais avec de vrais paiements. Les erreurs de contrôle d’abonnement sont exercées au niveau du composant et de l’API, sans provoquer de panne de service de production. Email sans configuration est vérifié comme échec ; livraison réelle non vérifiée. Stockage absent couvert par le PDF inline ; pannes de génération/persistance injectées au point d’appel du service PDF pour vérifier absence de faux succès et conservation du paiement. L’indisponibilité d’un vrai MinIO n’est pas testée. Voir AUDIT et RELEASE-READINESS pour les réserves fonctionnelles.
