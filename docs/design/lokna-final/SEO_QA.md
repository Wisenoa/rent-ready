# SEO : contrôle

Mesuré sur le HTML rendu (`next dev`, puis build de production pour les tests `rendered-html`).

| Élément | Production actuelle | Nouvelle page | Statut |
| --- | --- | --- | --- |
| URL | `/gestion-locative` | identique | conservée |
| Canonical | `https://lokna.fr/gestion-locative` | identique | conservé |
| Robots | index, follow | index, follow | conservé |
| Rendu | ISR 1 h | statique, ISR 1 h (`○` dans le build) | conservé |
| Title | « … propriétaires bailleurs — Lokna \| Lokna » | « Logiciel de gestion locative pour propriétaires bailleurs \| Lokna » | marque en double supprimée, mots-clés inchangés |
| Description | 153 car., cite « état des lieux » (non vérifié dans l'interface) | 154 car., uniquement des capacités vérifiées | réécrite |
| H1 | « Gérer ses locations sans tableur ni dossiers de PDF » | « La gestion locative, mois par mois, sans tableur. » | un seul H1, contient « gestion locative » |
| H2 | 5 | 8 (dont « Octobre 2026 » pour le registre) | |
| JSON-LD | SoftwareApplication + BreadcrumbList | SoftwareApplication (offre 9.00 EUR depuis `PLANS`) + FAQPage + BreadcrumbList | enrichi |
| FAQ | 6 Q/R visibles, sans balisage | 7 Q/R visibles dans `<details>`, balisées FAQPage, questions en `<h3>` | enrichie |
| Liens villes | 50 | 50 (`/gestion-locative/[ville]`, tous visibles) + `/villes` | conservés |
| Liens outils | 0 | 5 outils + `/outils` | ajoutés |
| Autres liens internes | `/features`, `/register` | `/features`, `/register`, `/pricing`, `/quittances` | conservés |
| Ancres de la navigation | absentes en production | `#cycle-mensuel`, `#fonctionnalites`, `#simulateurs`, `#tarifs` | réparées |

## Contrôles exécutés
- `pnpm seo:all` : 0 erreur. Un avertissement statique `no-h1` vient d'une regex qui ne traverse pas les retours à la ligne. Il touche aussi `/gestion-locative/[ville]` et les comparatifs. Le HTML rendu contient exactement un H1 (vérifié par Playwright et par `rendered-html.test.ts`).
- `rendered-html.test.ts` (sur le build standalone) : titres sans marque doublée, un seul H1, aucun `{expression}` littéral, prix d'entrée réel dans le JSON-LD : vert.
- Playwright `gestion-locative-landing.spec.ts` : canonical, robots, chaque question FAQPage visible sur la page, les 50 liens de villes, les liens d'outils : vert.
