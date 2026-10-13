# 02 — Audit technique

**Sources :** code de `origin/master` (`7503d2e`, déployé) et crawl de production du 13/10/2026 à 20:30 UTC.
- **Crawl :** `evidence/crawl.mjs`. Il respecte robots.txt, avec 2 requêtes simultanées et 300 ms de pause.
- **Données brutes :** `evidence/crawl_pages.csv` (431 URL) et `evidence/crawl_analysis.txt`.
- **Indexation non vérifiée :** je n'ai pas accès aux données Search Console. Une URL présente dans le sitemap n'est pas pour autant réputée indexée.

## 1. Cartographie des routes (code)

| Famille | Route | URL | Génération | Intention visée |
| --- | --- | --- | --- | --- |
| Homepage | `/` | 1 | statique, ISR 1 h | gestion locative en ligne (marque) |
| Pages produit | `/gestion-locative`, `/features`, `/pricing`, `/quittances`, `/bail`, `/assurance-loyer-impaye`, `/locations`, `/demo`, `/entretien` | 9 | statique | commerciale |
| Pages locales | `/gestion-locative/[ville]`, `/bail/[ville]`, `/quittances/[ville]`, `/assurance-loyer-impaye/[ville]` | 200 (4 × 50) | `generateStaticParams` sur `src/data/cities.json` (5 champs : slug, nom, département, région, population) | commerciale locale |
| Blog | `/blog/[slug]` | 119 | `src/data/articles.ts` | informationnelle |
| Guides | `/guides/*` | 5 + hub | statique | informationnelle et modèle |
| Glossaire | `/glossaire-immobilier/[slug]` | 30 + hub | `src/data/glossary.json` | définition |
| Outils | `/outils/*` (2 groupes de routes) | 16 + hub | page serveur + `calculator-client.tsx` | utilitaire |
| Modèles | `/templates/*`, `/templates/lease/*` | 21 + 2 hubs | statique | modèle de document |
| Comparatifs | `/comparatif/*` | 5 + hub | statique | commerciale |
| Légal | `/cgu`, `/mentions-legales`, `/politique-*` | 4 | statique | navigationnelle |
| Privé | `(dashboard)` (17), `/portal`, `/login`, `/register` | — | dynamique | bloqué par robots.txt |
| Prototypes | `/design-preview/*` | 17 | statique | aucune (interne) |

**robots.txt** (`src/app/robots.ts`) bloque l'application, `/login`, `/register`, `/api`, `/admin` et `/offline`. Il ne bloque pas `/design-preview`.

**Sitemap** (`src/app/sitemap.ts`, alimenté par `src/data/routes.ts`) : 417 URL, toutes en 200.

## 2. Résultats du crawl

| Mesure | Valeur | Preuve |
| --- | --- | --- |
| URL découvertes | 431 : 420 en 200, 8 en 404, 3 bloquées par robots | `crawl_analysis.txt`, ligne STATUS |
| Sitemap → 200 | 417 / 417 | SITEMAP-not-200 vide |
| Crawlées hors sitemap | 3, toutes des redirections 308 encore liées en interne : `/templates/colocation`, `/outils/calculateur-irl-2026`, `/templates/calculateur-rendement-locatif` | LINKS TO REDIRECTS (8 liens) |
| Liens internes cassés | **9 liens vers 8 URL en 404**, tous dans le glossaire (ex. `/glossaire-immobilier/apport-personnel` → `/glossaire-immobilier/pret-immobilier`) | BROKEN internal links |
| Pages orphelines (0 lien entrant) | **4** : `/entretien`, `/templates/bail-professionnel`, `/templates/contrat-de-location`, `/templates/repartition-charges` | ORPHANS |
| Pages inaccessibles depuis `/` par les liens | **67** : `/assurance-loyer-impaye` et ses 50 villes, `/comparatif` et 5 pages, `/templates/lease` et 5 pages, plus les 4 orphelines | DEPTH, `unreachable` |
| Profondeur depuis `/` | 0 : 1 · 1 : 17 · 2 : 271 · 3 : 64 · inaccessibles : 67 | DEPTH |
| Robots meta | `index, follow` sur les 420 pages | ROBOTS meta |
| JSON-LD invalide | 0 | INVALID LD |
| H1 ≠ 1 | 0 | H1 != 1 |
| Titles > 65 caractères | 202 / 420 | TITLE len>65 |
| Descriptions > 165 caractères | 90 | DESC |

### Anomalies prioritaires
1. **`/entretien` : canonical vers `https://lokna.fr/maintenance`, une route privée** (307 vers `/login`, bloquée par robots.txt). C'est un canonical vers une URL non indexable. La page est aussi orpheline.
2. **50 descriptions identiques** sur `/assurance-loyer-impaye/[ville]` (« Lokna détecte les loyers impayés et déclenche les relances… »).
3. **7 pages `/design-preview/*` publiques et indexables** (`b1`, `b2`, `b3`, `dashboard-v21`, `exploration`, `homebase-v21`, `wave2`) : anciennes maquettes, canonical vers `/`, non liées, absentes du sitemap. Les 10 autres sont en `noindex`.
4. **Doublon éditorial réel :** `/blog/litige-depot-garantie` et `/blog/litige-depot-garantie-procedure` ont le même title et le même H1, sans canonical croisé.
5. **Redirections héritées encore liées :** 8 liens internes passent par une redirection 308. `/glossaire-immobilier/IRL` répond 301 vers `/glossaire-immobilier/irl`, qui est en 404.

