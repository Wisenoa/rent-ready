import { formatEntryPrice, SITE_NAME, E_REPORTING_YEAR } from "@/data/entity";

export interface FaqItem {
  question: string;
  answer: string;
}

export const GESTION_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'un logiciel de gestion locative ?",
    answer:
      "C'est un logiciel qui rassemble, pour un propriétaire bailleur, ce qui se faisait auparavant dans un tableur et une pile de PDF : les biens, les locataires, les baux, les loyers attendus, les paiements reçus, et les documents qui en découlent. Son rôle n'est pas de remplacer le bailleur, mais de savoir à chaque instant qui devait payer, qui a payé, ce qui manque et quelle échéance approche.",
  },
  {
    question: `À qui s'adresse ${SITE_NAME} ?`,
    answer:
      `Au propriétaire bailleur indépendant français qui gère lui-même un petit parc, généralement de 1 à 10 logements, et qui ne veut pas apprendre un logiciel d'agence complexe. ${SITE_NAME} ne vise ni les syndics ni les agences immobilières : leurs contraintes ne sont pas les nôtres.`,
  },
  {
    question: "En quoi est-ce différent d'un tableur ?",
    answer:
      `Un tableur enregistre ce que vous saisissez et ne calcule rien de fiable : une quittance y est recopiée, un prorata est approché, une révision de loyer se calcule sur un indice recopié manuellement. ${SITE_NAME} déduit l'état à partir des données du bail : le montant du mois, la part déjà payée, le reste dû, la date anniversaire de la révision. Si une saisie manque, rien ne se recalcule seul dans Excel — c'est sa limite structurelle.`,
  },
  {
    question: `Comment fonctionne le parcours de gestion dans ${SITE_NAME} ?`,
    answer:
      `Un bien, un locataire, un bail, un loyer attendu chaque mois. ${SITE_NAME} sait alors qui doit payer quoi, et quand. À chaque paiement enregistré, il calcule l'état réel du mois — payé, partiel, impayé — et génère la quittance correspondante. Le propriétaire voit ce qui est réglé, ce qui ne l'est pas, et ce qui approche.`,
  },
  {
    question: `Combien coûte ${SITE_NAME} ?`,
    answer: `À partir de ${formatEntryPrice()} pour le plan Starter, qui couvre jusqu'à 3 biens. Le plan Pro, à 15 €/mois, couvre jusqu'à 10 biens et ajoute l'OCR des factures artisans, la conformité Factur-X et la relance automatique. Essai gratuit 14 jours, sans carte bancaire.`,
  },
  {
    question: "Faut-il connaître la réglementation locative ?",
    answer: `Non, ${SITE_NAME} applique les règles pour vous :
• la quittance respecte les mentions obligatoires de l'article 21 de la loi du 6 juillet 1989 ;
• le dépôt de garantie est plafonné selon le type de bail (1 mois nu, 2 mois meublé) ;
• la révision de loyer utilise l'Indice de Référence des Loyers (IRL) officiel publié par l'INSEE ;
• les factures respectent le format Factur-X et l'e-reporting B2C ${E_REPORTING_YEAR}.`,
  },
];
