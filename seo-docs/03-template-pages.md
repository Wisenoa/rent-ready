# Document Template Pages — Content Briefs for SEO

> This document provides SEO-optimized content outlines for the document template pages. The Senior Frontend Engineer uses these briefs to implement the content sections of each page.

---

## Overview

Document template pages serve a dual purpose:
1. **SEO**: They rank for high-intent "modèle [document]" keywords
2. **Conversion**: They convert visitors into signups by offering free value

Template pages should be at `/home/ubuntu/rent-ready/src/app/(marketing)/templates/[template-name]/page.tsx` OR at `/home/ubuntu/rent-ready/src/app/(outils)/outils/[tool-name]/page.tsx`.

**Current template pages:**
- `/app/(marketing)/templates/bail-mobilite/` (EXISTING)
- `/app/(marketing)/templates/bail-commercial/` (EXISTING)
- `/app/(marketing)/templates/bail-meuble/` (EXISTING)
- `/app/(marketing)/templates/colocation/` (EXISTING)
- `/app/(marketing)/templates/conge-locataire/` (EXISTING)
- `/app/(marketing)/templates/conge-proprietaire/` (EXISTING)
- `/app/(marketing)/templates/etat-des-lieux/` (EXISTING)
- `/app/(marketing)/templates/recu-loyer/` (EXISTING)
- `/app/(marketing)/templates/calculateur-rendement-locatif/` (EXISTING)
- `/app/(outils)/outils/modele-bail-location/` (EXISTING)
- `/app/(outils)/outils/modele-quittance-loyer-pdf/` (TO DO)
- `/app/(outils)/outils/lettre-relance-loyer/` (TO DO)

---

## 1. Modèle de Quittance de Loyer

**Page URL:** `/app/(outils)/outils/modele-quittance-loyer-pdf/page.tsx`

**Status:** Needs implementation

**Meta Title:** Modèle de Quittance de Loyer PDF Imprimable — Gratuit, Sans Inscription

**Meta Description:** Téléchargez notre modèle de quittance de loyer PDF gratuit et imprimable. Conforme à la loi du 6 juillet 1989. Remplissez en 2 minutes, sans inscription.

**Target Keywords:** modèle quittance loyer gratuit, quittance loyer PDF, modèle reçus loyer, quittance imprimable, reçus paiement loyer, modèle quittanceWord, quittance gratuite

**Page Type:** Outil / Template (free tool with product CTA)

**Primary Intent:** Informational + tool use (user wants to download/fill a template)

**Target User:** Landlord who needs a quick, legal rent receipt

---

### Content Sections

#### Section 1: Hero / Tool Introduction
- **H1:** Modèle de Quittance de Loyer PDF — Gratuit et Conforme
- **Subtitle:** Téléchargez et remplissez votre quittance en 2 minutes. Aucune inscription requise.
- **Primary CTA button:** "Télécharger le modèle PDF" (links to the actual PDF template download)
- **Secondary CTA:** "Générez vos quittances automatiquement →" (links to `/register`)
- **Visual:** Screenshot/preview of the template

#### Section 2: Qu'est-ce qu'une quittance de loyer?
- **H2:** Qu'est-ce qu'une quittance de loyer?
- **Content:** Legal obligation per Article 21 of loi 89-462 (6 July 1989). Must be provided within 1 month of tenant's request. Purpose: proof of payment, protects both parties.
- **Word count:** ~120 words

#### Section 3: Mentions obligatoires
- **H2:** Mentions obligatoires d'une quittance légale
- **Content:** Bulleted list of required mentions:
  - Nom et adresse du bailleur
  - Nom et adresse du locataire
  - Désignation du logement (adresse + surface)
  - Période de location concernée
  - Montant du loyer (hors charges) + montant des charges
  - Date de paiement
  - Mode de paiement utilisé
  - Signature du bailleur
- **Note:** Mention that digital signatures are valid
- **Word count:** ~150 words

#### Section 4: Comment utiliser ce modèle
- **H2:** Comment remplir ce modèle de quittance
- **Content:** Numbered steps:
  1. Download the PDF
  2. Fill in landlord information
  3. Fill in tenant and property details
  4. Enter the rental period and amounts
  5. Date and sign
  6. Send to tenant (email or postal)
