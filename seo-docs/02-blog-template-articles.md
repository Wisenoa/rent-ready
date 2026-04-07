# Blog Template & Article Content Briefs — RentReady

> This document provides the blog template structure and first 10 SEO-optimized article outlines for the Senior Frontend Engineer and Content team to implement.

---

## 1. Blog Page Template

**File:** `/home/ubuntu/rent-ready/src/app/(marketing)/blog/[slug]/page.tsx`

The existing blog template is already built at `src/app/(marketing)/blog/[slug]/page.tsx`. The SEO content brief below defines what content should go into the article content field for each of the first 6 articles (already in `src/data/articles.ts`), plus the 4 additional articles to create.

### Template Structure for `/blog/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/data/articles";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { BreadcrumbSchema } from "@/components/seo/organization-schema";
import { GlassNav } from "@/components/landing/glass-nav";
import { FinalCta } from "@/components/landing/final-cta";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — Blog RentReady`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://www.rentready.fr/blog/${params.slug}`,
      images: [{ url: "https://www.rentready.fr/og-image.png", width: 1200, height: 630 }],
      publishedTime: article.date,
      authors: ["RentReady"],
    },
    alternates: { canonical: `https://www.rentready.fr/blog/${params.slug}` },
  };
}

export default function BlogArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: "RentReady" },
    publisher: { "@type": "Organization", name: "RentReady", url: "https://www.rentready.fr" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.rentready.fr/blog/${params.slug}` },
  };

  return (
    <>
      <SchemaMarkup data={schema} />
      <BreadcrumbSchema items={[
        { name: "Accueil", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: article.title, url: `/blog/${params.slug}` },
      ]} />
      {/* Full article content rendered here */}
    </>
  );
}
```

**Note:** Articles 1-6 already exist in `src/data/articles.ts`. Articles 7-10 need to be added to that file.

---

## 2. First 10 Article Outlines

### Article 1 (EXISTING)
- **Slug:** `comment-gerer-loyers-impayes`
- **Title:** Comment gérer les loyers impayés en 2026
- **Status:** Published
- **Category:** Gestion

### Article 2 (EXISTING)
- **Slug:** `revision-loyer-irl-guide-complet`
- **Title:** Révision de loyer et IRL: guide complet 2026
- **Status:** Published
- **Category:** Calculs

### Article 3 (EXISTING)
- **Slug:** `depot-garantie-regles-essentielles`
- **Title:** Dépôt de garantie: les règles essentielles à connaître en 2026
- **Status:** Published
- **Category:** Juridique

### Article 4 (EXISTING)
- **Slug:** `etat-des-lieux-entree-sortie`
- **Title:** État des lieux d'entrée et de sortie: mode d'emploi 2026
- **Status:** Published
- **Category:** Juridique

### Article 5 (EXISTING)
- **Slug:** `loi-alur-proprietaire-bailleur`
- **Title:** Loi ALUR: impact sur les propriétaires bailleurs en 2026
- **Status:** Published
- **Category:** Juridique

### Article 6 (EXISTING)
- **Slug:** `optimiser-fiscalite-loyers`
- **Title:** Optimiser la fiscalité de vos revenus locatifs en 2026
- **Status:** Published
- **Category:** Fiscalité

---

### Article 7 (NEW — Add to articles.ts)

**Slug:** `modele-quittance-loyer-pdf-gratuit`

**Meta Title:** Modèle de quittance de loyer PDF gratuit — Comment remplir une quittance conforme

**Meta Description:** Téléchargez notre modèle de quittance de loyer PDF gratuit et découvrez comment remplir chaque mention obligatoire. Quittance conforme loi 89-462 en 5 minutes.

**Target Keywords:** modèle quittance loyer gratuit, quittance de loyer PDF, quittance imprimable, reçu loyerWord, modèle quittanceWord

**Buyer Journey Stage:** TOFU / MOFU (awareness + consideration)

**H1:** Modèle de Quittance de Loyer PDF Gratuit — Comment Remplir Chaque Mention

**Target Intent:** Informational — "comment faire une quittance de loyer", "télécharger modèle quittance"

**Content Outline:**
1. **Intro** (150 words): Problem — landlords waste time manually creating receipts. Solution — use a free template + RentReady automates it. CTA to tool.
2. **Qu'est-ce qu'une quittance de loyer?** (200 words): Legal definition per loi 89-462. When it's mandatory (upon tenant request). Consequences of not providing one.
3. **Mentions obligatoires d'une quittance** (300 words): Detailed list of all required mentions: names/addresses, rental period, amount (loyer + charges separated), payment method, date, landlord signature. Table format.
4. **Modèle de quittance à télécharger** (100 words): Link to `/outils/modele-quittance-loyer-pdf`. Explain it's free, no signup required.
5. **Comment remplir le modèle** (400 words): Step-by-step walkthrough of each field. Tips for partial payments, multiple tenants, parking fees.
6. **Quand envoyer la quittance** (150 words): Legal obligation timing. Email vs. postal. Tenant portal advantage.
7. **Comparaison : modèle gratuit vs. logiciel de gestion** (200 words): Table comparing manual template vs. RentReady. Automation benefits.
8. **FAQ** (5 questions): Short answers.
9. **Internal Links**: Link to `/quittances`, `/blog/revision-loyer-irl-guide-complet`, `/glossaire-immobilier`
10. **CTA**: "Générez vos quittances automatiquement" → link to `/register`

**Internal Linking:** Link to `/quittances`, `/blog/revision-loyer-irl-guide-complet`, `/glossaire-immobilier` (term: quittance de loyer)

**Schema:** Article + FAQPage

---

### Article 8 (NEW — Add to articles.ts)

**Slug:** `lettre-relance-loyer-impaye-modele`

**Meta Title:** Lettre de relance pour loyer impayé — Modèle gratuit et conseils juridiques

**Meta Description:** Téléchargez notre modèle de lettre de relance pour loyer impayé. Conseils juridiques, délai légal, étapes de la procédure d'impayé. Gratuit.

**Target Keywords:** lettre relance loyer impayé, modèle lettre relance, relance loyer, courrier impayé locataire, mise en demeure loyer

**Buyer Journey Stage:** MOFU (consideration)

**H1:** Lettre de Relance pour Loyer Impayé — Modèle Gratuit et Conseils Juridiques

**Target Intent:** Informational + transactional — landlord searching for how to handle late payments + wants a template

**Content Outline:**
1. **Intro** (150 words): Scale of the problem (statistics on unpaid rents in France). Introduce free template offer.
2. **Comprendre la procédure d'impayé** (300 words): Legal framework (loi 89-462). Step-by-step timeline: day 1 → day 10 → day 30 → day 60 → commandatory letter → tribunal.
3. **Modèle de lettre de relance** (100 words): Download link to `/outils/lettre-relance-loyer`. Note: customizable for landlord's situation.
4. **Comment rédiger votre lettre** (400 words): Structure of the letter. Formal French legal language. What to include (amounts, due dates, consequences). Tone advice.
5. **Les erreurs à éviter** (200 words): Don't threaten illegally, don't breach tenant privacy, don't use aggressive tone. Legal boundaries.
6. **Que faire si le locataire ne paie toujours pas?** (250 words): Formal notice (mise en demeure), conciliation, référé gracieux, commandatory letter (assignation).
7. **Prévention des impayés** (200 words): Open Banking detection via RentReady. Pre-screening tenants. Tenant insurance (GLI).
8. **FAQ** (5 questions)
9. **Internal Links**: Link to `/blog/comment-gerer-loyers-impayes`, `/outils/lettre-relance-loyer`, `/locations`
10. **CTA**: "Détectez automatiquement les impayés" → link to `/register`

**Internal Linking:** Link to `/blog/comment-gerer-loyers-impayes`, `/outils/lettre-relance-loyer`, `/locations`

**Schema:** Article + FAQPage

---

### Article 9 (NEW — Add to articles.ts)

**Slug:** `charges-locatives-decompte-annualise`

**Meta Title:** Charges locatives : le guide complet du décompte annualisé

**Meta Description:** Charges locatives : comment établir le décompte annualisé, quelles sont les charges récupérables, quand envoyer le relevé au locataire. Guide complet 2026.

**Target Keywords:** charges locatives, décompte charges, charges récupérables, régularisation charges, provision charges, relevé charges locataire

**Buyer Journey Stage:** MOFU (consideration)

**H1:** Charges Locatives : Le Guide Complet du Décompte Annualisé

**Content Outline:**
1. **Intro** (150 words): What charges are, why annual settlement matters, risk of not doing it.
2. **Les charges récupérables vs. non récupérables** (300 words): Detailed list (gardien, ascenseur, eau froide, entretien espaces verts vs. taxe foncière, assurance). Reference to décret n° 87-713.
3. **Comment calculer la provision sur charges** (300 words): Estimate method (dépenses réelles N-1 / number of lots). Advance payment rules.
4. **Le décompte annualisé** (250 words): When to send (within 6 months of year end). What to include. Template link.
5. **Cas particulier : lesapen charges** (150 words): Handling increases.
6. **Erreurs fréquentes** (200 words): Wrong charges, missing deadlines, wrong calculation bases.
7. **Logiciel vs. tableur** (150 words): Why a tool prevents errors.
8. **FAQ** (5 questions)
9. **Internal Links**: Link to `/locations`, `/glossaire-immobilier` (terms: charges, provision), `/blog/comment-gerer-loyers-impayes`
10. **CTA**: "Gérez vos charges automatiquement" → link to `/register`

**Schema:** Article + FAQPage

---

### Article 10 (NEW — Add to articles.ts)

**Slug:** `assurance-loyeur-gli-garantie-loyers-impayes`

**Meta Title:** Assurance loyer impayé (GLI) : comment protéger vos revenus locatifs

**Meta Description:** La Garantie Loyer Impayé (GLI) vous protège contre les impayés, dégradations et frais de procédure. Comparatif des offres et conseils pour bien choisir.

**Target Keywords:** garantie loyer impayé, GLI assurance, assurance loyer impayé propriétaire, protection revenus locatifs, garantie propriétaire bailleur

**Buyer Journey Stage:** TOFU (awareness) + MOFU (consideration)

**H1:** Assurance Loyer Impayé (GLI) : Comment Protéger Vos Revenus Locatifs

**Content Outline:**
1. **Intro** (150 words): Risk of unpaid rent (statistics). Introduce GLI as solution.
2. **Qu'est-ce que la GLI?** (250 words): Definition, what's covered (loyers, charges, dégradations, frais de procédure). How it works (monthly premium).
3. **GLI obligatoire vs. facultative** (200 words): Only mandatory for certain types of subsidized housing. For regular landlords: optional but strongly recommended.
4. **Ce que couvre la GLI** (300 words): Detail coverage — unpaid rent (typically 3-12 months), damage deposits shortfall, legal fees, tenant default.
5. **Combien coûte une GLI?** (150 words): Pricing ranges (0.5-3% of annual rent). Factors affecting price. Comparison with self-insuring.
6. **Comment choisir son assureur** (200 words): Key criteria — waiting period, ceiling, franchise, exclusions. Top providers in France.
7. **Alternatives à la GLI** (150 words): Visale (bailleur sans contrainte), deposit scheme (caution), tenant screening.
8. **FAQ** (5 questions)
9. **Internal Links**: Link to `/blog/comment-gerer-loyers-impayes`, `/locations`, `/blog/loi-alur-proprietaire-bailleur`
10. **CTA**: "Réduisez vos risques avec RentReady" → link to `/register`

**Schema:** Article + FAQPage

---

## 3. Content Brief Template (For Future Articles)

When creating new article briefs, use this structure:

```
### Article [N]
**Slug:** [url-safe-slug]
**Title:** [SEO-optimized title with primary keyword near start]
**Meta Title:** [50-60 chars — Primary keyword + "— Blog RentReady"]
**Meta Description:** [140-155 chars — query answer + value proposition]
**Target Keywords:** [5-8 keywords, primary first, separated by commas]
**Buyer Journey Stage:** [TOFU / MOFU / BOFU]
**H1:** [Exact title or close variant]
**Target Intent:** [Informational / Commercial / Transactional]
**Content Outline:**
1. **Intro** (150 words): [Hook + problem statement + article promise]
2. **[Section 2]** ([N] words): [Topic coverage]
3. **[Section 3]** ([N] words): [Topic coverage]
4. ... (8-10 sections total)
5. **FAQ** (5 questions): [Most common related questions]
6. **Internal Links**: [List 3-5 internal link targets]
7. **CTA**: [Product CTA tied to the article topic]
**Schema:** [Article + FAQPage / HowTo / etc.]
```

---

## 4. Publishing Schedule (3 articles/week target)

| Week | Monday | Wednesday | Friday |
|------|--------|-----------|--------|
| Week 1 | [Already live] | [Already live] | [Already live] |
| Week 2 | Article 7 (Modèle quittance) | Article 8 (Lettre relance) | Article 9 (Charges locatives) |
| Week 3 | Article 10 (GLI) | NEW: Bail en穿年期详解 | NEW: Quittance avanceede |
| Week 4 | NEW: IRL 2026 update | NEW: Diagnostics obligatoires | NEW: Reéré gracieux |

**Note:** Publish articles on Monday/Wednesday/Friday mornings (8-9am Paris time for optimal indexing crawl timing).

---

## 5. Pillar Page Strategy

The blog should eventually be organized around **pillar pages** — comprehensive hub articles that link to cluster content.

### Pillar Page 1: "Guide Complet de la Gestion Locative pour Propriétaires"
- **URL:** `/blog/guide-gestion-locative-proprietaire`
- **Target Keyword:** gestion locative particulier, guide gestion locative
- **Links to:** All individual topic articles (IRL, charges, quittances, bail, maintenance)
- **Internal links from:** Homepage, pricing, glossary

### Pillar Page 2: "Loyers Impayés : Du Début à la Procédure Judiciaire"
- **URL:** `/blog/loyers-impayes-procedure-complete`
- **Target Keyword:** procédure loyer impayé, recouvrement loyer
- **Links to:** Article 1 (impayés), Article 8 (lettre relance), Article 10 (GLI)
- **Internal links from:** Bail page, Locations page

### Pillar Page 3: "Révision de Loyer IRL : Tout Savoir en 2026"
- **URL:** `/blog/revision-loyer-irl-complet`
- **Target Keyword:** révision loyer IRL, IRL 2026
- **Links to:** Article 2 (IRL guide), calculateur IRL tool
- **Internal links from:** Bail page, Quittances page


---

## 6. Articles 11–50: Content Calendar (40 Additional Article Briefs)

### Article 11 — Quittance de Loyer : Mentions Obligatoires et Modèle

**Slug:** quittance-loyer-mentions-obligatoires
**Meta Title:** Quittance de Loyer : Mentions Obligatoires et Modèle Gratuit
**Meta Description:** Quittance de loyer : toutes les mentions obligatoires selon la loi du 6 juillet 1989. Téléchargez un modèle gratuit et découvrez comment la générer automatiquement.
**Target Keywords:** mentions obligatoires quittance de loyer, modèle quittance loyer, quittance de loyer loi, reçu paiement loyer
**Buyer Journey Stage:** TOFU
**H1:** Quittance de Loyer : Mentions Obligatoires et Modèle Conforme
**Target Intent:** Informational

**Content Outline:**
1. Intro: Legal obligation to provide receipt upon tenant request
2. Les 8 mentions obligatoires (nom, adresse, période, montants, date, mode de paiement, signature)
3. Différence quittance manuscrite vs. numérique
4. Modèle gratuit à télécharger
5. FAQ (5 questions)

**Internal Links:** /outils/modele-quittance-loyer-pdf, /blog/modele-quittance-loyer-pdf-gratuit
**Schema:** Article + FAQPage

---

### Article 12 — Comment Calculer le Rendement Locatif Brut et Net

**Slug:** calculer-rendement-locatif-brut-net
**Meta Title:** Calcul Rendement Locatif Brut et Net — Formule et Simulateur Gratuit
**Meta Description:** Calculez le rendement locatif brut et net de votre investissement immobilier. Formule, exemple chiffré, et conseils pour maximiser votre rentabilité.
**Target Keywords:** calcul rendement locatif, rendement brut, rendement net, rentabilité investissement locatif, formule rendement locatif
**Buyer Journey Stage:** TOFU (awareness)
**H1:** Comment Calculer le Rendement Locatif Brut et Net
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: Why yield calculation matters before buying
2. Formule du rendement brut avec exemple
3. Formule du rendement net avec exemple (charges, taxe foncière, vacance)
4. Outil de simulation
5. Facteurs qui influencent le rendement (emplacement, type de bien, financement)
6. Comparaison rendement France vs.其他国家
7. FAQ

**Internal Links:** /outils/calculateur-rendement-locatif, /blog/optimiser-fiscalite-loyers
**Schema:** Article + FAQPage

---

### Article 13 — État des Lieux : Modèle et Procédure pour Propriétaires

**Slug:** etat-des-lieux-proprietaire-modele
**Meta Title:** État des Lieux : Modèle Gratuit et Procédure pour Propriétaires
**Meta Description:** État des lieux d'entrée et de sortie : modèle gratuit, checklist, et conseils pour protéger votre dépôt de garantie. Conforme décret 2016-382.
**Target Keywords:** état des lieux modèle, état des lieux sortie, modèle état des lieux gratuit, checklist état des lieux
**Buyer Journey Stage:** MOFU
**H1:** État des Lieux : Modèle et Procédure pour Propriétaires
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Why exit inventory matters for deposit disputes
2. Cadre légal (décret 2016-382)
3. Checklist état des lieux d'entrée
4. Checklist état des lieux de sortie
5. Modèle téléchargeable
6. Comparaison photos vs.描述文字
7. Délais et procédure de contestation
8. FAQ

**Internal Links:** /templates/etat-des-lieux, /blog/depot-garantie-regles-essentielles
**Schema:** Article + FAQPage

---

### Article 14 — Bail de Colocation : Modèle et Clauses Essentielles

**Slug:** bail-colocation-modele-clauses
**Meta Title:** Bail de Colocation : Modèle et Clauses Essentielles en 2026
**Meta Description:** Bail de colocation : comment rédiger le contrat, quelles clauses ajouter, modèle gratuit. Droits et obligations des colocataires.
**Target Keywords:** bail colocation, modèle colocation, contrat colocation, colocation bail clause, bail colocataire
**Buyer Journey Stage:** MOFU
**H1:** Bail de Colocation : Modèle et Clauses Essentielles
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Growing colocation market in France
2. Cadre légal du bail en colocation (loi 89-462)
3. Clauses obligatoires vs. recommandées
4. Solidarité et clause de division des loyers
5. Modèle de bail à télécharger
6. Gestion des impayés en colocation
7. Fin de colocation : procédure et droits
8. FAQ

**Internal Links:** /templates/colocation, /blog/lettre-relance-loyer-impaye-modele
**Schema:** Article + FAQPage

---

### Article 15 — DPE 2026 : Ce Qui Change pour les Propriétaires Bailleurs

**Slug:** dpe-2026-changements-proprietaires
**Meta Title:** DPE 2026 : Ce Qui Change pour les Propriétaires — Interdictions et Obligations
**Meta Description:** DPE 2026 : nouvelles règles, interdiction de location des logements G+, et obligations des propriétaires. Tout savoir pour mettre votre bien en conformité.
**Target Keywords:** DPE 2026,Diagnostic Performance Énergétique,interdiction location,DPE classe G,loi Climat
**Buyer Journey Stage:** TOFU (awareness)
**H1:** DPE 2026 : Ce Qui Change pour les Propriétaires Bailleurs
**Target Intent:** Informational

**Content Outline:**
1. Intro: DPE as the most impactful rental regulation of 2026
2. Principe du DPE (climats A–G)
3. Dates d'interdiction de location par classe
4. Qué faire si mon bien est classé F ou G ?
5. Coût des travaux de rénovation énergétique
6. Aides disponibles (MaPrimeRénov', CEE)
7. FAQ

**Internal Links:** /blog/loi-alur-proprietaire-bailleur, /blog/assurance-loyer-impaye-gli
**Schema:** Article + FAQPage

---

### Article 16 — Comment Louer un Bien enSCI : Avantages et Procédure

**Slug:** location-sci-avantages-procedure
**Meta Title:** Louer un Bien en SCI : Avantages, Inconvénients et Procédure en 2026
**Meta Description:** SCI locative : avantages fiscaux, responsabilité, et procédure pour mettre un bien en location via une société civile immobilière.
**Target Keywords:** SCI location, société civile immobilière location, SCI fiscal avantages,SCI bailleur
**Buyer Journey Stage:** MOFU (consideration)
**H1:** Comment Louer un Bien en SCI : Avantages et Procédure
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: Why landlords choose SCI for rental property
2. Qu'est-ce qu'une SCI et pourquoi l'utiliser pour la location ?
3. Avantages fiscaux de la SCI (IS vs. IR)
4. SCI à l'IS : intérêts pour l'investissement locatif
5. Démarches pour mettre un bien en SCI
6. Responsabilité du gérant et des associés
7. Inconvénients et pièges à éviter
8. FAQ

**Internal Links:** /blog/optimiser-fiscalite-loyers, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 17 — Garantie Loyer Impayé (GLI) : Comparatif des Offres 2026

**Slug:** gli-comparatif-offres-2026
**Meta Title:** Garantie Loyer Impayé : Comparatif des Meilleures Offres GLI 2026
**Meta Description:** Comparatif GLI 2026 : garanties, délais de carence, plafonds, tarifs. Trouvez la meilleure assurance loyers impayés pour votre parc locatif.
**Target Keywords:** garantie loyer impayé comparatif, GLI comparatif, assurance loyers impayés, meilleur GLI
**Buyer Journey Stage:** MOFU (consideration)
**H1:** Garantie Loyer Impayé (GLI) : Comparatif des Offres 2026
**Target Intent:** Commercial Investigation

**Content Outline:**
1. Intro: GLI market overview in France
2. Tableau comparatif de 5 offres GLI principales
3. Critères de choix : délai de carence, plafond, franchise
4. Coût moyen de la GLI (% du loyer)
5. Ce qui est couvert vs. non couvert
6. GLI vs. Visale vs. caution : quelle option ?
7. FAQ

**Internal Links:** /blog/assurance-loyer-impaye-gli, /blog/comment-gerer-loyers-impayes
**Schema:** Article + FAQPage

---

### Article 18 — Bail Meublé : Conditions, Clause et Modèle de Bail

**Slug:** bail-meuble-conditions-clause-modele
**Meta Title:** Bail Meublé : Conditions Légales, Clauses et Modèle en 2026
**Meta Description:** Bail meublé : conditions de location meublée, mentions obligatoires, durée, et modèle gratuit. Différence avec le bail vide.
**Target Keywords:** bail meublé, location meublée bail,模型 bail meublé, bail meublé durée, bail meublé obligatoire
**Buyer Journey Stage:** MOFU
**H1:** Bail Meublé : Conditions, Clauses et Modèle de Bail
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Furnished rental advantages (higher rent, shorter lease)
2. Conditions pour un bail meublé (équipements minimum)
3. Liste des équipements obligatoires (décret)
4. Durée du bail meublé (1 an tacite reconduction)
5. Loyer en meublé : encadrement et augmentation
6. Modèle de bail à télécharger
7. FAQ

**Internal Links:** /templates/bail-meuble, /blog/loi-alur-proprietaire-bailleur
**Schema:** Article + FAQPage

---

### Article 19 — Révision de Loyer IRL 2026 : Indice, Calcul et Simulateur

**Slug:** revision-loyer-irl-2026-indice-calcul
**Meta Title:** Révision de Loyer IRL 2026 : Indice, Calcul et Simulateur Gratuit
**Meta Description:** IRL 2026 : valeur de l'indice INSEE, formule de révision, et simulateur gratuit. Updated chaque trimestre.
**Target Keywords:** IRL 2026, révision loyer 2026, indice référence loyers 2026, calcul révision loyer 2026
**Buyer Journey Stage:** TOFU/MOFU
**H1:** Révision de Loyer IRL 2026 : Indice, Calcul et Simulateur
**Target Intent:** Informational + Tool

**Content Outline:**
1. Intro: IRL is the most-used rent index in France
2. Qu'est-ce que l'IRL (indice de référence des loyers) ?
3. Tableau des dernières valeurs IRL (2023–2026)
4. Formule de calcul de la révision
5. Exemple chiffré étape par étape
6. Simulateur gratuit (lien vers outil)
7. Plafonnement dans les zones encadrées
8. FAQ

**Internal Links:** /outils/simulateur-irl, /blog/revision-loyer-irl-guide-complet
**Schema:** Article + HowTo + FAQPage

---

### Article 20 — Taxe Foncière Propriétaire : Calcul, Exonération et Récupération

**Slug:** taxe-fonciere-proprietaire-calcul-recuperation
**Meta Title:** Taxe Foncière Propriétaire : Calcul, Exonération et Récupération sur le Locataire
**Meta Description:** Taxe foncière : comment est-elle calculée, quelles exonérations existent, et comment la récupérer sur votre locataire via les charges locatives.
**Target Keywords:** taxe foncière propriétaire, exonération taxe foncière, récupération taxe foncière locataire, calcul taxe foncière
**Buyer Journey Stage:** MOFU
**H1:** Taxe foncière Propriétaire : Calcul, Exonération et Récupération
**Target Intent:** Informational

**Content Outline:**
1. Intro: Taxe foncière as a significant owner cost
2. Comment est calculée la taxe foncière ?
3. Exonérations et allègements (nouveau constructed,社会保险)
4. Taxe foncière et location : qué récupérer ?
5. Délais et modalités de paiement
6. Contester la taxe foncière : procédure
7. FAQ

**Internal Links:** /blog/charges-locatives-decompte-annualise, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 21 — Travaux Réparable par le Locataire : Liste Officielle

**Slug:** travaux-reparable-locataire-liste
**Meta Title:** Travaux Réparable par le Locataire : La Liste Officielle Décret 87-713
**Meta Description:** Décret 87-713明确列出tenant负责的小维修：清单、使用工具、墙壁颜色等。避免押金扣除纠纷。
**Target Keywords:** travaux locataire, menú ouvrage, entretien location, réparation locataire bailleur, responabilité travaux location
**Buyer Journey Stage:** TOFU
**H1:** Travaux Réparable par le Locataire : La Liste Officielle
**Target Intent:** Informational

**Content Outline:**
1. Intro: Common source of landlord-tenant disputes
2. Fondement juridique (décret 87-713 du 26 août 1987)
3. Liste détaillée des travaux à la charge du locataire (chaudière,fusibles,robinetteries,peinture,etc.)
4. Différence avec les grosses réparations (bailleur)
5. Que faire en cas de désaccord ?
6. FAQ

**Internal Links:** /glossaire-immobilier, /blog/etat-des-lieux-proprietaire-modele
**Schema:** Article + FAQPage

---

### Article 22 — Congé pour Reprise : Comment Reprendre son Bien en 2026

**Slug:** conge-reprise-propriete-bailleur
**Meta Title:** Congé pour Reprise : Comment Reprendre son Bien en 2026 — Délais et Procédure
**Meta Description:** Congé pour reprise : délai de préavis, conditions de reprise personnelle, motif légitime, et modèle de lettre. Protégez-vous contre les Contestations.
**Target Keywords:** congé reprise, reprise bien immobilier,congé bailleur résidence principale, délai préavis reprise, motif reprise
**Buyer Journey Stage:** MOFU
**H1:** Congé pour Reprise : Comment Reprendre son Bien en 2026
**Target Intent:** Informational

**Content Outline:**
1. Intro: When a landlord needs to reclaim their property
2. Conditions du congé pour reprise (délai, motif)
3. Motifs légitimes de reprise (résidence principale, travaux, vente)
4. Délai de préavis (6 mois minimum)
5. Modèle de lettre de congé
6. Contestations locataire : qué Faire ?
7. Sanctions en cas de fausses reprise
8. FAQ

**Internal Links:** /templates/conge-proprietaire, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 23 — Location Meublée vs. Vide : Quelle Choix en 2026 ?

**Slug:** location-meublee-vs-vide-comparaison
**Meta Title:** Location Meublée vs. Vide : Quelle Choix en 2026 ? Avantages et Inconvénients
**Meta Description:** Bail meublé ou bail nu ? Comparez fiscalité, rentabilité, flexibilité et obligations pour choisir le meilleur régime de location selon votre profil.
**Target Keywords:** location meublée vs vide, bail meublé avantages,bail vide avantages, lmnp vs régime foncier, comparaison location meublée nue
**Buyer Journey Stage:** MOFU (consideration)
**H1:** Location Meublée vs. Vide : Quelle Choix en 2026 ?
**Target Intent:** Commercial Investigation

**Content Outline:**
1. Intro: Key decision point for new landlords
2. Tableau comparatif : durée, loyer, fiscalité, préavis
3. Avantages du meublé (revenus plus élevés,LMNP)
4. Avantages du vide (stabilité locataire, charges déductibles)
5. Comparaison fiscale (micro-foncier, régime réel, LMNP)
6. ProfileType d'investisseur qui convient à chaque régime
7. FAQ

**Internal Links:** /blog/optimiser-fiscalite-loyers, /blog/bail-meuble-conditions-clause-modele
**Schema:** Article + FAQPage

---

### Article 24 — Provision sur Charges : Comment la Calculer et la Régulariser

**Slug:** provision-charges-regularisation-annuelle
**Meta Title:** Provision sur Charges : Comment la Calculer et la Régulariser Annuellement
**Meta Description:** Provision sur charges locatives : comment estimer le montant mensuel, effectuer la régularisation annuelle, et éviter les litiges avec votre locataire.
**Target Keywords:** provision sur charges, régularisation charges annuelles, provisions charges locatives,appel de fonds charges
**Buyer Journey Stage:** MOFU
**H1:** Provision sur Charges : Calcul et Régularisation Annuelle
**Target Intent:** Informational

**Content Outline:**
1. Intro: Charge provisions prevent surprise bills
2. Qu'est-ce que la provision sur charges ?
3. Comment calculer le montant de la provision ?
4. Régularisation annuelle : méthode et délai
5. Appel de fonds supplémentaires vs. reversement
6. Modèle de décompte de charges
7. FAQ

**Internal Links:** /blog/charges-locatives-decompte-annualise, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 25 — Encadrement des Loyers : Comment Fonctionne-t-il en Zone Tendue ?

**Slug:** encadrement-loyers-zone-tendue
**Meta Title:** Encadrement des Loyers : Fonctionnement en Zone Tendue — Paris, Lille, Lyon
**Meta Description:** Encadrement des loyers : dans quelles villes s'applique-t-il, comment est calculé le loyer de référence, et qué risquent les bailleurs qui dépassent ?
**Target Keywords:** encadrement des loyers, zone tendue, loyer référence, dépassement loyer encadré, encadrement loyer Paris
**Buyer Journey Stage:** TOFU
**H1:** Encadrement des Loyers : Comment Fonctionne-t-il en Zone Tendue ?
**Target Intent:** Informational

**Content Outline:**
1. Intro: Rent control expanding in France
2. Qu'est-ce qu'une zone tendue ?
3. Liste des villes concernées (Paris, Lille, Lyon, Bordeaux, etc.)
4. Comment est calculé le loyer de référence ?
5. Dépassements autorisés (complément de loyer exceptionnel)
6. Sanctions en cas de non-respect
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/loi-alur-proprietaire-bailleur
**Schema:** Article + FAQPage

---

### Article 26 — Dossier de Location : Documents Obligatoires pour Louer en 2026

**Slug:** dossier-location-documents-obligatoires
**Meta Title:** Dossier de Location : Documents Obligatoires et Légaux en 2026
**Meta Description:** Dossier de location locataire : documents que le bailleur peut exiger, ceux qui sont interdits, et conseils pour sélectionner sereinement.
**Target Keywords:** dossier location, documents location bailleur, pièces dossier location,garantie locale,凭证locataire
**Buyer Journey Stage:** TOFU
**H1:** Dossier de Location : Documents Obligatoires en 2026
**Target Intent:** Informational

**Content Outline:**
1. Intro: Dossier de location as a pain point for both parties
2. Documents que le bailleur peut demander (pièce d'identité, justificatifs revenus,avis d'imposition)
3. Documents interdits (dossier médical, casier judiciaire, CDD vs.CDI)
4. Dossier numérique vs. papier
5. Critères de sélection équitables (loi ALUR)
6. Qué faire si le dossier est incomplet ?
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/assurance-loyer-impaye-gli
**Schema:** Article + FAQPage

---

### Article 27 — Maintenance et Petites Réparations : Responsabilités Bailleur vs. Locataire

**Slug:** maintenance-reparations-responsabilites-bailleur-locataire
**Meta Title:** Maintenance et Petites Réparations : Qui Paie Quoi en 2026 ?
**Meta Description:** Répartition des responsabilité : travaux de maintenance, grosses réparations,菜单ouvrages. Connaissez vos obligations en tant que bailleur ou locataire.
**Target Keywords:** responsabilité bailleur réparation, maintenance location, grosses réparations bailleur, travaux location
**Buyer Journey Stage:** TOFU
**H1:** Maintenance et Réparations : Responsabilités Bailleur vs. Locataire
**Target Intent:** Informational

**Content Outline:**
1. Intro: Clarity prevents disputes
2. Principe général : gros œuvre vs.menu ouvrage
3. Tableau de répartition (chaudière,toiture,peinture,espaces verts)
4. Que faire si le bailleur ne fait pas les réparations ?
5. Réparations urgentes (suite à dégât des eaux, etc.)
6. FAQ

**Internal Links:** /glossaire-immobilier, /blog/travaux-reparable-locataire-liste
**Schema:** Article + FAQPage

---

### Article 28 — Fichier des Loyers Impayés : Fichage et Droits du Locataire

**Slug:** fichier-loyers-impayes-fichage
**Meta Title:** Fichier des Loyers Impayés : Fichage, Droits et Procédure en 2026
**Meta Description:** Fichage pour loyer impayé : dans quel fichier, combien de temps, comment contester ? Protégez vos droits en tant que locataire ou bailleur.
**Target Keywords:** fichier impayés, fichage locataire, FICP impayé loyer, contestation fichage, droit locataire fiché
**Buyer Journey Stage:** TOFU
**H1:** Fichier des Loyers Impayés : Fichage et Droits du Locataire
**Target Intent:** Informational

**Content Outline:**
1. Intro: Impact of being listed for unpaid rent
2. Les différents fichiers (FICP, fichiers私营)
3. Conditions pour être fiché (procédure, délai)
4. Durée du fichage
5. Conséquences pour le locataire
6. Comment contester un fichage abusif
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/comment-gerer-loyers-impayes
**Schema:** Article + FAQPage

---

### Article 29 — Loyer Charges Comprises : Avantages, Inconvénients et Calcul

**Slug:** loyer-charges-comprises-calcul
**Meta Title:** Loyer Charges Comprises : Comment Fixer le Bon Montant en 2026
**Meta Description:** Loyer charges comprises (CC) vs.hors charges (HC) : avantages, inconvénients, et méthode pour estimer les charges pour fixer le bon loyer.
**Target Keywords:** loyer charges comprises, charges comprises vs hors charges, fixer loyer charges, estimation charges location
**Buyer Journey Stage:** MOFU
**H1:** Loyer Charges Comprises : Avantages et Calcul
**Target Intent:** Informational

**Content Outline:**
1. Intro: CC vs. HC decision affects cash-flow clarity
2. Différence entre loyer HC et CC
3. Avantages et inconvénients pour le bailleur
4. Avantages et inconvénients pour le locataire
5. Méthode de calcul des charges forclusion
6. Exemple chiffré (studio Paris, 500€ HC)
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/charges-locatives-decompte-annualise
**Schema:** Article + FAQPage

---

### Article 30 — Clause de Révision du Loyer : Modèle et Utilisation

**Slug:** clause-revision-loyer-modele
**Meta Title:** Clause de Révision du Loyer : Modèle et Utilisation — Guide 2026
**Meta Description:** Clause de révision du loyer dans le bail : comment la rédiger, formule type, et différence avec la clause d'indexation. Modèle gratuit.
**Target Keywords:** clause révision loyer, clause indexation loyer, modèle clause révision bail,indexation loyer bail
**Buyer Journey Stage:** MOFU
**H1:** Clause de Révision du Loyer : Modèle et Utilisation
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Many leases lack proper revision clauses
2. Fondement juridique de la clause de révision
3. Modèle de clause à insérer dans le bail
4. Différence entre indexation et révision
5. Calcul pratique de la révision IRL
6. Erreurs fréquentes à éviter
7. FAQ

**Internal Links:** /blog/revision-loyer-irl-2026-indice-calcul, /templates/bail-mobilite
**Schema:** Article + FAQPage

---

### Article 31 — Comment Réussir sa Première Mise en Location : Guide du Débutant

**Slug:** premiere-mise-en-location-guide-debutant
**Meta Title:** Première Mise en Location : Guide Complet du Débutant — Étapes et Documents
**Meta Description:** Première location : checklist complète des étapes, documents à préparer, diagnostics obligatoires, et pièges à éviter pour louer sereinement.
**Target Keywords:** première mise en location, checklist mise en location, location pour la première fois, étapes mise en location
**Buyer Journey Stage:** TOFU (awareness)
**H1:** Comment Réussir sa Première Mise en Location : Guide du Débutant
**Target Intent:** Informational

**Content Outline:**
1. Intro: Encouraging new landlords with clear roadmap
2. Checklist de la mise en location (étapes 1–10)
3. Documents obligatoires (diagnostics, bail, état des lieux)
4. Sélection du locataire (dossier, garanties)
5. Signature et remise des clés
6. После подписания : vos premières obligations
7. FAQ

**Internal Links:** /blog/dossier-location-documents-obligatoires, /templates/bail-mobilite
**Schema:** Article + FAQPage

---

### Article 32 — Garantie Visale : Comment Fonctionne le Dispositif Action Logement

**Slug:** garantie-visale-fonctionnement
**Meta Title:** Garantie Visale : Comment Fonctionne le Dispositif Action Logement en 2026
**Meta Description:** VisaLocataire Action Logement : conditions, couverture, démarches. Gratuit pour le propriétaire, elle remplace la caution dans certains cas.
**Target Keywords:** Visale, garantie Visale, Action Logement garantie, caution Visale, visa location
**Buyer Journey Stage:** TOFU/MOFU
**H1:** Garantie Visale : Comment Fonctionne le Dispositif Action Logement
**Target Intent:** Informational

**Content Outline:**
1. Intro: Free government-backed guarantee gaining adoption
2. Qu'est-ce que Visale ? (Visa pour le Logement)
3. Conditions pour en bénéficier (âge, type de logement, plafond)
4. Ce que couvre Visale (loyers impayés, dégradations)
5. Comment le bailleur fait une déclaration de sinistre
6. Visale vs. GLI vs. caution : comparatif
7. FAQ

**Internal Links:** /blog/assurance-loyer-impaye-gli, /blog/comment-gerer-loyers-impayes
**Schema:** Article + FAQPage

---

### Article 33 — Délai de Préavis et Congé du Bailleur : Tout Savoir en 2026

**Slug:** delai-preavis-conge-bailleur-2026
**Meta Title:** Délai de Préavis et Congé du Bailleur : Tout Savoir en 2026
**Meta Description:** Congé donné par le bailleur : délai de préavis (3 ou 6 mois), motifs obligatoires, modèle de lettre en recommandé. Tout ce qui change en 2026.
**Target Keywords:** délai préavis bailleur,congé bailleur délai,préavis location bailleur,lettre congé bailleur
**Buyer Journey Stage:** MOFU
**H1:** Délai de Préavis et Congé du Bailleur : Tout Savoir en 2026
**Target Intent:** Informational

**Content Outline:**
1. Intro: Many landlords unaware of their notice obligations
2. Délai de préavis selon le motif (reprise, vente, autre motif légitime)
3. Formes du congé (recommandé avec accusé, remise en main propre)
4. Qué doit contenir la lettre de congé ?
5. Modèle de lettre de congé
6. Conséquences d'un congé irrégulier
7. FAQ

**Internal Links:** /templates/conge-proprietaire, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 34 — Diagnostics Obligatoires à Fournir avant la Location : La Liste Complète

**Slug:** diagnostics-obligatoires-location-2026
**Meta Title:** Diagnostics Obligatoires pour la Location : La Liste Complète 2026
**Meta Description:** DPE, ERNMT, Lead, Amiante, Électricité, Gaz : tous les diagnostics à fournir avant la signature du bail. Validité, coûts et conséquences.
**Target Keywords:** diagnostics obligatoires location, DPE location, ERNMT location, diagnostics bailleur,constat location
**Buyer Journey Stage:** TOFU
**H1:** Diagnostics Obligatoires à Fournir avant la Location : La Liste Complète
**Target Intent:** Informational

**Content Outline:**
1. Intro: Missing diagnostics = null lease clause
2. Liste complète des diagnostics par type
3. DPE : methodology and impact on listing
4. ERP (ex-ERNMT) : risques etPollutions
5. CREP (Lead) : pour les biens construits avant 1949
6. Constat amiante : pour les biens construits avant 1997
7. Diagnostics Électricité et Gaz : pour les installations > 15 ans
8. Validité et coûts de chaque diagnostic
9. FAQ

**Internal Links:** /glossaire-immobilier, /blog/dpe-2026-changements-proprietaires
**Schema:** Article + FAQPage

---

### Article 35 — Loyer Impayé : Procédure Complète de A à Z en 2026

**Slug:** procedure-loyer-impaye-complete
**Meta Title:** Loyer Impayé : Procédure Complète de A à Z — De la Relance au Tribunal
**Meta Description:**loyers impayés : chronology complète de la procédure (délai, huissier, mise en demeure, référé, assignation). Protégez vos revenus locatifs.
**Target Keywords:** procédure loyer impayé, recouvrement loyer, mise en demeure loyer,assignation tribunal, référé bailleur
**Buyer Journey Stage:** MOFU/BOFU
**H1:** Loyer Impayé : Procédure Complète de A à Z en 2026
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: Step-by-step roadmap for unpaid rent
2. Day 1–10 : Relance amiacle (email + téléphone)
3. Day 10–30 : Lettre de relance en recommandée (modèle)
4. Day 30–60 : Mise en demeure par huissier
5. Month 2–3 : Assignation au tribunal judiciaire
6. Référé gracieux vs. procédure de fond
7. Exécution du jugement ( Commandature)
8. Assurance GLI : declaration de sinistre
9. FAQ

**Internal Links:** /blog/comment-gerer-loyers-impayes, /blog/lettre-relance-loyer-impaye-modele
**Schema:** Article + FAQPage

---

### Article 36 — Résiliation du Bail par le Locataire : Droits et Procédure

**Slug:** resiliation-bail-locataire-droits
**Meta Title:** Résiliation du Bail par le Locataire : Droits, Préavis et Procédure
**Meta Description:** Locataire souhaitant partir : délai de préavis, modèles de lettre, garantie du dépôt de garantie, et obligations du bailleur en cas de départ.
**Target Keywords:** résiliation bail locataire, préavis locataire, partir avant fin bail, romper bail location
**Buyer Journey Stage:** TOFU (tenant awareness)
**H1:** Résiliation du Bail par le Locataire : Droits et Procédure
**Target Intent:** Informational

**Content Outline:**
1. Intro: Tenant rights to leave a lease
2. Durée du préavis selon le type de bail (1 mois meublé, 3 mois vide)
3. Motifs légitimes de départ anticipé (mutuelle, perte emploi,force majeure)
4. Modèle de lettre de résiliation
5. Dépôt de garantie : délai de restitution par le bailleur
6. État des lieux de sortie : votre protection
7. FAQ

**Internal Links:** /templates/conge-locataire, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 37 — Investissement Locatif LMNP : Guide Fiscal Complet 2026

**slug:** investissement-locatif-lmnp-guide-fiscal
**Meta Title:** Investissement Locatif LMNP : Guide Fiscal Complet — Amortissement, Charges, Micro Bic
**Meta Description:** LMNP : statut fiscal Loueur en Meublé Non Professionnel. Amortissement du bien, déficit, Micro Bic vs. régime réel. Maximisez votre rentabilité.
**Target Keywords:** LMNP investissement, lmnp amortissement, fiscalités lmnp, micro bic lmnp, lmnp déficit
**Buyer Journey Stage:** MOFU (consideration)
**H1:** Investissement Locatif LMNP : Guide Fiscal Complet 2026
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: LMNP as the most tax-efficient rental status
2. Conditions pour être LMNP (seuils de revenus)
3. Régime Micro Bic : 50% d'abattement
4. Régime réel : amortissement + déficit reportable
5. Amortissement du bien (durées par catégorie)
6. Récupération de la TVA sur lmneumement
7. FAQ

**Internal Links:** /blog/optimiser-fiscalite-loyers, /blog/calculer-rendement-locatif-brut-net
**Schema:** Article + FAQPage

---

### Article 38 — Comment Calculer le Dépôt de Garantie en Location

**Slug:** calculer-depot-garantie-location
**Meta Title:** Calcul Dépôt de Garantie : Combien Exiger et Quand le Restituer
**Meta Description:** Dépôt de garantie location : règles de calcul (2 mois hors charges), délais de restitution (1 ou 2 mois), et cas de retenue合法的.
**Target Keywords:** calcul dépôt garantie, montant dépôt garantie, restitution dépôt garantie,délai restitution dépôt
**Buyer Journey Stage:** TOFU
**H1:** Comment Calculer le Dépôt de Garantie en Location
**Target Intent:** Informational + Tool

**Content Outline:**
1. Intro: Deposit disputes are among the most common conflicts
2. Rgles de calcul (logement vide vs. meublé)
3. Différence avec la caution (dépôt vs. personne)
4. Délais de restitution (1 mois si état des lieux concordant, 2 mois sinon)
5. Retenues合法的 (impayés, dégradations)
6. Инструмент / Simulateur de calcul de retenue
7. FAQ

**Internal Links:** /blog/depot-garantie-regles-essentielles, /blog/etat-des-lieux-proprietaire-modele
**Schema:** Article + FAQPage

---

### Article 39 — Clause de Solidarité en Colocation : Modèle et Utilisation

**Slug:** clause-solidarite-colocation
**Meta Title:** Clause de Solidarité en Colocation : Modèle et Utilisation en 2026
**Meta Description:** Clause de solidarité en colocation : à quoi sert-elle, comment la rédiger, et quels risques pour les colocataires ? Modèle gratuit.
**Target Keywords:** clause solidarité colocation, solidarité colocataire, responsabilité loyer colocation, bail colocation clause
**Buyer Journey Stage:** MOFU
**H1:** Clause de Solidarité en Colocation : Modèle et Utilisation
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Solidarity clause protects landlords in colocation
2. Qu'est-ce que la clause de solidarité ?
3. Comment fonctionne la solidarité entre colocataires ?
4. Modèle de clause à insérer
5. Clause de division des loyers (alternative)
6. Действия si un colocataire ne paie plus
7. FAQ

**Internal Links:** /templates/colocation, /blog/bail-colocation-modele-clauses
**Schema:** Article + FAQPage

---

### Article 40 — Récupération de la TVA sur un Bien Loué Meublé : Conditions et Démarches

**slug:** recuperation-tva-location-meublee
**Meta Title:** Récupération de la TVA sur un Bien Loué Meublé : Conditions et Démarches
**Meta Description:**TVA sur lmneumement : conditions de récupération, durée de l'engagement, et obligations de classement. Guide complet pour les investisseurs LMNP.
**Target Keywords:** récupération TVA lmneumement, TVA location meublée, tv桑 LMNP, engagement TVA meublé
**Buyer Journey Stage:** MOFU (advanced investor)
**H1:** Récupération de la TVA sur un Bien Loué Meublé : Conditions et Démarches
**Target Intent:** Informational

**Content Outline:**
1. Intro: Significant tax advantage for qualified investors
2. Conditions pour récupérer la TVA (niveau de classement)
3. Durée de l'engagement de location (20 ans ou 5 ans si opsi)
4. Démarches pour bénéficier de la récupération
5. Conséquences en cas de non-respect de l'engagement
6. Calcul du montant de la TVA récupérable
7. FAQ

**Internal Links:** /blog/investissement-locatif-lmnp-guide-fiscal, /blog/location-meublee-vs-vide-comparaison
**Schema:** Article + FAQPage

---

### Article 41 — Bail de Location Commerciale : Différences avec le Bail d'Habitation

**Slug:** bail-commercial-vs-bail-habitation
**Meta Title:** Bail Commercial vs. Bail d'Habitation : Quelles Différences en 2026 ?
**Meta Description:** Bail commercial, bail professionnel, bail d'habitation : différences majeures en termes de durée, loyer, révision, et protection du locataire.
**Target Keywords:** bail commercial vs bail habitation, bail professionnel, bail commercial durée,区别 bail location
**Buyer Journey Stage:** TOFU/MOFU
**H1:** Bail Commercial vs. Bail d'Habitation : Quelles Différences ?
**Target Intent:** Informational

**Content Outline:**
1. Intro: Confusion between commercial and residential leases
2. Tableau comparatif (durée, loyer, révision, congé, protection)
3. Bail commercial : caractéristiques principales
4. Bail professionnel : caractéristiques principales
5. Bail d'habitation :保护和限制
6. Qué bail pour un local dédié à la location courte durée (Airbnb) ?
7. FAQ

**Internal Links:** /templates/bail-commercial, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 42 — Comment Créer un Budget Prévisionnel pour sa Gestion Locative

**slug:** budget-previsionnel-gestion-locative
**Meta Title:** Budget Prévisionnel Gestion Locative : Comment le Créer et le Suivre
**Meta Description:** Budget prévisionnel pour votre location : estimation des revenus et charges, provision pour travaux, et équilibre de votre investissement locatif.
**Target Keywords:** budget gestion locative, prévisionnel location, charges locatives budget, équilibre locatif
**Buyer Journey Stage:** MOFU
**H1:** Comment Créer un Budget Prévisionnel pour sa Gestion Locative
**Target Intent:** Informational + Tool

**Content Outline:**
1. Intro: Professional property management requires budgeting
2. Structure du budget prévisionnel locatif
3. Poste de revenus (loyer, charges récupérées)
4. Poste de charges (taxe foncière, assurances, maintenance, gestion)
5. Provision pour gros travaux
6. Calcul du cash-flow prévisionnel
7. Outil de simulation / Modèle de budget
8. FAQ

**Internal Links:** /blog/calculer-rendement-locatif-brut-net, /blog/provision-charges-regularisation-annuelle
**Schema:** Article + FAQPage

---

### Article 43 — Clause Pénale dans le Bail : Utilisation et Limites Légales

**slug:** clause-penale-bail-location
**Meta Title:** Clause Pénale dans le Bail : Utilisation, Limites et Modèle en 2026
**Meta Description:** Clause pénale : comment l'utiliser dans un bail de location, quels plafonds respecter, et qué risques en cas de clause abusive ?
**Target Keywords:** clause pénale bail, pénalité retard loyer, clause abusive bail, sanctions contractuelles location
**Buyer Journey Stage:** MOFU
**H1:** Clause Pénale dans le Bail : Utilisation et Limites Légales
**Target Intent:** Informational

**Content Outline:**
1. Intro: Penalty clauses must respect legal limits
2. Qu'est-ce qu'une clause pénale ? (fondement civil)
3. Utilisation légitime dans un bail (loyers impayés, départ anticipé)
4. Plafonds légaux et contrôle judiciaire
5. Clause pénale vs. clause résolutoire (différence)
6. Modèle de clause (avec garde-fous)
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/loyers-impayes-procedure-complete
**Schema:** Article + FAQPage

---

### Article 44 — Location et Fiscalité :Régime Micro-Foncier vs. Réel — Quel Choix ?

**slug:** micro-foncier-vs-reel-fiscalite-location
**Meta Title:** Micro-Foncier vs. Régime Réel : Quelle Fiscalité pour Votre Location ?
**Meta Description:** Impots sur les revenus locatifs :micro-foncier (abattement 30%), rég réelle (déduction réels). Quel est le plus avantageux selon votre situation ?
**Target Keywords:** micro foncier, régime réel fiscal location, déficit foncier, choix fiscal location, revenus fonciers
**Buyer Journey Stage:** MOFU
**H1:** Micro-Foncier vs. Régime Réel : Quelle Fiscalité pour Votre Location ?
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: Tax regime choice can save thousands
2. Conditions d'éligibilité au micro-foncier (< €15,000/an)
3. Micro-foncier : fonctionnement et abattement 30%
4. Régime réel : déduction de toutes les charges
5. Comparaison chiffrée (exemple type d'investissement)
6. Comment faire sa demande (option pour le réel)
7. FAQ

**Internal Links:** /blog/optimiser-fiscalite-loyers, /blog/investissement-locatif-lmnp-guide-fiscal
**Schema:** Article + FAQPage

---

### Article 45 — Carnet d'Entretien du Bien : Pourquoi et Comment le Tenir

**slug:** carnet-entretien-bien-immobilier
**Meta Title:** Carnet d'Entretien du Bien Immobilier : Pourquoi et Comment le Tenir
**Meta Description:** Carnet d'entretien : document obligatoire en copropriété, mais recommandé pour tout bailleur. Ce qu'il doit contenir et comment l'organiser.
**Target Keywords:** carnet d'entretien immobilier, document gestion locative, historique entretien location, maintenance suivi
**Buyer Journey Stage:** MOFU
**H1:** Carnet d'Entretien du Bien : Pourquoi et Comment le Tenir
**Target Intent:** Informational

**Content Outline:**
1. Intro: Documentation protects landlords in disputes
2. Obligation légale du carnet d'entretien (loi 2000-1208)
3. Ce qu'il doit contenir (travaux, contrats, diagnostics)
4. Comment l'organiser (format numérique vs. papier)
5. Intérêt en cas de vente ou de contentieux
6. Intégration avec la gestion locative numérique (RentReady)
7. FAQ

**Internal Links:** /glossaire-immobilier, /blog/etat-des-lieux-proprietaire-modele
**Schema:** Article + FAQPage

---

### Article 46 — Plus-Value Immobilière et Location : Calcul et Exonération

**slug:** plus-value-immobiliere-location-exoneration
**Meta Title:** Plus-Value Immobilière : Calcul, Exonération et Fiscalité en cas de Vente
**Meta Description:** Plus-value immobilière : comment la calculer, combien vous paierez, et comment les dispositifs Pinel, Denormandie ou la résidence principale exonèrent.
**Target Keywords:** plus-value immobilière, calcul plus-value, exonération plus-value, fiscalité plus-value, Pinel plus-value
**Buyer Journey Stage:** MOFU
**H1:** Plus-Value Immobilière et Location : Calcul et Exonération
**Target Intent:** Informational

**Content Outline:**
1. Intro: Capital gains tax on rental property sale
2. Calcul de la plus-value (prix d'achat vs. prix de vente)
3. Abattements pour durée de détention
4. Exonération pour résidence principale
5. Dispositifs de réduction (Pinel, Denormandie)
6. Taux d'imposition (19% + 17.2%contributions)
7. FAQ

**Internal Links:** /blog/optimiser-fiscalite-loyers, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 47 — Assurance Propriétaire Non Occupant (PNO) : Pourquoi et Comment la Choisir

**slug:** assurance-pno-proprietaire-non-occupant
**Meta Title:** Assurance PNO : Pourquoi Tout Propriétaire Non Occupant Doit l'Avoir
**Meta Description:** Assurance Propriétaire Non Occupant (PNO) : couverture, obligations, et comment la choisir. Obligatoire en copropriété, fortement recommandée sinon.
**Target Keywords:** assurance PNO, propriétaire non occupant, assurance bailleur, garantie propriétaire, assurance local vacant
**Buyer Journey Stage:** MOFU
**H1:** Assurance Propriétaire Non Occupant (PNO) : Pourquoi et Comment la Choisir
**Target Intent:** Informational

**Content Outline:**
1. Intro: Many landlords don't know they need PNO
2. Qu'est-ce que l'assurance PNO ?
3. Différence avec l'assurance multirisque habitation
4. Ce que couvre la PNO (responsabilité civile, recours)
5. Coût moyen de la PNO
6. Как choisir la meilleure offre PNO
7. FAQ

**Internal Links:** /blog/assurance-loyer-impaye-gli, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 48 — Tacite Reconduction du Bail : Régles et Préavis en 2026

**slug:** tacite-reconduction-bail-2026
**Meta Title:** Tacite Reconduction du Bail : Régles et Préavis en 2026
**Meta Description:** Tacite reconduction d'un bail de location : comment fonctionne-t-elle, quand envoyer un congé, et comment éviter la reconduction automatique ?
**Target Keywords:** tacite reconduction bail, reconduction automatique bail, fin bail tacite, congé tacite reconduction
**Buyer Journey Stage:** MOFU
**H1:** Tacite Reconduction du Bail : Régles et Préavis en 2026
**Target Intent:** Informational

**Content Outline:**
1. Intro: Many landlords accidentally renew leases they wanted to end
2. Principe de la tacite reconduction (loi 89-462)
3. Bail vide : 3 ans automatic renewal
4. Bail meublé : 1 an automatic renewal
5. Quand envoyer le congé pour éviter la reconduction
6. Conséquences de la reconduction tacite
7. FAQ

**Internal Links:** /templates/conge-proprietaire, /glossaire-immobilier
**Schema:** Article + FAQPage

---

### Article 49 — Lettre de Mise en Demeure : Modèle et Procédure pour Loyer Impayé

**slug:** lettre-mise-en-demeure-loyer-impaye
**Meta Title:** Lettre de Mise en Demeure pour Loyer Impayé : Modèle et Procédure
**Meta Description:** Mise en demeure de payer le loyer : modèle de lettre, passage par huissier, effets juridiques, et下一步 de la procédure de recouvrement.
**Target Keywords:** mise en demeure loyer, lettre mise en demeure,huisier justice loyer, recouvrement loyer procédure
**Buyer Journey Stage:** MOFU
**H1:** Lettre de Mise en Demeure : Modèle et Procédure pour Loyer Impayé
**Target Intent:** Informational + Transactional

**Content Outline:**
1. Intro: Formal demand letter is a key legal step
2. Qu'est-ce que la mise en demeure ? (fondement civil 1103)
3. Forme et contenu de la lettre
4. Modèle de mise en demeure à télécharger
5. Passage par huissier : кога и как
6. Effets juridiques de la mise en demeure (interruption prescription)
7. FAQ

**Internal Links:** /blog/lettre-relance-loyer-impaye-modele, /blog/procedure-loyer-impaye-complete
**Schema:** Article + FAQPage

---

### Article 50 — Réussir son Investissement Locatif : Les 10 Erreurs à Éviter

**slug:** erreurs-investissement-locatif
**Meta Title:** 10 Erreurs à Éviter lors d'un Investissement Locatif en France
**Meta Description:** Investissement locatif : les 10 erreurs les plus fréquentes des propriétaires bailleurs. Évitez les pièges pour réussir votre projet locatif.
**Target Keywords:** erreurs investissement locatif, pièges location, conseils investissement locatif, éviter erreurs location
**Buyer Journey Stage:** TOFU (awareness)
**H1:** Réussir son Investissement Locatif : Les 10 Erreurs à Éviter
**Target Intent:** Informational + Commercial

**Content Outline:**
1. Intro: Many first-time landlords learn the hard way
2. Erreur 1 : Sous-estimer les charges de fonctionnement
3. Erreur 2 : Mal évaluer laVacance locative
4. Erreur 3 : Négliger la sélection du locataire
5. Erreur 4 : Ignorer les contrainte réglementaires (DPE, encadrement)
6. Erreur 5 : Choisir le mauvais statut fiscal
7. Erreur 6 : Ne pas prévoir de trésorerie de réserve
8. Erreur 7 : Surévaluer le rendement attendu
9. Erreur 8 : Ne pas se protéger contre les impayés (GLI)
10. Erreur 9 : Négliger l'emplacement (critère n°1)
11. Erreur 10 : Ne pas se faire accompagner (comptable, avocat)
12. FAQ

**Internal Links:** /blog/calculer-rendement-locatif-brut-net, /blog/assurance-loyer-impaye-gli
**Schema:** Article + FAQPage

---

## 7. Expanded Publishing Schedule (Weeks 1–17)

| Week | Monday | Wednesday | Friday |
|------|--------|-----------|--------|
| W1 | [Already live] | [Already live] | [Already live] |
| W2 | Article 7 (Modèle quittance) | Article 8 (Lettre relance) | Article 9 (Charges) |
| W3 | Article 10 (GLI) | Article 11 (Quittance mentions) | Article 12 (Rendement) |
| W4 | Article 13 (État des lieux) | Article 14 (Bail colocation) | Article 15 (DPE 2026) |
| W5 | Article 16 (SCI location) | Article 17 (GLI comparatif) | Article 18 (Bail meublé) |
| W6 | Article 19 (IRL 2026) | Article 20 (Taxe foncière) | Article 21 (Travaux locataire) |
| W7 | Article 22 (Congé reprise) | Article 23 (Meublé vs. vide) | Article 24 (Provision charges) |
| W8 | Article 25 (Encadrement loyers) | Article 26 (Dossier location) | Article 27 (Maintenance) |
| W9 | Article 28 (Fichier impayés) | Article 29 (Loyer CC) | Article 30 (Clause révision) |
| W10 | Article 31 (Première mise en location) | Article 32 (Visale) | Article 33 (Préavis bailleur) |
| W11 | Article 34 (Diagnostics obligatoires) | Article 35 (Procédure impayés) | Article 36 (Résiliation locataire) |
| W12 | Article 37 (LMNP fiscal) | Article 38 (Calcul dépôt garantie) | Article 39 (Clause solidarité colocation) |
| W13 | Article 40 (Récupération TVA) | Article 41 (Bail commercial vs. habitation) | Article 42 (Budget prévisionnel) |
| W14 | Article 43 (Clause pénale) | Article 44 (Micro-foncier vs. réel) | Article 45 (Carnet d'entretien) |
| W15 | Article 46 (Plus-value) | Article 47 (Assurance PNO) | Article 48 (Tacite reconduction) |
| W16 | Article 49 (Mise en demeure) | Article 50 (10 erreurs investissement) | PILLAR: Guide gestion locative |
| W17 | PILLAR: Loyers impayés procédure | PILLAR: Révision IRL complet | Buffer / Refresh existing |
