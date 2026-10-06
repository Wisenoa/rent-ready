# Isolation multi-locataire — inventaire

Audit du 2026-10-02 (HEAD `c24487e`, plus les corrections de ce lot).

RentReady héberge des données financières de tiers. La condition à tenir est
simple : un propriétaire qui connaît l'identifiant d'un autre ne peut ni lire ni
modifier ce qui s'y rattache.

## Comment lire ce tableau

Trois mécanismes, du plus solide au plus faible :

| Niveau | Signification |
|---|---|
| **Requête scopée** | `userId` (ou une relation qui mène à lui) est dans le `where` / le `update`. La requête refuse d'elle-même : impossible d'oublier le contrôle plus tard. |
| **Contrôle après coup** | `findFirst`/`findUnique` vérifié par un `if`, puis écriture non scopée. Fonctionne, mais la sécurité dépend d'un `if` que la prochaine réécriture peut contourner. |
| **Aucun** | Pas de contrôle sur la ressource propriétaire. **À corriger.** |

Règle cible (AGENTS.md §8) : viser *requête scopée* partout.

## Routes API

| Route | Méthode | Mécanisme | Note |
|---|---|---|---|
| `/api/properties` | GET, POST | Requête scopée | `{ userId }` dans le `where` |
| `/api/properties/[id]` | GET | Requête scopée | `findFirst({ id, userId, deletedAt: null })` |
| `/api/properties/[id]` | PATCH, DELETE | Requête scopée | **Corrigé** — `updateMany({ id, userId, … })`, était contrôle après coup + `update({ where: { id } })` |
| `/api/units` | GET, POST | Requête scopée | |
| `/api/units/[id]` | GET, PATCH, DELETE | Requête scopée | `Unit` n'a pas de colonne `userId` : scopé via `property: { userId }`. Le `findFirst` précède l'écriture, l'écriture reste non scopée — **acceptable**, `Unit` n'a pas la colonne |
| `/api/tenants` | GET, POST | Requête scopée | |
| `/api/tenants/[id]` | GET | Requête scopée | |
| `/api/tenants/[id]` | PATCH, DELETE | Requête scopée | **Corrigé** — `updateMany` / `deleteMany` scopés |
| `/api/leases` | GET | Requête scopée | `where: { userId }` |
| `/api/leases` | POST | Requête scopée | **Corrigé** — `property`/`tenant` passés de `findUnique({id})` + comparaison à `findFirst({ id, userId })` |
| `/api/leases/[id]` | GET | Requête scopée | |
| `/api/leases/[id]` | PATCH | Requête scopée | **Corrigé** — `updateMany({ id, userId })` |
| `/api/leases/[id]` | DELETE | Requête scopée | **Corrigé** — le `findFirst` (nécessaire pour `endDate`) est scopé, et l'écriture aussi |
| `/api/leases/[id]/payments` | GET | Requête scopée | **Corrigé — le défaut trouvé.** `Promise.all` avec `where: { leaseId }` sans `userId`, lancé *en parallèle* du contrôle d'ownership. Les transactions d'autrui étaient lues avant vérification |
| `/api/leases/[id]/revision-preview` | GET | Requête scopée | |
| `/api/transactions` | GET | Requête scopée | |
| `/api/transactions/[id]` | GET, PATCH | Requête scopée | `updateMany({ id, userId })`, champs financiers refusés |
| `/api/transactions/[id]/receipt` | GET | Requête scopée | `findFirst({ id, userId })` |
| `/api/transactions/[id]/receipt` | POST | Requête scopée | **Corrigé** — ajout d'un `findFirst({ id, userId })` ; s'appuyait sur le contrôle interne de `generateQuittance` |
| `/api/transactions/unpaid` | GET | Requête scopée | |
| `/api/transactions/dashboard` | GET | Requête scopée | |
| `/api/payments` | GET | Requête scopée | |
| `/api/payments/[id]` | GET, PATCH, DELETE | Requête scopée | `cancelRentPayment({ userId, transactionId })` |
| `/api/reminders` | GET, POST | Requête scopée | vérifie aussi `leaseId`/`propertyId`/`tenantId` fournis |
| `/api/reminders/[id]` | GET | Requête scopée | |
| `/api/reminders/[id]` | PATCH, DELETE | Requête scopée | **Corrigé** — les deux branches d'écriture passent en `updateMany` / `deleteMany` scopés |
| `/api/maintenance` | GET, POST | Requête scopée | |
| `/api/maintenance/[id]` | GET, PATCH | Contrôle après coup | `findUnique({ id })` puis `ticket.property.userId !== …` → 403. `MaintenanceTicket` n'a pas de `userId` : il faudrait passer par `propertyId` dans le `where`. **Reste à faire** |
| `/api/guarantors` | GET, POST | Requête scopée | |
| `/api/guarantors/[id]` | GET, PATCH, DELETE | Contrôle après coup | `guarantor.lease.property.userId`, 404 (bon : ne divulgue pas). `Guarantor` n'a pas de `userId`. **Reste à faire** |
| `/api/documents` | GET, POST | Requête scopée | |
| `/api/documents/[documentId]` | GET, DELETE | Requête scopée | **Corrigé** — `findUnique` + 403 divulguait l'existence d'un document d'autrui ; désormais `findFirst({ id, userId })` → 404, et `deleteMany` scopé |
| `/api/dashboard/summary` | GET | Requête scopée | |
| `/api/email/send-tenant-invitation` | POST | Requête scopée | l'`user.findUnique` porte `session.user.id` ; la recherche du locataire est bornée par `leases: { userId }`. **Correct** |
| `/api/e-reporting/export` | GET | Requête scopée | |
| `/api/fiscal/prepare` | POST | Requête scopée | |
| `/api/ai/*` | POST | Requête scopée | `userId` dérivé de la session |
| `/api/stripe/checkout`, `/api/stripe/portal` | POST | Requête scopée | |

