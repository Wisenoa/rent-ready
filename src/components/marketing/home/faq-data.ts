export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Visible on the homepage and published as FAQPage data. Each answer is checked
 * against the product: change the code or the answer, never only one of them.
 */
export const HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Pourquoi quitter un tableur Excel pour Lokna ?",
    answer:
      "Un tableur garde ce que vous y écrivez, mais il ne sait pas ce qui est dû ce mois-ci, ne recalcule pas seul le reste d'un loyer payé en deux fois et ne prépare pas la quittance. Lokna part du bail pour le faire, et met en évidence ce qui demande votre attention.",
  },
  {
    question: "Comment fonctionne l'essai gratuit de 14 jours ?",
    answer:
      "Vous créez votre compte avec votre nom et votre e-mail, sans carte bancaire. Pendant 14 jours, vous ajoutez vos logements, vos locataires et vos baux, et vous utilisez le suivi en conditions réelles. Vous choisissez une formule ensuite, si Lokna vous convient.",
  },
  {
    question: "Que se passe-t-il en cas de versement partiel d'un locataire ?",
    answer:
      "Lokna enregistre le versement et calcule le solde restant dû. Vous obtenez un reçu de paiement partiel ; la quittance n'est délivrée qu'une fois le loyer et les charges réglés en totalité, comme le prévoit l'article 21 de la loi du 6 juillet 1989.",
  },
  {
    question: "Mes données d'encaissement sont-elles exportables ?",
    answer:
      "Oui. Depuis l'espace Analyse fiscale, vous exportez vos loyers encaissés au format CSV, pour votre déclaration ou pour votre comptable.",
  },
];
