# SPEC — Régularisation des charges locatives et prorata (RentReady)

**Date de consultation de toutes les sources : 5 octobre 2026.**
Périmètre : location vide, location meublée, bail mobilité, copropriété.

Classification employée :
- **[JURIDIQUE]** = obligation ou interdiction posée par un texte (Legifrance, DILA/Service-Public).
- **[PRODUIT]** = choix de conception RentReady. Aucune valeur juridique propre.
- **[CALCUL]** = règle de calcul que le produit applique, à partir d'une donnée légale ou d'une convention.
- **[INCONNU]** = aucun texte primaire trouvé. Ne pas trancher.

> Avertissement : toute mention « tel que le présente la pratique » est hors périmètre.
> Les sources secondaires (blogs, éditeurs) ont été écartées ; seules Legifrance,
> Service-Public (DILA) et les ADIL/ANIL sont retenues.

---

## SOURCES NORMATIVES RETENUES

| Réf | Texte | URL | État |
|---|---|---|---|
| L89-462 art. 23 | Charges récupérables, provisions, régularisation | https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000041587263/ | en vigueur depuis 01/07/2021 |
| L89-462 art. 25-10 | Location meublée : forfait ou provisions | https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000028779195/ | en vigueur depuis 27/03/2014 |
| L89-462 art. 8-1 V | Colocation : même choix que l'art. 23 | https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000038834725/ | en vigueur depuis 01/07/2021 |
| L89-462 art. 6-2 | Transmission des mesures de consumption | https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000042120464 | en vigueur depuis 25/10/2020 |
| Décret 87-713 (annexe) | Liste fermée des charges récupérables | https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006066149/ | en vigueur ; annexe depuis 30/08/1987 |
| Arrêté 27/08/2012 | Répartition chauffage/froid, mixte habitation-profession | https://www.legifrance.gouv.fr/loda/id/JORFTEXT000026344847/ | art. 1 en vigueur depuis 01/07/2021 |
| SP F947 | Charges à payer par le locataire | https://www.service-public.gouv.fr/particuliers/vosdroits/F947 | vérifié 15/04/2025 |
| SP F2590 | Charges de copropriété | https://www.service-public.gouv.fr/particuliers/vosdroits/F2590 | vérifié 18/02/2026 |
| SP F479 | Prescription dette de loyer/charges | https://www.service-public.gouv.fr/particuliers/vosdroits/F479 | vérifié 10/04/2025 |
| SP F34759 | Bail mobilité | https://www.service-public.gouv.fr/particuliers/vosdroits/F34759 | vérifié 06/06/2025 |
| ADIL 94 | Note juridique — les charges locatives | https://www.adil94.org/actualites-locales/2024/10/23/note-juridique-les-charges-locatives/ | 23/10/2024 |

---

## 1. LOCATION VIDE — charges récupérables

### [JURIDIQUE]
La liste est **fermée**. Art. 23 : les charges récupérables sont exigibles **« sur justification »** en contrepartie de (1) services rendus liés à l'usage des éléments de la chose louée, (2) dépenses d'entretien courant et menues réparations sur les éléments d'usage commun, (3) impositions correspondant à des services dont le locataire profite directement. « La liste de ces charges est fixée par décret en Conseil d'État » — décret 87-713, annexe.

