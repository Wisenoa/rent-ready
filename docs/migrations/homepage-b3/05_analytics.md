# RentReady — Taxonomie d'Événements & Instrumentation de Conversion

**Objectif :** Mesurer précisément l'engagement et les taux de passage dans le funnel de conversion de la homepage sans violer la vie privée des visiteurs (zéro donnée personnelle ou financière collectée).

---

## 1. Funnels de Conversion Officiels

### 1.1 Funnel Primaire : Inscription & Activation
```
1. homepage_view
   ↓ (Clic CTA Hero, Pricing ou Final)
2. signup_started (visite de /register)
   ↓ (Validation formulaire nom / email / mot de passe)
3. signup_completed (compte Better Auth créé, statut TRIAL)
   ↓ (Ajout du premier bien dans /properties)
4. onboarding_first_property_created (propriété enregistrée en base)
```

### 1.2 Funnel Secondaire : Passerelle Outils Gratuits
```
1. homepage_view
   ↓ (Clic outil gratuit)
2. homepage_tool_click (outils: irl | quittance)
   ↓ (Arrivée sur simulateur sans inscription)
3. tool_simulated
   ↓ (Clic sur CTA contextuel dans l'outil)
4. signup_started
```

---

## 2. Taxonomie d'Événements de la Homepage (B.3)

| Événement | Déclencheur (Trigger) | Emplacement | Propriétés autorisées (Sans PII) | Consentement requis | Destination |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `homepage_view` | Chargement initial de la page | Root `/` | `referrer`, `utm_source`, `utm_medium` | Non (exempté Plausible) | Plausible + Internal log |
| `homepage_hero_cta_click` | Clic sur « Essayer gratuitement » | Section Hero | `target: "/register"`, `position: "hero"` | Non | Plausible (`custom_event`) |
| `homepage_demo_interaction` | Clic sur « Régulariser » ou « Relancer » | Démo produit | `action: "regularisation" \| "relance"` | Non | Plausible (`custom_event`) |
| `homepage_demo_resolved` | Démo passée en état soldé | Démo produit | `state: "resolved"` | Non | Plausible (`custom_event`) |
| `homepage_tool_click` | Clic vers Calculateur IRL ou Quittance | Section Outils | `tool: "irl" \| "quittance_pdf"` | Non | Plausible (`custom_event`) |
| `homepage_pricing_click` | Clic sur Starter ou Pro | Section Tarifs | `plan: "starter" \| "pro"`, `billing: "monthly" \| "annual"` | Non | Plausible (`custom_event`) |
| `homepage_final_cta_click` | Clic sur le CTA de bas de page | Section Final CTA | `target: "/register"`, `position: "bottom"` | Non | Plausible (`custom_event`) |

---

## 3. Discipline de Confidentialité (Privacy-First)

Pour respecter les directives RGPD et la CNIL :
- **Strictement interdit dans les payloads d'analytics :**
  - Adresse postale ou localisation précise d'un bien ;
  - Nom ou prénom du bailleur ou locataire ;
  - Adresse email ou identifiant utilisateur en clair ;
  - Coordonnées bancaires (IBAN, BIC, numéro de carte) ;
  - Montant réel d'un loyer ou d'une transaction.
- **Gestion du consentement :**
  - Les événements marketing de base transitent par Plausible Analytics (solution souveraine sans cookies, exemptée d'accord préalable selon le guide CNIL des traceurs).
  - Si un service tiers nécessitant des cookies était branché à l'avenir, il serait conditionné à l'acceptation via le composant `<CookieConsent />`.
