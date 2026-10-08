# LIVRABLE 02 — BENCHMARK CONCURRENTIEL & LOGICIEL
## RentReady Visual Identity Exploration — Phases 2 & 3

Ce document synthétise les enseignements tirés de l'analyse détaillée des 14 produits en production (voir le détail complet dans [`docs/design/research/product-benchmark.md`](file:///home/ubuntu/rent-ready/docs/design/research/product-benchmark.md)).

---

### 1. Tableau Synthétique des Décisions de Design Observées

| Produit | Famille | Palette dominante | Typographie clé | Gestion des flux & densité | Ce qui inspire RentReady | Ce qui est rejeté pour RentReady |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Qonto** | Finance | Gris-bleu `#F4F6F9`, blanc, violet/indigo | Sans-sérif géométrique + Inter | Lignes d'opérations chronologiques fluides | Rapprochement bancaire clair, badges compacts | Rigidité corporate bancaire, complexité d'équipes |
| **Wise** | Finance | Vert Wise `#9FE870`, Forêt `#163300`, Calcaire `#E8EBE6` | Wise Sans (gras display) + Inter | Hiérarchie par contraste fort | Affirmation d'une vraie couleur de marque | Style "néo-pop / streetwear" inadapté au bailleur |
| **Pennylane** | Finance | Blanc technique `#F8F9FA`, bleu expert, pastels | Inter optimisée haute densité | Tables ajustables, colonnes alignées à droite | Précision du solde attendu / perçu | Austérité purement logicielle, jargon PCG comptable |
| **Stripe** | Finance | Blanc pur, gris neutres, indigo `#635BFF` | Söhne / Inter, alignement pixel | Isolation des exceptions de facturation | Retenue typographique, clarté absolue des erreurs | Complexité réservée aux développeurs et e-commerces |
| **Linear** | Productivité | Base sombre/light feutré, indigo `#5E6AD2` | Inter Variable (510) + Berkeley Mono | Lignes denses, séparation par filets 1px | **Anti-card architecture** : structuration sans card soup | Raccourcis clavier obscurs, look pur dev tool |
| **Things 3** | Productivité | Blanc, gris très doux, bleu système | San Francisco (taille/opacité) | Centre actif (Today) vs périphérie calme | **Rétractation mécanique** : ce qui est fait s'efface | Absence d'indicateurs financiers chiffrés |
| **Basecamp** | Productivité | Blanc, jaune doux, verts naturels | Sans-sérif chaleureuse | Flux chronologique descendant | Vocabulaire humain et naturel, anti-jargon | Grandes cartes illustrées qui gâchent l'espace |
| **Folk CRM** | Business | Pierre calcaire `#E8E3DA`, blanc, encre `#0E0A07` | Sans contemporaine, grille 4px | Format hybride tableur + pilules d'état | Matière minérale douce, boutons pilules tactiles | Émojis omniprésents, trop orienté pipeline de vente |
| **Attio** | Business | Monochrome sophistiqué, bleu électrique | Inter avec hiérarchie d'opacité | Tables modulaires avec status dots | Netteté des tables de données, status dots | Paramétrage trop lourd pour un particulier |
| **BailFacile** | Proptech | Bleu roi, blanc, vert d'action | Roboto / Inter | Faible densité, assistants pas-à-pas (wizards) | Simplicité d'accès pour les primo-bailleurs | Bannières d'upsell, card soup imposante |
| **Rentila** | Proptech | Bleu et gris Web 2.0 | Arial / système standard | Tableaux HTML denses et rigides | Rigueur de la complétude financière | Design archaïque, impression de corvée administrative |
| **Matera** | Proptech | Vert Matera, blanc, gris léger | Sans-sérif accessible | Rapprochement bancaire ventilé | Ventilation claire des dépenses et recettes | Trop orienté copropriété et syndic |
| **Mercury** | Forte identité| Blanc, crème satiné, noir doux `#1A1A1A` | Typographie raffinée aux formes ouvertes | Solde consolidé majestueux, flux feutré | Équilibre suprême : luxe calme sans ostentation | Contrastes parfois un peu faibles |
| **Family** | Forte identité| Couleurs acidulées, contrastes profonds | Néo-grotesque expressive | Grands conteneurs arrondis très tactiles | Satisfaction tactile de l'enregistrement | Coins trop arrondis (24-32px), manque de sérieux juridique |

---

### 2. Les 3 Grands Enseignements pour RentReady

1. **La mort de la Card Soup :**
   Les meilleurs logiciels modernes (Linear, Stripe, Qonto, Pennylane) n'enferment pas chaque élément dans une carte fermée avec bordure et ombre. Ils utilisent l'espace blanc, l'alignement typographique et des filets horizontaux discrets (1px à faible contraste). Une carte n'est utilisée que lorsqu'un élément requiert une attention spécifique (l'exception).
2. **La couleur comme vecteur d'action, pas de décoration :**
   Wise et Stripe démontrent qu'une couleur de marque forte doit servir à orienter l'œil (CTA primaire, accent d'état), tandis que 90% de l'interface reste neutre et silencieuse.
3. **Le rejet du faux notariat :**
   Aucun logiciel financier européen contemporain sérieux ne simule du papier jauni ou une machine à écrire. La crédibilité naît de la netteté de l'exécution, de l'absence de bugs et de la justesse des calculs, pas d'un habillage rétro.