Annexe 87-713, 8 rubriques : **I** Ascenseurs et monte-charge · **II** Eau froide, eau chaude et chauffage collectif · **III** Installations individuelles · **IV** Parties communes intérieures · **V** Espaces extérieurs · **VI** Hygiène · **VII** Équipements divers · **VIII** Impositions et redevances (droit de bail, taxe/redevance d'enlèvement des ordures ménagères, taxe de balayage).

Modalités de personnel (art. 2 du décret 87-713) : encadrement technique **10 %** ; gardien assurant entretien des parties communes **et** élimination des rejets : **75 %** de rémunération + charges sociales et fiscales ; une seule de ces deux tâches : **40 %**.

Rupture de monopole : art. 23 autorise des **accords collectifs locaux** (sécurité, développement durable) à ajouter des postes.

Non récupérables (par construction, hors annexe) : taxe foncière, honoraires de syndic, gros travaux, remplacement d'équipements, assurance du bailleur. L'électricité du logement privé est à la charge du locataire (abonnement personnel) — SP F947.

### [PRODUIT]
Codifier l'annexe comme une table de données fermée (8 rubriques × postes), avec un contrôle de saisie qui **refuse** tout poste absent de l'annexe. Interdire la saisie libre d'un libellé de charge.

### [INCONNU]
Aucun texte primaire ne définit le **libellé exact** des rubriques à afficher ni le **niveau de détail** attendu d'un décompte. Le produit doit.documenter sa nomenclature comme un choix de design.

---

## 2. LOCATION MEUBLÉE — forfait de charges

### [JURIDIQUE]
Art. 25-10 : les charges sont récupérées **au choix des parties et tel que prévu par le contrat** :
1° soit dans les conditions de l'art. 23 (provisions + régularisation) ;
2° soit sous forme de **forfait versé simultanément au loyer**, dont le montant et la périodicité sont définis au contrat, **qui ne peut donner lieu à complément ni à régularisation ultérieure**.

Règles du forfait : fixé **en fonction des montants exigibles en application de l'art. 23** ; révisable chaque année **aux mêmes conditions que le loyer principal** ; **ne peut pas être manifestement disproportionné** au regard des charges dont le locataire ou le précédent locataire se serait acquitté.

**Bail mobilité** : le forfait est une **obligation**, non une option (SP F947 et SP F34759 : « les charges locatives sont payées […] sous la forme d'un forfait versé simultanément au loyer »). L'ANIL confirme : « pour un bail mobilité, c'est même une obligation ».

Colocation : art. 8-1 V aligne la colocation sur ce choix.

**Postes couverts** : ce sont ceux de l'annexe 87-713, puisque le forfait est fixé « en fonction des montants exigibles […] en application du même article 23 ». Le forfait est donc **une agrégation figée de la liste fermée**, pas une liste distincte.

### [PRODUIT]
Graphe de décision à 3 entrées (vide / meublé / mobilité) → mode de paiement. Pour le forfait : champ de saisie du montant ; le produit calcule un **plancher de conformité** à partir de la charge du précédent locataire quand cette donnée existe. Le dépassement du seuil « manifestement disproportionné » est un contrôle produit, pas une règle chiffrée par la loi.

### [INCONNU]
Aucun seuil numérique de disproportion n'est fixé par un texte. **Ne pas en inventer un** : exposer le ratio et laisser l'utilisateur décider, ou renvoyer vers l'ADIL.

---

## 3. PROVISIONS POUR CHARGES

### [JURIDIQUE]
Art. 23 : « Les charges locatives **peuvent** donner lieu au versement de provisions et doivent, en ce cas, faire l'objet d'une régularisation annuelle. » → les provisions sont **facultatives**, la régularisation est **obligatoire** dès lors qu'une provision est versée.

**Référence de justification** (deux sources cumulatives) : « Les demandes de provisions sont justifiées par la communication de **résultats antérieurs arrêtés lors de la précédente régularisation** et, lorsque l'immeuble est soumis au statut de la copropriété ou lorsque le bailleur est une personne morale, par le **budget prévisionnel**. »

SP F947 confirme : les provisions sont fixées « en se fondant sur le budget prévisionnel et les résultats antérieurs arrêtés lors de la précédente régularisation ».

Loyer et charges sont deux termes distincts : les charges sont des « sommes accessoires au loyer principal » (art. 23) — ne jamais les fusionner dans un loyer TTC.

### [CALCUL]
Provision mensuelle = (base de justification ÷ périodicité) × part du locataire. Le choix de la référence (résultats antérieurs N-1, budget prévisionnel, ou les deux) est **[PRODUIT]**, l'obligation de fonder sur ces éléments étant **[JURIDIQUE]**.

### [INCONNU]
Aucun texte ne fixe le **montant** de la provision, ni sa révision, ni le lissage. **INCONNU** = choix bailleur.

---

## 4. RÉGULARISATION ANNUELLE

### [JURIDIQUE]
Art. 23 : « doivent […] faire l'objet d'une **régularisation annuelle** ». SP F947 : « Les charges doivent être régularisées **au moins 1 fois par an** ».

Forme du décompte (art. 23) : « **Un mois avant cette régularisation**, le bailleur en communique au locataire le **décompte par nature de charges** ainsi que, dans les immeubles collectifs, le **mode de répartition entre les locataires** et, le cas échéant, une **note d'information** sur les modalités de calcul des charges de chauffage et d'eau chaude sanitaire collectifs et sur la consommation individuelle de chaleur et d'eau chaude sanitaire du logement. »

ADIL 94 : « à défaut, le bailleur ne saurait obtenir le paiement de l'arriéré de charges. »

Art. 6-2 : en immeuble équipé d'une installation centrale avec dispositifs d'individualisation télé-relevables (CCH art. L. 174-2), le bailleur transmet au locataire l'évaluation de sa consommation de chaleur, froid et ECS. En copropriété, transmission des informations reçues au titre de l'art. 24-9 de la loi n° 65-10.

### [PRODUIT]
Écran de décompte : ventilation par nature, provisions versées, dépenses réelles, solde. Alerte à J-30 (le mois qui précède est une obligation légale, pas un simple rappel produit).

### [CALCUL]
Solde = dépenses réelles imputables au locataire − provisions versées sur la même période.

---

## 5. ENTRÉE ET SORTIE EN COURS DE PÉRIODE (prorata temporis)

### [JURIDIQUE]
**Aucune source primaire consultée ne fixe la méthode de calcul du prorata temporis.** L'art. 23 impose la régularisation annuelle et le décompte par nature, mais ne traite ni le prorata, ni le décompte des jours.

La proratisation est **unanimement pratiquée** par les bailleurs et mentionnée dans la documentation ADIL, mais c'est une **convention de calcul**, pas une règleLegifrance.

### [INCONNU] — deux points précis
1. **Base de calcul** (jours calendaires / mois commencés / 365 vs 366) : **INCONNU**, aucun texte primaire.
2. **Sort du jour d'entrée et du jour de sortie** (comptés ou non) : **INCONNU**, aucun texte primaire.

### [PRODUIT] — à assumer explicitement comme tel
Le produit DOIT choisir une convention et l'afficher dans le décompte (« prorata selon la convention X du produit »). Le choix doit être :
- paramétrable (jours vs mois) ;
- tracé dans le décompte remis au locataire ;
- présenté comme **convention de gestion**, jamais comme une règle légale.

Règle de conception à retenir : le prorata doit porter sur **l'assiette** (dépenses imputables à la période d'occupation) et être appliqué de façon symétrique aux provisions. Appliquer le prorata aux seules dépenses sans l'appliquer aux provisions déjà versées produit un double biais.

---

## 6. LOCAUX MIXTES HABITATION / COMMERCE

### [JURIDIQUE]
L'arrêté du 27 août 2012 porte expressément sur les « immeubles collectifs **à usage d'habitation ou à usage professionnel et d'habitation** » et règle la détermination individuelle de la quantité de chaleur/froid et la répartition des frais de chauffage et de refroidissement. Il s'applique donc aussi aux immeubles mixtes.

ADIL 94 : le décret 87-713 « énumère les charges récupérables pour les locations à usage d'habitation **ou mixte** d'habitation et professionnel soumises aux dispositions de la loi du 6 juillet 1989 », et son énumération « reste limitative ».

Logique commune : art. 23 exige des services dont le locataire **profite directement** et une justification des dépenses. Une charge propre à l'activité professionnelle du bailleur n'est pas récupérable.

### [PRODUIT]
Le produit doit **distinguer deux périmètres** dans un immeuble mixte : part habitation et part professionnelle/commerciale. Seule la part habitation entre dans l'assiette des charges récupérables.

### [INCONNU]
Aucune clé de répartition légale entre les deux périmètres dans un immeuble mixte **n'est lue dans le texte** : elle relève du droit de la copropriété (règlement, quotes-parts) et de l'organisation interne du bailleur. **INCONNU** côté charges locatives — le produit doit exiger que l'utilisateur fournisse la clé, sans la fabriquer.

---

## 7. TANTIÈMES DE COPROPRIÉTÉ

### [JURIDIQUE]
Les tantièmes sont un concept de **droit de la copropriété**, non de la loi du 6 juillet 1989. SP F2590 (vérifié 18/02/2026) :
- le **règlement de copropriété** répartit les charges entre charges générales et charges spéciales ;
- les charges d'administration, conservation et entretien des parties communes sont réparties **proportionnellement à la valeur relative du lot** (consistance, superficie, situation), sans tenir compte de l'utilisation ;
- les charges de **services collectifs et équipements communs** sont réparties selon l'**utilité objective** (possibilité d'usage) — un copropriétaire paie même s'il n'utilise pas ;
- le règlement de copropriété **fixe la quote-part de chaque lot** dans chaque catégorie et indique la méthode de calcul des quotes-parts de parties communes.

