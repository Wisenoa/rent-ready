AGENTS.md — RentReady Engineering Instructions

Read these files before substantial work:

1. IDEA.md — product direction and priorities.
2. SOUL.md — engineering judgment and behavior.
3. This file — repository-specific execution rules.

IDEA.md defines what we are building.

SOUL.md defines how you should reason.

AGENTS.md defines how you should work in this repository.

When documentation conflicts with running code, tests, or verified behavior, investigate the discrepancy. Do not blindly follow stale documentation.

⸻

1. Project maturity

RentReady is early-stage.

Backward compatibility with accidental internal architecture is not a goal by itself.

You may refactor, reorganize, replace, or delete existing implementation when this materially improves the product or architecture.

However:

* preserve real user data;
* preserve intentional external contracts unless explicitly changing them;
* preserve security properties;
* preserve financial history;
* understand existing behavior before replacing it.

Do not create compatibility layers solely to preserve bad internal abstractions.

Prefer fixing the architecture while the product is still young.

⸻

2. Product priority

The primary product loop is:

Property
  ↓
Tenant
  ↓
Lease
  ↓
Rent due
  ↓
Payment
  ↓
Receipt

When making architectural or implementation trade-offs, optimize this flow first.

Do not expand speculative peripheral systems while the core flow remains incomplete or unreliable.

Before implementing a large feature, check whether it supports the product direction in IDEA.md.

⸻

3. Repository reconnaissance

Before implementing non-trivial work:

1. locate the relevant route;
2. locate the UI components;
3. locate the server-side entry point;
4. locate the domain/business logic;
5. locate Prisma models involved;
6. locate validation schemas;
7. locate existing tests;
8. search for similar implementations;
9. inspect relevant documentation;
10. inspect git history when behavior or architecture is unclear.

Do not modify the first matching file without understanding its surrounding flow.

Search before creating:

* components;
* hooks;
* utilities;
* schemas;
* services;
* actions;
* API handlers;
* domain functions.

Avoid parallel implementations of the same concept.

⸻

4. Next.js

<!-- BEGIN:nextjs-agent-rules -->

This is NOT the Next.js you know

This project uses a version of Next.js whose APIs, conventions, and behavior may differ from training data.

Read the relevant guide under:

node_modules/next/dist/docs/

before implementing behavior that depends on Next.js APIs.

Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

The project uses the App Router.

Prefer Server Components by default.

Use Client Components only when required for:

* browser APIs;
* interactive state;
* event handlers;
* client-only libraries.

Keep "use client" boundaries as low as practical.

Do not turn an entire page into a Client Component because one child needs interaction.

Prefer server-side data access for authenticated application data.

Avoid unnecessary client-side fetch-after-render flows.

Use framework primitives before building custom equivalents.

⸻

5. TypeScript

Keep TypeScript strict and meaningful.

Do not use:

any

to bypass a type problem.

Avoid unsafe assertions such as:

value as SomeType

unless the invariant is genuinely established elsewhere.

At external boundaries, validate rather than assert.

Prefer:

* explicit domain types;
* discriminated unions for state machines;
* exhaustive handling;
* inferred Prisma/Zod types where appropriate.

Do not duplicate types representing the same concept without a reason.

Do not silence TypeScript errors to make a build pass.

⸻

6. Validation

Treat all external input as untrusted.

This includes:

* forms;
* URL parameters;
* query strings;
* API bodies;
* webhook payloads;
* uploaded files;
* AI responses;
* bank-provider responses;
* Stripe metadata.

Use Zod or another existing project validation mechanism at trust boundaries.

Validation belongs on the server even when equivalent client validation exists.

Client validation is UX.

Server validation is correctness.

⸻

7. Authentication and authorization

Authentication does not imply authorization.

Every server-side operation accessing user-owned resources must establish the authenticated user and verify ownership or membership.

Never trust identifiers received from the browser.

This applies to:

* properties;
* units;
* tenants;
* leases;
* transactions;
* documents;
* expenses;
* maintenance;
* bank connections;
* conversations;
* messages;
* purchases;
* organization resources.

A request such as:

/property/:id

must not become safe merely because the caller is logged in.

The server must verify that the caller is authorized for that specific resource.

Prefer authorization mechanisms that are difficult to forget.

When adding a new resource type, consider authorization tests mandatory.

⸻

8. Multi-tenant queries

