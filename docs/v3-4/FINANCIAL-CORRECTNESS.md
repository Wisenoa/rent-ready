# Exactitude financière et limites — vérification du 18 octobre 2026

## Loyers et documents : calcul déterministe

920 = 850 HC + 70 charges. 500 reçus laissent 420 ; 500 + 420 soldent la période. Le domaine déjà présent conserve les dates, les versements et les valeurs historiques, avec Decimal, CAS et transactions. Le trop-perçu est refusé ; aucun avoir de 80 € n’est inventé. Une annulation n’est pas un remboursement bancaire.

Correction supplémentaire : annulation après modification du bail fondée sur les montants photographiés au paiement ; paiement/annulation exécutés en Serializable et réessayés sur P2034 et sur le conflit de commit DriverAdapterError/TransactionWriteConflict de l’adaptateur PostgreSQL installé, y compris sans échéance matérialisée. Les tests ont reproduit deux pertes de cohérence avant correction. Les modifications de bail et leur recalcul sont désormais atomiques ; les mois avec paiement sont préservés, et une panne injectée provoque un rollback. Une répétition de suite a montré qu’un conflit au commit ne porte pas toujours P2034 : le code installé de l’adaptateur confirme cause.kind=TransactionWriteConflict pour PostgreSQL 40001. Reprise de toute la transaction, au plus huit tentatives avec délais bornés, sans effets externes dans la fonction réessayée ; tests des deux formes et du refus de réessayer les autres erreurs. Voir aussi [Prisma 7, transactions et reprise](https://docs.prisma.io/docs/orm/v7/prisma-client/queries/transactions). Le dashboard réutilise summariseLease et compte tous les versements du mois, pas seulement le dernier.

La quittance consomme ces valeurs ; le PDF ne recalcule pas le métier. Une archive partielle n’est pas régénérée comme quittance après un versement ultérieur. Le total acquitté d’une quittance est désormais le montant historique intégral de la période (920), et non le seul dernier versement (420). Le reçu partiel conserve son propre montant (500). Une nouvelle quittance est refusée si une annulation a rouvert un solde. Le navigateur vérifie les octets téléchargés et le chargement PDF réel ; les tests PDF réels des outils sont également conservés. Identités et adresses historiques avant la première génération : limitation signalée dans AUDIT. Des archives anciennes éventuellement erronées ne sont pas réécrites automatiquement.

## IRL : calcul exact sur l’indice retenu

Formule : loyer × nouvel indice / indice de référence, puis arrondi au centime. Différence = nouveau montant arrondi − ancien montant arrondi. Zéro ne produit plus NaN ; négatifs et non-finis sont refusés. La liste des formulaires de bail vient du même catalogue.

148,06 pour T3 2026, publication INSEE du 15 octobre, confirmé par [INSEE, Informations rapides 246](https://www.insee.fr/fr/statistiques/9081853). Aucune valeur plus ancienne ne remplace cet indice. Cas indépendant : 850 × 148,06 / 145,77 → 863,35, soit +13,35 €. L’outil ne prouve pas à lui seul que le bail est révisable (clause, trimestre, DPE, délais).

## LMNP 2026 : estimation annuelle

Références : [ministère de l’Économie, location meublée longue durée](https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-longue-duree-quels-revenus-declarer), [DGFiP, prélèvements sociaux, mise à jour 17 juillet 2026](https://www.impots.gouv.fr/particulier/questions/je-donne-un-bien-en-location-dois-je-payer-des-prelevements-sociaux), [régimes d’imposition / amortissement](https://www.impots.gouv.fr/particulier/les-regimes-dimposition).

- Seuil de référence des recettes pour 2026 : 83 600 €, abattement de longue durée 50 %, minimum 305 € borné aux recettes.
- PS en meublé : 18,6 % sur la base après abattement ou déductions. Le 17,2 % de la location nue ne doit pas être repris pour le LMNP 2026.
- Art. 39 C : amortissement déduit limité au résultat positif après charges/intérêts ; il ne crée pas de déficit. Excédent d’amortissement et déficit BIC restent distincts.
- Hypothèses de simulation existantes : bâti 85 % / 30 ans, mobilier / 7 ans, TMI fixe. Ce ne sont pas des durées universelles imposées par la loi. La simulation ne calcule pas le barème progressif, la CSG déductible, les cotisations d’une activité professionnelle, ni l’éligibilité pluriannuelle du micro.

Cas indépendant : recettes 12 000 € au micro → base 6 000 € ; IR à 30 % = 1 800 €, PS = 1 116 €, total indicatif 2 916 €. Borne : 83 600 exactement ne dépasse pas le seuil ; 83 600,01 le dépasse. Les comparatifs ne constituent pas un montant d’impôt définitif.

Revente : moteur plus-value existant conservé, amortissements immobiliers effectivement déduits saisis explicitement ; mobilier exclu. Référence : [DGFiP, vente d’un logement meublé](https://www.impots.gouv.fr/particulier/questions/je-vends-un-bien-immobilier-donne-en-location-meublee-comment-se-calcule-la). Les exceptions et la qualification finale relèvent de la situation réelle et du notaire.

## Jeanbrun : simulation indicative du neuf

Références : [CGI art. 31, version au 1 septembre 2026](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053154357/2026-09-01), [revenus fonciers, texte de création](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006191572/2026-02-21/), [CGI art. 156](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053544806/2026-02-21), [BOI-RFPI-BASE-30-20](https://bofip.impots.gouv.fr/bofip/4142-PGP.html/identifiant=BOI-RFPI-BASE-30-20-20250916).

Le mécanisme n’est pas présumé identique à l’article 39 C du LMNP. Les amortissements i/j sont des déductions foncières ; aucune limitation LMNP n’a été transposée arbitrairement. L’imputation du déficit est conditionnelle et bornée à 10 700 € dans la simulation. Les intérêts compensent d’abord les loyers ; leur déficit propre est reportable sur les revenus fonciers. La comparaison tient compte du déficit déjà possible au réel classique.

Cas indépendant : 100 000 € × 80 % × 3,5 % = 2 800 €. Loyers 6 000, intérêts 2 000, autres charges 5 000 : les intérêts sont absorbés ; déficit après amortissement 3 800 imputable sous hypothèses. Le réel classique a déjà 1 000 de déficit : avantage supplémentaire indicatif = 2 800 × 30 % = 840 €, et non l’économie totale attribuée à Jeanbrun.

Les plafonds annuels 8 000 / 10 000 / 12 000 sont ceux du foyer, pas une franchise cumulable par bien. Les taux 3,5 / 4,5 / 5,5 concernent le neuf : l’écran le précise. Ancien réhabilité, loyers/ressources, travaux et dates d’éligibilité ne sont pas automatiquement vérifiés. Neuf années pleines constantes ; pas de prorata fiscal de première année, pas d’actualisation financière, pas de calcul d’impôt de revente, pas d’expiration de stock au-delà de cet horizon. La validation juridique personnalisée demeure nécessaire.

## Autres outils et écran SaaS

Plus-value, charges, dépôt, préavis, rendement, prêt : moteurs V3.3 conservés et tests de référence existants relancés. Cela ne constitue pas une nouvelle validation exhaustive de tous les cas légaux.

L’ancien comparatif `/fiscal` avait son propre Jeanbrun incorrect. Il utilise maintenant les moteurs publics pour le calcul d’amortissement et le calcul Jeanbrun, garde les montants en Decimal, distingue nu/meublé et exclut une option non retenue. Il compare l’impôt annuel, sans monétiser les déficits globaux ni chiffrer toute la durée de détention. Les libellés explicitent cette limite.