### Hors périmètre volontaire

- **Portail locataire** (`/api/tenant/*`, `/portal/[token]`) : authentifié par
  jeton, pas par session. C'est un modèle différent — le jeton EST l'identité.
  Couvert par `portal-authorization.test.ts`.
- **Webhooks** (`/api/webhooks/bank`, `/api/webhooks/stripe`) : authentifiés par
  signature/HMAC.
- **Cron** (`/api/cron/*`, `/api/email/cron-dispatch`) : secrets d'URL, et
  agissent sur l'ensemble des propriétaires par conception — pas d'isolation par
  `userId` à faire.

## Server Actions (`src/lib/actions/`)

Toutes les mutations dérivent `userId` de `getCurrentUserId()` — jamais d'un
champ de formulaire. C'est le point le plus important et il est respecté partout.

| Action | Mécanisme |
|---|---|
| `property-actions` (create/update/delete) | Contrôle après coup (`findUnique` + `existing.userId`) ; `deleteProperty` utilise déjà `findFirst({ id, userId })` |
| `tenant-actions` (create/update/delete) | Contrôle après coup |
| `lease-actions` (create/update/terminate) | Contrôle après coup ; `createLease` vérifie bien `property` **et** `tenant` |
| `expense-actions` (create/update/delete) | Contrôle après coup |
| `transaction-actions` | Contrôle après coup |
| `quittance-actions` (`generateQuittance`) | Contrôle après coup : `transaction.userId !== userId` |
| `profile-actions`, `checklist-actions`, `deposit-return-actions` | `userId` de session, scope par la requête |
| `portal-actions` | Jeton — voir hors périmètre |

**Les Server Actions restent en « contrôle après coup ».** Elles sont correctes
aujourd'hui, mais passer les écritures en `updateMany({ id, userId })` comme sur
les routes les rendrait robustes de la même façon. Non fait dans ce lot : le
périmètre demandé portait sur les routes, et cela toucherait ~12 fichiers de plus.

## Ce qui reste à faire

1. `/api/maintenance/[id]` et `/api/guarantors/[id]` : passer le contrôle dans
   la requête. Ces deux modèles n'ont pas de colonne `userId` — il faut soit
   passer par `property: { userId }` / `lease: { property: { userId } }` dans le
   `where` (Prisma le permet), soit ajouter la colonne. À trancher avec
   `rr-lead` : ajouter `userId` à `MaintenanceTicket` et `Guarantor` rend
   l'isolation explicite partout, au prix d'une dénormalisation à tenir.
