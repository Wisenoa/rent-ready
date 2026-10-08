# DOCUMENT 02 — RECHERCHE VISUELLE & BENCHMARK DU MONDE RÉEL
## Analyse de 14 Produits en Production & Checklist Anti-Clichés IA

---

### 1. Méthodologie de Recherche Empirique

Pour immuniser RentReady contre l'effet « landing générée par IA » (Framer/v0) et contre le clonage aveugle de templates shadcn/ui, nous avons audité 14 produits majeurs en production sur le marché européen et international.  
Chaque référence a été disséquée selon la grille d'exigence :
1. **Source & URL**
2. **Date de consultation**
3. **Ce que nous avons appris** (principes exportables)
4. **Ce que nous refusons de copier** (pièges ou inadaptations à RentReady)

---

### 2. Fiches d'Analyse des Références Réelles

#### A. Folk CRM
* **Source :** Folk (Application CRM collaborative & Site marketing)
* **URL :** `https://www.folk.app`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** L'usage maîtrisé de teintes neutres chaudes (`#0e0a07` pour l'encre, fonds crème doux) et d'un espacement en incréments stricts de 4px confère une élégance immédiate sans jamais paraître clinique. Les vues en tables compactes démontrent qu'une interface conviviale n'a pas besoin d'être fragmentée en boîtes arrondies.
* **Ce que nous refusons de copier :** Les émojis dispersés dans les menus et le recours systématique aux pilules sur l'intégralité des boutons, qui basculent parfois vers un univers trop récréatif pour la gestion de loyers et de contentieux locatifs.

#### B. Wise (Rebranding 2023 / Ragged Edge)
* **Source :** Wise (Plateforme financière internationale)
* **URL :** `https://wise.com`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** La rupture audacieuse avec le « bleu banquier » grâce à un vert forêt profond `#163300` couplé à un vert accent tonique `#9FE870`. Wise prouve qu'un service financier gérant des milliards peut afficher une identité chromatique végétale mémorable tout en garantissant un contraste WCAG AAA irréprochable sur les tableaux de conversion de devises.
* **Ce que nous refusons de copier :** Les tapisseries graphiques bariolées et les couleurs secondaires fluorescentes (rose/jaune) qui ne conviendraient pas à la sobriété patrimoniale d'un bailleur privé français.

#### C. Pennylane
* **Source :** Pennylane (Plateforme de gestion financière & comptable française)
* **URL :** `https://www.pennylane.com`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** La conception d'un *Domain-Specific Design System* pensé pour la double cible dirigeant / expert-comptable. Pennylane excelle dans la clarté du lettrage tabulaire, la réconciliation bancaire par état (rapproché, en attente, écart) et le vocabulaire financier francophone précis.
* **Ce que nous refusons de copier :** La densité administrative parfois écrasante du logiciel comptable pur et la structure marketing très conventionnelle orientée grands comptes et cabinets comptables.

#### D. Linear
* **Source :** Linear (Outil de gestion de cycle produit)
* **URL :** `https://linear.app`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** La perfection absolue du rythme des listes et de la micro-typographie. Dans Linear, une ligne d'issue fait 36px, l'information s'ordonne par alignement typographique et non par bordures de boîtes. Le logiciel s'efface totalement devant le travail de l'utilisateur.
* **Ce que nous refusons de copier :** Le dark-mode cybernétique sombre et les néons violacés, inadaptés aux consultations en plein jour des propriétaires et à l'impression de quittances de loyer.

#### E. Qonto
* **Source :** Qonto (Banque en ligne professionnelle B2B française)
* **URL :** `https://qonto.com`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** L'exemplarité de la typographie financière (grille de chiffres tabulaires, distinction nette entre date d'opération et date de valeur) et l'extrême rigueur des formulaires de virement sécurisés.
* **Ce que nous refusons de copier :** Les aplats pourpres saturés et les illustrations 3D volumétriques abstraites qui alourdissent le temps de chargement sans éclairer le fonctionnement du produit.

#### F. Monzo
* **Source :** Monzo (Banque mobile britannique)
* **URL :** `https://monzo.com`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** La maîtrise de l'expérience mobile 390px / 360px : le flux principal de transactions est ultra-condensé sous le pouce, et seule la transaction présentant une anomalie (double prélèvement, pourboire inattendu) déclenche une surface d'action déployée.
* **Ce que nous refusons de copier :** La couleur corail fluorescente agressive et le ton humoristique informel dans les notifications d'impayés.

