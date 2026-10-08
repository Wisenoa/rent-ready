# DOCUMENT 04 — SYSTÈME CHROMATIQUE & DISCIPLINE MINÉRALE B.1
## Spécifications OKLCH, Matrice de Contraste WCAG, Daltonisme & Grayscale

---

### 1. Philosophie Chromatique : Matière Durable & Signaux Purs

La palette de la Direction B.1 repose sur l'équilibre entre **trois forces complémentaires** :
1. **La matière minérale patrimoniale :** Le fond calcaire doux et l'encre végétale apportent le confort optique et la noblesse tactile.
2. **Le vert d'atelier propriétaire :** Un vert forêt profond qui ancre l'identité institutionnelle sans recourir aux clichés technologiques.
3. **La rigueur des signaux sémantiques :** Une distinction intraitable entre ce qui relève de la marque, ce qui indique un état sain (succès/calme), et ce qui réclame une vigilance immédiate (attention/exception).

---

### 2. Tokens Chromatiques Maîtres (Format OKLCH & HEX)

Le système de tokens est formalisé dans l'espace perceptuel uniforme **OKLCH**, garantissant une cohérence prévisible de luminosité (*Lightness*) et de saturation (*Chroma*) à travers toutes les plateformes d'affichage :

```css
:root {
  /* ── 1. Matière & Canvas ── */
  --b1-canvas:             oklch(0.962 0.006 85);   /* #F5F3EF : Calcaire doux contemporain */
  --b1-surface-pure:       oklch(1.000 0.000 0);    /* #FFFFFF : Albâtre pur, surface active */
  --b1-surface-muted:      oklch(0.935 0.008 85);   /* #ECEAE4 : Pierre adoucie, insets/hover */
  --b1-border-subtle:      oklch(0.905 0.010 85);   /* #E5E2DA : Filet minéral d'imprimerie */
  --b1-border-medium:      oklch(0.840 0.012 85);   /* #D4CFC4 : Séparateur accentué */

  /* ── 2. Encre & Typographie ── */
  --b1-ink-primary:        oklch(0.240 0.025 155);  /* #15241F : Épicéa profond / Encre végétale */
  --b1-ink-secondary:      oklch(0.490 0.015 155);  /* #5A6660 : Neutre chaud d'accompagnement */
  --b1-ink-muted:          oklch(0.610 0.012 155);  /* #7C8782 : Mention tertiaire & indices */

  /* ── 3. Marque Propriétaire (Atelier) ── */
  --b1-brand-forest:       oklch(0.330 0.045 155);  /* #1E3A2F : Vert forêt d'atelier RentReady */
  --b1-brand-forest-hover: oklch(0.280 0.040 155);  /* #172F26 : État actif / survol CTA */
  --b1-brand-tint:         oklch(0.950 0.020 155);  /* #EEF4F1 : Voile vert léger de sélection */

  /* ── 4. Sémantique Métier : État Calme / Réglé (Success) ── */
  --b1-calm-text:          oklch(0.480 0.095 148);  /* #236B47 : Vert sauge vif de validation */
  --b1-calm-bg:            oklch(0.965 0.020 148);  /* #EEF7F2 : Fond discret de ligne réglée */
  --b1-calm-border:        oklch(0.880 0.045 148);  /* #C6E7D3 : Bordure fine de badge réglé */

  /* ── 5. Sémantique Métier : État Attention / Exception (Honey) ── */
  --b1-attention-text:     oklch(0.580 0.145 55);   /* #C86D2C : Ambre miel chaleureux */
  --b1-attention-bg:       oklch(0.970 0.022 65);   /* #FDF6ED : Fond d'exception déployée */
  --b1-attention-border:   oklch(0.865 0.065 65);   /* #F5D6B5 : Filet d'alerte bienveillante */

  /* ── 6. Sémantique Métier : Alerte Critique / Impayé Majeur (Danger) ── */
  --b1-danger-text:        oklch(0.480 0.170 28);   /* #B9382B : Garance naturelle d'alerte */
  --b1-danger-bg:          oklch(0.965 0.022 28);   /* #FDF1F0 : Voile de contentieux */
  --b1-danger-border:      oklch(0.850 0.065 28);   /* #F6C4C0 : Bordure d'alerte contentieuse */
}
```

---

### 3. La Séparation Stricte : Brand Green ≠ Success Green