- **Word count:** ~200 words

#### Section 5: Téléchargement
- **H2:** Télécharger le modèle de quittance
- **CTA:** Large "Télécharger (PDF gratuit)" button
- **Note:** "Ce modèle est gratuit. Pour une génération automatique de quittances chaque mois, découvrez RentReady."
- **Word count:** ~50 words

#### Section 6: Pourquoi utiliser un modèle vs. un logiciel?
- **H2:** Comparaison : modèle gratuit ou logiciel de gestion locative?
- **Content:** Two-column comparison table:

| Critère | Modèle gratuit | RentReady |
|---------|--------------|-----------|
| Coût | Gratuit | 15€/mois |
| Conformité légale | Manual verification needed | Automatic per loi 89-462 |
| gain de temps | One-time use | Automated monthly generation |
| Détection des paiements | Manual | Automatique (Open Banking) |
| Portail locataire | Non | Oui |
| Historique | Manual filing | Automatique |

- **Word count:** ~100 words + table

#### Section 7: FAQ
- **H2:** Questions fréquentes sur les quittances de loyer
- **5 FAQs:**
  1. La quittance est-elle obligatoire? (Non, but must be provided within 1 month if tenant requests)
  2. Combien coûte une quittance? (Free to issue)
  3. Une quittance numérique est-elle valide? (Yes, since 2016)
  4. Que faire en cas de paiement partiel? (Issue receipt for amount actually received, note partial payment)
  5. Comment archiver les quittances? (Keep digital copy for 5 years minimum)

#### Section 8: Related Content
- **H2:** Ressources complémentaires
- **Links:**
  - Article: "Comment gérer les loyers impayés" → `/blog/comment-gerer-loyers-impayes`
  - Article: "Révision de loyer IRL" → `/blog/revision-loyer-irl-guide-complet`
  - Glossaire: Quittance de loyer → `/glossaire-immobilier`
  - Outil: Calculateur de dépôt de garantie → `/outils/calculateur-depot-garantie`

---

### SEO Notes for Quittance Page
- **JSON-LD:** WebApplication schema (free tool) + FAQPage schema
- **Internal Links:** From `/quittances` (feature page) and `/blog/article-7` (modèle quittance article)
- **External Links:** Reference INSEE official IRL data page (link to INSEE)

---

## 2. Lettre de Relance pour Loyer Impayé

**Page URL:** `/app/(outils)/outils/lettre-relance-loyer/page.tsx`

**Status:** Needs implementation

**Meta Title:** Modèle de Lettre de Relance pour Loyer Impayé — Téléchargement Gratuit

**Meta Description:** Téléchargez notre modèle de lettre de relance pour loyer impayé. Copiez-collez, personnalisez et envoyez en 5 minutes. Conseils juridiques inclus.

**Target Keywords:** modèle lettre relance loyer impayé, lettre relance gratuite, courrier relance locataire, mise en demeure loyer impayé, lettre relance

**Page Type:** Outil / Template (free tool with product CTA)

**Primary Intent:** Informational + tool use (landlord wants to send a reminder letter)

---

### Content Sections

#### Section 1: Hero
- **H1:** Lettre de Relance pour Loyer Impayé — Modèle Gratuit
- **Subtitle:** Personnalisez et envoyez votre lettre de relance en 5 minutes. Gratuit, sans inscription.
- **Primary CTA:** "Télécharger le modèle Word/PDF"
- **Secondary CTA:** "Détectez automatiquement les impayés →" (links to `/register`)

#### Section 2: Contexte juridique
- **H2:** Ce que dit la loi sur les loyers impayés
- **Content:** Legal framework summary — loi 89-462 (art. 7), procedure timeline, tenant protections.
- **Important:** Note that formal mise en demeure requires huissier, but this letter is a prior informal step.
- **Word count:** ~180 words

#### Section 3: Quand envoyer une lettre de relance?
- **H2:** Quand envoyer une lettre de relance?
- **Content:** Timeline:
  - Day 1 of month: rent due
  - Day 5: follow-up if no payment received (informal call/text)
  - Day 10-15: formal written reminder (this letter)
  - Day 30: mise en demeure via huissier
  - Day 60+: commandatory letter (assignation au tribunal)
- **Word count:** ~150 words