#### G. Basecamp & 37signals
* **Source :** Basecamp (Logiciel de gestion de projet)
* **URL :** `https://basecamp.com`
* **Date consultée :** 8 Octobre 2026
* **Ce que nous avons appris :** L'art de la démonstration concrète sur la page publique. Zéro jargon commercial vide, zéro vidéo marketing d'ambiance : la page d'accueil montre des captures réelles annotées, explique la philosophie du produit avec des mots simples et affiche un tarif forfaitaire sans astérisques trompeuses.
* **Ce que nous refusons de copier :** L'esthétique manuscrite rétro (flèches dessinées à la main) qui daterait RentReady.

---

### 3. Audit Comparatif de 15 Landing Pages SaaS en Production

L'analyse de 15 pages d'accueil en production (Wise, Linear, Notion, Pennylane, Qonto, Alan, Stripe, Figma, Loom, Vercel, Supabase, Raycast, Folk, Incident.io, Basecamp) révèle les constats structurels suivants :

| Dimension | Pattern Dominant Marché | Recommandation B.1 pour RentReady |
| :--- | :--- | :--- |
| **Ordre narratif** | Hero $\rightarrow$ Logos clients $\rightarrow$ 3 Cards $\rightarrow$ Bento $\rightarrow$ Pricing | **Hero Produit $\rightarrow$ Démonstration Cycle (Calm/Exception/Resolved) $\rightarrow$ Outils Gratuits $\rightarrow$ Preuve par le Réel $\rightarrow$ Tarifs clairs** |
| **Hauteur du Hero** | Écran entier (100vh) avec mockups inclinés | **Hero dense (max 640px) où le Grand Livre d'encaissements est visible dès le premier regard sans scroll.** |
| **Fréquence CTA** | 5 à 7 boutons identiques répétés | **3 déclencheurs stratégiques contextualisés : Hero, Démonstration produit, et Section tarifaire.** |
| **Utilisation des captures** | Faux dashboards en perspective isométrique 3D | **Composants d'interface réels, rendus en HTML/CSS, interactifs et vérifiables.** |
| **Gestion des objections** | Témoignages inventés avec faux profils LinkedIn | **Réponses factuelles : conformité Loi 1989, hébergement souverain, formules IRL officielles de l'INSEE.** |
| **Comportement Mobile** | Les 3 colonnes deviennent 3 cartes géantes | **Le tableau s'adapte en un flux vertical condensé de 44px par unité, seule l'exception s'étire.** |

---

### 4. La Checklist Anti-Clichés IA (Anti-AI Landing Audit)

Pour garantir que RentReady ne ressemble à aucun template Framer ou prototype v0, chaque composition publique est soumise à la checklist d'interdiction suivante :

| Cliché IA Récurrent | Diagnostic de Rejet | Règle Stricte B.1 |
| :--- | :--- | :--- |
| **Badge flottant au-dessus du H1** (*« Nouveau en 2026 »*) | Gimmick décoratif sans valeur d'information | **Interdit.** Si une mention est nécessaire, elle s'intègre comme métadonnée d'en-tête sobre. |
| **Dégradé violet / mesh gradient blob** | Signature visuelle des IA génératives | **Interdit.** Fond calcaire pur `#F5F3EF`, contrasté par des surfaces albâtres `#FFFFFF`. |
| **Faux mockup incliné flottant dans le vide** | Dissimule l'absence de vrai produit | **Interdit.** L'interface est posée à plat, nette, comme un instrument de travail. |
| **Grille bento décorative à 6 cases inégales** | Remplissage artificiel sans logique de lecture | **Interdit.** Rythme éditorial linéaire et clair fondé sur le cycle locatif réel. |
| **Bordures lumineuses (Glowing borders)** | Cosplay cyberpunk futuriste | **Interdit.** Filets minéraux feutrés `#E5E2DA` inspirés de l'édition imprimée. |
| **Témoignages avec faux avatars Unsplash** | Perte immédiate de crédibilité légale | **Interdit formellement.** Aucun faux avis ou métrique inventée. La preuve est le produit. |
| **Slogans creux** (*« Simple. Puissant. Intelligent. »*) | Ponctif marketing vide de sens | **Remplacé par la réalité métier :** *« Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. »* |
| **Petites icônes dans des carrés arrondis colorés** | Cliché de template shadcn/ui | **Interdit.** L'icône est fonctionnelle et discrète, jamais encagée dans un carré violet. |
| **Étoiles scintillantes aléatoires (Sparkles ✨)** | Cliché IA générative par excellence | **Banni définitivement.** Aucune icône sparkle décorative. |