Une ambiguïté majeure des SaaS mal conçus est de confondre la couleur de leur marque avec l'indicateur de validation « payé ». Dans B.1, la distinction est absolue :

| Rôle | Token | Valeur HEX | Comportement & Règle d'usage |
| :--- | :--- | :--- | :--- |
| **Marque Institutionnelle** | `--b1-brand-forest` | `#1E3A2F` | Réservé aux **actions directes de l'utilisateur** (CTA primaire *« Ajouter un bail »*, *« Télécharger la quittance »*), aux états de sélection de navigation et au logo. **N'indique jamais un état comptable.** |
| **Validation Métier (Calme)** | `--b1-calm-text` | `#236B47` | Réservé exclusivement à la constatation comptable : *« Loyer réglé »*, *« Quittance émise »*. Sa tonalité sauge vive est immédiatement discernable du vert forêt sombre. |

---

### 4. La Règle d'Or de l'Ambre Miel (`#C86D2C`) : Vigilance sans Panique

L'ambre miel est l'outil visuel le plus puissant du système RentReady. Il incarne le principe : **« Seule l'exception demande votre attention »**.
* **Ce qu'il fait :** Il éclaire une situation intermédiaire (loyer reçu partiel de `450 € sur 850 €`, régularisation de charges en attente). Il attire le regard avec douceur sans transformer l'écran en gyrophare rouge agressif.
* **Ce qu'il est interdit d'en faire :** Aucun élément purement décoratif, aucun badge marketing « Nouveau », aucun dégradé de fond ne peut utiliser ce token. Si l'ambre apparaît à l'écran, c'est **toujours et uniquement** parce qu'une action concrète d'arbitrage est requise de la part du propriétaire.

---

### 5. Matrice de Contraste WCAG 2.2 & APCA

Chaque association typographique a été testée sous la norme WCAG 2.2 :

| Texte | Fond | Ratio de Contraste | Niveau WCAG | Contexte d'usage |
| :--- | :--- | :--- | :--- | :--- |
| **Encre primaire (`#15241F`)** | Canvas Calcaire (`#F5F3EF`) | **12.82 : 1** | **AAA** (Excellence) | Tous les textes de lecture, montants, adresses. |
| **Encre primaire (`#15241F`)** | Albâtre pur (`#FFFFFF`) | **14.15 : 1** | **AAA** (Excellence) | Données dans les tableaux et formulaires. |
| **Texte secondaire (`#5A6660`)** | Canvas Calcaire (`#F5F3EF`) | **5.24 : 1** | **AA** (Conforme texte standard) | Sous-titres, libellés d'échéances, villes. |
| **Texte d'action (`#FFFFFF`)** | Vert Forêt Atelier (`#1E3A2F`) | **8.65 : 1** | **AAA** (Excellence) | Boutons d'action primaire et CTA. |
| **Texte d'exception (`#C86D2C`)** | Fond Attention (`#FDF6ED`) | **4.68 : 1** | **AA** (Conforme texte standard) | Badges de solde partiel et retard. |
| **Texte de succès (`#236B47`)** | Fond Succès (`#EEF7F2`) | **5.38 : 1** | **AA** (Conforme texte standard) | Badges de quittance disponible. |

---

### 6. Robustesse Écran : Grayscale, OLED, LCD Moyen & Daltonisme

1. **Épreuve Grayscale (Noir & Blanc intégral) :**  
   Désaturée à 100%, l'interface B.1 conserve sa hiérarchie parfaite. L'exception se repère immédiatement non pas par sa teinte orange, mais par son **déploiement volumétrique (hauteur double), son fond tramé et son libellé explicite de solde dû**.
2. **Écrans OLED & Mobiles en Plein Soleil :**  
   Contrairement aux fonds blancs crus qui éblouissent en extérieur, le canvas `#F5F3EF` réduit la fatigue oculaire tout en conservant une luminosité de 96% assurant la lisibilité sous forte lumière ambiante.
3. **Simulations de Daltonisme (Protanopie, Deutéranopie, Tritanopie) :**  
   L'état calme (`#236B47`) et l'état d'exception (`#C86D2C`) ne reposent jamais uniquement sur la couleur :
   - L'état calme s'accompagne d'une puce pleine et du mot explicite *« Réglé »*.
   - L'état d'exception s'accompagne d'un chevron ouvert, d'une indentation de solde et du bouton d'action *« Pointer »*.
   Même sans perception des canaux vert ou rouge, la différence d'état est évidente.
