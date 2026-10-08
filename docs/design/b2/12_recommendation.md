# Recommandation Finale pour Revue Humaine (B.2)

> **Statut méthodologique :** `RECOMMENDED FOR HUMAN REVIEW` (Proposition motivée soumise à l'arbitrage humain, et non « Winner » décrété unilatéralement).

---

## 1. Choix Recommandés pour la Revue Humaine

### 1.1 Le Hero Recommandé : HERO 5 (HYBRID)
- **Titre H1 :** *Gérez vos locations sans tableur. Agissez uniquement sur l'exception.*
- **Sous-titre :** *RentReady suit vos loyers chaque mois, édite vos quittances en un clic et ne sollicite votre attention qu'en cas d'écart. Conforme à la loi du 6 juillet 1989.*
- **Composant visuel :** Démonstration du cycle mensuel avec le cas d'anomalie de Lyon (400 € restant) résolu au clic, contractant la ligne et révélant la signature : *« Tout ce qui va bien devient silencieux. »*

#### Pourquoi ce choix (WHY) :
1. **Équilibre optimal entre compréhension et différenciation :** Les tests ont montré que le Hero 1 (Category) est très clair mais un peu conventionnel, tandis que le Hero 3 (Exception) était parfois trop abstrait sans le mot « locations ». Le Hero 5 réunit le meilleur des deux mondes : il nomme l'activité (« locations », « tableur ») et introduit immédiatement la mécanique d'exception.
2. **Performance mobile éprouvée :** Le H1 compact sur 3 lignes permet à la première carte de logement d'apparaître dès Y=420px sur 390px et 360px.
3. **Mise en valeur naturelle de la signature de marque :** La devise *« Tout ce qui va bien devient silencieux »* n'est plus sacrifiée en H1 commercial inefficace ; elle devient le couronnement de la démonstration produit.

#### Compromis consentis (TRADEOFFS) :
- Le titre est légèrement plus long que le Hero 4 (Product First) qui ne faisait que 5 mots (*« La gestion locative sans tableur »*).
- Il demande un effort de concentration légèrement supérieur à un titre hyper-générique type « Logiciel de gestion locative ».

---

### 1.2 L'Architecture Complète Recommandée : ARCHITECTURE C (HYBRID CONVERSION)
- **Structure séquentielle :**
  1. Header B.1 épuré
  2. Hero 5 (Hybride avec démo interactive intégrée)
  3. Démonstration approfondie du cycle mensuel (ATTENTION $\rightarrow$ ACTION $\rightarrow$ RESOLVED $\rightarrow$ CALM)
  4. Les 4 piliers métier (Encaissements, Quittances loi 1989, Révision IRL INSEE, Historique & Export CSV)
  5. Cadre légal rigoureux et protection des données (Articles 21 et 17-1, RGPD, TLS 1.3)
  6. Passerelle outils gratuits (Calculateur IRL et modèle quittance sans inscription)
  7. Tarification transparente (Starter 9 €/mois / Pro 15 €/mois, 14 jours d'essai sans carte)
  8. FAQ concise des bailleurs
  9. CTA final avec réassurance et signature de marque
  10. Footer scalable

#### Pourquoi ce choix (WHY) :
1. **Couverture exhaustive du parcours décisionnel :** Répond successivement aux questions « Qu'est-ce que c'est ? », « Comment ça marche ? », « Est-ce légalement conforme ? », « Combien ça coûte ? » et « Que risque-je à essayer ? ».
2. **Aucune section superflue :** Chaque bloc résout une objection réelle documentée dans le benchmark sans jamais recourir à de faux témoignages ou à des badges décoratifs creux.
3. **Passerelle SEO efficace :** Les liens vers le calculateur IRL et les quittances offrent une porte d'entrée à haute valeur ajoutée pour les visiteurs pas encore prêts à créer un compte.

---

## 2. Risques Identifiés & Points de Vigilance (RISKS)

1. **Sensibilité au taux d'interaction de la démo :**
   Si un utilisateur mobile ne clique pas sur le bouton « Régulariser », perçoit-il quand même le bénéfice ?  
   *Mitigation mise en place :* L'état statique initial explicite clairement le problème (« Reste 400 € dû ») et la solution (« Quittance prête dès encaissement ») même sans clic.
2. **Attente d'une synchronisation bancaire magique :**
   Les bailleurs peuvent penser que le logiciel se connecte instantanément à leur banque sans action de leur part.  
   *Mitigation mise en place :* La copy insiste sur le « rapprochement bancaire intelligent » et la « validation en un clic », sans survendre une autonomie totale non supervisée.
3. **Compétition avec le freemium de Rentila (1 bien gratuit) :**
   RentReady propose un essai de 14 jours puis 9 €/mois, sans plan gratuit à vie.  
   *Mitigation mise en place :* Souligner la valeur de la tranquillité d'esprit, de l'absence de publicité et de l'interface non polluée dès 30 centimes par jour.

---

## 3. Hypothèses à Tester en A/B Testing Post-Lancement

Une fois la homepage en production avec du trafic réel :
1. **A/B Test H1 :** Hero 5 (*Gérez vos locations sans tableur. Agissez uniquement sur l'exception*) vs Hero 1 (*Le logiciel de gestion locative des propriétaires indépendants*).  
   *Métrique :* Taux de clic sur le CTA principal (`/register`).
2. **A/B Test Placement Tarifs :** Bloc tarifaire visible sur la homepage vs simple mention « Dès 9 €/mois » avec lien vers la page `/pricing`.  
   *Métrique :* Taux de conversion global en inscriptions complètes.
3. **A/B Test CTA Secondaire :** « Voir le fonctionnement » (ancre) vs « Calculer ma révision IRL » (outil gratuit).  
   *Métrique :* Taux de rétention et activation via les outils gratuits.
