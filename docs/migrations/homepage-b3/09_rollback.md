# 09 — Procédure de Rollback Atomique & Réversibilité

Date : Octobre 2026  
Branche : `feature/homepage-b3-migration`

---

## 1. Principe de Réversibilité

Cette migration a été conçue pour offrir un **risque opérationnel nul** :
1. **Zéro migration de base de données :** Aucune modification de `prisma/schema.prisma` ni aucune écriture en base.
2. **Préservation intégrale des composants antérieurs :** L'ensemble des composants du dossier `src/components/landing/` a été conservé intact sans aucune suppression.
3. **Isolation de branche :** Tout le travail réside sur la branche dédiée `feature/homepage-b3-migration`.

---

## 2. Scénarios de Rollback

### Scénario A : Rollback avant déploiement (En cours de Phase A)
Le déploiement en production n'ayant pas encore été effectué, il suffit de ne pas fusionner la branche de fonctionnalité dans `master`.
```bash
git checkout master
```

### Scénario B : Rollback chirurgical en production (Post-atterrissage)
Si une anomalie inattendue survenait après atterrissage sur `master`, la restauration de la homepage précédente s'exécute en une commande atomique sans toucher au reste de l'application :
```bash
# Restaurer le fichier page.tsx d'origine
git checkout fe99f5b -- src/app/page.tsx

# Créer le commit de rollback
git commit -m "revert: rollback homepage to baseline fe99f5b"

# Déployer
git push origin master
```

### Scénario C : Invalidation du cache de bordure (CDN Edge)
La route `/` utilisant `export const revalidate = 3600;`, tout nouveau déploiement sur Vercel/Node purge et régénère immédiatement le cache HTML de la page d'accueil pour tous les visiteurs et robots d'indexation.
