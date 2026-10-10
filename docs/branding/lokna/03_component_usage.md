# Guide d'Utilisation du Composant Logo — Lokna

Le composant unifié [`LoknaLogo`](file:///home/ubuntu/rent-ready/src/components/ui/lokna-logo.tsx) est la source unique pour l'affichage de l'identité graphique dans l'application et les pages marketing.

---

## 1. Importation

```tsx
import { LoknaLogo } from "@/components/ui/lokna-logo";
```

---

## 2. Propriétés (Props)

```typescript
interface LoknaLogoProps {
  /**
   * Variante d'affichage :
   * - "full" : Symbole + lettrage "lokna" (par défaut)
   * - "mark" : Symbole seul (maison)
   * - "wordmark" : Lettrage seul "lokna"
   * - "light" : Logo complet en version claire pour fonds sombres
   * - "monochrome" : Logo complet monochrome utilisant currentColor
   */
  variant?: "full" | "mark" | "wordmark" | "light" | "monochrome";

  /**
   * Taille prédéfinie ou hauteur en pixels :
   * - "sm" : hauteur 20px
   * - "md" : hauteur 28px (par défaut)
   * - "lg" : hauteur 36px
   * - "xl" : hauteur 48px
   * - number : hauteur exacte en pixels (la largeur est calculée automatiquement)
   */
  size?: "sm" | "md" | "lg" | "xl" | number;

  /** Classes Tailwind supplémentaires */
  className?: string;

  /** Texte alternatif accessible (par défaut: "Lokna") */
  alt?: string;
}
```

---

## 3. Exemples d'Utilisation par Surface

### A. Barre de Navigation Marketing (Fond clair / crème)
```tsx
<Link href="/" aria-label="Lokna Accueil">
  <LoknaLogo size={26} />
</Link>
```

### B. Barre Latérale Applicative (Sidebar Dashboard)
```tsx
{/* Mode étendu */}
<div className="flex items-center gap-2.5">
  <LoknaLogo variant="mark" size={30} />
  <span className="font-bold text-base text-[#15241F]">Lokna</span>
</div>

{/* Mode replié */}
<LoknaLogo variant="mark" size={28} />
```

### C. Pied de Page Marketing (Footer)
```tsx
<LoknaLogo size={22} />
```

### D. En-tête sur Fond Sombre ou Bannière Contrastée
```tsx
<div className="bg-[#0B3B2C] p-6 text-white">
  <LoknaLogo variant="light" size={32} />
</div>
```

### E. Pages d'Authentification (Connexion & Inscription)
```tsx
<div className="flex justify-center mb-4">
  <LoknaLogo variant="mark" size={48} />
</div>
<h1 className="text-2xl font-semibold">Bienvenue sur Lokna</h1>
```

---

## 4. Règles d'Intégrité Visuelle

1. **Pas de déformation de ratio** : La largeur et la hauteur respectent scrupuleusement le viewBox natif (`460:140` pour le logo complet, `140:140` pour le symbole).
2. **Accessibilité (a11y)** : Le composant inclut les attributs `role="img"`, `aria-label`, et `<title>` pour les lecteurs d'écran.
3. **Zéro dépendance externe** : Fonctionne sans chargement de fichier distant ni requêtes réseau.