Tenant isolation is a hard invariant.

Prefer queries scoped from the authenticated owner/workspace rather than:

findUnique({ where: { id } })

followed by an ownership check later.

Where practical, make unauthorized access impossible directly in the query.

Never expose whether another user’s private resource exists unnecessarily.

Nested relations require the same scrutiny.

A user owning a parent ID supplied by the client does not automatically prove ownership of every supplied child ID.

⸻

9. Prisma and database design

prisma/schema.prisma is an important part of the domain model, not merely persistence configuration.

Before changing it:

1. understand existing relations;
2. inspect code depending on the affected models;
3. determine migration consequences;
4. consider existing data;
5. consider rollback/recovery;
6. verify indexes and constraints.

Prefer database constraints for invariants the database can reliably enforce.

Use transactions when multiple writes represent one logical operation.

Avoid partial state when an operation should be atomic.

Do not perform destructive schema changes casually.

Because the project is early-stage, redesigning weak schema is allowed.

If a schema design is fundamentally wrong, prefer correcting it now rather than building years of compatibility around it.

⸻

10. Money

Monetary correctness is critical.

Use Prisma Decimal / decimal.js or the project’s established monetary representation.

Never convert monetary business logic to JavaScript floating-point arithmetic.

Avoid:

0.1 + 0.2

style arithmetic for money.

Be explicit about:

* rent;
* charges;
* deposits;
* payments;
* outstanding amounts;
* partial payments;
* periods;
* rounding.

Never derive financial history solely from mutable current state when historical truth matters.

Financial operations that span multiple writes should generally be transactional.

Add regression tests for financial bugs.

⸻

11. Rent and payment domain

Do not treat payments as generic CRUD.

Keep separate concepts separate:

expected rent
payment received
allocation
payment status
receipt
bank transaction

A bank transaction is evidence of money movement.

It is not automatically a RentReady payment.

A payment does not automatically mean a full rent period has been paid.

A partial payment must not generate a full rent receipt (quittance).

The business model must handle at minimum:

* unpaid;
* partial;
* paid;
* late payment;
* multiple payments;
* payment dates;
* rent periods;
* charges.

Avoid deriving critical state independently in multiple places.

Prefer one canonical domain implementation.

⸻

12. Stripe

Treat Stripe as an external financial system.

Webhook handlers must be idempotent.

Use Stripe event IDs or another durable mechanism to prevent duplicate processing.

Do not assume webhooks arrive once or in order.

Verify webhook signatures.

Do not trust client-provided subscription/payment state.

Do not mark internal financial state successful before the required Stripe operation has actually succeeded.

Handle retries deliberately.

⸻

13. Banking integrations

Bank integrations are external and unreliable by nature.

Keep provider-specific models away from core rent/payment concepts where practical.

Webhook processing must tolerate:

* duplicates;
* retries;
* delayed events;
* missing events;
* reordered events.

Do not automatically reconcile uncertain matches.

If matching confidence is insufficient, surface the case for confirmation rather than corrupting payment history.

Store enough provider information to investigate synchronization issues.

Never log banking secrets or credentials.

⸻

14. Documents

Generated documents may have financial or legal significance.

Values included in PDFs must originate from validated domain data.

Do not independently reimplement financial calculations inside PDF components.

Document rendering should consume already-established business values.

Where relevant, generated documents should be reproducible from the underlying historical data.

Do not silently replace an existing historical document with one generated from changed current data.

⸻

15. AI

AI output is untrusted input.

Never directly persist or execute an LLM response without validation when it affects application state.

Use structured schemas.

Keep deterministic business rules outside prompts.

Never use AI to decide:

* authorization;
* payment status;
* monetary calculations;
* ownership;
* billing state;
* destructive operations.

AI may suggest.

Application code decides.

⸻

16. Server Actions

Server Actions are server endpoints.

Treat them with the same security requirements as API routes.

Every action performing a mutation must:

1. authenticate;
2. authorize;
3. validate;
4. execute business logic;
5. handle expected failures;
6. return a controlled result.

Never rely on the form or page that invokes the action for security.

⸻

17. API routes

Keep route handlers thin.

Prefer:

request
→ authentication
→ authorization
→ validation
→ domain/service operation
→ response

Avoid embedding large amounts of business logic directly in route files.

Do not create API endpoints merely because REST endpoints look architecturally complete.

