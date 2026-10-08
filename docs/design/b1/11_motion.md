# DOCUMENT 11 — SIGNATURE CINÉTIQUE & DESIGN DU MOUVEMENT B.1
## La Rétraction Feutrée comme Actif de Marque, Courbes Bézier & Accessibilité Réduite

---

### 1. Le Mouvement comme Signature Propriétaire

Dans la majorité des applications web, les animations sont soit absentes (austérité rigide), soit superflues et distrayantes (rebonds élastiques, confettis lors d'un paiement, micro-cartes qui tournoient).

Pour RentReady, la cinétique n'est pas un ornement : elle est la **traduction physique de notre philosophie d'intendance**.  
Le mouvement sert un objectif psychologique précis :
> **Matérialiser le retour au calme : lorsque le problème est réglé, l'espace se referme paisiblement.**

La rétraction feutrée de l'exception résolue devient ainsi un actif de marque aussi distinctif qu'un jingle sonore ou une couleur.

---

### 2. Le Storyboard en 4 Temps du Cycle d'Exception

```
TEMPS T0 : ÉTAT ANOMALIE ACTIVE (Loyer incomplet 450 € / 850 €)
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠ Nantes — 12 rue Crébillon                  450 € reçus / Reste 400 € due  │
│ [Ambre miel #FDF6ED]  Hauteur : 96px         [Bouton : Pointer le solde]    │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ CLIC UTILISATEUR : « Pointer le solde de 400 € »
                                  │
TEMPS T1 : TRANSITION D'APUREMENT (Durée : 240ms)
Courbe : cubic-bezier(0.16, 1, 0.3, 1) — Décélération fluide naturelle
  • Le fond ambre s'estompe vers le blanc pur (#FFFFFF)
  • Le montant 450 € se transforme en 850 € avec transition de chiffre fluide
  • Le bouton d'action se replie en badge vert sauge « Réglé »
  • La hauteur de la ligne se comprime de 96px à 42px
                                  │
                                  ▼
TEMPS T2 : ÉTAT CALME SILENCIEUX (Loyer à jour)
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✓ Nantes — 12 rue Crébillon          850,00 €          Réglé · Quittance prête│
│ [Blanc calme]        Hauteur : 42px                    (Action discrète ⋯)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Spécifications Techniques & Courbes d'Accélération (Easing Tokens)

Les paramètres de temporisation sont calibrés pour éliminer toute impression de lenteur :

| Type d'Interaction | Durée | Courbe de Bézier | Usage dans B.1 |
| :--- | :--- | :--- | :--- |
| **Micro-tactile (Hover, Press)** | `120ms` | `cubic-bezier(0, 0, 0.2, 1)` (ease-out) | Enfoncement léger des boutons d'action primaire et changement d'opacité. |
| **Bascule d'état (Toggle, Badge)** | `180ms` | `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out) | Changement de couleur d'un badge de *« Partiel »* à *« Réglé »*. |
| **Rétraction / Déploiement** | `260ms` | `cubic-bezier(0.16, 1, 0.3, 1)` (fluid natural) | Réduction de hauteur de la carte d'exception vers la ligne de 42px. |
| **Changement de Mois (Arrêté)** | `200ms` | `cubic-bezier(0.25, 1, 0.5, 1)` | Fondu enchaîné subtil entre les bilans mensuels consécutifs. |

---

### 4. Respect Rigoureux de `prefers-reduced-motion`

L'accessibilité cognitive et vestibulaire est une obligation stricte :
* Pour tout utilisateur ayant activé l'option système « Réduire les animations » :
  - **Toutes les animations de déplacement et de hauteur sont désactivées** (`transition-property: opacity` uniquement) ;
  - Le passage de 96px à 42px se produit instantanément (0ms) sans défilement de pixels ;
  - Seul un micro-fondu d'opacité de 100ms accompagne le changement d'état pour éviter un clignement désagréable.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