2. Les Server Actions : passer les écritures en `updateMany`/`deleteMany`.
3. `/api/tenant/lease` et `/api/tenant/quittances` : le jeton est validé, mais
   `tenant/lease` récupère le bail par `tenantId` seul. Cohérent avec le modèle
   portail, à confirmer.

## Tests

- `src/__tests__/lib/authorization-isolation.test.ts` — 17 tests. Appellent les
  vrais handlers avec deux sessions. Le mock Prisma **applique réellement** le
  `where` construit par le handler : un handler qui cesse de scoper reçoit la
  ligne d'autrui et le test échoue.
- `src/__tests__/lib/authorization-isolation.db.test.ts` — 7 tests sur la vraie
  base : deux utilisateurs, un bien/un locataire/bail/un document/une ligne de
  loyer réels, accès croisé refusé. Se désactive (skip) si `DATABASE_URL` est
  absent.

### Preuves par mutation (rejouées, pas annoncées)

| # | Mutation appliquée au code livré | Résultat observé |
|---|---|---|
| M1 | retirer `userId` du `where` des transactions (`/api/leases/[id]/payments`) | suite mock ÉCHOUE |
| M2 | retirer `userId` de l'écriture `PATCH /api/tenants/[id]` | suite mock ÉCHOUE |
| M3 | **revenir entièrement à `findUnique({ id })` + `403` sur `GET /api/documents/[documentId]`** | suite mock ÉCHOUE (1 test : `GET does not confirm the existence of a foreign document`, 403 au lieu de 404) |
| M4 | retirer le contrôle d'ownership de `POST /api/transactions/[id]/receipt` | suite mock ÉCHOUE |
| M5a | retirer `userId` de la **seule** lecture du bien dans `POST /api/leases` | suite mock ÉCHOUE (2 tests) + suite DB ÉCHOUE (`cannot create a lease on Bob's property`, bail réel écrit sur le bien d'autrui) |
| M5b | retirer `userId` de la **seule** lecture du locataire dans `POST /api/leases` | suite mock ÉCHOUE (2 tests) + suite DB ÉCHOUE (`cannot create a lease on Bob's tenant`, bail réel rattaché au locataire d'autrui) |
| M6 | retirer l'écriture `PATCH /api/leases/[id]` du scope | suite mock ÉCHOUE |
| M7 | retirer l'écriture `DELETE /api/properties/[id]` du scope | suite mock ÉCHOUE |
| M8 | retirer l'écriture `DELETE /api/reminders/[id]` du scope | suite mock ÉCHOUE |

Précision honnête, vérifiée par exécution : une variante *cosmétique* de M3 —
ajouter un `403` **après** une lecture déjà scopée par `userId` — n'est PAS
détectée (17/17 verts), et ne doit pas l'être : la lecture scopée ramène déjà
`null`, donc le `403` est du code mort dans les deux sens. Seule la mutation M3
complète (retour au `findUnique` non scopé, qui rend à la route le pouvoir de
lire la ligne d'autrui) change le comportement observable, et elle échoue.

Le point clé du lot : `POST /api/leases` est le seul handler qui **crée** une
ligne. Un test qui ne vérifie que le code HTTP passerait même après un `insert`
réussi suivi d'un 404 — la corruption resterait. Les tests vérifient donc
explicitement l'**absence d'écriture** : `lease.create` jamais appelé côté mock,
et côté vraie base aucun bail rattaché au bien ni au locataire de Bob. C'est
cette assertion, et non le statut, qui détecte M5a/M5b.

Limite connue et assumée : la suite DB ne détecte pas le retrait du seul
`userId` de la requête des transactions, la lecture étant déjà gardée en amont
par la résolution du bail — c'est la suite mock qui épingle la forme du `where`.
Les deux sont complémentaires.

Note d'environnement : en cas de timeout sur `authorization-isolation.db` /
`receipt-number` / `article-payload-boundary` en suite complète, ce sont des
collisions de connexion Postgres sous parallelisme, pas une régression
d'isolation — ces trois fichiers passent isolément, et la base échoue aussi
sans les fichiers de ce lot. Rejouer le fichier concerné suffit.