# RentReady — Différence & Préservation SEO (Production Migration)

**Audit de comparaison :** Baseline Production vs Nouvelle Homepage B.3  
**Objectif :** Préserver et renforcer le positionnement organique sur les mots-clés prioritaires (*logiciel de gestion locative*, *propriétaire bailleur*, *suivi des loyers*, *quittance de loyer*, *révision IRL*) sans keyword stuffing et avec une stricte intégrité Schema.org.

---

## 1. Métadonnées Avant / Après

| Balise SEO | Avant (Baseline) | Après (B.3 Production) | Impact & Rationale |
| :--- | :--- | :--- | :--- |
| **`<title>`** | `RentReady — Pilotage locatif pour propriétaires bailleurs \| Essai gratuit` | `Logiciel de gestion locative pour propriétaires bailleurs \| RentReady` | **+ FORT SUR LA REQUÊTE N°1**. Place *« Logiciel de gestion locative »* en tête de balise (terme le plus cherché) tout en conservant la marque. |
| **`<meta description>`** | `Du loyer exigible à la quittance certifiée conforme à la loi de 1989. Zéro tableur, détection des paiements et révision IRL connectée à l'INSEE. Essai 14 jours sans carte.` (174 caractères - tronquée sur Google) | `Gérez vos locations sans tableur. Suivi des loyers, quittances conformes en 1 clic et révision IRL INSEE. Essai 14 jours gratuit sans carte bancaire.` (151 caractères) | **OPTIMISÉ (151 car.)**. Évite la troncature mobile/desktop dans la SERP tout en regroupant les 4 leviers de clic et la réassurance sans carte. |
| **Canonical** | `https://www.rentready.fr` | `https://www.rentready.fr` | **IDENTIQUE**. Invariant préservé. |
| **Robots** | `index: true, follow: true` | `index: true, follow: true` | **IDENTIQUE**. |
| **H1** | `« Vos locations tournent. RentReady s'occupe du suivi. »` | `« Gérez vos locations sans tableur. »` | **PLUS CONCRET & ORIENTÉ DOULEUR**. Cible directement le pain point majeur de 90% des bailleurs (Excel/tableur). |
| **Open Graph** | Titre et description génériques | Aligné sur title et description optimisés, image OG conservée | **OPTIMISÉ**. |
| **Twitter Card** | `summary_large_image` (`@rentready_fr`) | `summary_large_image` (`@rentready_fr`) | **IDENTIQUE**. |

---

## 2. Données Structurées JSON-LD

### 2.1 Graph Schema (Organization & WebSite)
- **Préservé à 100% :** Injection via `buildGraphSchema(buildOrganizationSchema(), buildWebSiteSchema())`.
- Données vérifiées : nom, URL officielle, logo SVG, description, contact support `contact@rentready.fr`, adresse France.
- Zéro faux avis (`AggregateRating` ou `Review` fictifs toujours strictement exclus).

### 2.2 FAQPage Schema (`mainEntity`)
- **Nettoyage de conformité :**  
  Dans l'ancienne version, la FAQ incluait des affirmations prospectives non fonctionnelles (*« Factur-X »*, *« dispositif Jeanbrun 2026 »*, *« grand livre »*).
- **Dans B.3 :**  
  Le JSON-LD `FAQPage` est mis à jour pour correspondre mot à mot aux 4 questions réelles de la page :
  1. *Pourquoi quitter un tableur Excel pour RentReady ?*
  2. *Comment fonctionne l'essai gratuit de 14 jours ?*
  3. *Que se passe-t-il en cas de versement partiel d'un locataire ?*
  4. *Mes données d'encaissement sont-elles exportables ?*
- **Bénéfice :** Éligibilité aux Rich Snippets de FAQ dans Google sans risque de pénalité manuelle pour divergence entre contenu visible et données structurées.

---

## 3. Maillage Interne (Internal Linking)

Tous les liens internes cruciaux de l'ancienne version sont préservés vers leurs routes canoniques :
- Outils gratuits à forte valeur SEO :
  - `/outils/calculateur-irl` (calculateur de révision annuel INSEE)
  - `/outils/modele-quittance-loyer-pdf` (modèle de quittance PDF conforme)
- Tarification & Offres : `/pricing`
- Tunnel d'inscription : `/register`, `/register?plan=starter`, `/register?plan=pro`
- Guides & Contenu : `/guides`
- Pages légales : `/mentions-legales`, `/politique-confidentialite`, `/cgu`
