# 15 — Risques, Limites & Garde-Fous Stratégiques

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : Facteurs de risque identifiés lors de l'audit et mesures d'atténuation

---

## 1. Risque n°1 : Absence Temporaire de Données Search Console (Limitation Majeure)

### Nature du risque :
Sans accès aux données réelles de la Search Console (`GOOGLE_SERVICE_ACCOUNT_JSON`), les classements de mots-clés, volumes et taux de clics reposent sur des **hypothèses déduites du code et d'échantillons de SERP** plutôt que sur des mesures historiques.

### Mesure d'atténuation :
- Tout document de cet audit distingue formellement les faits vérifiés du code des hypothèses d'intention.
- Prioriser les correctifs techniques certains (`TECH-01` sitemap leak, `TECH-02` crash CI) qui apportent une valeur immédiate sans dépendre des métriques de trafic.
- Brancher le compte de service GSC dès la fin de cette mission.

---

## 2. Risque n°2 : Risque « Doorway Pages » sur les 200 Pages Villes Programmatiques

### Nature du risque :
Les filtres Google pénalisent sévèrement les pages dites "satellites" générées à grande échelle ciblant des variations géographiques sans valeur locale propre.
- Une page `/quittances/bordeaux` ou `/quittances/strasbourg` n'a **aucune différence juridique** avec une quittance parisienne (loi du 6 juillet 1989 d'application nationale stricte).
- Dans le code actuel, 38 villes sur 50 n'ont aucune donnée statistique locale (`AVG_RENT_DATA`).

### Mesure d'atténuation :
- **Geler toute extension programmatique :** Ne pas créer de nouvelles familles de villes.
- **Concentrer la valeur sur les villes sous encadrement effectif :** N'enrichir que les métropoles où il existe une véritable spécificité légale locale (plafonds préfectoraux à Paris, Lille, Lyon, Bordeaux, Montpellier).
- **Consolider le maillage latéral régional :** Éviter les feuilles mortes en reliant les communes voisines.

---

## 3. Risque n°3 : Précision Juridique & Évolutions Réglementaires Françaises

### Nature du risque :
Le droit immobilier français (loi de 1989, loi ALUR, loi ELAN, calendrier DPE, encadrement des loyers) est complexe et change fréquemment. Une coquille juridique dans un article ou un simulateur détruit immédiatement la crédibilité de RentReady.

### Mesure d'atténuation :
- **Zéro génération automatique d'articles par IA en aveugle.**
- Tout modèle de document ou simulateur interactif doit citer la source officielle légale (Légifrance, Service-Public, Journal Officiel).
- Maintenir à jour les séries trimestrielles INSEE de l'IRL dans les constantes de l'application.

---

## 4. Risque n°4 : Intégrité Concurrentielle (Risque de Dénigrement)

### Nature du risque :
Citer des concurrents réels (Rentila, BailFacile, GérerSeul) sur des pages comparatives impose une obligation légale de **loyauté et de vérifiabilité** en droit français (art. L. 122-1 du Code de la consommation sur la publicité comparative).

### Mesure d'atténuation :
- Comparer des fonctionnalités objectives et vérifiables (prix public constaté, présence de la synchronisation bancaire, format d'export).
- Ne jamais dénigrer ; valoriser la simplicité d'usage et le design d'exception plutôt que des critiques infondées.
- Supprimer immédiatement les noms fantaisistes (« Apfer », « Tecoo ») qui nuisent à l'image de sérieux de RentReady.

---

## 5. Risque n°5 : Respect de la Politique de Zéro Achat de Backlinks

### Nature du risque :
L'achat de liens artificiels ou de réseaux de blogs privés (PBN) expose le domaine à des pénalités algorithmiques sévères (Google Penguin / SpamBrain).

### Mesure d'atténuation :
- Acquisition de liens exclusivement naturelle (Earned Media) par la qualité des outils gratuits (calculateur IRL, modèle de quittance PDF) recommandés spontanément sur les forums d'investisseurs et blogs immobiliers indépendants.