Loi 89-462 art. 23 n'exige que la communication du « **mode de répartition entre les locataires** » dans les immeubles collectifs — donc la **clé** doit être communiquée, mais elle n'est pas créée par la loi locative.

### [PRODUIT]
Le produit consomme une **clé de répartition** (quote-part ou clé du syndic) et affiche le mode de répartition dans le décompte. Il ne calcule pas de tantième : il n'a ni l'état daté, ni le règlement de copropriété.

### [INCONNU] — point explicitement demandé
**Un bailleur non copropriétaire n'a pas de tantièmes.** Il n'existe aucun « tantième » hors copropriété : la notion n'a pas de base juridique dans ce cas. Le produit doit donc **ne jamais synthétiser de tantième** hors copropriété. Dans un immeuble en copropriété mais détenu par un bailleur non copropriétaire (cas d'une division), il n'est pas non plus copropriétaire → **pas de tantièmes pour ce bailleur** ; la répartition se fait selon les indications du syndic transmises par le bailleur.

Conséquence produit : deux régimes distincts — (a) bailleur copropriétaire : clé de quote-part ; (b) bailleur non copropriétaire : **clé contractuelle libre** saisie ou importée. Ne pas confondre les deux.

---

## 8. ARRONDI D'UNE QUOTE-PART EN EUROS

