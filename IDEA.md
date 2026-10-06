IDEA.md — RentReady

The idea

RentReady is a rental management SaaS for independent landlords in France.

Its purpose is simple:

Make managing a rental property almost administrative-free.

A landlord should not need spreadsheets, folders of PDFs, calendar reminders, banking checks and repeated manual work to manage a few properties.

RentReady should know what needs to happen, surface what requires attention, and automate everything else that can safely be automated.

Who we build for

The primary user is a French independent landlord managing a small portfolio.

Typically:

* 1–10 properties;
* manages rentals themselves;
* is not a professional property manager;
* does not want to learn complex property-management software;
* wants to spend as little time as possible on administration;
* needs confidence that rent, documents and deadlines are handled correctly.

Professional property managers and agencies may eventually use RentReady, but they must not distort the initial product.

Do not build enterprise property-management software prematurely.

The core promise

At any moment, a landlord should be able to open RentReady and immediately know:

* who should have paid;
* who has paid;
* what is missing;
* what requires action;
* what deadline is approaching;
* which documents are available;
* what RentReady already handled automatically.

The user should not have to reconstruct this information manually.

The golden path

The fundamental RentReady journey is:

Property → Tenant → Lease → Rent → Payment → Receipt

This path must be excellent before the product expands horizontally.

A new landlord should be able to:

1. create a property;
2. add a tenant;
3. create or register the lease;
4. define the rent and charges;
5. start tracking rent;
6. record or automatically detect a payment;
7. generate and send the appropriate receipt;
8. see the resulting state clearly on the dashboard.

This should feel obvious without documentation.

The product loop

Once configured, RentReady should progressively become quieter.

Each month:

Rent becomes due
→ RentReady expects payment
→ payment is recorded or detected
→ the correct state is calculated
→ a receipt is generated when appropriate
→ the tenant can receive it
→ the landlord sees that everything is fine.

If something goes wrong:

payment is missing or incomplete
→ RentReady detects it
→ explains the situation
→ proposes the appropriate action
→ tracks the resolution.

The product should manage the routine and surface the exceptions.

What RentReady replaces

For its core user, RentReady should progressively replace the need for:

* rent-tracking spreadsheets;
* manually created rent receipts;
* calendar reminders;
* scattered tenant information;
* scattered lease documents;
* manually checking whether rent arrived;
* manually calculating what remains unpaid;
* searching through emails and folders;
* repetitive tenant messages.

Every important feature should reduce one of these burdens.

Product principles

Automation over administration

If RentReady already has enough information to perform or prepare a repetitive task safely, the user should not have to do it manually.

Exceptions over dashboards

Do not force users to inspect dashboards to discover problems.

Surface what requires attention.

When everything is fine, the product should feel calm.

Trust over cleverness

This product deals with homes, contracts and money.

Correctness matters more than novelty.

Users must understand what happened and why.

Important actions should be traceable.

Progressive complexity

A landlord with one apartment should see a very simple product.

Complexity should appear only when the user’s situation requires it.

Do not expose the full complexity of the data model through the UI.

Useful defaults

French rental management contains many conventions and recurring values.

Use good defaults wherever safe.

Do not turn every possible choice into configuration.

One source of truth

RentReady should become the place where the landlord trusts the current state of their rental activity.

Conflicting payment, lease or tenant states are unacceptable.

What matters most

In approximate priority:

1. Properties and tenants

The basic portfolio must be easy to create and understand.

2. Leases

RentReady must understand the contractual relationship connecting a property and its tenant.

3. Rent schedule

The system must know what amount is expected and when.

4. Payments

The system must represent what was actually paid accurately, including partial or late payments.

5. Receipts and documents

Correct documents should be generated from trusted data with minimal effort.

6. Alerts and actions

The user should know when something requires attention.

7. Automation

Once the underlying workflows are trustworthy, automate repetitive steps.

Everything else competes with these priorities.

Banking

Bank synchronization can become one of RentReady’s strongest features because it closes the gap between expected rent and actual payment.

But banking is not the product by itself.

The core payment model must work correctly without a banking provider.

Bank synchronization should enhance it:

expected payment
→ bank transaction detected
→ probable match
→ reconciliation
→ receipt workflow.

Provider-specific concepts must not become the domain model.

AI

AI is an accelerator, not a foundation.

Good uses may include:

* extracting structured information from documents;
* helping import an existing lease;
* summarizing information;
* drafting communications;
* assisting the user through complex administrative tasks.

AI must not replace deterministic logic for:

* financial calculations;
* authorization;
* payment state;
* legal deadlines;
* rent schedules;
* critical document values;
* business invariants.

If deterministic code can solve the problem reliably, prefer it.

SEO and free tools

SEO can be an important acquisition channel.

Free calculators, templates, guides and educational content can bring landlords to RentReady.

But acquisition tooling must not consume more product energy than the product users eventually discover.

The ideal loop is:

useful free tool → trust → RentReady account → property configured → recurring value

Traffic without activation is not product success.

Monetization

RentReady should charge for recurring operational value, not arbitrary feature restriction.

A user should understand why paying saves them time, risk or administrative effort.

The free/trial experience should allow users to experience the core value before requiring payment.

Pricing and limits should remain simple.

What we are NOT building yet

Unless demonstrated user demand changes the strategy, RentReady is not primarily:

* an enterprise property-management ERP;
* an accounting suite;
* a marketplace;
* a social network;
* a maintenance contractor marketplace;
* a banking product;
* an AI chatbot;
* a generic document-management system;
* a CRM for agencies.

Features in those directions require strong justification.

How to judge a feature

Before building something substantial, ask:

Does this make rental management meaningfully easier, safer or more automatic for our core landlord?

Then ask:

Does it improve the golden path or remove a recurring burden?

If neither answer is convincing, it is probably not a priority.

A feature being technically interesting is not sufficient.

A competitor having it is not sufficient.

A roadmap containing it is not sufficient.

V1 success

V1 is successful when a landlord can confidently manage real rentals in RentReady every month.

Not when every roadmap item exists.

Not when the architecture looks impressive.

Not when the landing page is complete.

A successful early RentReady user should eventually feel:

“I barely have to think about my rental administration anymore.”

That is the product.
