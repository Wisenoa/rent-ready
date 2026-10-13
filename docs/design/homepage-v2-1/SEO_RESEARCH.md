# Recherche SEO

Sources : recherche web (outil de recherche de la session) et lecture directe des pages d'accueil concurrentes (title, description et H1 relevés par `curl` le 13/10/2026). **Aucun volume de recherche n'est disponible dans cet environnement** : pas de Search Console, d'outil de mots-clés ni de données Lokna. Les priorités ci-dessous reposent sur l'intention et sur la page de résultats, pas sur des volumes.

## Intentions observées
| Requête | Intention | Pages qui ressortent |
| --- | --- | --- |
| logiciel gestion locative | Comparer des solutions | Comparatifs et annuaires (La Fabrique du Net, Capterra, GetApp, Manda) et pages produit d'éditeurs |
| logiciel gestion locative gratuit | Trouver une offre gratuite | Comparatifs « gratuits » ; TurboTenant et Stessa (anglo-saxons) ; offres freemium françaises (lokt.fr : 1 logement) |
| gestion locative en ligne / particulier | Gérer soi-même, sans agence | **Pages d'accueil d'éditeurs** : BailFacile (title « Gestion Locative en Ligne », H1 « Gestion locative en ligne »), Gererseul (title « Gestion locative en ligne »), Smartloc (« sans agence ») |
| outil gestion locative / comparatif 2026 | Choisir un outil | Comparatifs rédigés par des éditeurs (BailFacile, Gererseul, Manda) |
| quittance de loyer (modèle gratuit) | Obtenir un document tout de suite | Modèles et générateurs (SeLoger, Selectra, LegalPlace, Resilier) |
| suivi loyers / logiciel propriétaire bailleur | Gérer ses encaissements | Pages produit d'éditeurs |

## Constats sur lokna.fr (production)
- **Cannibalisation :** la homepage (« Logiciel de gestion locative pour propriétaires bailleurs ») et `/gestion-locative` (« Logiciel de gestion locative pour propriétaires bailleurs | Lokna ») ont le même titre et visent la même requête.
- **Marque absente du title de la homepage :** le gabarit `%s | Lokna` du layout racine ne s'applique pas à la page racine elle-même.
- **Concurrents :** ils placent « gestion locative en ligne » sur leur page d'accueil et laissent le terme « logiciel » aux comparatifs et aux pages dédiées.
- **Requêtes « gratuit » :** elles demandent une réponse honnête. Lokna n'a pas d'offre gratuite permanente, mais propose des outils gratuits sans compte.
- **Requêtes « quittance de loyer » :** elles relèvent des outils et de `/quittances`, pas de la homepage.
