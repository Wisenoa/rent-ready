import { PLANS, SITE_NAME, formatEntryPrice, formatProPrice } from "@/data/entity";

/**
 * Visible FAQ of /gestion-locative, also published as FAQPage structured data.
 * Each answer must stay true to the product: check the code before adding one.
 */

function planLimit(id: "starter" | "pro"): number {
  const limit = PLANS.find((p) => p.id === id)?.properties;
  if (typeof limit !== "number") {
    throw new Error(`Plan ${id} has no property limit`);
  }
  return limit;
}

export type FaqItem = { question: string; answer: string };

export const GESTION_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'un logiciel de gestion locative ?",
    answer: `C'est un logiciel qui rassemble ce qu'un propriétaire bailleur gère d'habitude dans un tableur et des dossiers de PDF : les logements, les locataires, les baux, les loyers attendus, les paiements reçus et les documents qui en découlent. ${SITE_NAME} s'en sert pour savoir, chaque mois, qui devait payer, qui a payé et ce qui reste dû.`,
  },
  {
    question: `À qui s'adresse ${SITE_NAME} ?`,
    answer: `Aux propriétaires qui louent eux-mêmes leurs logements, généralement de 1 à 10, en location vide ou meublée. ${SITE_NAME} n'est pas un logiciel d'agence : il va à l'essentiel du suivi locatif.`,
  },
  {
    question: "Que se passe-t-il si mon locataire ne paie qu'une partie du loyer ?",
    answer: `${SITE_NAME} enregistre le versement, calcule le reste dû et vous permet d'émettre un reçu de paiement partiel. La quittance n'est délivrée qu'une fois le loyer et les charges réglés en totalité, comme le prévoit l'article 21 de la loi du 6 juillet 1989. Un loyer payé en plusieurs fois est soldé dès que la somme des versements atteint le montant dû.`,
  },
  {
    question: "Les quittances sont-elles envoyées automatiquement ?",
    answer: `Non. La quittance est générée lorsque vous enregistrez le paiement qui solde le mois, à condition que votre adresse de bailleur soit renseignée dans votre profil. Vous la téléchargez en PDF quand vous en avez besoin et la transmettez vous-même à votre locataire : ${SITE_NAME} ne l'envoie pas à votre place.`,
  },
  {
    question: "Faut-il connecter son compte bancaire ?",
    answer: `Non. Vous enregistrez vous-même les paiements reçus, en quelques secondes depuis le suivi du mois. Tout le calcul des loyers, du reste dû et des documents fonctionne sans connexion bancaire.`,
  },
  {
    question: `Combien coûte ${SITE_NAME} ?`,
    answer: `La formule Starter coûte ${formatEntryPrice()} pour ${planLimit("starter")} logements au plus. La formule Pro coûte ${formatProPrice()} et va jusqu'à ${planLimit("pro")} logements. L'inscription commence par 14 jours d'essai, sans carte bancaire.`,
  },
  {
    question: "Faut-il connaître la réglementation locative ?",
    answer: `Il vaut mieux en connaître les grandes lignes, mais ${SITE_NAME} applique les règles courantes pour vous : les quittances reprennent les mentions prévues par la loi du 6 juillet 1989, et la révision de loyer se calcule avec l'indice de référence des loyers publié par l'INSEE. Pour les règles propres à votre commune, consultez la page de votre ville.`,
  },
];
