# Fonctionnalités réellement présentes

Inventaire du checkout, pas attestation d’exploitation. Le détail des commandes et résultats est dans QA-REPORT.md.

| Fonction | Implémentation principale | État vérifiable |
| --- | --- | --- |
| Inscription / session | register-form, register-actions, auth-server, Better Auth | Code présent ; validation et essai corrigés ; inscription/session exercées en navigateur et essais en base isolée. Stripe indépendant. |
| Google OAuth | bouton d’inscription sans socialProviders configuré | Non configuré dans le code audité ; bouton désormais explicitement indisponible. |
| Mot de passe oublié | API email/send-password-reset, auth-server, forgot-password/reset-password | Parcours corrigé ; fournisseur indispensable ; fonctionnement externe réel non vérifié. |
| Bien | properties, PropertyForm, property-actions/API, Property | Création/modification/suppression logique existantes ; propriétaire scoping ; tests d’isolation existants. |
| Locataire | tenants, TenantForm, tenant-actions/API, Tenant | Création/modification existantes ; suppression d’un dossier lié refusée pour préserver l’historique. |
| Assistant | OnboardingWizardV2, OnboardingWizardHost | Existe sur les écrans de configuration. Le dashboard actuel privilégie le CTA d’ajout de logement ; l’ancienne documentation d’ouverture automatique n’est pas exacte. |
| Bail | StandaloneLeaseForm, LeaseForm, lease-actions/API, Lease | Existe ; relations obligatoires et validation consolidées ; échéances initiales atomiques avec création. |
| Colocation | Lease.tenantId unique par relation | Pas de nouvelle colocation développée ; ne pas prétendre à un modèle multi-preneurs complet. |
| Échéances | domain/rent-periods, generate-rent-periods, Transaction(paidAt=null) | Existe, idempotence et index partiel déjà en place ; génération mensuelle et prorata testés. |
| Paiements | services/rent-payments, period-settlement, payment dialog/API | Partiels, versements multiples, plafond du solde et annulation existent ; concurrence et montants historiques corrigés, tests PostgreSQL réels. |
| Trop-perçu | recordRentPayment | Refus explicite au-delà du solde ; pas d’affectation inventée pour les 80 € supplémentaires. |
| Remboursement | cancelRentPayment | Correction/annulation conservant la ligne ; pas un moteur de remboursements bancaires ou Stripe. |
| Reçu / quittance | quittance-actions, quittance-pdf-server, Document | Distinction existante, total acquitté intégral corrigé, montants figés, PDF archivé et réutilisé, stockage inline de secours. Tests des octets et lecture de PDF réels ; aucun envoi automatique prétendu. |
| Portail locataire | portal-actions et routes portail à token | Code présent, tests d’accès existants ; paiement Stripe confirmé branché au domaine. Exploitation non vérifiée. |
| Abonnement | subscription-gate, subscription-access, Stripe/webhook | Contrôle technique corrigé ; anciens essais préservés ; quotas de plan incomplets. |
| Banque | webhook bank, bank-reconciliation, BankConnection | Code et mocks/tests présents ; configuration et synchronisation réelles non vérifiées. Aucun accès au fournisseur effectué. |
| Email | email/service, sender, Resend, EmailLog | Configuration locale existante non utilisée ; QA sans clé ; échec d’envoi désormais explicite et routes sensibles autorisées par propriétaire. |
| Stockage | storage, MinIO, Document.content | Code présent ; QA sans MinIO, PDF inline ; service de production non interrogé. |
| Jobs | api/cron et email/cron-dispatch | Routes avec secret et tests ; planification effective non vérifiable sans audit d’exploitation autorisé. |
| Analytics | collector interne + AuditLog | Nouveau contrat filtré et soumis au consentement ; PostHog n’avait aucun appelant ; Vercel conditionnel n’atteste pas une collecte dans Docker. Aucun taux réel calculé. |
| SEO | sitemap/robots, routes générées, métadonnées, JSON-LD | Conservé ; seules nouvelles routes de récupération exclues de l’indexation. |

Les 16 outils conservés, avec les mêmes URLs et composants : générateur quittance, modèle quittance PDF, IRL, charges locatives, relance, congé pour vente, prorata/loyer au m², dépôt de garantie, préavis, état des lieux, surface habitable, rendement, prêt, plus-value, LMNP, Jeanbrun. Les deux quittanciers partagent QuittanceTool. Les autres moteurs, contenus SEO, liens préremplis et modèles PDF ne sont pas redessinés.