### [INCONNU] — point explicitement demandé
**Aucun texte primaire ne prescrit de règle d'arrondi pour une quote-part de charges en euros.** Recherche menée sur : décret 87-713 (annexe + art. 2), loi 89-462 art. 23 / 25-10 / 8-1 / 6-2, arrêté 27/08/2012, SP F947, SP F2590, SP F479, ADIL 94. Aucun ne mentionne d'arrondi, de centime, ni de mode d'arrondi.

### [PRODUIT] — ce qui suit est une décision de design, rien de plus
- Conserver le calcul **en pleine précision** (nombre décimal) tout au long de la chaîne.
- N'arrondir qu'à l'affichage et au format monétaire, en fin de chaîne.
- Méthode retenue par le produit : arrondi **au centime** (2 décimales), aligné sur la convention de la comptabilité française.
- Afficher la mention « montants arrondis au centime — convention d'affichage du produit » dans le décompte.
- Ne jamais présenter cet arrondi comme une règle légale.

---

## 9. SOLDE — qui paie quoi, dans quel délai

### [JURIDIQUE]
- Provisions **supérieures** aux dépenses réelles : le bailleur **doit reverser le trop-perçu** (SP F947 ; l'art. 23 n'explicite pas le remboursement, il découle de la justification des charges).
- Provisions **inférieures** aux dépenses réelles : le bailleur **demande un complément** (SP F947).
- Prescription : **3 ans** pour réclamer un impayé de charges comme pour demander le remboursement d'un trop-perçu — SP F479 et SP F947 (« ce délai s'applique aussi au locataire qui a payé trop de charges »).
- Régularisation tardive possible même en cas d'**oubli, ignorance ou négligence** (SP F947) ; le juge des contentieux de la protection peut<refuser un rappel jugé **déloyal, brutal** et consécutif à une faute du bailleur (même source).
- Si la régularisation n'a pas été faite **avant la fin de l'année civile**, le locataire peut exiger un **paiement échelonné sur 12 mois** (du 1er janvier au 31 décembre suivant l'année d'exigibilité), par lettre recommandée AR (SP F947, modèle R74682).

