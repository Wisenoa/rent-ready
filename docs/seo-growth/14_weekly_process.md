# 14 — Processus de Suivi Hebdomadaire (Weekly SEO Ritual)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Format : **RITUEL HEBDOMADAIRE LÉGER (30 MINUTES PAR SEMAINE)**

---

## 1. Objectif du Rituel

Maintenir une dynamique continue d'optimisation basée sur des preuves concrètes, sans surcharger l'équipe technique et sans générer de travail superficiel.

---

## 2. Déroulé en 4 Étapes (Chaque Lundi Matin)

```text
1. EXTRACTION DES DONNÉES (5 min)
   └─► Exécuter `node scripts/monitor-gsc.mjs --json`
   └─► Vérifier les inscriptions hebdomadaires (Plausible / DB)

2. ANALYSE DU DELTA J-7 (10 min)
   └─► Identifier le Top 5 des progressions et régressions
   └─► Filtrer les requêtes "Podium à portée" (Positions 4 à 10)

3. SÉLECTION DES 3 À 5 ACTIONS PRIORITAIRES (10 min)
   └─► Ajustement de méta-titre (CTR)
   └─► Renfort de maillage interne vers une page montante
   └─► Optimisation d'un CTA sur un outil à fort trafic

4. VALIDATION & PLANIFICATION DU SPRINT (5 min)
   └─► Validation humaine des propositions
   └─► Implémentation sur branche dédiée
```

---

## 3. Matrice de Détection des Opportunités

| Signal détecté | Constat Search Console | Décision d'action |
| :--- | :--- | :--- |
| **Opportunité Podium** | Requête en position 4 à 9 avec de fortes impressions et un faible CTR (< 3 %). | Enrichir la page cible avec un paragraphe répondant directement à l'intention, ajouter 2 liens internes depuis des articles satellites, tester un méta-titre plus percutant. |
| **Fuite de trafic** | Perte de plus de 3 positions sur un mot-clé commercial clé. | Vérifier les mouvements concurrents sur la SERP, contrôler l'exactitude des informations juridiques (ex: révision IRL périmée), vérifier la vitesse de chargement. |
| **Trafic sans conversion** | Page outil ou article générant de nombreuses visites mais 0 clic vers `/register`. | Repositionner l'encart d'automatisation plus haut dans la page ou reformuler la proposition de valeur (« Automatiser vos quittances le mois prochain »). |
| **Cannibalisation émergente** | Deux URLs différentes qui se partagent les impressions sur une même requête. | Déterminer l'URL canonique légitime et faire pointer la seconde vers la première avec un lien d'ancrage exact. |

---

## 4. Modèle de Journal de Bord Hebdomadaire (`docs/seo-growth/changelog.md`)

Chaque intervention doit être consignée sous le format standard suivant :

```markdown
### Semaine [Numéro] — [Date]
- **Données GSC observées :** Clics totaux: X (+Y%), Impressions: Z, Mots-clés en Top 10: N.
- **Actions réalisées :**
  - [ACT-XXX] : Ajout de 3 liens internes vers `/outils/calculateur-irl` depuis les articles 12, 14 et 18.
  - [ACT-YYY] : Optimisation du title de `/comparatif/logiciel-gestion-locative`.
- **Hypothèse testée :** Amélioration du CTR de 2,1 % à 3,5 % sur la requête "comparatif gestion locative".
- **Revue à J+14 :** [Résultats mesurés].
```