## 3. Familles de pages

| Famille | Nb | Mots (médiane) | Liens entrants (médiane, dont contextuels) | Profondeur | Risque | Valeur SEO estimée* |
| --- | --- | --- | --- | --- | --- | --- |
| Blog | 119 | 1 104 | 4 (4) | 2 | Cannibalisation forte (§4), 10 articles < 350 mots | Moyenne |
| Pages locales (4 familles) | 200 | 767 à 897 | 1 à 2 (1 à 2) | 2, ou inaccessibles | **Doorway** : 0,3–0,4 % de texte propre à la page (doc 07) | Faible en l'état, risque élevé |
| Glossaire | 30 | 174 | 4 (4) | 2 | Contenu faible, 9 liens cassés | Faible |
| Modèles | 23 | 783 | 4 (4) | 3 | 4 orphelines, sous-hub `/templates/lease` inaccessible | Moyenne à forte (intention « modèle ») |
| Outils | 17 | 523 | 3 (2) | 2 | 4 outils < 310 mots, deux URL d'IRL | **Forte** |
| Guides | 5 | 726 | 394 (3 contextuels) | 2 | Chevauchement avec le blog | Moyenne |
| Comparatifs | 5 | 553 | 1 (1) | inaccessibles | Hors du graphe | Moyenne (intention commerciale) |

*Estimation qualitative fondée sur l'intention et la concurrence observée, pas sur des volumes.

## 4. Cannibalisation (titles des pages hors pages locales)
| Sujet | Pages en concurrence | Exemples |
| --- | --- | --- |
| Quittance | 14, plus 50 pages `/quittances/[ville]` | `/quittances`, `/guides/quittance-loyer`, `/outils/generateur-quittance`, `/outils/modele-quittance-loyer-pdf`, `/templates/recu-loyer` (title « Modèle Quittance de Loyer »), 5 articles de blog dont `quittance-loyer-pdf-gratuit` et `modele-quittance-loyer-gratuit` |
| Relance / impayé | 21 | `/guides/relance-loyer`, `/outils/lettre-relance-loyer`, `/templates/relance-loyer-impaye`, articles `lettre-relance-loyer-impaye-modele`, `relance-loyer-impaye-modele-lettre`, `modele-lettre-relance` |
| Bail | 34 | `/guides/modele-bail`, `/templates/contrat-de-location`, `/templates/bail-vide`, articles `rediger-bail-location`, `comment-rediger-bail-location-guide-complet`, `rediger-contrat-location`, `modele-bail-location-gratuit` |
| IRL / révision | 13 | `/guides/irl-2026`, `/outils/calculateur-irl`, articles `revision-loyer-irl-guide-complet`, `indexation-loyer-formule-2026`, `augmentation-loyer-irl`, `simulateur-irl-2026` |
| Dépôt de garantie | 10 | dont le doublon exact `litige-depot-garantie` / `-procedure` |
| Charges | 8 | articles `charges-locatives-recuperables-liste` et `-liste-2026` |
| Gestion locative en ligne | 3 | `/`, articles `gestion-locative-en-ligne-avantages` et `-avantages-comparatif-2026` |

## 5. Exactitude du contenu (trust)
Contenus publiés **contredits par le produit** (preuves dans `evidence/local_pages_similarity.txt` et le code) :
- **Synchronisation bancaire « Open Banking DSP2 » annoncée sur 109 pages** (50 `/gestion-locative/[ville]`, 50 `/quittances/[ville]`, `/features`, `/pricing`, `/demo`, `/locations`…). Le dépôt contient `src/app/api/webhooks/bank/route.ts` et le modèle `BankConnection`, mais **aucun écran ne permet de connecter une banque**.
- **`/pricing` :** sa FAQ promet « OCR par IA », « Factur-X complète » et « relance automatique des impayés » en Pro (`src/app/(marketing)/pricing/page.tsx:92`). Ces fonctions ne sont pas vérifiées dans l'interface, et aucune fonctionnalité n'est réservée à une formule.
- **14 pages `/quittances/[ville]`** contiennent le mot espagnol « pequeños ».
- **36 pages locales** citent une source « CLAMEU/SeLoger 2025 » pour des loyers au m², sans lien vérifiable.
- **`/outils/generateur-quittance` (FAQ) :** « le bailleur doit la fournir dans un délai d'un mois » et « la quittance doit mentionner l'indice utilisé » — deux obligations absentes de l'article 21 de la loi du 6 juillet 1989. À faire valider avant toute republication.

## 6. Mesure
Voir `09_CONVERSION_STRATEGY.md` §4 : Search Console est vérifiée par DNS, mais ses données ne sont pas accessibles. Il n'existe ni analytics persistant ni événement d'inscription.
