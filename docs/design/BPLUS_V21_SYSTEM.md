# B+ V2.1 « Editorial Software » — Système de Conception de Production

> **Statut :** CANDIDAT DE PRODUCTION VALIDÉ (Production Design System)  
> **Surfaces déployées en production :** `/dashboard` (Tableau de bord & Grand Livre) & `/properties/[id]` (Property Home Base)  
> **Dernière révision :** Mars 2026

---

## 1. Philosophie & Manifeste

RentReady n'est ni un tableur grisâtre des années 2000, ni un SaaS gadget bariolé de dégradés fintech ou de cartes en 3D.  
RentReady est un **logiciel éditorial de gestion patrimoniale** :

> **« Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. »**

### Principes Fondateurs
1. **Le calme par défaut** : Lorsqu'un loyer est réglé, l'interface s'efface. La ligne du grand livre se rétracte de **54%**, l'accent orange disparaît au profit d'un vert sauge feutré, et aucune célébration superflue ne vient encombrer la charge mentale du bailleur.
2. **La tension graphique réservée à l'action utile** : Seules les anomalies réelles (acompte partiel nécessitant pointage, retard d'échéance appelant une relance, logement vacant sans bail) emploient des marqueurs de couleur chaude (`#C2410C` orange brûlé, `#D97706` ambre).
3. **Vérité produit intransigeante (Product Truth)** :
   - On n'affiche jamais « Encaisser » pour un virement externe bancaire : le libellé exact est « Enregistrer le paiement » ou « Pointer ».
   - Un paiement partiel n'émet **jamais** de quittance libératoire : il émet un « Reçu d'acompte » sous l'article 21 de la loi du 6 juillet 1989.
   - Les montants utilisent exclusivement des entiers ou `Decimal` / `decimal.js`, avec typographie tabulaire monospace (zéro arithmétique flottante JavaScript).
4. **Adieu à la « Card Soup »** : Remplacement des blocs carrés redondants par un **registre linéaire haute densité**, structuré par des filets ochre fins (`#E5E0D8`) inspirés des grands livres comptables.

---

## 2. Fondations & Jetons Sémantiques

### 2.1. Palette Chromatique Sémantique

| Nom de Jeton | Valeur Hex | Rôle dans le système | Règle de Contraste |
| :--- | :--- | :--- | :--- |
| `paper` | `#F8F6F0` | Fond de page chaleureux (Warm Paper) | Fond universel |
| `card` | `#FAF8F3` | Surface secondaire des registres et modules | Fond surélevé léger |
| `card-subtle` | `#F2EFE9` | Surface rétractée / inactive | 1.05:1 sur paper |
| `ink` | `#151413` | Encre profonde pour le texte et les titres majeurs | 15.8:1 sur paper (AAA) |
| `muted` | `#6B6760` | Texte secondaire, métadonnées, dates | 5.2:1 sur paper (AA) |
| `subtle` | `#9E9A90` | Icônes discrètes, séparateurs de texte | 3.1:1 sur paper |
| `border` | `#E5E0D8` | Filet de délimitation horizontal & registre | Délimitation subtile |
| `border-strong` | `#151413`/15 | Bordure active ou conteneur principal | Délimitation nette |
| `calm` | `#166534` | Statut payé, quittance disponible, conforme | 6.8:1 sur paper (AA) |
| `calm-bg` | `#F0FDF4` | Fond du bandeau de paiement réglé | 1.1:1 sur paper |
| `attention` | `#C2410C` | Paiement partiel, anomalie, action prioritaire | 5.1:1 sur paper (AA) |
| `attention-bg`| `#FFF7ED` | Fond du bandeau de paiement partiel | 1.1:1 sur paper |
| `delayed` | `#D97706` | Retard d'échéance, loyer impayé | 4.8:1 sur paper (AA) |
| `delayed-bg` | `#FEF3C7` | Fond du bandeau de loyer en retard | 1.1:1 sur paper |

### 2.2. Typographie Tripartite

1. **Serif Noble (`Newsreader`, `--font-serif`)**
   - Utilisation : Titres de mois (`MonthHeader`), nom du logement (`PropertyHeader`), titres de registres majeurs.
   - Poids : `font-normal` (400), taille `text-2xl` à `text-4xl`.
   - Rendu : Élégance éditoriale, ancrage temporel patrimonial.
2. **Sans Moderne (`Inter`, `--font-sans`)**
   - Utilisation : Labels, textes explicatifs, fil d'Ariane, microcopy légale, boutons.
   - Poids : `font-normal` (400) et `font-medium` (500).
   - Rendu : Lisibilité et ergonomie parfaites.
3. **Monospace Rigoureux (`JetBrains Mono`, `--font-mono`)**
   - Utilisation : Montants financiers (`Money`), numéros de référence cadastre, dates d'échéance, téléphones.
   - Caractéristique : Chiffres tabulaires alignés (`tabular-nums`), garantissant un alignement vertical parfait des colonnes financières.

---

## 3. Primitives du Système (`src/components/design-system/primitives/`)

### 3.1. `<PageShell>`
Conteneur de page pleine hauteur garantissant le fond warm paper `#F8F6F0` et le centrage horizontal responsive :
```tsx
<PageShell maxWidth="default" className="space-y-6 pb-12">
  {/* Contenu */}
</PageShell>
```

