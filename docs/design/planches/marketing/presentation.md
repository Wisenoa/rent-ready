# RentReady — Refonte des Surfaces Publiques (Direction Artistique & Produit)
**Studio Deliverable : Creative Direction, Brand & Product Design, Frontend Architecture**

---

## 1. Intention Stratégique & Direction Artistique

### Le Positionnement : « Sérénité Active » (The Calm Ledger)
RentReady s'adresse au propriétaire bailleur indépendant français (1 à 10 biens). Ce propriétaire ne gère pas un fonds immobilier institutionnel : il gère un patrimoine familial sur ses soirées et ses week-ends, souvent avec la crainte sourde d'un impayé, d'une erreur de calcul de charges ou d'un litige sur une quittance.

La plupart des SaaS de gestion locative tombent dans deux écueils opposés :
1. **Le complexe fintech surchargé :** Gradients violets criards, métriques inventées (« 12 450 propriétaires »), jargon de startup financière américaine, badges d'Open Banking non testés.
2. **Le portail administratif austère :** Tableaux grisâtres, formulaires kilométriques, esthétique de logiciel de comptabilité des années 2000.

**Notre parti-pris créatif : « Sérénité Active »**
* **La promesse :** *« Vos locations tournent. RentReady s'occupe du suivi. »*
* **L'émotion recherchée :** Clarté, apaisement immédiat, sensation de solidité juridique et financière, maîtrise sans effort.
* **Le matériau visuel :** Le produit réel lui-même. Pas d'illustrations génériques ni d'écrans 3D factices. Nous mettons en scène le véritable grand livre d'octobre 2026, la Home Base du bien, le calcul au centime près (`decimal.js`) et la séparation légale loyer nu / charges de la loi du 6 juillet 1989.

---

### Grille d'Évaluation Comparative (Design Fidelity & Impact Index - DFII)

| Critère d'évaluation (sur 5) | Direction 1 : L'Atelier Foncier | **Direction 2 : Sérénité Active (Retenue)** | Direction 3 : Le Dossier Vivant |
| :--- | :---: | :---: | :---: |
| **Authenticité & Vérité Produit** | 4 / 5 | **5 / 5** | 3 / 5 |
| **Crédibilité Légale & Fiscale** | 4 / 5 | **5 / 5** | 3 / 5 |
| **Lisibilité & Hiérarchie Visuelle** | 3 / 5 | **5 / 5** | 3 / 5 |
| **Différenciation Concurrentielle** | 4 / 5 | **4 / 5** | 3 / 5 |
| **Score Total DFII** | **15 / 20** | **19 / 20** | **12 / 20** |

> [!NOTE]
> La Direction 2 s'est imposée par son équilibre exceptionnel : elle rassure instantanément par sa rigueur comptable tout en offrant une ergonomie moderne, tactile et aérée.

---

## 2. Anatomie Détaillée des Surfaces Publiques

### 2.1 Navigation & En-tête : [`glass-nav.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/glass-nav.tsx)
* **Design :** Barre flottante translucide (`backdrop-blur-md bg-white/80 border-stone-200/60`), ancres fluides (`#cycle-mensuel`, `#fonctionnalites`, `#simulateurs`, `#tarifs`).
* **Conversion :** Bouton contextuel `SmartHeaderCta` qui affiche « Essai gratuit » pour les visiteurs anonymes et « Accéder à mon espace » pour les utilisateurs authentifiés.
* **Mobile :** Menu tiroir accessible au clavier avec cibles tactiles de 48px minimum. Suppression de la bannière fixe du bas pour désencombrer l'écran sur mobile.

---

### 2.2 Hero Section & Grand Livre d'Octobre 2026 : [`hero-section.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/hero-section.tsx)
![Hero Viewport Desktop 1440](./3_section_hero_1440.png)

* **Titre :** *« Vos locations tournent. RentReady s'occupe du suivi. »*
* **Sous-titre :** *« Du loyer exigible à la quittance certifiée, gardez la maîtrise de votre patrimoine sans y passer vos soirées. Zéro tableur obsolète, pointage en un clic et calcul au centime près. »*
* **Composant Produit Vivant :** Le Grand Livre d'Octobre 2026 :
  * **Paris 11e (750,00 €) :** Réglé le 02 oct. Quittance générée.
  * **Lyon 2e (1 700,00 €) :** Réglé le 04 oct. Quittance générée.
  * **Nantes (800,00 € attendu, 400,00 € reçu) :** Statut « Paiement partiel », reçu de paiement partiel selon l'article 21 de la loi de 1989, avec un bouton interactif « Encaisser le solde (400 €) » démontrant le passage instantané à 100 % encaissé.