#### Section 4: Section 4: Éléments à inclure dans la lettre
- **H2:** Quels éléments inclure dans votre lettre de relance?
- **Bulleted list:**
  - Header with your coordinates and tenant's coordinates
  - Date and reference number
  -，明确 mention "Relance pour loyer impayé"
  - Period and exact amount owed
  - Bank details for payment
  - Deadline for payment (10 days typical)
  - Consequences of non-payment (formal notice, legal proceedings)
  - Formal but not aggressive tone
- **Word count:** ~200 words

#### Section 5: Section 5: Télécharger le modèle
- **H2:** Télécharger le modèle de lettre de relance
- **CTA:** "Télécharger (gratuit)"
- **Note:** "Modèle Word modifiable. Pour une automatisation complète des relances, utilisez RentReady."

#### Section 6: Section 6: Conseils de rédaction
- **H2:** Conseils pour rédiger une lettre de relance efficace
- **Bulleted tips:**
  - Be firm but professional — avoid emotional language
  - Always include exact amounts and dates
  - Set a clear but reasonable deadline
  - Mention the consequences clearly but legally
  - Keep a copy for your records
  - Send by recommandé avec accusé de réception (creates proof)
- **Word count:** ~150 words

#### Section 7: Section 7: FAQ
- **H2:** Questions fréquentes
- **5 FAQs:**
  1. Cette lettre a-t-elle une valeur juridique? (It documents the reminder but is not a formal mise en demeure. For formal legal action, use a huissier.)
  2. Comment adresser la lettre? (Recommandé avec accusé de réception is best for proof)
  3. Combien de lettres de relance envoyer? (1-2 informal reminders before formal mise en demeure)
  4. Que faire si le locataire ne répond pas? (Proceed to formal mise en demeure via huissier, then tribunal if needed)
  5. Peut-on ajouter des pénalités? (Only if specified in the lease — check your bail)

#### Section 8: Related Content
- **Links:**
  - Article: "Comment gérer les loyers impayés" → `/blog/comment-gerer-loyers-impayes`
  - Outil: Calculateur de dépôt de garantie → `/outils/calculateur-depot-garantie`
  - Glossaire: Loyer impayé → `/glossaire-immobilier`

---

## 3. Modèle de Bail de Location

**Page URL:** `/app/(marketing)/templates/bail-mobilite/` (or dedicated bail page at `/bail`)

**Status:** Existing at bail-mobilite but needs SEO enrichment

**Meta Title:** Modèle de Bail de Location — Contrat gratuit conforme loi française 2026

**Meta Description:** Téléchargez notre modèle de bail de location gratuit. Bail nu (vide) et bail meublé, conformes à la loi du 6 juillet 1989. Mise à jour 2026.

**Target Keywords:** modèle bail location gratuit, contrat location gratuit, bail PDF, modèle bailWord, bailWord gratuit, bail 2026

---

### Additional Sections to Add to Existing Bail Pages

The existing bail pages (bail-mobilite, bail-meuble, bail-commercial) should have these sections added:

#### Section: Modèle à télécharger
- **H2:** Télécharger le modèle de bail
- **CTA:** "Télécharger le modèle de bail gratuit (PDF/Word)"
- **Note:** "Ce modèle est fourni à titre indicatif. Consultez toujours un professionnel pour votre situation."

#### Section: Clauses obligatoires
- **H2:** Clauses obligatoires du bail de location
- **Table of required clauses:**
  - Identification des parties
  - Désignation du logement (adresse, surface, nombre de pièces)
  - Destination du logement
  - Montant du loyer + modalités de révision
  - dépôt de garantie
  - Date de début et durée du bail
  - Clause de révision (IRL)
  - Modalités de résiliation
  - Éta des lieux (entrée)
  - Diagnostics obligatoires annexés
- **Word count:** ~200 words + table

#### Section: Clause IRL
- **H2:** Clause de révision de loyer (IRL)
- **Content:** Standard clause text to include in the bail for annual rent review. Reference to INSEE IRL. Include example calculation.
- **Word count:** ~150 words

---

## 4. Additional Template Pages to Create

### 4A. Modèle d'État des Lieux

**Page URL:** `/app/(marketing)/templates/etat-des-lieux/`

**Status:** Already exists — needs SEO enrichment

