# LIVRABLE 01 — RECHERCHE VISUELLE & FONDATIONS
## RentReady Visual Identity Exploration — Phase 1 & 4

### 1. Introduction & Démarche
Ce document pose les bases de l'exploration d'identité visuelle de RentReady. Contrairement aux approches précédentes basées sur des adjectifs abstraits générateurs de clichés (l'extrême crème/notarial ou l'extrême grisaille shadcn), la démarche s'ancre dans la recherche de signaux visuels pérennes, issus de logiciels financiers en production et de systèmes d'information visuels éprouvés.

---

### 2. Enseignements de la Recherche Non-SaaS (Design de Systèmes & Signalétique)

Une identité durable pour un logiciel de gestion patrimoniale ne doit pas regarder uniquement ses pairs SaaS ; elle doit s'inspirer des systèmes conçus pour durer des décennies.

#### A. Adrian Frutiger : La typographie comme outil invisible
- *Philosophie :* « Une lettre est comme une cuillère : elle doit remplir sa fonction sans attirer l'attention sur sa propre forme. »
- *Application à RentReady :*
  - Pour un propriétaire vérifiant que son virement de 850 € est arrivé, la police de caractères ne doit pas être un spectacle littéraire (pas de Newsreader géante).
  - Elle doit posséder des contreformes ouvertes (*open apertures*), une hauteur d'x généreuse et une netteté immédiate. Les chiffres doivent être conçus pour être comparés verticalement (`tabular-nums`).

#### B. Jean Widmer & la Signalétique Autoroutière / Pompidou
- *Philosophie :* Réduction géométrique et informationnelle au service d'une compréhension instantanée. Les 500 pictogrammes de Widmer sur les autoroutes françaises communiquent une réalité complexe en une seconde à 130 km/h.
- *Application à RentReady :*
  - Un tableau de bord locatif doit fonctionner comme un panneau de signalisation : ce qui est dégagé est fluide et neutre ; l'obstacle ou le virage (loyer partiel, retard d'échéance) possède un code signalétique évident qui ne nécessite aucun mode d'emploi.

#### C. L'Édition Contemporaine Européenne vs le Notariat Vintage
- Les publications contemporaines prestigieuses (Monocle, Le Monde moderne, revues d'architecture) n'utilisent plus de faux fonds jaunis ni d'effets parcheminés.
- Elles utilisent des fonds minéraux calmes (blanc albâtre, pierre calcaire très douce), une typographie sans-sérif ciselée avec des contrastes de corps équilibrés, et une mise en page aérée rythmée par des colonnes rigoureuses.

---

### 3. Enseignements Ergonomiques : La Divulgation Progressive (NN/g)

L'étude des principes de *Progressive Disclosure* documentés par le Nielsen Norman Group apporte la justification théorique de la signature comportementale de RentReady :
1. **Priorité au traitement immédiat :** Réduire la charge cognitive en n'affichant au premier niveau que les données vitales du mois (Attendus, Reçus, Solde, Statut par bien).
2. **Dévoilement contextuel :**
   - Lorsqu'un loyer est à jour : ligne compacte silencieuse avec accès en un clic à la quittance.
   - Lorsqu'un loyer accuse un incident : déploiement automatique de la fiche d'exception avec montant manquant, jours d'arriéré et action de régularisation.
3. **Retour au calme :** Dès l'enregistrement du solde, l'élément se rétracte et l'écran retrouve son silence.

---

### 4. Bilan des Écueils à Éviter
- **Écueil 1 : L'effet "Template shadcn" :** Uniformité grise sans aspérité, manque d'ancrage français, typographie passe-partout.
- **Écueil 2 : L'effet "AI Prompt Editorial" :** Excès d'ornements rétros (crème, serif géante, mono machine à écrire, terracotta).
- **Objectif :** Atteindre la **JUSTESSE** : un design qui inspire confiance, solidité et tranquillité d'esprit à un bailleur indépendant.