If an endpoint has no product consumer or justified external contract, question whether it needs to exist.

⸻

18. Components

Search src/components before creating a component.

Reuse existing primitives and patterns when appropriate.

Do not create near-duplicates differentiated only by naming.

Split components when it improves:

* responsibility;
* readability;
* reuse;
* server/client boundaries;
* testability.

Do not split components solely to reduce line count.

Keep business rules out of presentation components.

⸻

19. UI and design system

Use the existing design system and Tailwind conventions.

Do not introduce another component library without strong justification.

Maintain consistency across:

* spacing;
* typography;
* controls;
* forms;
* dialogs;
* navigation;
* feedback;
* loading states;
* empty states.

Avoid one-off styling when an existing primitive solves the same problem.

For significant UI work, verify at least:

375px
768px
desktop

where relevant.

Do not sacrifice accessibility for visual polish.

⸻

20. Forms

Forms should:

* validate clearly;
* preserve user input after recoverable errors;
* prevent duplicate submission;
* communicate progress;
* communicate success;
* communicate actionable failure.

Use react-hook-form and existing Zod integration where consistent with the surrounding code.

Do not create complex form abstractions for trivial forms.

⸻

21. Error handling

Do not swallow errors.

Do not expose raw internal errors to users.

Separate:

* expected domain errors;
* validation errors;
* authorization errors;
* external provider failures;
* unexpected system errors.

User-facing messages should explain what happened at the appropriate level and, where possible, what the user can do next.

Unexpected errors should remain diagnosable through server logs / monitoring.

Never log secrets.

⸻

22. Logging

Logs should help investigate real incidents.

Prefer contextual structured information over random console.log() calls.

Useful context may include:

* operation;
* internal resource ID;
* provider event ID;
* authenticated user ID where appropriate;
* failure category.

Never log:

* passwords;
* session tokens;
* OAuth tokens;
* bank credentials;
* Stripe secrets;
* full sensitive documents;
* unnecessary personal data.

Remove temporary debug logging before completion.

⸻

23. Email

Email sending is an external side effect.

Do not report success before the provider operation succeeds when delivery initiation is required for the workflow.

Avoid coupling core state transitions to email availability when email is merely a notification.

Where an email is critical to completing an operation, model failure explicitly.

Keep email templates separate from core business calculations.

⸻

24. External side effects

Be careful when an operation combines database writes with:

* email;
* Stripe;
* storage;
* banking;
* AI;
* webhooks.

Database transactions cannot magically make external systems atomic.

Design these flows deliberately.

Where appropriate, persist internal intent/state before executing retryable external work.

Do not create distributed transaction complexity unless the actual workflow requires it.

⸻

25. Dependencies

Before installing a package:

1. check whether the repository already has a solution;
2. check whether Next.js / Node provides it;
3. assess maintenance and bundle cost;
4. determine whether a small local implementation would be simpler.

Do not install overlapping libraries without justification.

When touching an area with multiple competing dependencies, consider consolidation if it materially simplifies the system.

⸻

26. Tests

Use Vitest for unit/integration-level tests and Playwright for critical browser flows.

Prioritize tests for:

* domain logic;
* authorization;
* financial calculations;
* payment transitions;
* webhook idempotency;
* reconciliation;
* document values;
* regressions.

Tests should describe behavior.

Prefer:

rejects access to a lease owned by another user

over implementation-oriented descriptions.

Do not over-mock domain behavior.

Do not change assertions merely to accommodate broken implementation.

⸻

27. E2E tests

Keep the E2E suite focused on critical journeys.

High-value flows include:

signup/login
→ create property
→ create tenant
→ create lease
→ record payment
→ obtain receipt

and important failure/security paths.

Do not create huge brittle E2E suites for behavior better covered by unit or integration tests.

⸻

28. Verification

Before reporting implementation complete, run the relevant checks.

Baseline:

pnpm lint
pnpm test
pnpm build

Run relevant targeted tests during development.

For important user-facing workflows, use Playwright or browser verification when practical.

For database changes, verify the migration/schema behavior.

For financial changes, run targeted regression tests.

For security-sensitive changes, verify unauthorized cases as well as authorized cases.

Do not say:

fixed
working
done
production-ready

without corresponding evidence.

Report what was actually verified.

⸻

29. Existing failures

