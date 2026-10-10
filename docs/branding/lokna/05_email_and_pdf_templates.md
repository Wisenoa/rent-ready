# Templates Transactionnels & Génération de Documents — Lokna

Ce document recense les gabarits d'emails transactionnels et les moteurs de génération de documents juridiques et financiers (PDF / Factur-X) mis à jour pour Lokna.

---

## 1. Emails Transactionnels (React Email)

Les gabarits ont été harmonisés dans `emails/` et `src/emails/`. Ils partagent une identité uniforme :
- **Expéditeur par défaut** : `Lokna <notifications@lokna.fr>`
- **Email de support** : `support@lokna.fr`
- **Email commercial/légal** : `contact@lokna.fr`, `dpo@lokna.fr`

| Template | Fichiers Source | Objet / Contenu Rebrandé |
| :--- | :--- | :--- |
| **Bienvenue** | `emails/welcome.tsx`, `src/emails/welcome.tsx` | "Bienvenue sur Lokna — Votre espace de gestion locative est prêt" |
| **Lien Magique** | `emails/magic-link.tsx` | "Votre lien de connexion Lokna" |
| **Réinitialisation Mot de Passe** | `src/emails/password-reset.tsx` | "Réinitialisation de votre mot de passe Lokna" |
| **Invitation Locataire** | `emails/tenant-invitation.tsx`, `src/emails/tenant-invitation.tsx` | "Accédez à votre espace locataire sur Lokna" / Signature "L'équipe Lokna" |
| **Rappel d'Échéance / Impayé** | `emails/payment-reminder.tsx`, `src/emails/payment-reminder.tsx` | En-tête "Lokna", mention légale : "Cet email a été envoyé via Lokna par [Bailleur]" |
| **Expiration de Bail** | `emails/lease-expiry.tsx`, `src/emails/lease-expiry.tsx` | En-tête "Lokna", avertissement et footer d'automatisation Lokna |

---

## 2. Génération de Documents PDF & Factur-X

La conformité juridique et financière est préservée sans compromis.

| Moteur de Génération | Fichier Source | Éléments & Métadonnées Rebrandés |
| :--- | :--- | :--- |
| **Générateur de Quittances de Loyer** | `src/lib/quittance-generator.tsx` | Mentions de pied de page : `"Document généré par Lokna — Gestion Locative Intelligente"`. Respect strict de l'article 21 de la loi du 6 juillet 1989 (distinction loyer / charges, solde nul). |
| **Générateur de Contrats de Bail** | `src/lib/bail-pdf-generator.tsx` | En-tête et bas de page : `"Document généré par Lokna — Contrat de location conforme loi ALUR"`. |
| **Moteur Factur-X / PDF/A-3** | `src/lib/facturx-pdf.ts` | Métadonnées XMP du PDF/A :<br>• `Producer: "Lokna PDF Generator"`<br>• `Creator: "Lokna Platform"` |
| **Lettres de Relance & Mises en Demeure** | `src/app/api/reminders/letter/route.tsx` | Sous-titre : `"Lokna - Gestion Locative"`, bas de page : `"Document généré par Lokna - lokna.fr"`. |

---

## 3. Garanties d'Immuabilité

1. **Aucun calcul financier à la volée dans les PDF** : Les montants, dates, indices IRL et décomptes sont pré-calculés et validés par le domaine TypeScript (`decimal.js`) avant rendu.
2. **Reproductibilité des documents archivés** : Les quittances historisées téléchargées depuis le portail locataire ou l'espace bailleur sont les copies exactes des octets archivés, garantissant la validité probatoire en cas de litige.