### 3.2. `<Section>`
Section sémantique avec surtitre (eyebrow) en capitales espacées, titre noble, description contextuelle et slot d'action :
```tsx
<Section
  eyebrow="Journal des Écritures"
  title="Grand Livre des Loyers"
  description="Situation arrêtée au 7 mars 2026"
  action={<Link href="/billing">Voir tout</Link>}
>
  {/* Lignes ou tableau */}
</Section>
```

### 3.3. `<Money>`
Affichage strict des devises évitant les erreurs d'arrondi JavaScript.
- Accepte `Decimal | number | string | null`.
- Gère la coloration sémantique (`tone="ink" | "calm" | "attention" | "delayed" | "muted"`).
- Gère les tailles typographiques (`xs` à `2xl`).
```tsx
<Money amount={new Decimal("2450.00")} size="xl" tone="calm" />
```

### 3.4. `<StatusBadge>` & `<StatusDot>`
Indicateurs d'état sémantiques discrets :
- Tones : `"calm"` (vert sauge), `"attention"` (orange brûlé), `"delayed"` (ambre), `"neutral"` (pierre neutre).
- Option `showDot` pour intégrer un voyant lumineux miniature.
```tsx
<StatusBadge tone="calm" showDot size="xs">
  Payé · Quittance prête
</StatusBadge>
```

---

## 4. Patterns Métier Spécialisés (`src/components/design-system/patterns/`)

### 4.1. `<MonthHeader>`
En-tête éditorial du mois civil combinant le grand titre Serif, la date d'arrêté comptable et les liens de circulation rapide (Logements, Locataires, Quittances).

### 4.2. `<FinancialSummary>`
Synthèse tripartite en 3 colonnes de grand livre :
1. **Attendus** (Loyer contractuel total CC)
2. **Reçus** (Somme des encaissements constatés)
3. **Solde** (Reste à recouvrer / exceptions)
Accompagné d'une barre de recouvrement bicolore haute densité.

### 4.3. `<RentRow>`
Ligne du Grand Livre immobilier intégrant la **rétractation mécanique** :
- **État Calme (Réglé)** : Hauteur compacte (42px), filet discret, pas de boutons d'action agressifs, lien discret vers la quittance.
- **État Exception (Partiel / En retard)** : Hauteur déployée (92px), bandeau d'alerte contextuel, notice explicative (Art. 21) et bouton d'action primaire immédiat (« Enregistrer », « Relancer »).

### 4.4. `<DocumentRegister>`
Tableau linéaire à 4 colonnes remplaçant la « card soup » de 140px par un registre linéaire de ~40px de hauteur :
- Titre & sous-titre de la pièce légale (Bail, Quittance, État des lieux, Assurance)
- Période / Référence
- Statut sémantique (Actif, Délivrée, Archivé, En attente)
- Action directe contextuelle (`QuittanceButton`, consultation ou lien externe).

### 4.5. `<PropertyHeader>` & `<PropertySituationBar>`
- `PropertyHeader` : Identité architecturale du logement, typologie, surface, statut d'occupation et loyer global.
- `PropertySituationBar` : Baromètre mensuel instantané ventilant loyer nu + charges, date de règlement, statut libératoire et action contextuelle à 1 clic.

---

## 5. Guide de Migration pour les Surfaces Restantes

| Surface | État Actuel | Priorité | Plan de Remplacement |
| :--- | :--- | :--- | :--- |
| **Baux (`/leases`, `/leases/[id]`)** | Formulaire multi-étapes classique | P1 | Aligner les badges sur `StatusBadge`, utiliser `DocumentRegister` pour les annexes, encapsuler dans `PageShell`. |
| **Facturation Globale (`/billing`)** | Tableaux shadcn génériques | P1 | Remplacer par le grand livre unifié `<FinancialSummary>` et `<RentRow>` de tous les biens. |
| **Documents (`/documents`)** | Grille de cartes carrées (Card soup) | P1 | Remplacer intégralement par `<DocumentRegister>`. |
| **Onboarding & First-run** | Modale Base UI | P2 | Harmoniser la palette sur Warm Paper `#F8F6F0` et Serif headers. |
| **Portail Locataire (`/portal/*`)** | Surface mobile autonome | P2 | Conserver l'isolation mais adopter la palette calme et les composants `<Money>` / `<DocumentRegister>`. |
| **Paramètres (`/settings/*`)** | Onglets formulaire standard | P3 | Encapsuler dans `PageShell`, remplacer les boutons par les variants B+ V2.1. |

---

## 6. Vérifications & Invariants Techniques

- **Compilation TypeScript :** `pnpm tsc --noEmit` -> **0 erreur**.
- **Suite de tests Vitest :** 86 fichiers de test, **916 tests passés**.
- **Tests End-to-End Playwright :**
  - `src/__tests__/e2e/dashboard.spec.ts` -> **4/4 passés (100%)**.
  - `src/__tests__/e2e/property-home-base.spec.ts` -> **4/4 passés (100%)** (4 états métier vérifiés).
- **Régression visuelle :** 12 captures HD validées sous 1440px, 390px et 360px.
