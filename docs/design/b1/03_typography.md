# DOCUMENT 03 — SYSTÈME TYPOGRAPHIQUE & LETTRAGE MONÉTAIRE B.1
## Recherche Typographique, Gestion Tabulaire & Hiérarchie Éditoriale

---

### 1. La Problématique Typographique de RentReady

Dans un logiciel de gestion locative, la typographie n'est pas un habillage décoratif : c'est l'ossature même de l'outil. Elle doit résoudre simultanément quatre contraintes sévères :
1. **L'exigence monétaire et tabulaire :** Aligner verticalement des montants variés (de `45,00 €` à `14 250,00 €`) avec des virgules, des centimes et le symbole euro sans décalage de colonnes (`tabular-nums`).
2. **Le respect des diacritiques français :** Gérer impeccablement les majuscules accentuées (*É, À, Ç, È, Ê*), les apostrophes typographiques et les ligatures sans provoquer de saut de ligne parasite sur mobile.
3. **La résistance aux données réelles longues :** Afficher sans troncature prématurée des adresses françaises complexes (*« 14 bis, avenue du Maréchal de Lattre de Tassigny, Escalier B, Bâtiment 4 »*) et des noms composés sur des largeurs d'écran de 360px à 390px.
4. **La personnalité de marque sans extravagance :** Éviter à la fois la neutralité mécanique anonyme d'Inter et l'artifice théâtral des polices avec empattements géantes (Newsreader) qui font ressembler le logiciel à un journal du XIXe siècle.

---

### 2. Évaluation Comparative des Candidats Typographiques

| Famille | Fonderie / Auteur | Licence | Support Chiffres Tabulaires (`tnum`) | Accents & Diacritiques FR | Caractère & Personnalité | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Plus Jakarta Sans** *(Recommandé)* | Tokotype (Gumpita Rahayu) | **SIL OFL 1.1** (Open Source) | **Oui** (Excellente gestion `tnum` depuis v2.6) | **Complet** (Latin étendu, diacritiques soignés) | **Humaniste contemporaine, ouvertures généreuses, chaleur tactile.** | **RETENU COMME CANDIDAT MAÎTRE** |
| **Inter** | Rasmus Andersson | **SIL OFL 1.1** (Open Source) | **Oui** (Métrique technique très neutre) | **Complet** | Fonctionnelle mais surutilisée (effet clone SaaS générique). | Utilisé comme référence technique de repli |
| **DM Sans** | Colophon Foundry | **SIL OFL 1.1** (Open Source) | **Oui** | **Complet** | Belle géométrie mais terminaisons parfois un peu sèches. | Candidat alternatif crédible |
| **Outfit** | Rodrigo Fuenzalida | **SIL OFL 1.1** (Open Source) | Partiel selon versions | **Complet** | Proportions légèrement trop larges pour les tableaux denses. | Non retenu pour le cœur dense |
| **General Sans** | Indian Type Foundry (Fontshare) | Gratuit / Propriétaire ITF | Oui | Complet | Très élégante allure néo-grotesque française, mais licence Fontshare spécifique. | Écarté par précaution de licence OFL pure |

---

### 3. Pourquoi Plus Jakarta Sans est la Famille Idéale pour B.1

1. **Noblesse géométrique et humanisme :** Ses contreformes rondes et ses fûts clairs confèrent à l'interface un accueil immédiat sans la froideur des fontes purement industrielles.
2. **Lisibilité accrue aux petits corps :** Ses œils de lettre ouverts (*c, e, s*) maintiennent une distinction exemplaire même à 12px sur les écrans mobiles d'entrée de gamme à densité moyenne.
3. **Précision monétaire tabulaire :** Grâce à la règle CSS `font-feature-settings: "tnum" 1, "cv05" 1`, les chiffres occupent exactement la même chasse horizontale, garantissant des colonnes d'encaissements d'une netteté comptable chirurgicale.
4. **Garantie légale absolue :** Sous licence SIL Open Font License (OFL 1.1), elle est 100% libre de droits pour un usage web, applicatif, mobile et SaaS commercial.

---

### 4. Échelle Typographique Modulaire (Ratio 1.20 - Minor Third)

L'échelle est calibrée pour privilégier la compacité utile dans l'application et la respiration éditoriale sur le site public :

| Niveau | Taille (Desktop) | Taille (Mobile 390px) | Graisse (Weight) | Hauteur de ligne (Line-height) | Tracking | Rôle & Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `44px` / `2.75rem` | `32px` / `2.0rem` | SemiBold (600) | `1.15` | `-0.025em` | Titre maître de la homepage publique. |
| **Section H2** | `28px` / `1.75rem` | `24px` / `1.5rem` | SemiBold (600) | `1.25` | `-0.02em` | Titres de sections marketing & titres de pages applicatives. |
| **Subsection H3** | `20px` / `1.25rem` | `18px` / `1.125rem` | Medium (500) | `1.3` | `-0.01em` | Titres d'onglets, en-têtes de modules et cartouches. |
| **Large Body** | `17px` / `1.0625rem` | `16px` / `1.0rem` | Regular (400) | `1.55` | `0em` | Paragraphe d'introduction de guides SEO et hero chapô. |
| **Base Body** | `15px` / `0.9375rem` | `15px` / `0.9375rem` | Regular (400) | `1.5` | `0em` | Texte courant, explications d'outils, modales d'aide. |
| **Dense UI / Table**| `13.5px` / `0.84rem` | `13px` / `0.81rem` | Medium (500) / Regular | `1.35` | `0em` + `tabular-nums` | **Lignes du Grand Livre**, montants, dates, identifiants locataires. |
| **Micro Label** | `11.5px` / `0.72rem` | `11px` / `0.69rem` | SemiBold (600) | `1.2` | `+0.03em` | Badges de statut, métadonnées, dates d'arrêté. |

---

### 5. Règles de Microcopy & Rédaction Typographique

Pour éliminer l'artificialité des maquettes générées par IA :
* **Interdiction formelle des points d'exclamation promotionnels :** Aucun *« Vos loyers sont à jour ! »* ou *« Simplifiez tout en un clic ! »*. Le constat est sobre : *« 10 logements à jour d'encaissement »*.
* **Casse naturelle en français soigné :** Abandon des libellés en majuscules intégrales agressives (`UPPERCASE TRACKING-WIDEST`). Les statuts s'écrivent en casse naturelle : *« Réglé »*, *« Solde partiel dû »*, *« En attente de virement »*.
* **Formatage légal et décimal français :**
  - Espace insécable fine devant le symbole monétaire : `1 250,00 €` (et non `1250.00€` ou `$1250`).
  - Dates écrites en toutes lettres sobres : *« 5 octobre 2026 »* ou abréviation comptable normalisée *« 05/10/2026 »*.
  - Références juridiques exactes : *« Art. 21, Loi du 6 juillet 1989 »* (et non *« Conformité juridique garantie »*).
