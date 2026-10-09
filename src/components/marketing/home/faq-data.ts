export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Pourquoi quitter un tableur Excel pour RentReady ?",
    answer:
      "Un tableur ne prépare pas vos quittances au format légal, n'alerte pas sur les révisions IRL et oblige à pointer vos relevés à la main. RentReady automatise ces vérifications et ne signale que les anomalies.",
  },
  {
    question: "Comment fonctionne l'essai gratuit de 14 jours ?",
    answer:
      "Création de compte immédiate avec votre nom et email. Aucune carte bancaire requise. Vous configurez vos logements et testez l'ensemble du suivi en conditions réelles sans engagement.",
  },
  {
    question: "Que se passe-t-il en cas de versement partiel d'un locataire ?",
    answer:
      "RentReady édite un reçu d'acompte avec le solde restant dû (loi de 1989 art. 21). La quittance définitive n'est disponible qu'une fois le loyer intégralement réglé.",
  },
  {
    question: "Mes données d'encaissement sont-elles exportables ?",
    answer:
      "Oui. En un clic, vous téléchargez un export CSV structuré de vos loyers et versements, directement utilisable pour votre déclaration fiscale ou votre comptable.",
  },
];
