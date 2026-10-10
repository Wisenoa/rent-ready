# Inventaire des Surfaces Applicatives et Publiques — Lokna

Cet inventaire documente l'ensemble des écrans et surfaces de la plateforme ayant fait l'objet de la migration vers Lokna.

---

## 1. Surfaces Publiques & Marketing

| Surface | Fichier Source | Éléments Modifiés |
| :--- | :--- | :--- |
| **Homepage B.3 (Production)** | `src/app/page.tsx`, `src/components/marketing/home/*` | Meta title (`... \| Lokna`), `<HomeNavbar>` (`LoknaLogo`), `<HomeFooter>` (`LoknaLogo`), moments produits, questions FAQ, appel à l'action final. |
| **Navigation Flottante** | `src/components/landing/glass-nav.tsx` | Rendu de `<LoknaLogo size={28} />`, liens d'ancrage. |
| **Footer Marketing** | `src/components/landing/marketing-footer.tsx` | Rendu de `<LoknaLogo size={28} />`, copyright © 2026 Lokna. |
| **Pages Hubs & Outils** | `src/app/(outils)/layout.tsx`, `src/app/(templates)/layout.tsx` | En-têtes avec `<LoknaLogo size={26} />`, footers légaux. |
| **50 Pages Villes Baux** | `src/app/(marketing)/bail/[ville]/page.tsx` | Breadcrumbs, JSON-LD `WebSite`, titres et bannières Lokna. |
| **50 Pages Villes Quittances**| `src/app/(marketing)/quittances/[ville]/page.tsx` | Métadonnées locales, promesses d'automatisation. |
| **50 Pages Gestion Locative** | `src/app/(marketing)/gestion-locative/[ville]/page.tsx` | Titres régionaux, micro-données Schema.org. |
| **Comparatif Juridique** | `src/app/(marketing)/comparatif/lokna-vs-legalplace/page.tsx` | Renommage de route, comparatif des fonctionnalités, tableau des scores. |
| **Pages Légales** | `src/app/(marketing)/mentions-legales/page.tsx`, `cgu/page.tsx`, `politique-confidentialite/page.tsx`, `politique-cookies/page.tsx` | Entité éditrice, domaine `lokna.fr`, adresses emails de contact et DPO. |

---

## 2. Surfaces d'Authentification & Onboarding

| Surface | Fichier Source | Éléments Modifiés |
| :--- | :--- | :--- |
| **Connexion** | `src/app/login/page.tsx` | Meta title ("Connexion — Lokna"), `<LoknaLogo variant="mark" size={48} />`, "Bienvenue sur Lokna". |
| **Inscription** | `src/app/register/page.tsx` | Meta title ("Créer un compte — Lokna"), `<LoknaLogo variant="mark" size={48} />`, "Créer un compte Lokna". |
| **Lien Magique Email** | `src/lib/auth-email-link.tsx` | Objet : "Votre lien de connexion Lokna". |
| **Bannière Cookies** | `src/components/cookie-consent.tsx` | Clé `lokna_cookie_consent` (avec rétrocompatibilité des sessions antérieures). |

---

## 3. Dashboard Propriétaire (Espace Connecté)

| Surface | Fichier Source | Éléments Modifiés |
| :--- | :--- | :--- |
| **Barre Latérale (Sidebar)** | `src/components/app-sidebar.tsx` | Intégration de `<LoknaLogo variant="mark" size={30} />` et texte "Lokna". |
| **Accueil Tableau de Bord** | `src/app/(dashboard)/dashboard/page.tsx` | Titre de page "Tableau de bord · Lokna", titre d'accueil "Bienvenue sur Lokna". |
| **Gestion des Baux** | `src/app/(dashboard)/leases/new/page.tsx` | Titre "Créer un bail — Lokna". |
| **E-Reporting Fiscal** | `src/app/(dashboard)/fiscal/e-reporting-section.tsx` | Bannières "Lokna prépare vos données". |
| **Abonnement & Facturation** | `src/app/(dashboard)/billing/subscription-banner.tsx` | Titres des plans "Lokna Starter" et "Lokna Pro". |

---

## 4. Portail Locataire

| Surface | Fichier Source | Éléments Modifiés |
| :--- | :--- | :--- |
| **Espace Locataire** | `src/app/portal/[token]/page.tsx` | En-tête "Espace Locataire — Lokna", badge officiel "Lokna". |
| **Confirmation de Paiement**| `src/app/portal/payment-success/page.tsx` | Titre "Paiement confirmé — Lokna". |
| **Historique des Quittances**| `src/app/portal/[token]/quittances.tsx` | Archivage légal certifié conforme. |