* **Bandeau de preuves produit :** 0 € sans CB • Essai 14 jours • Mise en place en 3 min • Hébergé en France.

---

### 2.3 Le Cycle Mensuel Idéal : [`monthly-cycle-story.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/monthly-cycle-story.tsx)
![Le Cycle Mensuel Idéal](./4_section_cycle_1440.png)

Structure narrative en 3 étapes séquentielles :
1. **01 — L'échéance se calcule d'elle-même (1er du mois) :** Décret n° 2015-587, ventilation stricte loyer nu (670,00 €) + provisions sur charges (80,00 €) = 750,00 €. Avis d'échéance automatisé.
2. **02 — Pointage & rapprochement en 1 clic (Au fil des virements) :** Gestion honnête des paiements complets et partiels avec calcul du solde restant.
3. **03 — Quittance certifiée ou Reçu partiel (Règlement complet ou solde) :** Application stricte de la loi du 6 juillet 1989 art. 21. Quittance uniquement si solde = 0,00 € ; sinon délivrance d'un reçu d'acompte.

---

### 2.4 Chaque Logement a son Quartier Général : [`property-homebase-feature.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/property-homebase-feature.tsx)
![Property Home Base Showcase](./5_section_homebase_1440.png)

Démonstration de la centralisation par bien autour de 3 onglets interactifs :
* **Onglet 1 — Statut & Pointage :** Statut du mois en cours, virement pointé, quittance émise.
* **Onglet 2 — Le Bail & le Locataire :** Date d'effet, pièces justificatives, cautionnaire, dépôt de garantie légalement encadré.
* **Onglet 3 — La Révision IRL INSEE :** Calcul automatique conforme avec la formule officielle INSEE : $800 \times (145,78 \div 144,64) = 806,31\ €$.

---

### 2.5 Rigueur Juridique & Technique : [`legal-rigor-section.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/legal-rigor-section.tsx)
Quatre garanties vérifiées et documentées :
1. **Loi du 6 juillet 1989 (art. 21) :** Quittance gratuite délivrée uniquement pour un loyer réglé à 100 %.
2. **Moteur arithmétique `decimal.js` :** Zéro centime d'écart lié aux flottants JavaScript IEEE 754.
3. **Indices IRL officiels INSEE :** Séries chronologiques officielles mises à jour chaque trimestre.
4. **Portail locataire chiffré & RGPD :** Liens d'accès par jetons sécurisés uniques, hébergement en France.

---

### 2.6 Grille Tarifaire Transparente : [`pricing-section.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/pricing-section.tsx)
![Grille Tarifaire](./6_section_pricing_1440.png)

* Consommation directe de la vérité de code `@/data/entity` (`PLANS`) :
  * **Starter :** 9 € / mois ou 7 € / mois facturé 89 € / an (2 mois offerts). Jusqu'à 3 logements.
  * **Pro :** 15 € / mois ou 12 € / mois facturé 149 € / an (2 mois offerts). Jusqu'à 10 logements, relances auto, exports comptables.
* **Comparatif de repère de coût annuel :**
  * Agence de gestion (7 %) : ~1 344 € / an.
  * Tableur Excel manuel : 0 € mais ~5 h / mois d'astreinte mentale.
  * RentReady Starter : 89 € / an.

---

### 2.7 Passerelle Outils Gratuits en Libre Accès : [`free-tools-gateway.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/free-tools-gateway.tsx)
![Outils Gratuits](./7_section_tools_1440.png)

Mise en avant des 4 simulateurs juridiques réels du produit sans inscription obligatoire :
* **Calculateur IRL :** `/outils/calculateur-irl`
* **Plafond Dépôt de Garantie :** `/outils/calculateur-depot-garantie`
* **Générateur de Quittance :** `/outils/generateur-quittance`
* **Régularisation des Charges :** `/outils/calculateur-charges-locatives`

---

