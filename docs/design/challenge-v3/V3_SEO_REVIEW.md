# V3 — revue SEO

| Élément | Résultat attendu et vérifié dans le navigateur |
| --- | --- |
| URL | `/gestion-locative` conservée |
| Canonical | `https://lokna.fr/gestion-locative` |
| Title | `Logiciel de gestion locative pour propriétaires bailleurs | Lokna` |
| H1 unique | `Votre gestion locative, en clair.` |
| Robots | `index, follow` |
| Description | Décrit logements, baux, loyers, règle de quittance, reçu partiel, révision IRL et tarif d’entrée dynamique |
| Données structurées | `WebSite`, `Organization`, `BreadcrumbList`, `SoftwareApplication` conservés ; JSON parsé dans le test navigateur |
| Tarifs structurés | `paidOffer()` et données partagées conservés |

La hiérarchie H2 couvre le parcours locatif, le suivi en situation, le dossier de location, le comparatif, les outils, la FAQ, le CTA et les pages locales. Les sous-thèmes utilisent H3. Les libellés restent concrets et n’accumulent pas le mot-clé principal.

Les liens vers le calculateur IRL, le générateur de quittance, la page des tarifs, `/villes` et les 50 pages locales sont conservés. L’annuaire est replié visuellement, avec ses liens présents dans le HTML et accessibles en ouvrant la divulgation. Les autres pages SEO ne sont pas modifiées.

Aucun balisage FAQPage n’est ajouté et aucun résultat enrichi Google n’est présenté comme acquis. Le JSON-LD a été contrôlé syntaxiquement et les types existants ont été préservés ; une validation distante Google n’a pas été exécutée.

Les textes alternatifs identifient les photographies et décrivent la situation de suivi visible dans les captures. Les données fictives sont signalées dans les légendes et la démonstration.

Les contrôles exacts et les limites de console partagées sont dans [V3_QA_REPORT.md](V3_QA_REPORT.md).