**Meta Title:** Modèle d'État des Lieux — Téléchargement gratuit et conforme 2026

**Meta Description:** Téléchargez notre modèle d'état des lieux gratuit et imprimable. Checklist complète entrée et sortie. Protégez-vous contre les litiges.

**Target Keywords:** modèle état lieux gratuit, état des lieux PDF, checklist état lieux, modèleWord état lieux, état lieux sortie

**Sections to add:**
1. Hero with download CTA
2. Why états des lieux matter (legal protection for both parties)
3. Checklist of items to inspect (with table)
4. How to fill the template
5. Difference between entry and exit états des lieux
6. Photo evidence guide
7. FAQ (5 questions)
8. Internal links to related articles and tools

---

### 4B. Modèle de Congé du Propriétaire

**Page URL:** `/app/(marketing)/templates/conge-proprietaire/`

**Status:** Already exists — needs SEO enrichment

**Meta Title:** Modèle de Congé du Propriétaire — 3 Formules de Préavis Conforme 2026

**Meta Description:** Téléchargez le modèle de congé du propriétaire gratuit. 3 formules selon le motif : reprise, vente, motif légitime et sérieux. Lettre recommandée obligatoire.

**Target Keywords:** modèle congé propriétaire gratuit,モデル congrée propriétaire,模型congee propriétaire,模型congee,模型congee,模型congee,模型congee, lettre congé bailleur, préavis location

**Note:** The Asian characters in keywords above are an encoding error — the correct keywords are:
- modèle congé propriétaire gratuit
- modèle congé bailleur
- lettre congé bailleur
- préavis location 3 mois
-模型congee is garbled text — ignore

**Sections to add:**
1. Hero with download CTA
2. Legal framework (notice periods, required reasons)
3. Three templates for: reprise, vente, motif légitime
4. How to send (recommandé avec accusé de réception)
5. FAQ (5 questions)

---

### 4C. Modèle de Congé du Locataire

**Page URL:** `/app/(marketing)/templates/conge-locataire/`

**Status:** Already exists — needs SEO enrichment

**Sections to add:**
1. Hero with download CTA
2. Notice period rules (1 month for meublé, 3 months for empty)
3. Template
4. How to send + proof
5. FAQ (5 questions)

---

## 5. SEO Patterns for All Template Pages

### Meta Title Patterns
- Format: `[Document Type] — [Key benefit] | RentReady`
- Max: 60 characters
- Include primary keyword near the beginning

### Meta Description Patterns
- Format: `[What it is] + [key benefit] + [free/price] + [action]`
- Max: 155 characters
- Include primary keyword once

### Header Structure
- H1: Page title (the document type name)
- H2: Section headers (descriptive, keyword-inclusive)
- H3: Sub-sections where needed
- No more than 3 H2 sections without a clear hierarchy

### Content Volume
- Minimum: 800 words of unique content per template page
- Ideal: 1200-1500 words
- The template itself (the downloadable document) is the primary value — content supports SEO and conversion

### Internal Linking (Template Pages)
- Link to at least 2 blog articles
- Link to the glossary (relevant terms)
- Link to at least 1 related tool page
- End with a product CTA section ("Pour automatiser X, essayez RentReady")

### Schema Markup
- Template/download pages: `WebApplication` schema with `offers.price: "0"` (free tool)
- Add `FAQPage` schema for pages with FAQ sections

---

## 6. Checklist for Template Page Implementation

Before a template page is considered complete, verify:

- [ ] Meta title ≤ 60 chars, includes primary keyword
- [ ] Meta description ≤ 155 chars, includes primary keyword
- [ ] H1 = page title (matches meta title without the " | RentReady" part)
- [ ] All H2 headings are descriptive and keyword-inclusive where natural
- [ ] At least 800 words of unique content
- [ ] Download CTA is prominent and above the fold
- [ ] At least 2 internal links to blog articles
- [ ] At least 1 internal link to glossary
- [ ] FAQ section with at least 5 questions (marked up with FAQPage schema)
- [ ] JSON-LD: WebApplication schema (free tool) + FAQPage schema
- [ ] Open Graph tags: title, description, url, image
- [ ] Canonical URL set
- [ ] All images have descriptive alt text
- [ ] Page is mobile-responsive