### Point dur
**Aucun texte primaire consulté ne fixe un délai de paiement du solde par le locataire.** L'obligation « un mois avant la régularisation » concerne l'**envoi du décompte**, pas le règlement.

### [INCONNU]
Délai de règlement du solde exigible du locataire : **INCONNU**.

### [PRODUIT]
Ne pas afficher de « délai légal de paiement » du solde : cela inventerait une obligation. Afficher à la place le délai de **paiement échelonné sur 12 mois** (qui, lui, est prévu) et l'avertissement sur le caractère déloyal d'un rappel tardif.

---

## 10. JUSTIFICATIFS

### [JURIDIQUE]
Art. 23, deux obligations distinctes :

1. **Obligation de communication anticipée** : « Un mois avant cette régularisation, le bailleur en communique au locataire le décompte par nature de charges ainsi que […] le mode de répartition […] et, le cas échéant, une note d'information […] ».
2. **Obligation de mise à disposition** : « **Durant six mois** à compter de l'envoi de ce décompte, les pièces justificatives sont tenues, **dans des conditions normales**, à la disposition des locataires. »

SP F947 : « Durant les 6 mois suivant l'envoi du décompte, le propriétaire doit tenir à la disposition du locataire l'ensemble des documents justificatifs. » ADIL 94 précise que ce délai est passé de 1 mois à 6 mois par la loi ALUR, et que la transmission dématérialisée du récapitulatif est possible depuis le 1er septembre 2015.

**Sur demande** du locataire, le bailleur doit transmettre le récapitulatif des charges du logement, par mail ou courrier (art. 23 dernier alinéa ; SP F947). Informations complémentaires obligatoires : facture d'eau annuelle et informations sur la qualité de l'eau en immeuble sans contrat individualisé (SP F947) ; mesures de consommation en immeuble à installation centrale (art. 6-2).

ADIL 94 : sans communication du décompte dans le délai, « le bailleur ne saurait obtenir le paiement de l'arriéré de charges ».

### [PRODUIT]
Conservation documentaire : categoriaiser les pièces (factures, contrats d'entretien, décompte de copropriété, note d'information chauffage) et tracer date d'envoi du décompte + **compteur 6 mois**. Le délai de 6 mois est une **[JURIDIQUE]** ; le système de classement et les notifications sont des choix produit.

### [INCONNU]
Le contenu exact du « récapitulatif des charges du logement » à la demande du locataire et le formalisme des pièces justificatives : **INCONNU**, non détaillés par les textes consultés.

---

## RÉCAPITULATIF DES INCONNUS (à ne jamais trancher dans le produit)

1. Méthode et base du prorata temporis (entrée/sortie en cours de période).
2. Sort du jour d'entrée et du jour de sortie dans le décompte des jours.
3. Seuil chiffré de « disproportion manifeste » du forfait meublé.
4. Clé de répartition habitation / profession dans un immeuble mixte (hors copropriété).
5. Règle d'arrondi officielle d'une quote-part en euros (aucune n'existe).
6. Délai légal de règlement du solde exigible du locataire.
7. Contenu formel du récapitulatif de charges à la demande du locataire.

---

## NOTES D'EXÉCUTION

- Aucun texte primaire n'a été déduit d'un blog. Les résultats de recherche 반환ant massivement des
  sites commerciaux ont été écartés ; seules les pages Legifrance, Service-Public (DILA), ANIL et ADIL
  ont été retenues, et le texte a été lu directement pour chaque citation.
- Points 8 et 5 sont les plus sensibles : ce sont les deux endroits où un produit peut transformer
  une convention de marché en prétendue obligation légale. Les deux doivent rester explicitement
  étiquetés « convention produit » dans l'interface.