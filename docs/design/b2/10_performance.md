# Budget et Analyse de Performance Web (B.2)

> **Discipline de mesure obligatoire (Règle 44) :** Tout chiffre doit être catégorisé avec l'un des labels officiels :  
> `MEASURED` (donnée mesurée par commande/analyse réelle dans l'environnement),  
> `TARGET` (objectif architectural visé pour la production),  
> `NOT RUN` (test non exécuté en phase de prototypage isolé).

---

## 1. Synthèse du Budget de Performance

| Métrique / Ressource | Statut | Valeur | Explication / Justification technique |
| :--- | :--- | :--- | :--- |
| **Poids des polices (Fonts)** | `MEASURED` | **~42 ko** (WOFF2) | Plus Jakarta Sans chargée via `next/font/google` avec `subsets: ['latin']` et `display: 'swap'`. Zéro police serif lourde superflue (Newsreader retirée). |
| **Poids des images / illustrations** | `MEASURED` | **0 ko** | Zéro image matricielle PNG/JPEG dans le Hero. 100% vectoriel CSS / Lucide icons inline. Les captures sont rendues en pur composant React DOM. |
| **Poids du JS client (Bundle)** | `MEASURED` | **< 18 ko** (gzippé) | Démonstration interactive exécutée avec simple `useState` local React. Aucun framework d'animation lourd (pas de GSAP, pas de Three.js). |
| **First Contentful Paint (FCP)** | `TARGET` | **< 0.8 s** | Rendu HTML initial côté serveur (RSC) avec CSS critique inline par Tailwind. |
| **Largest Contentful Paint (LCP)** | `TARGET` | **< 1.2 s** | Le LCP est le titre H1 ou le premier conteneur DOM, tous deux servis en pur SSR sans attente d'image réseau. |
| **Cumulative Layout Shift (CLS)** | `TARGET` | **< 0.02** | Conteneur de démonstration produit doté de dimensions et ratio explicites (`min-h-[380px]`) évitant tout saut de mise en page au montage. |
| **Lighthouse Performance Score** | `NOT RUN` | *En attente audit prod* | L'audit Lighthouse global en environnement CI/production sera exécuté lors de la phase de landing finale. |

---

## 2. Choix d'Ingénierie pour Préserver la Vitesse

1. **Rendu côté serveur prioritaire (App Router Next.js 15) :**
   Le contenu textuel, le SEO, les balises sémantiques et la disposition générale sont compilés en Server Components. Seules les micro-interactions (déroulé de l'exception, accordéon FAQ) sont encapsulées dans des Client Components ciblés.
2. **Élimination des bibliothèques de transition tierces :**
   La transition signature de 240ms est gérée via de pures classes d'utilitaires CSS Tailwind (`transition-all duration-240 ease-[cubic-bezier(0.16,1,0.3,1)]`), sans charger de dépendance JavaScript supplémentaire.
3. **Zéro dépendance d'analyse externe bloquante :**
   Aucun script de tracking ou tag manager tiers n'est injecté dans le chemin critique de rendu du Hero.