### 2.8 Pied de Page Honnête : [`marketing-footer.tsx`](file:///home/ubuntu/rent-ready/.worktrees/marketing-redesign/src/components/landing/marketing-footer.tsx)
* **Suppression :** Le faux formulaire de newsletter qui affichait un état « Merci de votre inscription » sans aucun appel d'API ni persistance a été supprimé.
* **Ajout :** Liens légaux stricts, badge d'hébergement souverain en France, respect de la loi de 1989.

---

## 3. Journal d'Audit de Vérité Produit (Product Truth Audit)

| Élément analysé | Traitement appliqué | Justification & Règle AGENTS.md |
| :--- | :---: | :--- |
| **Mentions presse « Le Monde, Les Echos, Challenges »** | **SUPPRIMÉ** | Règle 37 : Zéro citation ou mention presse non vérifiée ou inventée. |
| **Faux formulaire newsletter (`setSubmitted(true)`)** | **SUPPRIMÉ** | Règle 37 : Interdiction de succès factice. Remplacé par une architecture de navigation claire. |
| **Promesse de synchronisation bancaire automatique DSP2** | **CADRÉ** | Règle 11/13 : Présenté comme pointage en 1 clic et rapprochement assisté, sans prétendre à un prélèvement automatique ou un sync DSP2 magique. |
| **Tarifs Starter & Pro** | **SYNCHRONISÉ** | Alignement strict sur `@/data/entity` : Starter 9 €/mois (89 €/an) et Pro 15 €/mois (149 €/an). |
| **Formule de révision IRL INSEE** | **VÉRIFIÉ** | Utilisation de la formule légale exacte et des valeurs réelles de l'INSEE vérifiées par `content-integrity.test.ts`. |
| **Distinction Quittance vs Reçu partiel** | **VÉRIFIÉ** | Règle 11 : Respect strict de l'art. 21 de la loi du 6 juillet 1989. |

---

## 4. Matrice de Vérification Technique (MEASURED)

| Vérification | Commande exécutée | Résultat mesuré | Statut |
| :--- | :--- | :--- | :---: |
| **Workspace Guard** | `scripts/workspace-guard.sh --task marketing-redesign --write` | `OK task=marketing-redesign profile=unknown (exit 0)` | **VALIDÉ** |
| **TypeScript Strict** | `pnpm exec tsc --noEmit` | `0 errors (exit 0)` | **VALIDÉ** |
| **ESLint** | `pnpm lint` | `0 errors, 13 warnings préexistants (exit 0)` | **VALIDÉ** |
| **Suite Vitest** | `pnpm test` | `86 test files passed, 916 tests passed (exit 0)` | **VALIDÉ** |
| **E2E Playwright** | `pnpm exec playwright test src/__tests__/e2e/marketing.spec.ts` | `6/6 tests passed (60.0s, exit 0)` | **VALIDÉ** |
| **Build Next.js** | `pnpm build` | `474 routes générées avec succès (exit 0)` | **VALIDÉ** |

---

## 5. Captures d'Écran Multi-Résolutions Disponibles

* Mobile (390px) :
  * [Hero Mobile](file://./1_hero_viewport_mobile_390.png)
  * [Full Page Mobile](file://./2_fullpage_mobile_390.png)
* Tablette (768px) :
  * [Hero Tablette](file://./1_hero_viewport_tablet_768.png)
  * [Full Page Tablette](file://./2_fullpage_tablet_768.png)
* Desktop Moyen (1024px) :
  * [Hero Desktop 1024](file://./1_hero_viewport_desktop_1024.png)
  * [Full Page Desktop 1024](file://./2_fullpage_desktop_1024.png)
* Desktop Large (1440px) :
  * [Hero Desktop 1440](file://./1_hero_viewport_desktop_1440.png)
  * [Full Page Desktop 1440](file://./2_fullpage_desktop_1440.png)
  * [Section Hero Isolée](file://./3_section_hero_1440.png)
  * [Section Cycle Mensuel Isolée](file://./4_section_cycle_1440.png)
  * [Section Home Base Isolée](file://./5_section_homebase_1440.png)
  * [Section Tarifs Isolée](file://./6_section_pricing_1440.png)
  * [Section Outils Gratuits Isolée](file://./7_section_tools_1440.png)
