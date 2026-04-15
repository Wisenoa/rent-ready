/**
 * FAQ data for SEO schema endpoints.
 * Maps page slugs to their FAQ content.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  slug: string;
  faqs: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Prix et forfaits",
    slug: "pricing",
    faqs: [
      {
        question: "RentReady est-il gratuit ?",
        answer:
          "RentReady propose un essai gratuit de 14 jours sans carte bancaire. Ensuite, le forfait commence à 15€/mois pour les propriétaires de 1 à 3 biens. Les forfaits supérieurs sont disponibles pour les gestionnaires avec plus de biens.",
      },
      {
        question: "Puis-je annuler à tout moment ?",
        answer:
          "Oui, vous pouvez résilier votre abonnement à tout moment depuis votre espace Settings > Abonnement. Aucun frais de résiliation, aucun engagement de durée.",
      },
      {
        question: "Quels modes de paiement acceptez-vous ?",
        answer:
          "Nous acceptons les cartes bancaires (Visa, Mastercard, CB) et les virements SEPA. Le paiement est sécurisé via Stripe.",
      },
      {
        question: "Y a-t-il des frais cachés ?",
        answer:
          "Non. Le prix affiché est le prix final. Les mises à jour légales, le support et les nouvelles fonctionnalités sont incluses dans votre abonnement.",
      },
    ],
  },
  {
    title: "Calculateur IRL",
    slug: "calculateur-irl-2026",
    faqs: [
      {
        question: "Qu'est-ce que l'Indice de Référence des Loyers (IRL) ?",
        answer:
          "L'Indice de Référence des Loyers (IRL) est un indice publié chaque trimestre par l'INSEE. Il sert de base légale pour le calcul de la révision annuelle des loyers d'habitation en France. L'IRL plafonne l'augmentation que le bailleur peut appliquer, protégeant ainsi les locataires contre des hausses excessives.",
      },
      {
        question: "Comment calculer la révision annuelle du loyer ?",
        answer:
          "La formule légale est : Nouveau loyer = Loyer actuel × (Nouvel IRL / IRL de référence du bail). Par exemple, pour un loyer de 800 € avec un IRL de référence de 142,06 et un nouvel IRL de 145,78, le nouveau loyer est : 800 × (145,78 / 142,06) = 820,95 €.",
      },
      {
        question: "Quand peut-on appliquer la révision de loyer ?",
        answer:
          "La révision de loyer peut être appliquée à la date anniversaire du bail, chaque année à la date de signature du contrat. Le bailleur doit en informer le locataire par courrier ou email.",
      },
    ],
  },
  {
    title: "Calculateur Depot de Garantie",
    slug: "calculateur-depot-garantie",
    faqs: [
      {
        question: "Quel est le montant maximum du dépôt de garantie ?",
        answer:
          "En France, le dépôt de garantie pour une location vide ne peut pas dépasser 1 mois de loyer hors charges. Pour une location meublée, il ne peut pas dépasser 2 mois de loyer hors charges.",
      },
      {
        question: "Quand rendre le dépôt de garantie ?",
        answer:
          "Le dépôt de garantie doit être restitué dans un délai maximal de 2 mois à compter de la remise des clés par le locataire. Passé ce délai, des intérêts automatiques s'appliquent.",
      },
    ],
  },
];

export function getFaqsBySlug(slug: string): FaqItem[] {
  const group = faqGroups.find((g) => g.slug === slug);
  return group?.faqs ?? [];
}