Do not casually attribute failures to “pre-existing issues”.

Investigate enough to establish that claim.

If unrelated existing failures prevent verification:

1. identify them;
2. confirm they are unrelated;
3. report them precisely;
4. still run every other meaningful verification available.

If the failure is cheap and safe to fix and blocks meaningful work, fixing it is acceptable.

⸻

30. Refactoring

Refactoring is encouraged when it reduces real complexity.

Good reasons:

* duplicated business rules;
* unclear ownership boundaries;
* incorrect domain model;
* security logic scattered everywhere;
* impossible-to-test coupling;
* unnecessary abstractions;
* competing implementations.

Bad reasons:

* personal style preference;
* fashionable architecture;
* reducing line counts;
* introducing patterns with no demonstrated need.

Because RentReady is early-stage, prefer fixing foundational mistakes now rather than institutionalizing them.

⸻

31. Dead and speculative code

Delete code that is confidently obsolete.

Do not preserve dead code “just in case”.

Git already preserves history.

Be suspicious of:

* unfinished integrations;
* unused abstractions;
* fake implementations;
* abandoned feature flags;
* placeholder APIs;
* speculative V2/V3 architecture implemented before V1 needs it.

Verify usage before deletion.

⸻

32. Documentation

Do not assume documentation is current.

The repository currently contains substantial planning and architecture documentation.

Validate claims against implementation.

When behavior materially changes:

* update relevant current documentation;
* remove or clearly mark obsolete instructions;
* avoid adding another document when updating an existing one is sufficient.

Do not generate audit/report Markdown files by default.

Documentation exists to help humans and agents operate the product, not to make the repository appear mature.

⸻

33. Git discipline

Keep changes focused.

Do not mix unrelated cleanup into a feature unless required for safe implementation.

Review the final diff.

Check for:

* debug code;
* accidental generated files;
* secrets;
* unrelated formatting churn;
* duplicated code;
* commented-out code.

Use descriptive commits when asked to commit.

Do not rewrite shared git history unless explicitly instructed.

⸻

34. Secrets

Never commit credentials.

Treat as sensitive:

* database URLs;
* Better Auth secrets;
* OAuth secrets;
* Stripe keys;
* Resend keys;
* OpenAI keys;
* Redis credentials;
* MinIO/S3 credentials;
* bank provider credentials;
* webhook secrets.

Use environment variables.

Keep .env.example limited to names and safe example values.

If a secret appears committed, do not merely delete it from the current file. Report that credential rotation may be required.

⸻

35. Performance

Do not prematurely optimize.

First avoid structurally bad behavior:

* N+1 queries;
* unbounded queries;
* huge client bundles;
* unnecessary client rendering;
* repeated expensive calculations;
* serial independent network calls;
* loading entire datasets when pagination is appropriate.

Measure before performing complex optimization.

⸻

36. Accessibility

Interactive UI should remain keyboard accessible.

Use semantic HTML.

Inputs require labels.

Dialogs require correct focus behavior.

Do not rely solely on color to communicate important state.

Use existing accessible primitives where available.

⸻

37. Product honesty

Never implement fake success.

Examples:

* newsletter form that says “subscribed” without subscribing;
* payment flow that looks successful before Stripe confirms it;
* bank sync UI using fake reconciliation;
* AI extraction displayed as confirmed data without validation;
* buttons that pretend an action occurred.

If functionality is unavailable, either implement it properly, disable it clearly, or remove it.

The UI must represent reality.

⸻

38. Working autonomously

Do not ask questions the repository can answer.

Investigate first.

When several technical implementations are possible, choose the strongest reasonable one yourself.

Ask the user when there is a real product decision such as:

* changing intended business behavior;
* removing a meaningful feature;
* changing pricing;
* changing legal assumptions;
* choosing between genuinely different user experiences.

Do not ask permission for routine engineering decisions.

⸻

39. Completion report

After substantial work, report concisely:

Changed

What materially changed.

Why

The important reasoning or root cause.

Verified

Exact checks or workflows executed.

Remaining

Only genuine remaining risks, limitations, or decisions.

Do not produce a giant work diary.

⸻

40. Prime directive

Do not optimize for preserving this repository.

Optimize for turning RentReady into an excellent product.

Keep what is good.

Fix what is weak.

Delete what is unnecessary.

Rewrite what is fundamentally wrong.

Verify what you ship.
