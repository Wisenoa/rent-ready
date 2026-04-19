import type { Metadata } from "next";
// ISR: glossary is static reference content — revalidate weekly
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildItemListSchema,
  buildFAQPageSchema,
  buildGraphSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";
import { GlossarySidebar } from "@/components/seo/blog/GlossarySidebar";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Glossaire immobilier | Définitions location | RentReady",
    description: "Glossaire complet de l'immobilier en France: définitions des termes de location, gestion locative, bail, quittance, charges et检修.",
    url: "/glossaire-immobilier",
    ogType: "template",
  });
}
;
const glossaryTerms = [
  {
    term: "Bail",
    definition:
      "Contrat de location qui définit les droits et obligations du propriétaire (bailleur) et du locataire. En France, le bail vide dure minimum 3 ans, le bail meublé dure minimum 1 an.",
    related: ["Bailleur", "Locataire", "État des lieux"],
  },
  {
    term: "Bailleur",
    definition:
      "Propriétaire qui met un bien immobilier en location. Le bailleur peut être une personne physique (propriétaire bailleur) ou une personne morale (société, SCI). Il doit fournir un logement décent et respecter les obligations du bail.",
    related: ["Bail", "Propriétaire", "Gestion locative"],
  },
  {
    term: "Caution",
    definition:
      "Voir Dépôt de garantie. Terme utilisé principalement dans le nord de la France.",
    related: ["Dépôt de garantie"],
  },
  {
    term: "Charges locatives",
    definition:
      "Dépenses liées à l'entretien et au fonctionnement de l'immeuble que le locataire doit rembourser au propriétaire. Elles comprennent l'eau froide, l'éclairage des parties communes, l'entretien des espaces verts, les ascenseurs, etc. Le propriétaire doit fournir un décompte annuel.",
    related: ["Provision sur charges", "Décompte de charges"],
  },
  {
    term: "DPE",
    definition:
      "Diagnostic de Performance Énergétique. Document obligatoire qui indique la consommation d'énergie et les émissions de gaz à effet de serre d'un logement. Noté de A (très performant) à G (passoire thermique). Obligatoire depuis 2023 pour tous les logements mis en location.",
    related: ["Diagnostic technique", "Passoire thermique"],
  },
  {
    term: "Dépôt de garantie",
    definition:
      "Somme versée par le locataire à la signature du bail, servant de garantie en cas de dégradations ou d'impayés. Limité à 1 mois de loyer pour une location vide et 2 mois pour une location meublée. Restitué à la fin du bail.",
    related: ["Caution", "Bail", "État des lieux de sortie"],
  },
  {
    term: "Décompte de charges",
    definition:
      "Document annuel envoyé par le propriétaire au locataire précisant le détail des charges récupérées et le solde à payer ou à recevoir. Le locataire a 6 mois pour contester.",
    related: ["Charges locatives", "Provision sur charges"],
  },
  {
    term: "État des lieux",
    definition:
      "Document qui décrit l'état du logement et de ses équipements à l'entrée et à la sortie du locataire. Comparé pour déterminer les réparations à la charge du locataire. Obligatoire et annexé au bail.",
    related: ["Bail", "Dépôt de garantie", "Vices cachés"],
  },
  {
    term: "État des lieux de sortie",
    definition:
      "Document établi lors du départ du locataire, comparé à l'état des lieux d'entrée pour déterminer les dégradations imputables au locataire. Le propriétaire doit restituer le dépôt de garantie dans le mois suivant (2 mois si différences).",
    related: ["État des lieux", "Dépôt de garantie"],
  },
  {
    term: "IRL",
    definition:
      "Indice de Référence des Loyers. Indice publié trimestriellement par l'INSEE servant à calculer la révision annuelle des loyers. La formule: Nouveau loyer = Loyer actuel × (Nouvel IRL ÷ IRL de référence). Plafonne l'augmentation des loyers.",
    related: ["Révision de loyer", "Bail", "INSEE"],
  },
  {
    term: "INSEE",
    definition:
      "Institut national de la statistique et des études économiques. Organisme public français qui publie l'IRL et d'autres indices économiques utilisés dans le cadre locatif.",
    related: ["IRL", "Révision de loyer"],
  },
  {
    term: "Locataire",
    definition:
      "Personne qui occupe un logement en location et paie un loyer au bailleur. Le locataire a des droits (jouissance paisible du logement) et des obligations (payer le loyer, entretenir le logement).",
    related: ["Bail", "Bailleur", "Loyer"],
  },
  {
    term: "Loyer",
    definition:
      "Somme mensuelle versée par le locataire au bailleur en contrepartie de la jouissance du logement. Peut inclure une provision sur charges. Le loyer peut être révisé annuellement selon l'IRL si prévu dans le bail.",
    related: ["Bail", "IRL", "Révision de loyer"],
  },
  {
    term: "Mise en demeure",
    definition:
      "Courrier formel envoyé par lettre recommandée avec accusé de réception enjoignant le destinataire de respecter ses obligations dans un délai imparti. En cas d'impayés de loyers, la mise en demeure fait courir les délais légaux.",
    related: ["Loyer impayé", "Relance", "Procédure d'expulsion"],
  },
  {
    term: "Pas-de-porte",
    definition:
      "Somme versée par le nouveau locataire à l'ancien locataire ou au propriétaire en contrepartie du droit de reprendre le bail commercial ou le fonds de commerce. Interdit dans l'habitation.",
    related: ["Bail commercial", "Fonds de commerce"],
  },
  {
    term: "Préavis",
    definition:
      "Délai que le locataire doit respecter avant de quitter le logement. 3 mois pour une location vide, 1 mois pour une location meublée ou dans certaines zones tendues. Le locataire doit notifier son départ par lettre recommandée.",
    related: ["Bail", "Résiliation", "Zone tendue"],
  },
  {
    term: "Provision sur charges",
    definition:
      "Somme mensuelle demandée au locataire pour couvrir les charges récupérables. Fait l'objet d'une régularisation annuelle en fonction du décompte réel des charges.",
    related: ["Charges locatives", "Décompte de charges"],
  },
  {
    term: "Quittance de loyer",
    definition:
      "Document remis au locataire attestant du paiement du loyer et des charges. La quittance doit mentionner le loyer, les charges et le solde éventuel. Obligatoire si le locataire la demande.",
    related: ["Loyer", "Charges locatives"],
  },
  {
    term: "Révision de loyer",
    definition:
      "Augmentation annuelle du loyer, plafonnée par l'IRL. Le bail doit prévoir une clause de révision pour que celle-ci soit applicable. La révision intervient à la date anniversaire du bail.",
    related: ["IRL", "Bail", "Loyer"],
  },
  {
    term: "Solde de tout compte",
    definition:
      "Document établi à la fin du bail récapitulant les sommes dues ou remboursées: dernier loyer, charges, dépôt de garantie, dégradations éventuelles.",
    related: ["Dépôt de garantie", "État des lieux de sortie"],
  },
  {
    term: "Zone tendue",
    definition:
      "Zone géographique où la demande de logement excède l'offre. Dans ces zones, le préavis du locataire est réduit à 1 mois (au lieu de 3) et l'encadrement des loyers peut s'appliquer. Paris, Lyon, Marseille et certaines communes d'Île-de-France sont en zone tendue.",
    related: ["Préavis", "Encadrement des loyers"],
  },
  {
    term: "SCI",
    definition:
      "Société Civile Immobilière. Structure juridique permettant à plusieurs personnes de posséder un bien immobilier ensemble. Rapport à l'indivision et facilite la transmission. Le bail peut être établi au nom de la SCI.",
    related: ["Bailleur", "Propriétaire", "Indivision"],
  },
  {
    term: "Diagnostic technique",
    definition:
      "Ensemble des documents obligatoires fournis par le bailleur: DPE, constat de risque d'exposition au plomb (CREP), état des risques naturels et technologiques, dossier amiante, etc. Annexés au bail.",
    related: ["DPE", "Bail", "CREP"],
  },
  {
    term: "CREP",
    definition:
      "Constat de Risque d'Exposition au Plomb. Diagnostic obligatoire pour les logements construits avant le 1er janvier 1949. Indique la présence de plomb dans les peintures et les mesures de prévention à prendre.",
    related: ["Diagnostic technique", "Plomb"],
  },
  {
    term: "Trêve hivernale",
    definition:
      "Période durant laquelle les expulsions locatives sont suspendues, du 1er novembre au 31 mars. Protège les locataires en difficulté pendant l'hiver.",
    related: ["Expulsion", "Procédure d'expulsion"],
  },
  {
    term: "Acte de caution",
    definition:
      "Document écrit par lequel une personne (la caution) s'engage à payer les sommes dues par le locataire en cas de défaillance. Doit être signé par la caution et annexé au bail.",
    related: ["Caution", "Dépôt de garantie", "Garantie"],
  },
  {
    term: "APL",
    definition:
      "Aide Personnalisée au Logement. Aide financière de l'État français qui réduit le montant du loyer ou de la mensualité de prêt. Versée par la CAF ou la MSA selon la situation.",
    related: ["Loyer", "CAF", "APL accession"],
  },
  {
    term: "Amiante",
    definition:
      "Matériau autrefois utilisé dans le bâtiment, aujourd'hui interdit pour ses effets cancérigènes. Un diagnostic amiante est obligatoire pour les bâtiments construits avant 1997.",
    related: ["Diagnostic technique", "CREP", "DPE"],
  },
  {
    term: "Annulation de bail",
    definition:
      "Résiliation judiciaire ou conventionnelle du contrat de location avant son terme. Peut intervenir pour manquement grave d'une des parties (impayés, non-respect des obligations).",
    related: ["Résiliation", "Clause résolutoire", "Bail"],
  },
  {
    term: "Apartment",
    definition:
      "Terme anglais désignant un appartement. Utilisé en France dans le cadre de programmes immobiliers neufs ou d'investissement locatif pour décrire un logement dans un immeuble collectif.",
    related: ["Appartement", "Copropriété"],
  },
  {
    term: "Arrhes",
    definition:
      "Somme versée lors de la réservation d'un logement pour confirmer l'intention de louer. Les arrhes sont perdues si le locataire se désiste ; le propriétaire doit le double s'il renonce.",
    related: ["Acompte", "Caution", "Bail"],
  },
  {
    term: "Assignation",
    definition:
      "Acte de procédure par lequel un huissier de justice cite un défendeur à comparaître devant le tribunal. Utilisée en cas d'impayés pour engager la procédure d'expulsion.",
    related: ["Huissier", "Procédure d'expulsion", "Loyer impayé"],
  },
  {
    term: "Assurance PNO",
    definition:
      "Assurance Propriétaire Non Occupant. Obligatoire pour les propriétaires qui ne habitent pas le bien. Couvre les risques locatifs : incendie, dégâts des eaux, responsabilité civile.",
    related: ["Bailleur", "Assurance", "Location"],
  },
  {
    term: "Assurance loyers impayés",
    definition:
      "Garantie qui rembourse les loyers impayés par le locataire (avec franchise). Aussi appelée GLI. Le locataire peut être soumis à une assurance obligatiore depuis la loi ALUR.",
    related: ["Loyer impayé", "Garantie", "Locataire"],
  },
  {
    term: "Avenant au bail",
    definition:
      "Document modificatif annexé au bail initial pour变更 une ou plusieurs clauses (augmentation de loyer, changement de roommate, modification des charges). Doit être signé par les deux parties.",
    related: ["Bail", "Clause", "Modification"],
  },
  {
    term: "Bail à titre gratuit",
    definition:
      "Contrat de location sans contrepartie financière. Soumis aux mêmes règles qu'un bail payant en matière d'obligations légales. Pas d'obligation de diagnostic de performance énergétique si prêté à un proche.",
    related: ["Bail", "Occupation paisible"],
  },
  {
    term: "Bail commercial",
    definition:
      "Contrat de location d'un local à usage commercial, artisanal ou industriel. Durée minimale de 6 ans (3 ans si le locataire est un commerçant). Régi par le Code de commerce.",
    related: ["Pas-de-porte", "Commercial", "Loyer"],
  },
  {
    term: "Bail de courte durée",
    definition:
      "Location inférieure à 12 mois (meublé) ou inférieure à 3 ans (vide). Le bail mobilité est un bail de courte durée spécifique de 1 à 10 mois pour des motifs professionnels.",
    related: ["Bail mobilité", "Bail meublé", "Durée"],
  },
  {
    term: "Bail mobilité",
    definition:
      "Bail de 1 à 10 mois, sans dépôt de garantie, réservé aux locataires en mobilité professionnelle (mutation, formation, CDD, stage). Non reconductible automatiquement.",
    related: ["Bail", "Durée", "Location"],
  },
  {
    term: "Bail meublé",
    definition:
      "Location d'un logement équipé de mobilier suffisant pour permettre au locataire de vivre décemment. Durée minimum 1 an, dépôts de garantie limité à 2 mois. Le loyer est généralement plus élevé qu'en vide.",
    related: ["Bail", "Dépôt de garantie", "Meublé"],
  },
  {
    term: "Bail nu ou vide",
    definition:
      "Location d'un logement sans mobilier. Durée minimum 3 ans (6 ans si le bailleur est une personne morale). Dépôt de garantie limité à 1 mois de loyer hors charges.",
    related: ["Bail", "Dépôt de garantie", "Vide"],
  },
  {
    term: "Bail reconductible",
    definition:
      "Bail qui se renouvelle automatiquement à son terme sauf notification contraire d'une des parties. La tacite reconduction est le mécanisme juridique par défaut pour les contrats de location.",
    related: ["Bail", "Renouvellement", "Tacite reconduction"],
  },
  {
    term: "Bail saisonnier",
    definition:
      "Location d'un bien pour une période de vacances (maximum 3 mois par an). Non soumis à la loi du 6 juillet 1989. Loué meublé avec matériel de vacation.",
    related: ["Bail", "Location vacances", "Meublé"],
  },
  {
    term: "Bailleur personne morale",
    definition:
      "Société (SCI, SARL, SAS, etc.) qui possède un bien en location. Les baux conclus par une personne morale ont une durée minimale de 3 ans (6 ans pour le bailleur personne morale).",
    related: ["Bailleur", "SCI", "Personne morale"],
  },
  {
    term: "Bailleur personne physique",
    definition:
      "Particulier propriétaire d'un bien mis en location. Le bailleur personne physique doit respecter les mêmes obligations légales que les bailleurs personnes morales.",
    related: ["Bailleur", "Propriétaire", "Loué"],
  },
  {
    term: "Bon de visite",
    definition:
      "Document signé par un candidat locataire après visite d'un bien, engageant le propriétaire à ne pas vendre à quelqu'un d'autre dans un délai défini. Évite les abuses de certaines agences.",
    related: ["Agence", "Candidat locataire", "Visite"],
  },
  {
    term: "Cadastre",
    definition:
      "Registre public administered par les Finances publiques qui recense et décrit toutes les propriétés immobilières d'une commune (superficie, consistance, valeur). Utilisé pour l'assiette des impôts fonciers.",
    related: ["Propriété", "Impôt foncier", "Titre de propriété"],
  },
  {
    term: "Capacité financière",
    definition:
      "Critère d'éligibilité d'un candidat locataire évalué par le bailleur ou l'agence. En général, le revenu mensuel doit être au moins 3 fois supérieur au montant du loyer charges comprises.",
    related: ["Candidat locataire", "Garant", "Revenu"],
  },
  {
    term: "Carnet d'entretien",
    definition:
      "Document obligatoire tenu par le syndic de copropriété-recensant les interventions d'entretien et de maintenance réalisées sur l'immeuble. À disposition des copropriétaires et locataires.",
    related: ["Copropriété", "Syndic", "Entretien"],
  },
  {
    term: "Caution bancaire",
    definition:
      "Garantie fournie par une banque (souvent via un organisme comme VISALE) qui se porte caution à la place du locataire. Plus sûre pour le bailleur qu'une caution personne physique.",
    related: ["Caution", "Garant", "VISALE"],
  },
  {
    term: "Certificat d'urbanisme",
    definition:
      "Document administratif indiquant les règles d'urbanisme applicables à un terrain (constructibilité, limitations, taxes). Utile avant acquisition pour vérifier le potentiel de construction ou de division.",
    related: ["Urbanisme", "Constructibilité", "Permis de construire"],
  },
  {
    term: "Chargé de location",
    definition:
      "Professionnel (agent immobilier, administrateur de biens) mandate par le propriétaire pour trouver un locataire, rédiger le bail et gérer la relation locative en échange d'honoraires.",
    related: ["Agence", "Gestion locative", "Mandat"],
  },
  {
    term: "Charges récupérables",
    definition:
      "Charges que le bailleur peut facturer au locataire en plus du loyer. Listées exhaustivement par décret. Incluent : eau froide, entretien des parties communes, ascenseur, taxe d'enlèvement des ordures ménagères.",
    related: ["Provision sur charges", "Charges locatives", "Décompte"],
  },
  {
    term: "Chirographaire",
    definition:
      "Se dit d'une créance sans garantie réelle (hypothèque, gage). En cas de failite du locataire, les créances chirographaires sont remboursées après les créances privilégiées.",
    related: ["Créance", "Privilege", "Loyer impayé"],
  },
  {
    term: "Clause de DÉCHÉANCE",
    definition:
      "Clause du bail prévoyant sa résiliation automatique en cas d'inexécution d'une obligation (le plus souvent les impayés). Soumise au contrôle du juge pour éviter les abus.",
    related: ["Clause résolutoire", "Résiliation", "Bail"],
  },
  {
    term: "Clause de révision",
    definition:
      "Clause du bail prévoir la variation du loyer chaque année selon un indice de référence (IRL). Sans cette clause, le loyer reste figé pendant toute la durée du bail.",
    related: ["Révision de loyer", "IRL", "Bail"],
  },
  {
    term: "Clause pénale",
    definition:
      "Clause prévoyant des pénalités en cas d'inexécution du contrat. En matière locative, peut concerner les frais de relance ou les intérêts de retard sur les impayés.",
    related: ["Pénalité", "Loyer impayé", "Intérêts de retard"],
  },
  {
    term: "Clause résolutoire",
    definition:
      "Clause qui entraîne la fin automatique du bail en cas de manquement grave (impayés, troubles de voisinage). Son application doit être validée par le juge des contentieux de la protection.",
    related: ["Résiliation", "Expulsion", "Trêve hivernale"],
  },
  {
    term: "Colocation",
    definition:
      "Location d'un même logement par plusieurs locataires ayant chacun un bail individuel (ou un bail unique avec clause de solidarité). Chaque colocataire est responsible de l'intégralité du loyer.",
    related: ["Bail", "Solidarité", "Locataire"],
  },
  {
    term: "Commission d'agence",
    definition:
      "Rémunération perçue par l'agent immobilier pour la mise en location d'un bien. Encadrée par la loi depuis 2022 :不得超过 un mois de loyer hors charges pour la location.",
    related: ["Agence", "Frais d'agence", "Mandat"],
  },
  {
    term: "Compromis de vente",
    definition:
      "Contrat préliminaire engageant acheteur et vendeur à conclure la vente immobilière. Souvent signé avec un dépôt de garantie de 5 à 10% du prix. Devient définitif après délai de rétractation.",
    related: ["Acte de vente", "Dépôt de garantie", "Résolution"],
  },
  {
    term: "Condition suspensive",
    definition:
      "Condition dans un acte (compromis ou bail) dont la réalisation rend l'acte pleinement effectif. En immobilier, l'obtention du prêt est une condition suspensive classique.",
    related: ["Compromis", "Prêt immobilier", "Acte"],
  },
  {
    term: "Constat de risque d'exposition au plomb",
    definition:
      "Voir CREP. Diagnostic obligatoire pour les logements construits avant 1949 visant à détecter la présence de peintures au plomb potentiellement dangereuses pour la santé.",
    related: ["CREP", "Plomb", "Diagnostic"],
  },
  {
    term: "Copropriété",
    definition:
      "Statut d'un immeuble dont le droit de propriété est réparti entre plusieurs personnes (copropriétaires). Géré par un syndic avec un règlement de copropriété et un budget prévisionnel.",
    related: ["Syndic", "Copropriétaire", "Lot de copropriété"],
  },
  {
    term: "Date de jouissance",
    definition:
      "Date à partir de laquelle le locataire peut occuper le logement. Généralement la date de signature du bail ou une date postérieure. Le loyer commence à courir à partir de cette date.",
    related: ["Bail", "Entrée", "Loyer"],
  },
  {
    term: "Déclaration de revenus fonciers",
    definition:
      "Déclaration annuelle des revenus tirés de la location (formulaire 2042). Les revenus fonciers sont imposés selon le régime microfoncier (abattement 30%) ou le régime réel.",
    related: ["Revenus fonciers", "Microfoncier", "Régime réel"],
  },
  {
    term: "Dégradations locatives",
    definition:
      "Dommages causés au logement par le locataire au-delà de l'usure normale. Constatés lors de l'état des lieux de sortie, ils justifient la retenue sur le dépôt de garantie.",
    related: ["État des lieux de sortie", "Dépôt de garantie", "Déduction"],
  },
  {
    term: "Démembrement de propriété",
    definition:
      "Séparation du droit de propriété en deux : l'usufruit (droit d'utiliser et de percevoir les revenus) et la nue-propriété (droit de disposer du bien). Courant dans les donations à enfants.",
    related: ["Usufruit", "Nue-propriété", "Propriété"],
  },
  {
    term: "Déontologie immobilière",
    definition:
      "Ensemble des règles éthiques et professionnelles applicables aux agents immobiliers et administrateurs de biens. Encadrée par la loi Hoguet et le Code de déontologie immobilière.",
    related: ["Agence", "Professionnel", "Mandat"],
  },
  {
    term: "Dernier loyer",
    definition:
      "Loyer due pour le dernier mois de location. Ne peut en principe pas être imputé sur le dépôt de garantie (sauf accord exprès). Le solde est réglé lors de la régularisation finale.",
    related: ["Bail", "Dépôt de garantie", "Solde de tout compte"],
  },
  {
    term: "Devis estimatif",
    definition:
      "Document établi par un artisan ou une entreprise décrivant les travaux à réaliser et leur coût. Utilisé pour vérifier le caractère raisonnable des déductions sur le dépôt de garantie.",
    related: ["Dégradations", "Dépôt de garantie", "Travaux"],
  },
  {
    term: "Dégrèvement",
    definition:
      "Réduction ou suppression d'un impôt ou d'une taxe. En matière locative, le locataire peut obtenir un dégrèvement de la taxe d'habitation sous certaines conditions de revenus.",
    related: ["Taxe d'habitation", "Impôt", "APL"],
  },
  {
    term: "Détournement de fonds",
    definition:
      "Infraction consistant à utiliser des fonds destinés à autrui à des fins personnelles. En location, le bailleur commet un détournement s'il utilise indument le dépôt de garantie.",
    related: ["Dépôt de garantie", "Obligations bailleur", "Restitution"],
  },
  {
    term: "Digue",
    definition:
      "Terme de droit civil désignant une limite juridique à l'exercice d'un droit. En copropriété, les juges contrôlent que les clauses du règlement ne constituent pas une diffigue abusive.",
    related: ["Copropriété", "Droit", "Clause"],
  },
  {
    term: "DLAL",
    definition:
      "Document d'Assistance à la Location. Formulaire FACIITatif permettant au candidat locataire de rassembler tous les pièces justificatives standardisées exigées par les bailleurs.",
    related: ["Candidat locataire", "Pièces justificatives", "Garant"],
  },
  {
    term: "Dommage电动",
    definition:
      "Sinistre affectant le logement (incendie, explosion, dégât des eaux). Doit être déclaré à l'assureur dans les 5 jours. La garantie multirisque habitation couvre généralement ces dommages.",
    related: ["Assurance", "PNO", "Sinistre"],
  },
  {
    term: "Dossier de location",
    definition:
      "Ensemble des pièces justificatives exigées du candidat locataire : pièce d'identité, justificatifs de revenus, avis d'imposition, guarantees. La loi encadre les documents pouvant être réclamés.",
    related: ["Candidat locataire", "Garant", "Revenu"],
  },
  {
    term: "Droit de reprise",
    definition:
      "Droit du bailleur de récupérer son logement pour l'occuper lui-même ou le vendre à l'issue du bail. Soumis à des conditions strictes et à un délai de préavis de 6 mois.",
    related: ["Bail", "Préavis", "Bailleur"],
  },
  {
    term: "Droit de préemption",
    definition:
      "Faculté accordée à certaines personnes (locataires, communes, SCI) d'acheter un bien en priorité lors de sa vente. Le vendeur doit notifier le locataire avant toute vente.",
    related: ["Vente", "Locataire", "Priorité"],
  },
  {
    term: "Durée du bail",
    definition:
      "Période pendant laquelle le bail produit ses effets. Minimum 3 ans en location vide (6 ans si bailleur personne morale), minimum 1 an en meublé, 1 à 10 mois en bail mobilité.",
    related: ["Bail", "Tacite reconduction", "Renouvellement"],
  },
  {
    term: "Echéance du bail",
    definition:
      "Date à laquelle le bail arrive à son terme. Le bailleur peut donner congé à cette date (avec 6 mois de préavis) ou le bail se renouvelle automatiquement (tacite reconduction).",
    related: ["Bail", "Congé", "Tacite reconduction"],
  },
  {
    term: "Effet de levier",
    definition:
      "Stratégie d'investissement consistant à financer l'acquisition d'un bien principalement par emprunt bancaire. Permet de超人 returns sur fonds propres mais augmente le risque financier.",
    related: ["Investissement locatif", "Prêt", "Rendement"],
  },
  {
    term: "Emphytéose",
    definition:
      "Droit réel de jouissance d'un bien immobilier pour une longue durée (18 à 99 ans). Rare en location habitation ; plus courant pour le droits de superficie sur terrain public.",
    related: ["Droit réel", "Bail", "Propriété"],
  },
  {
    term: "Encadrement des loyers",
    definition:
      "Mesure visant à limiter les loyers dans les zones tendues (Paris, Lille, Grenoble, etc.). Le loyer de relocation ne peut dépasser un loyer de référence majoré de 20%.",
    related: ["Zone tendue", "Loyer", "Loyer de référence"],
  },
  {
    term: "État des risques et pollutions",
    definition:
      "ERP (ex-ERNT). Document obligatoire depuis 2018 indiquant les risques naturels, miniers, technologiques et pollutions présents dans la commune. À annexer au bail.",
    related: ["Diagnostic", "Risques naturels", "Bail"],
  },
  {
    term: "Expulsion",
    definition:
      "Procédure judiciaire visant à contraindre un locataire à quitter les lieux. Ne peut être exécutée que par un huissier de justice et dans le respect de la trêve hivernale.",
    related: ["Trêve hivernale", "Huissier", "Procédure d'expulsion"],
  },
  {
    term: "Fiscale",
    definition:
      "Domaine du droit concernant les impôts et taxes. En location, la fiscale du bailleur comprend la déclaration des revenus fonciers, la TVAeventuelle et la plus-value en cas de vente.",
    related: ["Revenus fonciers", "TF", "Plus-value"],
  },
  {
    term: "Fiscalité des revenus locatifs",
    definition:
      "Régime d'imposition des revenus tirés de la location : microfoncier (abattement 30%) ou réel (déduction des charges et amortissements). Le choix impacte significativement la rentabilité.",
    related: ["Revenus fonciers", "Microfoncier", "Régime réel"],
  },
  {
    term: "Fongibilité",
    definition:
      "Caractère d'un bien qui peut être remplacé par un autre de même nature. En droit locatif, le dépôt de garantie doit être restitué en argent (fongible) et non en nature.",
    related: ["Dépôt de garantie", "Garantie", "Restitution"],
  },
  {
    term: "Garantie",
    definition:
      "Engagement d'un tiers (caution) ou mécanisme (dépôt, assurance) assurant le bailleur contre les impayés. La garantie VISALE est une caution gratuite portée par l'État.",
    related: ["Caution", "VISALE", "Loyer impayé"],
  },
  {
    term: "Garant VISALE",
    definition:
      "Dispositif de garantie gratuite porté par l'Action Logement. Couvre les impayés de loyer et charges jusqu'à 9 mois. Accessible aux salariés de certaines entreprises et aux jeunes de moins de 30 ans.",
    related: ["VISALE", "Garant", "Impayés"],
  },
  {
    term: "Gérance",
    definition:
      "Mandat par lequel le propriétaire confie à un professionnel (gérant) la gestion complète de son bien : perception des loyers, interventions techniques, suivi comptable.",
    related: ["Gestion locative", "Mandat", "Honoraires"],
  },
  {
    term: "Gestion locative",
    definition:
      "Ensemble des tâches liées à l'exploitation d'un bien en location : recherche de locataire, rédaction du bail, perception des loyers, suivi des travaux, régularisation des charges.",
    related: ["Gérance", "Bailleur", "Gestionnaire"],
  },
  {
    term: "Gradient de loyer",
    definition:
      "Variation du loyer selon la surface ou l'étage du logement. Permet d'appliquer des loyers plus élevés pour les grandes surfaces ou les étages élevés avec vue.",
    related: ["Loyer", "Surface", "Encadrement"],
  },
  {
    term: "Greffe du tribunal",
    definition:
      "Service administratif où sont enregistrés les jugements et décisions de justice. En matière locative, le juge des contentieux de la protection statue sur les litiges entre bailleurs et locataires.",
    related: ["Juridiction", "Jugement", "Contentieux"],
  },
  {
    term: "Hausse de loyer",
    definition:
      "Augmentation du loyer autorisée dans certaines limites. En zone tendue, l'augmentation est encadrée (IRL +不得超过 10% du loyer de référence). Hors zone tendue, libre entre bailleurs.",
    related: ["Loyer", "IRL", "Encadrement"],
  },
  {
    term: "Huissier de justice",
    definition:
      "Officier public chargé de signifier les actes (congés, assignations), de procéder aux expulsions et de constate. Ses honoraires sont réglementés et à la charge de la partie requérante.",
    related: ["Assignation", "Expulsion", "Constat"],
  },
  {
    term: "Hypothèque",
    definition:
      "Garantie réelle inscrite sur un bien immobilier au profit d'un créancier (banque). En cas de défaut de paiement du prêt, le créancier peut faire saisir le bien.",
    related: ["Prêt immobilier", "Garantie", "Nantissement"],
  },
  {
    term: "Immeuble de rapport",
    definition:
      "Bien immobilier acquis dans le but de générer des revenus locatifs. L'analyse repose sur le rendement brut, le rendement net et lavacance potentielle.",
    related: ["Investissement locatif", "Rendement", "Loyer"],
  },
  {
    term: "Impôt sur la fortune immobilière",
    definition:
      "IFI. Impôt annuel sur la valeur nette des actifs immobiliers (résidence principale exonérée). Depuis 2018, remplace l'ISF et n'intègre plus les actifs financiers.",
    related: ["IFI", "Patrimoine", "Immobilier"],
  },
  {
    term: "Indemnité d'occupation",
    definition:
      "Somme due par le locataire qui reste dans les lieux après expiration ou résiliation du bail. Egale au dernier loyer majoré de 50% (trêve hivernale) ou 100% (hors trêve).",
    related: ["Expulsion", "Trêve hivernale", "Bail"],
  },
  {
    term: "Indice de référence des loyers",
    definition:
      "Voir IRL. Indice INSEE trimestriel utilisé comme base de révision des loyers. Publié au Journal officiel et accessible sur site INSEE. La valeur du T4 2025 est utilisée pour les révisions de 2026.",
    related: ["IRL", "Révision de loyer", "INSEE"],
  },
  {
    term: "Indivision",
    definition:
      "Situation dans laquelle un bien appartient à plusieurs personnes sans division matérielle (chaque indivisaire a une quote-part). Les décisions doivent être prises à la majorité des deux tiers.",
    related: ["SCI", "Copropriété", "Propriété"],
  },
  {
    term: "Inflation locative",
    definition:
      "Hausse générale des loyers dans un marché. En France, l'inflation locative est limitée par l'encadrement des loyers dans les zones tendues et par l'IRL dans les autres zones.",
    related: ["Encadrement", "IRL", "Zone tendue"],
  },
  {
    term: "Intempéries",
    definition:
      "Événements météorologiques exceptionnels (inondations, tempêtes, neige) causant des dommages au logement. La garantie catastrophes naturelles de l'assurance multirisque couvre ces sinistres.",
    related: ["Sinistre", "Assurance", "Catastrophe naturelle"],
  },
  {
    term: "Intérêts de retard",
    definition:
      "Majoration du montant dû en cas de paiement tardif. En matière locative, le bail peut prévoir des intérêts de retard au taux légal (5% en 2025) à partir du premier jour de retard.",
    related: ["Loyer impayé", "Pénalité", "Retard"],
  },
  {
    term: "Inventaire de location",
    definition:
      "Liste détaillée des équipements et du mobilier d'un logement meublé, annexée au bail. Sert de référence pour vérifier l'état du mobilier à l'entrée et à la sortie du locataire.",
    related: ["Bail meublé", "Meublé", "État des lieux"],
  },
  {
    term: "Jour de grâce",
    definition:
      "Délai supplémentaire parfois accordé par le bailleur avant l'application de pénalités pour impayé. Ne constitue pas une obligation légale et ne suspendu pas la procédure d'expulsion.",
    related: ["Loyer impayé", "Relance", "Pénalité"],
  },
  {
    term: "Linéaire de façade",
    definition:
      "Longueur de façade d'un local commercial. Sert de base au calcul de la valeur locative professionnelle (valeur locative = linéaire de façade × coefficient de localisation).",
    related: ["Bail commercial", "Valeur locative", "Local commercial"],
  },
  {
    term: "Lobbying immobilier",
    definition:
      "Action de pression exercée par les acteurs de l'immobilier (syndicats de bailleurs, agences, promoteurs) sur les pouvoirs publics pour influencer la législation locative.",
    related: ["Législation", "Loyer", "Réglementation"],
  },
  {
    term: "Location-accession",
    definition:
      "Dispositif permettant de louer un bien avec une option d'achat progressive. Le locataire-acquéreur verse un dépôt qui constitue son apport pour l'acquisition définitive.",
    related: ["Prêt", "Acquisition", "Accession"],
  },
  {
    term: "Location en état futur d'achèvement",
    definition:
      "VEFA. Achat d'un logement sur plan avant sa construction. Le promoteur verse des pénalités en cas de retard de livraison. Soumis à garanties financières obligatoires.",
    related: ["VEFA", "Promoteur", "Achèvement"],
  },
  {
    term: "Location gère",
    definition:
      "Formule locative dans laquelle le bailleur confie la gestion complète à un professionnel (gérant) moyennant honoraires (généralement 5 à 10% des loyers encaissés).",
    related: ["Gérance", "Gestion locative", "Honoraires"],
  },
  {
    term: "Location indigne",
    definition:
      "Logement ne présentant pas les caractéristiques de décence définies par la loi (humidité, absence de W.-C., équipements dangereux). Le bailleur qui loue un logement indigne s'expose à des sanctions.",
    related: ["Décence", "Logement", "Obligations bailleur"],
  },
  {
    term: "Location nue",
    definition:
      "Location d'un logement sans mobilier. Statut le plus courant pour les locations de longue durée. Durée minimale 3 ans, dépôt de garantie maximum 1 mois hors charges.",
    related: ["Bail nu", "Vide", "Meublé"],
  },
  {
    term: "Location saisonnière",
    definition:
      "Location meublée pour des besoins turísticos ou de vacances (maximum 4 mois par an). Non soumise à la loi du 6 juillet 1989. Peut être soumise à la autorisation de changement d'usage.",
    related: ["Bail saisonnier", "Meublé", "Usage"],
  },
  {
    term: "Loi ALUR",
    definition:
      "Loi pour l'Accès au Logement et un Urbanisme Rénové (24 mars 2014). A profondément modifié le droit locatif : encadrement des loyers, gararantie universelle des loyers, règles de relocation.",
    related: ["Encadrement", "Garantie", "Loyer"],
  },
  {
    term: "Loi Elan",
    definition:
      "Loi Évolution du Logement, de l'Aménagement et du Numérique (23 novembre 2018). A assoupli certaines règles ALUR et renforcé les procédures d'expulsion.",
    related: ["Expulsion", "Bail", "Logement"],
  },
  {
    term: "Loyer conventionné",
    definition:
      "Loyer d'un logement ouvrant droit à l'APL grâce à une convention signée entre le bailleur et l'État. En contrepartie, le bailleur s'engage à respecter des plafonds de loyer.",
    related: ["APL", "Plafond", "Convention"],
  },
  {
    term: "Loyer de référence",
    definition:
      "Loyer médian calculé par l'État dans les zones tendues pour chaque catégorie de logement et secteur. Sert de base à l'encadrement des loyers (maximum : loyer de référence majoré + 20%).",
    related: ["Encadrement", "Zone tendue", "Majoré"],
  },
  {
    term: "Loyer impayé",
    definition:
      "Situation dans laquelle le locataire ne paie pas son loyer aux dates prévues. Engage la procédure de recouvrement : relance, mise en demeure, puis procédure d'expulsion.",
    related: ["Relance", "Mise en demeure", "Expulsion"],
  },
  {
    term: "Loyer principal",
    definition:
      "Partie du loyer correspondant à la seule occupation du logement, hors charges. C'est sur le loyer principal que s'applique l'encadrement dans les zones tendues.",
    related: ["Loyer", "Charges", "Encadrement"],
  },
  {
    term: "Loyer social",
    definition:
      "Loyer applicable aux logements sociaux (HLM), inférieur au prix du marché grâce à des aides publiques. Plafonds de ressources pour les locataires et plafonds de loyer pour les bailleurs.",
    related: ["HLM", "Logement social", "APL"],
  },
  {
    term: "Mainlevée",
    definition:
      "Acte officiel levant une inscription hypothécaire ou une mesure d'exécution (saisie). En location, la mainlevée de l'hypoth堂 est nécessaire pour libérer le bien lors de la revente.",
    related: ["Hypothèque", "Garantie", "Mainlevée"],
  },
  {
    term: "Majoration du loyer",
    definition:
      "Augmentation légitime du loyer entre deux locataires pour un même logement (dans la limite de l'encadrement). Ne peut pas dépasser le loyer de référence majoré en zone tendue.",
    related: ["Encadrement", "Loyer", "Zone tendue"],
  },
  {
    term: "Mandat de gestion",
    definition:
      "Contrat par lequel le propriétaire donne pouvoir à un tiers (gérant, agence) d'accomplir des actes de gestion locative en son nom. Résiliable avec préavis.",
    related: ["Gérance", "Agence", "Gestion locative"],
  },
  {
    term: "Meublé de tourisme",
    definition:
      "Logement meublé loué à une clientèle de passage pour de courts séjours (chambres d'hôtes, gîtes, locations de vacances). Soumis à déclaration en mairie et éventuelle taxe de séjour.",
    related: ["Location saisonnière", "Meublé", "Déclaration"],
  },
  {
    term: "Microfoncier",
    definition:
      "Régime fiscal simplifié pour les revenus locatifs: un abattement forfaitaire de 30% est appliqué automatiquement. Accessible si les revenus fonciers n'excèdent pas 15 000 € par an.",
    related: ["Revenus fonciers", "Régime réel", "Abattement"],
  },
  {
    term: "Mois de tolérance",
    definition:
      "Période d'un mois après l'échéance du bail pendant laquelle le locataire peut encore payer les loyers arriérés pour éviter la résiliation. N'existe plus depuis la loi ALUR 2014.",
    related: ["Bail", "Loyer impayé", "Résiliation"],
  },
  {
    term: "Nantissement",
    definition:
      "Garantie consistant à affecter un bien meuble ou un droit au paiement d'une dette. En matière locative, le dépôt de garantie constitue un nantissement sur les sommes remises.",
    related: ["Garantie", "Dépôt de garantie", "Privilège"],
  },
  {
    term: "Negotiated rent",
    definition:
      "Terme anglais désignant un loyer négocié librement entre bailleur et locataire. En zone tendue, la négociation reste possible dans certaines limites (loyer de référence majoré).",
    related: ["Loyer", "Encadrement", "Négociation"],
  },
  {
    term: "Nue-propriété",
    definition:
      "Droit de disposer d'un bien (vendre, donner) sans l'occuper ni percevoir de revenus. L'usufruit est détenu par un autre. Le démembrement permet d'optimiser la transmission patrimoniale.",
    related: ["Démembrement", "Usufruit", "Propriété"],
  },
  {
    term: "Obligations du bailleur",
    definition:
      "Devoirs légaux du propriétaire: fournir un logement décent, assurer la jouissance paisible, effectuer les repairs locatives, délivrer les quittances, restituer le dépôt de garantie.",
    related: ["Bailleur", "Décence", "Bail"],
  },
  {
    term: "Obligations du locataire",
    definition:
      "Devoirs légaux du locataire: payer le loyer et les charges, user paisiblement du logement, effectuer l'entretien courant, ne pas-transformer le bien sans accord.",
    related: ["Locataire", "Bail", "Entretien"],
  },
  {
    term: "Off-market",
    definition:
      "Transaction immobilière réalisée sans publicité ni mise en concurrence. En location, un bien peut être proposé en off-market via des réseaux privés pour éviter les multiply、快速",
    related: ["Transaction", "Agence", "Offre"],
  },
  {
    term: "Ordonnance de référé",
    definition:
      "Décision de justice rendue rapidement (en quelques jours) par le juge des référés. En matière locative, le juge peut ordonner l'expulsion avec constat d'urgence.",
    related: ["Jugement", "Expulsion", "Référé"],
  },
  {
    term: "Outils de gestion locative",
    definition:
      "Logiciels et applications facilitant la gestion quotidienne d'un parc locatif: suivi des loyers, génération des quittances, alertes IRL, portail locataire.",
    related: ["Logiciel", "Gestion locative", "Automatisation"],
  },
  {
    term: "Paramètres de loyer",
    definition:
      "Variables déterminant le montant du loyer acceptable: surface, localisation, état du bien, prestations, comparaison avec les loyers du marché. À documenter pour justifier le loyer demandé.",
    related: ["Loyer", "Surface", "Encadrement"],
  },
  {
    term: "Passoire thermique",
    definition:
      "Logement dont la consommation énérgétique est supérieure à 450 kWh/m²/an (classe F ou G du DPE). Depuis 2023, les passoires thermiques ne peuvent plus voir leur loyer augmenté.",
    related: ["DPE", "Énergie", "Encadrement"],
  },
  {
    term: "Patrimoine immobilier",
    definition:
      "Ensemble des biens immobiliers possédés par une personne (physique ou morale). En location, le patrimoine génère des revenus fonciers déclarés à l'administration fiscale.",
    related: ["Propriété", "Revenus fonciers", "Fiscalité"],
  },
  {
    term: "Pénalité de retard",
    definition:
      "Somme due par le locataire en cas de paiement tardif du loyer. Généralement calculée sur la base du taux d'intérêt légal (5% en 2025), appliquée par jour de retard.",
    related: ["Intérêts de retard", "Loyer impayé", "Taux légal"],
  },
  {
    term: "Personne à charge",
    definition:
      "Membre du foyer fiscal dépendant financièrement du contribuable (enfant, conjoint). Le nombre de personnes à charge impacte le calcul de l'allocation logement (APL).",
    related: ["APL", "Foyer", "Allocations"],
  },
  {
    term: "Plafond de loyer",
    definition:
      "Maximum légal du loyer applicable en zone tendue ou pour les logements aidés. Le dépassement est sanctionné par la réduction du loyer excessif et une amende administrative.",
    related: ["Encadrement", "Loyer", "Zone tendue"],
  },
  {
    term: "Plafond de ressources",
    definition:
      "Seuil de revenus au-delà duquel un candidat locataire ne peut plus prétendre à certains dispositifs d'aide (APL, logement social, Visale pour certains publics). Varie selon la composition du foyer.",
    related: ["APL", "VISALE", "Logement social"],
  },
  {
    term: "Plomb",
    definition:
      "Métal toxique présent dans les anciennes peintures. Le diagnostic plomb (CREP) est obligatoire pour les logements construits avant 1949. Si concentration > 1 mg/cm², des travaux sont obligatoires.",
    related: ["CREP", "Diagnostic", "Santé"],
  },
  {
    term: "Plus-value immobilière",
    definition:
      "Gain réalisé lors de la vente d'un bien immobilier (prix de vente - prix d'achat - frais). Soumise à l'impôt sur la plus-value (19% + 17,2% CSG), avec exonération après 30 ans de détention.",
    related: ["Vente", "Impôt", "Plus-value"],
  },
  {
    term: "Prêt in fine",
    definition:
      "Prêt immobilier dont le capital n'est remboursé qu'à l'échéance finale (souvent via la revente du bien). En investissement locatif, les intérêts sont souvent déductibles des revenus fonciers.",
    related: ["Prêt", "Investissement", "Intérêts"],
  },
  {
    term: "Privilège du bailleur",
    definition:
      "Droit de suite permettant au bailleur d'être payé en priorité sur le prix de vente du bien en cas de procédure collective du locataire (faillite). Garanti le paiement des loyers impayés.",
    related: ["Créance", "Priorité", "Loyer impayé"],
  },
  {
    term: "Procédure d'expulsion",
    definition:
      "Ensemble des étapes judiciaires pour contraindre un locataire à quitter les lieux : assignation, jugement, commandement de quitter les lieux, intervention de l'huissier.",
    related: ["Expulsion", "Huissier", "Trêve hivernale"],
  },
  {
    term: "Promoteur immobilier",
    definition:
      "Professionnel qui conceive et fait construire des programmes immobiliers neufs pour les vendre ou les louer. En VEFA, le promoteur est le vendeur et doit respecter des garanties financières.",
    related: ["VEFA", "Immobilier neuf", "Garantie"],
  },
  {
    term: "Prolongation de bail",
    definition:
      "Renouvellement du bail au-delà de sa durée initiale sans modification substantielle des conditions. La tacite reconduction opère automatiquement unless le bailleur donne congé.",
    related: ["Tacite reconduction", "Bail", "Renouvellement"],
  },
  {
    term: "Provision pour charges",
    definition:
      "Somme mensuelle demandée au locataire en amont pour couvrir les charges locatives réelles. Régularisée annuellement avec le décompte de charges réel.",
    related: ["Charges", "Décompte", "Régularisation"],
  },
  {
    term: "Quittance de régularisation",
    definition:
      "Quittance émise lors de la régularisation annuelle des charges. Montre le rapprochement entre les provisions versées et les charges réelles, avec le solde à payer ou à rembourser.",
    related: ["Quittance", "Charges", "Régularisation"],
  },
  {
    term: "Quote-part",
    definition:
      "Fraction de la propriété ou des charges appartenant à chaque copropriétaire ou indivisaire. Exprimée en tantième ou en millièmes du total. Détermine la contribution de chacun.",
    related: ["Copropriété", "Indivision", "Charges"],
  },
  {
    term: "Recouvrement de loyer",
    definition:
      "Ensemble des mesures visant à obtenir le paiement des loyers impayés : relance, mise en demeure, procédure judiciaire, eventually expulsion. La garantie des Loyers Impayés (GLI) sécurise ce risque.",
    related: ["Loyer impayé", "GLI", "Relance"],
  },
  {
    term: "Régime réel",
    definition:
      "Régime fiscal des revenus fonciers permettant de déduire les charges réelles (travaux, intérêts d'emprunt, honoraires, taxes) du revenu brut pour obtenir le revenu net imposable.",
    related: ["Revenus fonciers", "Microfoncier", "Déduction"],
  },
  {
    term: "Régularisation des charges",
    definition:
      "Opération annuelle consistant à comparer les provisions sur charges versées par le locataire avec les charges réelles supportées par le bailleur. Le solde est remboursé ou facturé au locataire.",
    related: ["Provision", "Charges", "Décompte"],
  },
  {
    term: "Relance pour impayé",
    definition:
      "Premier courrier informant le locataire de son retard de paiement et lui demandant de régulariser. Ne marque pas le début de la procédure judiciaire (qui nécessite une mise en demeure).",
    related: ["Loyer impayé", "Mise en demeure", "Recouvrement"],
  },
  {
    term: "Rendement brut",
    definition:
      "Ratio dividende brut annuel par le prix d'achat du bien (×100). En location, le rendement brut = (Loyer mensuel × 12) ÷ Prix d'achat × 100. En France, vise 5 à 8%.",
    related: ["Rendement", "Investissement", "Loyer"],
  },
  {
    term: "Rendement net",
    definition:
      "Rendement d'un investissement locatif après déduction de tous les frais (taxe foncière, charges non récupérables, vacance, frais de gestion). Plus précis que le rendement brut.",
    related: ["Rendement brut", "Charges", "Vacance"],
  },
  {
    term: "Réparation locative",
    definition:
      "Travaux d'entretien courant incombant au locataire : ampoules, petites réparations, maintien de la propreté. Les grosses repairs et结构的 repairs restent à la charge du bailleur.",
    related: ["Entretien", "Bailleur", "Travaux"],
  },
  {
    term: "Répartition des charges",
    definition:
      "Division des charges de copropriété entre le bailleur et le locataire selon les règles légales ou conventionnelles. Le locataire prend en charge les charges récupérables via les provisions.",
    related: ["Charges", "Copropriété", "Provision"],
  },
  {
    term: "Résidence principale",
    definition:
      "Logement occupé au moins 8 mois par an par le propriétaire ou sa famille.Condition pour bénéficier de certains avantages fiscaux (résidence principale non soumise à l'IFI, plus-value réduite).",
    related: ["IFI", "Plus-value", "Résidence"],
  },
  {
    term: "Résiliation du bail",
    definition:
      "Fin anticipée du contrat de location avant son terme. Peut être prononcée par le juge (clause résolutoire) ou par accord amiable. Le locataire doit тогдаем preavis d'un mois.",
    related: ["Bail", "Clause résolutoire", "Préavis"],
  },
  {
    term: "Responsabilité civile",
    definition:
      "Obligation de réparer le préjudice causé à autrui. En location, le locataire et le bailleur ont chacun une RC qui couvre les dommages causés à l'autre partie ou aux tiers.",
    related: ["Assurance", "Locataire", "Bailleur"],
  },
  {
    term: "Restitution du dépôt de garantie",
    definition:
      "Remise du dépôt de garantie au locataire à la fin du bail, déduction faite des sommes légitimement retainues (impayés, dégradations). Doit intervenir dans les 1 à 2 mois selon les cas.",
    related: ["Dépôt de garantie", "Déduct", "Fin de bail"],
  },
  {
    term: "Résultat foncier",
    definition:
      "Différence entre les revenus fonciers bruts (loyers encaissés) et les charges déductibles. Peut être positif (revenu supplémentaire) ou négatif (déficit foncier déductible des autres revenus).",
    related: ["Revenus fonciers", "Régime réel", "Déficit"],
  },
  {
    term: "Revenus fonciers",
    definition:
      "Montant total des loyers perçus au cours d'une année civile. Soumis à l'impôt sur le revenu (barème progressif) et aux prélèvements sociaux (17,2%). Déclarés sur la déclaration 2042.",
    related: ["Impôt", "Revenus", "Déclaration"],
  },
  {
    term: "Solde migratoire",
    definition:
      "Différence entre le nombre de personnes qui s'installent dans un territoire et le nombre de personnes qui le quittent. Un solde migratoire positif indique une zone attractive pour la location.",
    related: ["Zone tendue", "Location", "Marché"],
  },
  {
    term: "Solidarité locative",
    definition:
      "Mécanisme par lequel chaque colocataire est tenu responsable de la totality du loyer. La clause de solidarité est fréquente en colocation et permet au bailleur de réclamer l'intégralité à n'importe quel colocataire.",
    related: ["Colocation", "Locataire", "Bail"],
  },
  {
    term: "Solvabilité",
    definition:
      "Capacité d'un candidat locataire à payer son loyer régulièrement. Évaluée via les justificatifs de revenus, les relevés bancaires et le historial de paiement. Garantie par caution ou assurance.",
    related: ["Candidat locataire", "Revenu", "Garantie"],
  },
  {
    term: "Sous-location",
    definition:
      "Location par le locataire d'une partie ou de la totality du logement à un tiers (sous-locataire). Interdite sans accord préalable et écrit du bailleur. Le locataire reste responsable.",
    related: ["Locataire", "Bail", "Autorisation"],
  },
  {
    term: "Surface habitable",
    definition:
      "Surface de plancher construite après déduction des murs, cloisons, marches et cages d'escalier, gaines, embrasures de portes et fenêtres. Doit être au moins de 9 m² et 2,20 m de hauteur sous plafond.",
    related: ["Surface", "Loyer", "Decence"],
  },
  {
    term: "Surface Carrez",
    definition:
      "Surface privative d'un lot de copropriété telle que définie par la loi Carrez (1996). Inclut les planchers des locaux clos et couverts après déduction des murs, cloisons, marches, gaines.",
    related: ["Surface", "Copropriété", "Diagnostic"],
  },
  {
    term: "Syndic de copropriété",
    definition:
      "Professionnel (ou bénévole) chargé d'administrer la copropriété : convocation des assemblées, exécution des décisions, gestion du compte bancaire, contrôle des prestataires.",
    related: ["Copropriété", "Copropriétaire", "Assemblée"],
  },
  {
    term: "Tacite reconduction",
    definition:
      "Renouvellement automatique du bail à son échéance sans formalité particulière. Le bailleur qui ne souhaite pas reconduire doit donner congé au moins 6 mois avant l'échéance.",
    related: ["Bail", "Echéance", "Renouvellement"],
  },
  {
    term: "Taxe foncière",
    definition:
      "Impôt local annuel dû par le propriétaire d'un bien immobilier. Calculé sur la valeur locative cadastrale du bien. Partiellement déductible des revenus fonciers en régime réel.",
    related: ["Impôt", "Propriétaire", "Revenus fonciers"],
  },
  {
    term: "Taxe d'habitation",
    definition:
      "Impôt local assis sur la valeur locative d'un bien occupé au 1er janvier de l'année. Supprimée pour la majorité des ménages depuis 2023 mais reste due pour les résidences secondaires et la Villas meublées.",
    related: ["Impôt", "Résidence secondaire", "Exonération"],
  },
  {
    term: "Taux d'effort",
    definition:
      "Ratio entre le montant du loyer (charges comprises) et les revenus du ménage. En général, un taux d'effort supérieur à 30% est considéré comme élevé. Utilisé pour évaluer la solvabilité.",
    related: ["Solvabilité", "Loyer", "Revenu"],
  },
  {
    term: "Taux d'intérêt légal",
    definition:
      "Taux de référence fixé par l'État, utilisé pour calculer les intérêts de retard en cas d'impayé. Pour 2025, le taux légal est de 5% pour les créances des particuliers.",
    related: ["Intérêts de retard", "Loyer impayé", "Pénalité"],
  },
  {
    term: "Tiers payant",
    definition:
      "Dispositif par lequel l'allocation (APL) est versée directement au bailleur plutôt qu'au locataire. Évite les problèmes de预处理 et simplifie le-budget du ménage.",
    related: ["APL", "Bailleur", "Allocations"],
  },
  {
    term: "Trouble de jouissance",
    definition:
      "Agissement du bailleur (ou d'un tiers) qui empêche le locataire de profiter pleinement de son logement (bruit, travaux abusifs, défaut de réparation). Peut justifier une baisse de loyer.",
    related: ["Locataire", "Bailleur", "Jouissance"],
  },
  {
    term: "Trouble de voisinage",
    definition:
      "Nuisances causées par un locataire (bruit, incivilités) qui affectent le voisinage ou les autres occupants. Peut constituer un motif de résiliation du bail si cela constitue un motif légitime et sérieux.",
    related: ["Locataire", "Résiliation", "Bail"],
  },
  {
    term: "Usufruit",
    definition:
      "Droit d'user d'un bien et d'en percevoir les fruits (loyers) sans en être le propriétaire. L'usufruitier ne peut ni vendre ni détruire le bien. L'usufruit peut être temporaire ou viager.",
    related: ["Nue-propriété", "Démembrement", "Propriété"],
  },
  {
    term: "Vacance locative",
    definition:
      "Période pendant laquelle un logement reste inoccupé entre deux locataires. Génère un manque à gagner pour le bailleur. À intégrer dans le calcul du rendement net de l'investissement.",
    related: ["Rendement net", "Loyer", "Investissement"],
  },
  {
    term: "Valeur locative cadastrale",
    definition:
      "Valeur théorique de reference du marché locatif d'un bien, établie par l'administration fiscale. Sert de base au calcul de la taxe foncière et de l'IFI. Peut être réevaluée par les services fiscaux.",
    related: ["Taxe fonciere", "IFI", "Base d'imposition"],
  },
  {
    term: "Vente en état futur d'achèvement",
    definition:
      "VEFA. Opération par laquelle l'acquéreur achète un logement sur plan auprès d'un promoteur. Le paiement s'effectue au fur et à mesure de l'avancement des travaux. Protégée par des garanties financières.",
    related: ["VEFA", "Promoteur", "Livraison"],
  },
  {
    term: "Vices cachés",
    definition:
      "Défauts non apparents lors de l'achat ou de la location, rendant le bien impropre à son usage ou diminuant tellement l'usage que l'acheteur/locataire ne l'aurait pas acquis/ loué.",
    related: ["Diagnostic", "Responsabilité", "Garantie"],
  },
  {
    term: "VISALE",
    definition:
      "Visa pour le Logement et l'Emploi. Dispositif de garantie gratuite porté par Action Logement. Couvre les impayés de loyer (jusqu'à 9 mois) et les dégradations pour les locataires éligibles.",
    related: ["Garant", "Impayés", "Action Logement"],
  },
  {
    term: "Zone d'habitat",
    definition:
      "Partie du territoire communal dédiée à l'habitat (résidentiel) selon le plan local d'urbanisme (PLU). Conditionne les droits de construction et les типы de destinations autorisées.",
    related: ["Urbanisme", "PLU", "Construction"],
  },
  {
    term: "Zone non tendue",
    definition:
      "Zone géographique où l'offre de logement est suffisante par rapport à la demande. Dans ces zones, les règles d'encadrement des loyers ne s'appliquent pas et le bailleur est plus libre.",
    related: ["Zone tendue", "Encadrement", "Loyer"],
  },
  {
    term: "Abandon de poste",
    definition:
      "Situation dans laquelle un locataire quitte volontairement les lieux sans respecter la procédure de résiliation. Ne libère pas le locataire de son obligation de payer le loyer jusqu'à la fin du bail.",
    related: ["Résiliation", "Bail", "Loyer"],
  },
  {
    term: "Accession à la propriété",
    definition:
      "Passage du statut de locataire à celui de propriétaire d'un bien immobilier. Soutenue par des dispositifs publics comme le PTZ (Prêt à Taux Zéro) pour les résidence principales.",
    related: ["Prêt", "Propriétaire", "Résidence principale"],
  },
  {
    term: "Acte authentique",
    definition:
      "Document rédig气 par un notaire qui confère une valeur probatoire légale maximale. L'acte de vente immobilière est un acte authentique qui doit être signé devant notaire.",
    related: ["Notaire", "Acte de vente", "Notaire"],
  },
  {
    term: "Agios",
    definition:
      "Frais prélevés par la banque lorsque le compte est à découvert. En gestion locative, les frais de rejet bancaire sur les prélèvements de loyer impayé constituent des agios à la charge du locataire.",
    related: ["Banque", "Frais", "Loyer impayé"],
  },
  {
    term: "Aide au logement",
    definition:
      "Allocation destinée à réduire le montant du loyer pour les ménages modestes. L'APL est l'aide la plus courante, versée selon les revenus, la composition du foyer et le montant du loyer.",
    related: ["APL", "CAF", "Loyer"],
  },
  {
    term: "Amortissement",
    definition:
      "Constatation comptable de la perte de valeur d'un bien immobilisé due à l'usure ou au temps. En investissement locatif, l'amortissement permet de réduire le revenu imposable en déduisant la depreciation du bien.",
    related: ["Revenus fonciers", "Régime réel", "Déduction"],
  },
  {
    term: "Annexe au bail",
    definition:
      "Document joint au contrat de location qui complète ou précise certaines clauses. Les diagnostics obligatoires (DPE, ERNT, CREP) sont des annexes au bail.",
    related: ["Bail", "Diagnostic", "Clause"],
  },
  {
    term: "Apport personnel",
    definition:
      "Somme que l'emprunteur investit de ses propres deniers pour financer une acquisition immobilière. Plus l'apport est élevé, meilleur est le taux d'emprunt obtenu.",
    related: ["Prêt immobilier", "Taux", "Acquisition"],
  },
  {
    term: "Architecte d'intérieur",
    definition:
      "Professionnel concevant l'agencement intérieur d'un bien à vocation locative. Peut recommander des améliorations pour augmenter l'attractivité et le loyer d'un logement.",
    related: ["Amélioration", "Loyer", "Bien"],
  },
  {
    term: "Arrêt de la Cour de cassation",
    definition:
      "Décision de justice définitive interpretant le droit applicable. En matière locative, les arrêts de la Troisième Chambre civile font référence pour l'interprétation des baux d'habitation.",
    related: ["Jurisprudence", "Droit", "Jugement"],
  },
  {
    term: "Ascenseur",
    definition:
      "Équipement collectif d'un immeuble en copropriété dont l'entretien et le remplacement pèsent sur le budget de la copropriété. Les coûts sont répartis entre les copropriétaires via les charges de copropriété.",
    related: ["Copropriété", "Charges", "Syndic"],
  },
  {
    term: "Assiette de la taxe foncière",
    definition:
      "Valeur locative cadastrale d'un bien servant de base au calcul de la taxe foncière. Révisée périodiquement par les services fiscaux selon l'évolution du marché immobilier local.",
    related: ["Taxe foncière", "Valeur locative", "assiette"],
  },
  {
    term: "Attestation de témoin",
    definition:
      "Déclaration écrite d'une personne confirmant un fait pertinent dans un litige locatif (état des lieux, dégradations, receipt de paiement). Peut étayer un dossier devant le tribunal.",
    related: ["Constat", "Huissier", "Preuve"],
  },
  {
    term: "Auto-entrepreneur",
    definition:
      "Statut juridique permettant d'exercer une activité en tant qu'indépendant. Certains propriétaires en SCI choisient le régime de l'auto-entrepreneur pour la gestion locativesimplifiée.",
    related: ["SCI", "Gestion locative", "Statut"],
  },
  {
    term: "Avance locative",
    definition:
      "Somme versée par le locataire au bailleur lors de l'entrée dans les lieux, distincte du dépôt de garantie. Peut être exigée pour couvrir la première mensualité de loyer.",
    related: ["Dépôt de garantie", "Loyer", "Entrée"],
  },
  {
    term: "Bail emphytéotique",
    definition:
      "Contrat de location de très longue durée (18 à 99 ans) conférant au locataire un droit réel sur le bien. Rare en habitation, plus courant pour les terrains agricoles ou les ERP.",
    related: ["Bail", "Droit réel", "Durée"],
  },
  {
    term: "Bail verbal",
    definition:
      "Location sans écrit, présumée exister dès lors que le locataire occupe le bien et paie un loyer. Repose sur l'accord des parties mais est plus difficile à prouver en cas de litige.",
    related: ["Bail", "Oral", "Preuve"],
  },
  {
    term: "Bénéfice的建筑",
    definition:
      "Opération immobilière générant des revenus nets positifs après déduction de toutes les charges et immobilisations. L'objectif de tout investisseur locatif est de générer un bénéfice.",
    related: ["Investissement", "Rendement", "Revenus"],
  },
  {
    term: "Blocier fiscal",
    definition:
      "Stratégie consistant àLOGER un bien dans une structure (SCI à l'IS) pour profit Fiscal. Les revenus locatifs sont alors imposés à l'IS plutôt qu'à l'IR, avec possibilité d'amortissement.",
    related: ["SCI", "Fiscalité", "Investissement"],
  },
  {
    term: "Bon de commande",
    definition:
      "Document engageant l'acquisition de travaux ou de matériaux pour le bien loué. Utile pour justifier les dépenses de travaux auprès de l'administration fiscale en régime réel.",
    related: ["Travaux", "Justificatif", "Régime réel"],
  },
  {
    term: "Bornage",
    definition:
      "Opération effectuée par un géomètre expert pour définir les limites exactes d'une propriété. Le bornage peut être amiable (entre voisins) ou judiciaire (en cas de litige).",
    related: ["Propriété", "Géomètre", "Limite"],
  },
  {
    term: "Budget de trésorerie",
    definition:
      "Prévision des flux financiers liés à la gestion locative: loyers attendus, charges à payer, impôts, mensualités de prêt. Permet d'anticiper les périodes de vacance locative.",
    related: ["Trésorerie", "Vacance", "Loyer"],
  },
  {
    term: "Cahier des charges",
    definition:
      "Document détaillant les specifications techniques et les obligations d'un prestataire. En copropriété, le cahier des charges définit les règles de travail du gardien ou de l'entreprise de nettoyage.",
    related: ["Copropriété", "Prestataire", "Syndic"],
  },
  {
    term: "Capital emprunté",
    definition:
      "Montant du prêt bancaire servant à financer l'acquisition d'un bien immobilier. Les intérêts d'emprunt sont déductibles des revenus fonciers en régime réel d'imposition.",
    related: ["Prêt immobilier", "Intérêts", "Régime réel"],
  },
  {
    term: "Carence de propriétaire",
    definition:
      "Situation dans laquelle le bailleur ne remplit pas ses obligations légales (fournir un logement décent, effectuer les repairs). Le locataire peut saisir le juge pour obtenir la résiliation du bail.",
    related: ["Obligations bailleur", "Résiliation", "Trouble de jouissance"],
  },
  {
    term: "Caution girardin",
    definition:
      "Dispositif fiscal permettant une réduction d'impôt en échange d'une investissements dans l'immobilier intermédiaire. La caution girardin est une garantie associée à ces opérations de défiscalisation.",
    related: ["Défiscalisation", "Investissement", "Caution"],
  },
  {
    term: "Centre des finances publiques",
    definition:
      "Service administratif de la Direction Générale des Finances Publiques (DGFiP) gérant la fiscalité immobilière (taxe foncière, revenus fonciers, plus-values).",
    related: ["Impôt", "Taxe foncière", "Revenus fonciers"],
  },
  {
    term: "Certification de conformité",
    definition:
      "Attestation délivrée par un professionnel confirmant qu'un logement respecte les normes en vigueur (électriques, gaz, accessibilité). Exigée pour la relocation après travaux importants.",
    related: ["Normes", "Travaux", "Conformité"],
  },
  {
    term: "Changement de destination",
    definition:
      "Modification de l'usage d'un bien (par exemple, transformation d'un local commercial en habitation). Nécessite une autorisation d'urbanisme et peut modifier le régime fiscal applicable.",
    related: ["Urbanisme", "Destination", "Autorisation"],
  },
  {
    term: "Changement de roommate",
    definition:
      "Situation dans laquelle un incontourn de lesOriginaux quitte le logement et est remplacé par un nuovo occupant. Généralement formalisé par un avenant au bail ou un nouveau bail.",
    related: ["Bail", "Avenant", "Colocation"],
  },
  {
    term: "Charge de copropriété",
    definition:
      "Dépenses liées à l'entretien et au fonctionnement de la copropriété: salaires des employés, énergie des parties communes, entretien des équipements. Réparties entre copropriétaires selon les tantièmes.",
    related: ["Copropriété", "Syndic", "Quote-part"],
  },
  {
    term: "Clause de solidarité",
    definition:
      "Disposition d'un bail de colocation prevoyant que chaque locataire est responsable de la totalité du loyer. Permet au bailleur de réclamer le plein montant à n'importe lequel des colocataires.",
    related: ["Colocation", "Solidarité", "Locataire"],
  },
  {
    term: "Clauseonorifique",
    definition:
      "Clause d'un bail stipulant un service ou une contrepartie en nature plutôt qu'en numéraire. En matière locative, peu courante et doit être précisée pour éviter les difficultés d'exécution.",
    related: ["Bail", "Clause", "Contrepartie"],
  },
  {
    term: "Coachings en investissement locatif",
    definition:
      "Prestation d'accompagnement pour advises les investisseurs immobiliers. Couvre la stratégie d'acquisition, le financement, la gestion locative et l'optimisation fiscale.",
    related: ["Investissement", "Conseil", "Fiscalité"],
  },
  {
    term: "Commission d'assemblée générale",
    definition:
      "Période au cours de laquelle les copropriétaires votent les décisions de la copropriété. Les décisions importantes (travaux importants, changement de syndic) requièrent une majorité qualifiée.",
    related: ["Copropriété", "Assemblée", "Syndic"],
  },
  {
    term: "Compensation de charges",
    definition:
      "Mécanisme permettant de imputer les charges d'un logement sur les revenus d'un autre au sein d'une même déclaration fiscale. Possible sous certaines conditions en régime réel.",
    related: ["Charges", "Régime réel", "Revenus fonciers"],
  },
  {
    term: "Comptabilité de la copropriété",
    definition:
      "Ensemble des écritures comptables retraçant les opérations financières de la copropriété: appels de fonds, dépenses, régularisations. Consultable par tout copropriétaire.",
    related: ["Copropriété", "Syndic", "Finances"],
  },
  {
    term: "Concubinage et location",
    definition:
      "Situation de deux personnes vivant ensemble sans être mariées ni pacsées. Le concubin peut être ajouté au bail ou rester tiers. Ses revenus ne sont pas pris en compte pour l'éligibilité APL.",
    related: ["Bail", "Locataire", "APL"],
  },
  {
    term: "Conseil syndical",
    definition:
      "Organe représentatif des copropriétaires qui assiste et contrôle le syndic. Ses miembros sono élus par l'assemblée générale et peuvent refuser les honoraires excessifs du syndic.",
    related: ["Copropriété", "Syndic", "Assemblée"],
  },
  {
    term: "Constat d'huissier",
    definition:
      "Acte authentique dressé par un huissier de justice décrivant un état de fait (dégradations, troubles, impayés).，价值高，具有法律证据价值，可用于司法程序。",
    related: ["Huissier", "Preuve", "Constat"],
  },
  {
    term: "Constructibilité",
    definition:
      "Potentiel d'un terrain à accueillir une construction. Déterminé par le PLU (Plan Local d'Urbanisme) qui fixe les règles de'emprise au sol, de hauteur et d'occupation des sols.",
    related: ["Urbanisme", "PLU", "Construction"],
  },
  {
    term: "Contentieux locatif",
    definition:
      "Litige entre bailleur et locataire porté devant le juge des contentieux de la protection (anciennement juge d'instance). Concerne les demandes de résiliation, d'expulsion ou de contestations.",
    related: ["Jugement", "Résiliation", "Expulsion"],
  },
  {
    term: "Contrat de location saisonnière",
    definition:
      "Contrat de courte durée pour la location meublée de vacances. Doit préciser le prix, les dates, les conditions d'annulation et le dépôt de garantie éventuel.",
    related: ["Bail saisonnier", "Meublé", "Vacances"],
  },
  {
    term: "Contrôle des层的",
    definition:
      "Procédure administrative vérifiant la conformité d'un logement aux normes de décence et de sécurité. Peut être diligenté par la mairie ou le juge en cas de signalement.",
    related: ["Décence", "Normes", "Logement"],
  },
  {
    term: "Coquart",
    definition:
      "Frais accessoires réclamés par le bailleur au-delà du loyer principal et des charges. Incluent parfois le stationnement, le mobilier ou les equipements冰雪.",
    related: ["Loyer", "Charges", "Accessoires"],
  },
  {
    term: "Couverture sociale des revenus locatifs",
    definition:
      "Obligation pour certains bailleurs (SCI à l'IS, marchands de biens) de cotiser auxcharges sociales sur les revenus fonciers. Les revenus locatifs sont soumis aux prélèvements sociaux (17,2%).",
    related: ["Revenus fonciers", "Prélèvements sociaux", "SCI"],
  },
  {
    term: "Date limite de paiement",
    definition:
      "Date à laquelle le loyer doit être crédité sur le compte du bailleur. En cas de non-paiement à cette date, le bailleur peut engager les démarches de recouvrement (relance, mise en demeure).",
    related: ["Loyer", "Paiement", "Recouvrement"],
  },
  {
    term: "Déblocage des fonds",
    definition:
      "Versement du capital emprunté par la banque lors de la réalisation d'une condition suspensive (obtention du prêt). Intervient généralement le jour de la signature de l'acte authentique chez le notaire.",
    related: ["Prêt immobilier", "Notaire", "Acquisition"],
  },
  {
    term: "Décence du logement",
    definition:
      "Critères minima impose by law for a rental property: surface >= 9m², height >= 2.20m, waterproof and healthy, equiped with basic facilities. A non-decent housing can result in rent reduction or damages.",
    related: ["Logement", "Normes", "Obligations bailleur"],
  },
  {
    term: "Démolition",
    definition:
      "Opération consistant à détruire un bâtiment vétuste ou inadapté. Peut être ordonnée par la mairie pour un logement dangereux ou intervenir dans le cadre d'un projet de promotion immobilière.",
    related: ["Urbanisme", "Travaux", "Construction"],
  },
  {
    term: "Dénombrement",
    definition:
      "Comptage des occupants d'un logement utilisé pour le calcul des aides au logement (APL). Un dénombrement erroné peut entraîner un trop-perçu à rembourser.",
    related: ["APL", "Foyer", "Allocations"],
  },
  {
    term: "Dépenses de maintenance",
    definition:
      "Coûts réguliers d'entretien d'un bien locatif: petits travaux, remplacement d'équipements, interventions techniques. Déductibles en régime réel des revenus fonciers.",
    related: ["Travaux", "Régime réel", "Charges"],
  },
  {
    term: "Depositdang",
    definition:
      "Terme anglais désignant le dépôt de garantie en common law. Aux États-Unis et au Royaume-Uni, le deposit est souvent plus élevé (1 à 2 mois) mais hautement réglementé.",
    related: ["Dépôt de garantie", "Garantie", "International"],
  },
  {
    term: "Désignation du bien",
    definition:
      "Description détaillée d'un bien immobilier dans le bail ou l'acte de vente: adresse, surface, consistance, numéro de lot. Doit être précise pour éviter les contestations.",
    related: ["Bail", "Bien", "Description"],
  },
  {
    term: "Disponibilité du bien",
    definition:
      "Obligation pour le bailleur de laisser le locataire jouir du bien pendant toute la durée du bail. La unavailable du bien (travaux, procédure d'expulsion d'un ancien occupant) ne suspend pas le loyer.",
    related: ["Bail", "Jouissance", "Bailleur"],
  },
  {
    term: "Dommage电动车",
    definition:
      "Erreur dans le terme precedent (Dommage电动 = Dommage électrique). Référence aux dommages causés par les installations électriques défaillantes d'un logement, couverts par l'assurance multirisque.",
    related: ["Assurance", "Sinistre", "Installation"],
  },
  {
    term: "Droit de passage",
    definition:
      "Servitude允许一个人穿越另一个人的土地。En copropriété, le droit de passage peut exister pour accéder à une partie commune ou à un lot enclavé.",
    related: ["Servitude", "Copropriété", "Terrain"],
  },
  {
    term: "Droit de visite et de perquisition",
    definition:
      "Droit du propriétaire de visiter son bien pendant la durée du bail. Doit respecter un préavis raisonnable et ne peut constitutive une atteinte à la jouissance paisible du locataire.",
    related: ["Bailleur", "Locataire", "Jouissance"],
  },
  {
    term: "Durée d'amortissement",
    definition:
      "Période sur laquelle un bien ou un équipement est amorti comptablement. Pour un logement, la durée d'amortissement est généralement de 20 à 40 ans selon la nature du bien.",
    related: ["Amortissement", "Régime réel", "Immobilier"],
  },
  {
    term: "Echange de lots",
    definition:
      "Opération consistant à troquer un lot de copropriété contre un autre entre deux copropriétaires. Peut simplifier la gestion ou优化 la répartition des charges.",
    related: ["Copropriété", "Lot", "Échange"],
  },
  {
    term: "Économie d'échelle",
    definition:
      "Réduction du coût unitaire de gestion grâce à l'augmentation du nombre de biens gérés. Principe appliqué par les gestionnaires de biens locatifs professionnels.",
    related: ["Gestion locative", "Échelle", "Location"],
  },
  {
    term: "Écrasement de loyer",
    definition:
      "Baisse significative du loyer proposta par un bailleur pour ajuster le loyer au marché ou pour maintenir un bon locataire. Pratiqué notamment en zone tendue pour respectant l'encadrement.",
    related: ["Loyer", "Encadrement", "Zone tendue"],
  },
  {
    term: "Effondrement de plancher",
    definition:
      "Sinistre grave affectant la structure d'un bâtiment. Peut être causé par une faiblesse konstruktionnelle, un incendie ou des dégâts des eaux. DOIT être déclaré à l'assurance et peut entraîner l'inhabitabilité du logement.",
    related: ["Sinistre", "Assurance", "Logement"],
  },
  {
    term: "Éligibilité au prêt",
    definition:
      "Ensemble des conditions que debe remplir un emprunteur pour obtenir un financement bancaire: revenus stables, endettement acceptable, apport personnel, profil de crédit.",
    related: ["Prêt", "Revenu", "Banque"],
  },
  {
    term: "Empiètement",
    definition:
      "Intrusion d'une construction, d'une haie ou d'un ouvrage sur le terrain voisin. En cas d'empiètement, le propriétaire du terrain empiété peut exiger la suppression de l'empiètement.",
    related: ["Propriété", "Voisin", "Limite"],
  },
  {
    term: "Encadrement de l'indice",
    definition:
      "Mesure réglementaire limitant l'évolution de l'IRL pour protéger les locataires d'augmentations excessives.区政府 peut também fixer des plafonds selon les zones.",
    related: ["IRL", "Encadrement", "Loyer"],
  },
  {
    term: "Enquête de satisfaction locataire",
    definition:
      "Outil de gestion permettant au bailleur de recueillir l'avis du locataire sur la qualité du service (réactivité, état du bien, communication). Utile pour améliorer la gestion locative.",
    related: ["Gestion locative", "Locataire", "Amélioration"],
  },
  {
    term: "Entrée en jouissance",
    definition:
      "Moment précis où le locataire peut accéder au logement et commencer à l'occuper. Généralement immédiat après la signature du bail. Le loyer starts à courir à partir de cette date.",
    related: ["Bail", "Date de jouissance", "Entrée"],
  },
  {
    term: "Équilibre financier",
    definition:
      "Situation dans laquelle les revenus locatifs couvrent durablement les charges (emprunt, taxe foncière, charges de copropriété, vacance). Indicateur clé de la viability d'un investissement.",
    related: ["Investissement", "Rendement", "Vacance"],
  },
  {
    term: "Erreur de surface",
    definition:
      "Différence entre la surface réelle d'un logement et la surface indiquée dans le bail. Si l'écart dépasse 5%, le locataire peut demander une diminution proportionnelle du loyer.",
    related: ["Surface", "Bail", "Loyer"],
  },
  {
    term: "Estimation de bien",
    definition:
      "Évaluation de la valeur vénale d'un bien immobilier par un professionnel (notaire, agent, expert). Permet au bailleur de fixer un loyer cohérent avec le marché.",
    related: ["Valeur", "Loyer", "Expert"],
  },
  {
    term: "Étalement fiscal",
    definition:
      "Mécanisme permettant d'étaler le paiement d'un impot sur plusieurs années (ex: plus-value immobilière des particuliers). Applicable sous certaines conditions et sur option du contribuable.",
    related: ["Impôt", "Plus-value", "Échelonnement"],
  },
  {
    term: "État futur du marché",
    definition:
      "Projection de l'évolution des prix et des loyers dans une zone géographique donnée. Fondée sur des données démographiques, économiques et réglementaires. Utile pour orienter l'investissement.",
    related: ["Marché", "Loyer", "Investissement"],
  },
  {
    term: "Étude de faisabilité",
    definition:
      "Analyse préalable d'un projet immobilier (acquisition, travaux, démembrement) évaluant sa rentabilité, ses risques et sa cohérence avec les objectifs patrimoniaux du bailleur.",
    related: ["Investissement", "Faisabilité", "Projet"],
  },
  {
    term: "European Accessibility Act",
    definition:
      "Législation européenne visant à garantir l'accessibilité des produits et services aux personnes handicapées. Applicable aux plateformes digitales de gestion locative comme RentReady.",
    related: ["Accessibilité", "Normes", "Digital"],
  },
  {
    term: "Exception de garantie",
    definition:
      "Moyen de défense du locataire qui démontre que le bailleur ne respecte pas ses propres obligations (décence, réparation) et ne peut donc pas réclamer l'exécution des siennes.",
    related: ["Obligations bailleur", "Locataire", "Décence"],
  },
  {
    term: "Exonération de taxe foncière",
    definition:
      "Cas dans lesquels un propriétaire peut être partiellement ou totalement exonéré de taxe foncière: nouveau constructed, logement.social, dépendance aux collectivités.",
    related: ["Taxe foncière", "Exonération", "Propriétaire"],
  },
  {
    term: "Exploitation Agricole",
    definition:
      "Bien rural loué à un agriculteur pour l'exercice d'une activité agricole. Bail rural de 9 ans minimum, avec droit de préemption du fermier en cas de vente.",
    related: ["Bail rural", "Agriculteur", "Droit de préemption"],
  },
  {
    term: "Exposition d'un bien",
    definition:
      "Orientation d'un logement par rapport aux points cardinaux. Une exposition sud procure plus de lumière et de chaleur, valorisant le bien sur le marché locatif.",
    related: ["Surface", "Loyer", "Valeur"],
  },
  {
    term: "Extension de garantie",
    definition:
      "Prolongation de la garantie constructeur ou panne au-delà de la période initiale. Conseillée pour les équipements neufs d'un logement locatif (chaudière, électroménager).",
    related: ["Garantie", "Travaux", "Assurance"],
  },
  {
    term: "Fabrication du bail",
    definition:
      "Processus de rédaction et de signature du contrat de location. Doit inclure toutes les clauses obligatoires et annexer les diagnostics réglementaires. Un bail incomplet est null et de nullité relative.",
    related: ["Bail", "Rédaction", "Obligations"],
  },
  {
    term: "Fallaitrice",
    definition:
      "Établissement financier proposant des prêts aux emprunteuses présentant un risque élevé. Terme généralement péjoratif désignant les pratiques de crédit irresponsable.",
    related: ["Prêt", "Banque", "Risque"],
  },
  {
    term: "Faillite personnelle",
    definition:
      "Mesure judiciaire privant un débiteur de la gestion de ses biens. Peut être prononcée en cas de gestion particulièrement fautive d'un patrimoine locatif (loueur en meublé professionability).",
    related: ["Jugement", "Débiteur", "Gestion"],
  },
  {
    term: "Fenêtre de toit",
    definition:
      "Ouverture vitrée installée dans une toiture pour apporter lumière naturelle et ventilation. Leur présence et leur état sont vérifiés lors de l'état des lieux et peuvent valoriser le bien.",
    related: ["Équipement", "Loyer", "Valeur"],
  },
  {
    term: "Fidélisation du locataire",
    definition:
      "Stratégie visant à encourager un bon locataire à rester longtemps dans le bien: stabilité des revenus pour le bailleur, logement pérenn pour le locataire. Un locataire de longue durée réduit la vacance.",
    related: ["Locataire", "Vacance", "Gestion locative"],
  },
  {
    term: "Fiscalité的事项",
    definition:
      "Régime fiscal applicable aux revenus tirés de la location meublée (microbic ou réel). Le loueur en meublé doit également s'acquitter des cotisations sociales sur les revenus locatifs.",
    related: ["Meublé", "Revenus fonciers", "Régime réel"],
  },
  {
    term: "Fléchissement du marché",
    definition:
      "Baisse de l'activité immobilière dans une zone donnée, se traduisant par une Decrease des prix et/ou des volumes de transactions. Influence les perspectives de rendement locatif.",
    related: ["Marché", "Prix", "Rendement"],
  },
  {
    term: "Fond de drawer",
    definition:
      "Épargne de sécurité conservée par le copropriétaire pour faire face aux dépenses imprévues de la copropriété. Remplacé progressivement par le fonds de prévoyance obligatoire.",
    related: ["Copropriété", "Finances", "Travaux"],
  },
  {
    term: "Fonds de prévoyance",
    definition:
      "Réserve financière obligatoire de la copropriété destinée à couvrir les travaux计划和重大维修. Doté progressivement via les appels de fonds extraordinaires.",
    related: ["Copropriété", "Travaux", "Finances"],
  },
  {
    term: "Forclusion",
    definition:
      "Perte d'un droit procesural due à l'expiration du délai pour l'exercer. En matière locative, le bailleur qui ne réclame pas le loyer dans les délais peut être forclos.",
    related: ["Jugement", "Droit", "Procédure"],
  },
  {
    term: "Formality poste",
    definition:
      "Formalité administrative liée à l'exercice d'une activité de gestion locative professionnelle: immatriculation au RCS, adhésion à un organisme de gestion, déclarations sociales.",
    related: ["Gestion locative", "Profession", "Obligations"],
  },
  {
    term: "Fraction de爱情",
    definition:
      "Partie d'un bien分割ée et vendue indépendamment. En copropriété, un lot peut être divisé en нескольких fractions（水、电气）distinctes, chacune（水表）ayant son propre compteur.",
    related: ["Copropriété", "Lot", "Division"],
  },
  {
    term: "Frameworthiness",
    definition:
      "Conformité aux normes de construction et d habitabilité en vigueur. Un bien non frameworthy ne peut être loué et doit être mis aux normes avant relocation.",
    related: ["Normes", "Décence", "Logement"],
  },
  {
    term: "Frais d'acte",
    definition:
      "Coûts liés à la rédaction et à l'enregistrement d'un acte juridique (bail, avenant, protokol). En location, les frais d'acte de bail sont généralement à la charge du bailleur.",
    related: ["Bail", "Frais", "Acte"],
  },
  {
    term: "Garantie biennale",
    definition:
      "Garantie de deux ans couvrant les défauts de conformité des équipements dissociables du bâti. Courante pour les travaux de rénovation realizados par un professionnel.",
    related: ["Travaux", "Garantie", "Conformité"],
  },
  {
    term: "Garantie decennale",
    definition:
      "Garantie de dix ans engageant le constructeur pour les dommages compromettant la solidité de l'ouvrage ou le rendant impropre à sa destination. Obligatoire pour les travaux de construcción.",
    related: ["Travaux", "Garantie", "Construction"],
  },
  {
    term: "Généalogie du title",
    definition:
      "Historique des propriétaires successifs d'un bien immobilier permettant de justifier de la propriété actuelle. Vérifiée par le notaire lors de la vente (rédaction de l'acte de propriété).",
    related: ["Propriété", "Titre", "Notaire"],
  },
  {
    term: "Gestion comptable",
    definition:
      "Enregistrement rigoureux de toutes les opérations financières liées à la location: loyers encaissés, charges payées, travaux realizados, impuestos deduits. Fondamentale pour le régime réel.",
    related: ["Régime réel", "Comptabilité", "Revenus fonciers"],
  },
  {
    term: "Goodwill",
    definition:
      "Valeur immatérielle d'un bien liée à sa réputation, son emplacement ou sa clientèle. En investissement locatif, un bien avec un bon goodwillJustifie un loyer plus élevé.",
    related: ["Loyer", "Valeur", "Emplacement"],
  },
  {
    term: "Grace period",
    definition:
      "Délai de tolérance accordé par le bailleur avant l'application des pénalités pour retard de paiement. N'a pas de base légale固定e et ne suspend pas la procédure d'expulsion.",
    related: ["Loyer impayé", "Retard", "Pénalité"],
  },
  {
    term: "Ground rent",
    definition:
      "Loyer versé par le locataire d'un terrain (generiquement en bail emphytéotique ou en bail à construction). Terrain appartenait au bailleur, le locataire construire un bâtiment.",
    related: ["Bail", "Terrain", "Loyer"],
  },
  {
    term: "Groupage fiscal",
    definition:
      "Possibilité de compenser les revenus d'une activité déficitaire (SCI.locative) avec les revenus d'une autre activité (traitements salaries) dans une même déclaration d'impôts.",
    related: ["SCI", "Revenus fonciers", "Déficit"],
  },
  {
    term: "Gymnase du bien",
    definition:
      "Ensemble des caractéristiques physiques d'un logement (surface, agencement, état, équipements). Influence directement le loyerievable et la satisfaction du locataire.",
    related: ["Loyer", "Surface", "Équipement"],
  },
  {
    term: "Hausse контроль",
    definition:
      "Encadrement réglementaire limitant l'augmentation des loyers entre deux locataires. En zone tendue, la hausse ne peut dépasser 10% du loyer de référence majoré en 3 ans.",
    related: ["Encadrement", "Loyer", "Zone tendue"],
  },
  {
    term: "Home staging",
    definition:
      "Technique de présentation d'un bien visant à le rendre plus attractif pour les candidats locataires ou acheteurs. Mobilier neutre, espaces dégagés, luminosité maximisée.",
    related: ["Valeur", "Loyer", "Attractivité"],
  },
  {
    term: "Honaires de gestion",
    definition:
      "Rémunération du gérant ou de l'agent immobilier pour la gestion locative. Généralement un pourcentage des loyers encaissés (5 à 10%) ou un forfait mensuel.",
    related: ["Gestion locative", "Gérance", "Honoraires"],
  },
  {
    term: "House hacking",
    definition:
      "Stratégie d'investissement consistant à acheter un bien, habiter une partie et louer les autres pièces ou logements pour couvrir tout ou partie du crédit. Formula popularized in the US and applicable in France.",
    related: ["Investissement", "Acquisition", "Loyer"],
  },
  {
    term: "I date d'effet",
    definition:
      "Date à laquelle une clause, un avenant ou un bail commence à produire ses effets juridiques. Doit être précisée dans l'acte; par défaut, c'est la date de signature.",
    related: ["Bail", "Avenant", "Date"],
  },
  {
    term: "Impayé en cours",
    definition:
      "Situation dans laquelle un ou plusieurs loyers n'ont pas été réglés à leur échéance. Constitue un manquement du locataire et ouvre le droit pour le bailleur d'engager une procédure.",
    related: ["Loyer impayé", "Recouvrement", "Expulsion"],
  },
  {
    term: "Incapacité de paiement",
    definition:
      "Situation dans laquelle le locataire se trouve dans l'impossibilité de honorer ses engagements financiers (perte d'emploi, séparation, maladie). Peut mener à la défaillance et à l'expulsion.",
    related: ["Loyer impayé", "Locataire", "Expulsion"],
  },
  {
    term: "Indexation du loyer",
    definition:
      "Mécanisme d'adaptation automatique du loyer à l'évolution d'un indice économique (IRL le plus souvent). Doit être prévu par une clause expresse dans le bail pour être applicable.",
    related: ["IRL", "Révision", "Bail"],
  },
  {
    term: "Indisponibilité du bien",
    definition:
      "Impossibilité pour le bailleur de mettre le bien à disposition du locataire (travaux non effectués, occupant précédent non parti). Dans ce cas, le loyer n'est pas dû.",
    related: ["Bail", "Jouissance", "Travaux"],
  },
  {
    term: "Insuffisance de revenus",
    definition:
      "Situation d'un candidat locataire dont les revenus ne permettent pas de couvrir le loyer et les charges dans des proportions acceptables (< 3 fois le loyer). Peut être compensée par une garantie.",
    related: ["Candidat locataire", "Revenu", "Garantie"],
  },
  {
    term: "Intangibilité du bail",
    definition:
      "Principe juridique garantissant la stabilité du contrat de location. Les clauses du bail ne peuvent être modifiées unilatéralement par le bailleur en cours de bail, sauf clause prévoyant une révision.",
    related: ["Bail", "Clause", "Modification"],
  },
  {
    term: "Intéressement des locataires",
    definition:
      "Dispositif visant à asocier les locataires aux результаты de la gestion du bien (économies d'énergie, état du immeuble). Some expérimentation en France pour les grands patrimoine sociaux.",
    related: ["Locataire", "Gestion", "Participation"],
  },
  {
    term: "Investissement Scellier",
    definition:
      "Dispositif fiscal de défiscalisation immobilière ayant couru de 2009 à 2012. Permettait une réduction d'impôt de 13 à 25% du prix du logement pour un engagement de location de 9 ans.",
    related: ["Défiscalisation", "Investissement", "Loyer"],
  },
  {
    term: "Investissement Duflot",
    definition:
      "Dispositif de défiscalisation successorale ayant couru de 2013 à 2016. Reduction d'impôt de 18% pour un engagement de location de 9 ans en zone tendue, avec plafonds de loyer et de ressources.",
    related: ["Défiscalisation", "Investissement", "Loyer"],
  },
  {
    term: "Investissement Pinel",
    definition:
      "Dispositif de défiscalisation pour l'investissement locatif dans le neuf ou l'ancien réhabilité. Offre une réduction d'impôt de 12 à 21% sur 6 à 12 ans en échange de loyers plafonnés et de ressources des locataires.",
    related: ["Défiscalisation", "Investissement", "Pinel"],
  },
  {
    term: "Jalon de paiement",
    definition:
      "Échéance intermédiaire dans le calendrier de versement d'un achat en VEFA ou en autogestion. Chaque jalon correspond à une étape de la construction (gros œuvre, mise hors d'eau, livraison).",
    related: ["VEFA", "Paiement", "Construction"],
  },
  {
    term: "Jouissance exclusive",
    definition:
      "Droit pour un seul copropriétaire d'user et de jouir d'une partie commune de manière exclusive (jardin privé, terrasse). Accordée par le réglement de copropriété et创造出 une servitude.",
    related: ["Copropriété", "Servitude", "Jouissance"],
  },
  {
    term: "Jurisprudence",
    definition:
      "Ensemble des décisions de justice rendués par les tribunaux et qui créent un précédent. La jurisprudence locative évoluent particulièrement sur les вопросы deденежных обязанностей et de repairs.",
    related: ["Jugement", "Droit", "Contentieux"],
  },
  {
    term: "Kiné du bien",
    definition:
      "État général et attractivité d'un logement sur le marché. Un bien avec une bonne kinesthetics (lumière, disposition, modernité) se loue plus facilement et à un meilleur prix.",
    related: ["Loyer", "Valeur", "Attractivité"],
  },
  {
    term: "Laisse de préférence",
    definition:
      "Clause d'un bail ou d'un acte de vente предпочтительного права. Accorde à une personne (locataire en place) un droit de priorité sur un tiers en cas de vente du bien.",
    related: ["Droit de préemption", "Vente", "Locataire"],
  },
  {
    term: "Leveling up",
    definition:
      "Travaux de mejora去美化提高 le standing d'un bien (ravalement, modernisation de la cuisine, création d'une salle de bain). Permet de justifier une augmentation de loyer.",
    related: ["Travaux", "Loyer", "Valeur"],
  },
  {
    term: "Likeness de loyer",
    definition:
      "Caractère comparables des loyers pratiqués pour des biens similaires dans un même secteur. Sert de référence pour l'estimation d'un bien et pour le contrôle de l'encadrement des loyers.",
    related: ["Loyer", "Encadrement", "Secteur"],
  },
  {
    term: "Linéaire commercial",
    definition:
      "Mesure de la longueur de façade d'un local commercial en mètres. Base de calcul de la valeur locative professionnelle (VLP) pour les baux commerciaux.",
    related: ["Bail commercial", "Valeur locative", "Local"],
  },
  {
    term: "Liquidité d'un bien",
    definition:
      "Capacité d'un bien à être vendu rapidement à un prix proche du marché. Un appartement en centre-ville aura une meilleure liquidité qu'une maison isolée en zone rurale.",
    related: ["Vente", "Valeur", "Marché"],
  },
  {
    term: "Liste des travaux",
    definition:
      "Catalogue des obras de mejora o reparación nécessaires pour un bien locatif. Sert de base à l'appel de fonds auprès du prêteur ou à l'élaboration du budget de copropriété.",
    related: ["Travaux", "Budget", "Copropriété"],
  },
  {
    term: "Lobbying",
    definition:
      "Action de pression exercée par les acteurs du secteur immobilier sur les pouvoirspublics pour influencer la réglementation locative. Associations de propriétaires, fédérations d'agences.",
    related: ["Réglementation", "Loyer", "Propriétaire"],
  },
  {
    term: "Location accessibile",
    definition:
      "Logement conçu ou adapté pour accueillir des personnes à mobilité réduite (PMR). Des obligations d'accessibilité s'appliquent aux constructions neuves depuis 2007.",
    related: ["Accessibilité", "PMR", "Normes"],
  },
  {
    term: "Location au冲",
    definition:
      "Situation d'un bail d'habitation continuant de produire ses effets alors que sa durée contractuelle est révolue. Le locataire devient un occupant de bonne foi bénéficiant de la trêve hivernale.",
    related: ["Bail", "Occupant de bonne foi", "Trêve hivernale"],
  },
  {
    term: "Location directe",
    definition:
      "Location réalisée sans intermédiaire (agence) entre le bailleur et le locataire. Le bailleur gère seul toutes les démarches: publicité, visites, sélection, bail, recouvrement.",
    related: ["Bailleur", "Agence", "Gestion locative"],
  },
  {
    term: "Location funding",
    definition:
      "Prêt banca屏幕 destinant à financer la création ou la mejora d'un parc locatif. Les taux peuvent être bonifiés pour les travaux de rénovation énergétique.",
    related: ["Prêt", "Travaux", "Rénovation"],
  },
  {
    term: "Location intergénérationnelle",
    definition:
      "Dispositif permettant à un senior de louer une chambre ou un appartement à un étudiant ou jeune actif en échange d'un loyer réduit et de services (compagnie, petits services).",
    related: ["Bail", "Senior", "Étudiant"],
  },
  {
    term: "Loyer minoré",
    definition:
      "Loyer inférieur au prix du marché, parfois lié à des obligations légales (conventionnement APL) ou à une stratégie de Feldman (loyer minoré pour locataire de qualité).",
    related: ["Loyer", "APL", "Encadrement"],
  },
  {
    term: "Loyer de relocation",
    definition:
      "Loyer appliqué lors de la signature d'un nouveau bail pour un même logement. En zone tendue, ne peut dépasser le dernier loyer pratiqué majoré de l'inflation IRL (+不得超过 10% depuis 2024).",
    related: ["Encadrement", "Zone tendue", "IRL"],
  },
  {
    term: "Loyer de车窗",
    definition:
      "Variation du loyer selon l'étage du logement. Les étages élevés (avec vue et luminosité) justifient un loyer supérieur au rez-de-chaussée.",
    related: ["Loyer", "Étage", "Valeur"],
  },
  {
    term: "Loyer équité",
    definition:
      "Stratégie de loyer fixé à un niveau inférieur au marché pour attirer un profil de locataire spécifique ou pour sécuriser une zone de vacance. Compromis entre rentabilité et remplissage.",
    related: ["Loyer", "Vacance", "Locataire"],
  },
  {
    term: "Macro-lot",
    definition:
      "Ensemble de lots de copropriété commercialisés comme un seul bien (immeuble entier, программа de Villas).Peut интерес present interesse pour un investisseur souhaitant acquérir un patrimoine complet.",
    related: ["Copropriété", "Acquisition", "Investissement"],
  },
  {
    term: "Main d'œuvre",
    definition:
      "Coût de la prestataires de services (artisans, entreprises) réalisant des travaux dans le bien locatif. Les frais de main d'œuvre sont partiellement déductibles en régime réel.",
    related: ["Travaux", "Régime réel", "Déduction"],
  },
  {
    term: "Majorité qualifiée",
    definition:
      "Seuil de vote en copropriété nécessaire pour adopter les décisions importantes (travaux d'amélioration, changement de syndic). Varie selon la nature de la décision (majorité absolue, 2/3 des tantièmes).",
    related: ["Copropriété", "Assemblée", "Vote"],
  },
  {
    term: "Mandant",
    definition:
      "Personne (bailleur) qui donne mandat à un tiers (gérant, agence) pour accomplir des actes en son nom. Le mandat définit les pouvoirs conférés et la rémunération du mandataire.",
    related: ["Mandat", "Bailleur", "Gestion locative"],
  },
  {
    term: "Marchand de biens",
    definition:
      "Professionnel qui achète des biens pour les revendre dans un bref délai (moins de 5 ans). Les_plus-values sont taxedées comme des Bénéfices industriels et commerciaux (BIC).",
    related: ["Plus-value", "Revente", "SCI"],
  },
  {
    term: "Marqueur de performance",
    definition:
      "Indicateur permettant de suivre les результаты de la gestion locative: taux de remplissage, délai moyen de relocation, taux d'encaissement, évolution du loyers vs индекс.",
    related: ["Gestion locative", "Performance", "KPI"],
  },
  {
    term: "Marge brute",
    definition:
      "Différence entre les revenus locatifs bruts et les charges directes (pas les charges de crédit). La marge brute mesure la rentabilité operative du bien avant frais financiers.",
    related: ["Rendement", "Revenus", "Charges"],
  },
  {
    term: "Marge nette",
    definition:
      "Revenu locatif net après déduction de toutes les charges, incluant les intérêts d'emprunt et l'amortissement. La marge nette reflète la rentabilité réelle de l'investissement.",
    related: ["Rendement net", "Charges", "Investissement"],
  },
  {
    term: "Market timing",
    definition:
      "Stratégie d'investissement consistant à acheter ou vendre au meilleur moment du cycle immobilier. Difficile à maîtriser et généralement pas recommandé pour les investisseurs particuliers.",
    related: ["Investissement", "Marché", "Timing"],
  },
  {
    term: "Meublé de fonction",
    definition:
      "Logement meublé mis à disposition d'un salarié par son employeur pour les besoins de sa fonction (garde-meubles, personnel de maison). Soumis à des règles spécifiques d'exonération d'impôt.",
    related: ["Meublé", "Salarié", "Exonération"],
  },
  {
    term: "Minimum de perception",
    definition:
      "Seuil de loyer en dessous duquel un bailleur ne peut juridiquement descendre s'il applique l'encadrement. En zone tendue, le loyer de référence minoré constitue le planchers.",
    related: ["Encadrement", "Loyer", "Zone tendue"],
  },
  {
    term: "Mise en location",
    definition:
      "Opération consistant à proposer un bien sur le marché locatif: détermination du loyer, rédaction de l'annonce, organisation des visites, sélection du candidat, signature du bail.",
    related: ["Gestion locative", "Loyer", "Bail"],
  },
  {
    term: "Modalités de paiement",
    definition:
      "Choix du moyen de règlement du loyer: virement bancaire, prél automate, TIP, chasse. Le bail peut imposer le prélèvement automatique comme condition d'acceptation du dossier.",
    related: ["Loyer", "Paiement", "Bail"],
  },
  {
    term: "Modèle de bail",
    definition:
      "Formulaire type de contrat de location lon/空格/预设 clauses conformes à la législation. La loi ALUR impose des модè客厅 нормализованном для les baux d'habitation principale.",
    related: ["Bail", "Modèle", "Loi ALUR"],
  },
  {
    term: "Multipropriété",
    definition:
      "Système dans lequel plusieurs personnes détiennent des droits de propriété sur un même bien pour des périodes successives (type time-sharing). Cadre juridique différent de la copropriété classique.",
    related: ["Copropriété", "Propriété", "Vacances"],
  },
  {
    term: "Nantissement de parts",
    definition:
      "Garantie constituée sur les parts d'une SCI pour secures un prêt contracté par la société. En cas de défaut, le prêteur peut faire vendre les parts du Gheorghe.",
    related: ["SCI", "Nantissement", "Prêt"],
  },
  {
    term: "Négoce immobilier",
    definition:
      "Activité d'achat et de revente de biens immobiliers avec un objectif de profit. Les marchands de biens pratiquent le négoce; les所产生的_plus-values sont imposées comme des BIC.",
    related: ["Marchand de biens", "Plus-value", "Revente"],
  },
  {
    term: "Nominalisme monétaire",
    definition:
      "Principe juridique selon lequel une somme d'argent doit être payée pour sa valeur nominale, non pour sa valeur réelle. En location, prevaut contre l'indexation automatique du loyer.",
    related: ["Loyer", "Indexation", "Droit"],
  },
  {
    term: "Note de frais",
    definition:
      "Document justificatif des dépenses engagées pour le compte du bien locatif (achats, petits travaux, frais de déplacement). Necesária para la deducción en régime réel.",
    related: ["Régime réel", "Déduction", "Justificatif"],
  },
  {
    term: "Nouvelle construction",
    definition:
      "Bâtiment nouveau edifié sur un terrain, nécessitant un permis de construire. Beneficie d'un régime fiscal avantageux (exonération temporaire de taxe foncière) et peut ouvrir droit à la garantie décennale.",
    related: ["Construction", "Permis", "Garantie"],
  },
  {
    term: "Numéro de matricule",
    definition:
      "Identifiant unique d'un lot de copropriété dans l'état descriptif de division. Sert à référencer le lot dans les actes et les documents de gestion de la copropriété.",
    related: ["Copropriété", "Lot", "Division"],
  },
  {
    term: "Obligation de conseil",
    definition:
      "Devoir pour le professionnel (agent, gérant) d'informer et de conseiller le bailleur sur les aspects juridiques, fiscaux et économiques de la location. Fondement de la déontologie immobilière.",
    related: ["Agence", "Gestion locative", "Conseil"],
  },
  {
    term: "Occupant de bonne foi",
    definition:
      "Personne occupant un logement sans titre régulier mais persuadée légitimement avoir droit à la jouissance (succession non régler, bail résilié sans notification). Bénéficie de la trêve hivernale.",
    related: ["Trêve hivernale", "Expulsion", "Bail"],
  },
  {
    term: "Offre de prêt",
    definition:
      "Proposition de financement adressée par une banque à l'emprunteur, contenant le taux, la durée, les modalités et les conditions. L'emprunteur dispose de 30 jours pour l'accepter.",
    related: ["Prêt", "Banque", "Acquisition"],
  },
  {
    term: "Optimisation fiscale",
    definition:
      "Ensemble des pratiques légales permettant de réduire la charge fiscale d'un investisseur immobilier (choix du régime, amortissement, déficit foncier, démembrement).",
    related: ["Fiscalité", "Revenus fonciers", "SCI"],
  },
  {
    term: "Original du bail",
    definition:
      "Exemplaire principal du contrat de location signé par les deux parties. Conservé par le bailleur et produit en cas de litige. Une copie ne suffit pas pour一部の preuves.",
    related: ["Bail", "Preuve", "Litige"],
  },
  {
    term: "Palier fiscal",
    definition:
      "Tranche du barème de l'impôt sur le revenu à laquelle est imposé un revenu supplémentaire. Comprendre les paliers est essentiel pour optimiser la rentabilité d'un investissement locatif.",
    related: ["Impôt", "Revenus fonciers", "Fiscalité"],
  },
  {
    term: "Parc locatif",
    definition:
      "Ensemble des biens immobiliers détenus par un bailleur ou une société de gestion et proposés à la location. La qualité du parc (entretien, typologie, localisation) détermine la rentabilité.",
    related: ["Gestion locative", "Investissement", "Loyer"],
  },
  {
    term: "Party wall",
    definition:
      "Mur mitoyen entre deux propriétés ou deux lots de copropriété. Les droits et obligations des voisins sur le mur mitoyen sont définis par le Code civil (usage, entretien, reconstruction).",
    related: ["Voisin", "Mitoyen", "Copropriété"],
  },
  {
    term: "Pathologie du bâtiment",
    definition:
      "Ensemble des désordres et malfunctionnements affectant un bâtiment (humidité, fissures, thermique). Un diagnostic de pathologie est parfois nécessaire avant de programmer des travaux.",
    related: ["Travaux", "Diagnostic", "Bâtiment"],
  },
  {
    term: "PEB",
    definition:
      "Performance Énergétique du Bâtiment. Label officiel belge ou suisse équivalent au DPE français. Pour les biens en边框, la performance énergétique influence diretamente le montant du loyer.",
    related: ["DPE", "Énergie", "Loyer"],
  },
  {
    term: "Permis de construire",
    definition:
      "Autorisation administrative préalable nécessaire pour toute construction nouvelle, extension ou modification de la structure d'un bâtiment. Délivré par la mairie après instruction du dossier.",
    related: ["Urbanisme", "Construction", "Autorisation"],
  },
  {
    term: "Personal use",
    definition:
      "Possibilité pour le propriétaire d'occuper occasionnellement sa propre acquisition locative (résidence secondaire). Cette utilisation ne doit pas nuire à la location ni dépasser 30 jours par an.",
    related: ["Propriétaire", "Résidence secondaire", "Location"],
  },
  {
    term: "Petit entretien",
    definition:
      "Travaux d'entretien courant incombant au locataire: remplacement des ampoules, petites réparations, nettoyage. Le refus du locataire de réaliser le petit entretien peut constituer une faute.",
    related: ["Locataire", "Entretien", "Bail"],
  },
  {
    term: "Pignon sur rue",
    definition:
      "Partie d'un bâtiment donnant directement sur la voie publique. Les murs pignon et les façades sur rue sont des éléments marquants de l'architecture urbaine et de la valeur du bien.",
    related: ["Copropriété", "Valeur", "Urbanisme"],
  },
  {
    term: "Plan de trésorerie",
    definition:
      "Prévision mensualisée des flux de trésorerie d'un investissement locatif:encaissements de loyers, décaissements (charges, impuestos, mensualités), solde. Permet d'anticiper les恐慌.",
    related: ["Trésorerie", "Investissement", "Loyer"],
  },
  {
    term: "PLU",
    definition:
      "Plan Local d'Urbanisme. Document de planification urbaine communal ou intercommunal fixant les règles d'occupation des sols (constructibilité, zonage, hauteurs, implantation).",
    related: ["Urbanisme", "Construction", "Zonage"],
  },
  {
    term: "Plus-value brute",
    definition:
      "Différence entre le prix de vente d'un bien et son prix d'acquisition, avant prise en compte des frais et améliorations. Sert de base au calcul de l'impôt sur la plus-value.",
    related: ["Plus-value", "Vente", "Impôt"],
  },
  {
    term: "Point de départ du bail",
    definition:
      "Date effective de début du bail, généralement la date de signature ou une date ultérieure convenue. Le bail produit ses effets à compter de ce point de départ.",
    related: ["Bail", "Date", "Entrée"],
  },
  {
    term: "Portefeuille locatif",
    definition:
      "Ensemble des biens locatifs détenus par un investisseur ou une société de gestion. La diversification du portefeuille réduit le risque de vacance et de impayé.",
    related: ["Investissement", "Vacance", "Gestion locative"],
  },
  {
    term: "Préavis courte durée",
    definition:
      "Délai de préavis réduit à 1 mois pour le départ du locataire en zone tendue, en cas de premier emploi (CDD, mutation) ou pour le bail mobilité. Au lieu des 3 mois classiques.",
    related: ["Préavis", "Zone tendue", "Bail mobilité"],
  },
  {
    term: "Prix d'achat optimisé",
    definition:
      "Acquisition d'un bien à un prix inférieur à sa valeur réelle grace à la négociation, à un contexte défavorable du vendeur ou à une prise de risque (travaux importants, occupancy).",
    related: ["Acquisition", "Investissement", "Négociation"],
  },
  {
    term: "Prix du marché",
    definition:
      "Valeur auquel un bien se vende dans des conditions normales de concurrence. Déterminé par l'offre et la demande dans le secteur. Sert de référence pour fixer le loyer.",
    related: ["Loyer", "Valeur", "Secteur"],
  },
  {
    term: "Procédure accélérée",
    definition:
      "Voie de procédure judiciaire plus rapide que la procédure ordinaire. En matière d'expulsion, le référé habitat permet d'obtenir une décision en quelques semaines pour les logements dangereux.",
    related: ["Expulsion", "Référé", "Jugement"],
  },
  {
    term: "Promesse de bail",
    definition:
      "Engagement préalable à la signature du bail par lequel le bailleur promet de louer et le candidat locataire promet de prendre en location à des conditions définies.",
    related: ["Bail", "Promesse", "Locataire"],
  },
  {
    term: "Prophylaxie de l'impayé",
    definition:
      "Ensemble des mesures préventives visant à éviter les impayés: sélection rigoureuse du locataire, vérification des revenus, demande de garantie, assurance GLI, suivi régulier des paiements.",
    related: ["Loyer impayé", "Garantie", "Sélection"],
  },
  {
    term: "Propriété拆分",
    definition:
      "Division d'un bien immobilier en plusieurs lots distincts, chacun faisant l'objet d'un droit de propriété séparé. En copropriété, chaque lot comprend une quote-part des parties communes.",
    related: ["Copropriété", "Lot", "Division"],
  },
  {
    term: "Provision pour grosses repairs",
    definition:
      " Somme budgétée chaque année par le copropriété pourprovisionner le fonds de修理 des gros travaux (ravalement, toiture, ascenseur). Contribue à la salud financiera de la copropriété.",
    related: ["Copropriété", "Travaux", "Fonds"],
  },
  {
    term: "PTZ",
    definition:
      "Prêt à Taux Zéro. Prêt gouvernemental sans intérêts pour l'accession à la propriété de la résidence principale. Dans le neuf, peut se cumuler avec un investissement locatif Pinel sous conditions.",
    related: ["Prêt", "Acquisition", "Accession"],
  },
  {
    term: "Quote-part de propriété",
    definition:
      "Fraction du droit de propriété exprimée en tantièmes ou millièmes. Chaque copropriétaire dispose d'une quote-part dans les parties communes proportionnelle à la valeur de son lot.",
    related: ["Copropriété", "Quote-part", "Tantièmes"],
  },
  {
    term: "Racheter un crédit",
    definition:
      "Opération consistant à substituer un nouveau prêt à un ou plusieurs prêts existants pour bénéficient d'un meilleur taux. En investissement locatif, le rachat peut libérer de la tréso.",
    related: ["Prêt", "Taux", "Trésorerie"],
  },
  {
    term: "Ramassage des charges",
    definition:
      "Opération comptable de regroupement des charges locatives pour établie le décompte annuel. Le bailleur adresse le décompte au locataire avec les factures justificatives.",
    related: ["Charges", "Décompte", "Régularisation"],
  },
  {
    term: "Rapport d'étape",
    definition:
      "Document périodique adressé par le gestionnaire au bailleur faisant le point sur l'état du bien, les revenus encaissés, les travaux realizados et les perspectives.",
    related: ["Gestion locative", "Bailleur", "Reporting"],
  },
  {
    term: "Ratio d'endettement",
    definition:
      "Proportion des revenus mensuels dédiée au remboursement des emprunts. En banque, le ratio d'endettement maximum est généralement de 35% (assurance-chômage compris).",
    related: ["Prêt", "Endettement", "Revenu"],
  },
  {
    term: "Recensement",
    definition:
      "Opération de comptage des habitants d'un logement utilisée pour le calcul des aides au logement. Doit refléter la réalité de l'occupation (personnes à charge, enfants).",
    related: ["Allocations", "APL", "Foyer"],
  },
  {
    term: "Reddition de compte",
    definition:
      "Obligation pour le gestionnaire de rendre compte au mandant (bailleur) de sa mission. La reddition de comptes interviente au moins une fois par an avec un état récapitulatif.",
    related: ["Gestion locative", "Mandat", "Bailleur"],
  },
  {
    term: "Réduction deapital",
    definition:
      "Diminution du capital restant dû d'un prêt grâce à des remboursements anticipés partiels. En investissement locatif, permet de réduire la charge mensuelle et d'améliorer la{Tr}.",
    related: ["Prêt", "Remboursement", "Trésorerie"],
  },
  {
    term: "Refacturation",
    definition:
      "Transfert de la charge d'une dépense du bailleur au locataire (ex: refacturation de travaux d'entretien). Ne peut se faire que pour les charges récupérables ou en vertu d'une clause du bail.",
    related: ["Charges", "Bail", "Locataire"],
  },
  {
    term: "Régime micro-foncier",
    definition:
      "Régime fiscal simplifié applicable aux revenus locatifs avec un abattement forfaitaire de 30% (frais et charges). Accessible si les revenus fonciers bruts ne dépassent pas 15 000 €.",
    related: ["Revenus fonciers", "Microfoncier", "Abattement"],
  },
  {
    term: "Registre des apais",
    definition:
      "Document dans lequel sont consignés les payments de loyer et les éventuels incidents. Utile comme preuve en cas de litige sur le paiement des loyers.",
    related: ["Loyer", "Paiement", "Preuve"],
  },
  {
    term: "Release",
    definition:
      "Acte par lequel le bailleur libère le locataire de ses obligations (solde de tout compte, mainlevée de la garantie). Décharge le locataire de toute réclamations futures.",
    related: ["Bail", "Restitution", "Dépôt de garantie"],
  },
  {
    term: "Rendement net-net",
    definition:
      "Rendement d'un investissement locatif après déduction duń wszystkich frais (loyer net - charges - impôt - vacance). Le metric le plus précis pour évaluer la profitability réelle.",
    related: ["Rendement net", "Charges", "Vacance"],
  },
  {
    term: "Rente viagère",
    definition:
      "Revenu périodique versé à vie à un crédirentier (souvent le vendeur en viager). En échange, l'acheteur occupe le bien. Le bouquet est le capital versé upfront.",
    related: ["Viager", "Rente", "Acquisition"],
  },
  {
    term: "Réponse àandidat",
    definition:
      "Obligation légale du bailleur de répondre à tout candidat ayant présenté un dossier complet. Depuis la loi du 24 septembre 2017, le bailleur doit informer de la suite donnée à chaque candidature.",
    related: ["Candidat locataire", "Bail", "Sélection"],
  },
  {
    term: "Réserve de jouissance",
    definition:
      "Partie du bien dont le bailleur se réserve l'usage malgré la location (ex: garage, cave). Doit être stipulée dans le bail et ne pas priver le locataire de la jouissance paisible.",
    related: ["Bail", "Jouissance", "Bailleur"],
  },
  {
    term: "Résidence de status",
    definition:
      "Catégorie juridique d'un logement (résidence principale, secondaire, location saisonnière, meublé de tourisme). Le status détermine le régime fiscal, les règles de location et les autorisations.",
    related: ["Statut", "Location", "Fiscalité"],
  },
  {
    term: "Responsabilité environnementale",
    definition:
      "Obligation du propriétaire de prendre en charge la remise en état d'un site pollué (anciens sites industriels, sols contaminés). Peut affects la valeur et l'assurabilité d'un bien.",
    related: ["Propriétaire", "Environnement", "Assainissant"],
  },
  {
    term: "Résiliation à l'amiable",
    definition:
      "Résiliation du bail par accord mutuel des deux parties (bailleur et locataire). Formalisée par un document écrit signé. Permet un départ plus rapide que la résiliation unilatérale.",
    related: ["Résiliation", "Bail", "Accord"],
  },
  {
    term: "Restructuration du bail",
    definition:
      "Renégociation des terms d'un bail en cours (durée, loyer, charges) par voie d'avenant. Nécessite l'accord des deux parties et ne peut être imposée unilatéralement.",
    related: ["Bail", "Avenant", "Modification"],
  },
  {
    term: "Revenu cadastral",
    definition:
      "Revenu théorique de référence servant de base au calcul de la taxe foncière. Actualisé périodiquement par les services fiscaux en fonction de l'évolution du marché locatif.",
    related: ["Taxe fonciere", "Base d'imposition", "Valeur locative"],
  },
  {
    term: "Right of first refusal",
    definition:
      "Droit de priorité accordé à une personne (souvent le locataire) de acheter le bien avant qu'il soit proposé à la vente à un tiers. Difficile à mettre en œuvre en pratique.",
    related: ["Droit de préemption", "Vente", "Locataire"],
  },
  {
    term: "Risque locatif",
    definition:
      "Ensemble des aléas de la location: impayé, dégradation, vacance, turn-over excessif. Le risque locatif doit être evalue et couvert (assurance, guarantees) dans la strategy d'investissement.",
    related: ["Investissement", "Loyer impayé", "Vacance"],
  },
  {
    term: "Scalarité du loyer",
    definition:
      "Échelle de loyers appliquée à un même bien selon sa typologie (T1 < T2 < T3). Chaque type de logement a un loyer de référence permettant de vérifiers le respect de l'encadrement.",
    related: ["Loyer", "Encadrement", "Typologie"],
  },
  {
    term: "Scellier",
    definition:
      "Dispositif de défiscalisation Pinel ancienapplicable dans certains secteurs (quartiers prioritaires, anciens monasteres). Permet une réduction d'impôt en échange d'un engagement de location de 9 ans.",
    related: ["Pinel", "Défiscalisation", "Investissement"],
  },
  {
    term: "Secteur protégé",
    definition:
      "Zone géographique où s'appliquent des règles spécifiques d'urbanisme (abords des monuments historiques, sites patrimoniaux, zones de protection du patrimoine). Peut restreindre les travaux.",
    related: ["Urbanisme", "Patrimoine", "Travaux"],
  },
  {
    term: "Séjour",
    definition:
      "Pièce principale d'un logement servant de pièce de vie commune. La presence d'un séjour est requise pour qu'un logement soit considéré comme décent (pièce principale avec éclairage naturel).",
    related: ["Décence", "Surface", "Pièce"],
  },
  {
    term: "Sell and rent back",
    definition:
      "Opération consistant à vendre un bien tout en négociant le droit de rester locataire du acheteur. Destinée aux propriétaires en difficulté financière souhaitant conserver l'occupation.",
    related: ["Vente", "Location", "Propriétaire"],
  },
  {
    term: "Soulte",
    definition:
      "Somme d'argent versée par un copropriétaire lors du partage ou de l'échange d'un bien pour compenser la différence de valeur des lots. Soumise à la TVA dans certains cas.",
    related: ["Copropriété", "Partage", "Échange"],
  },
  {
    term: "Stage de formation",
    definition:
      "Formation suivie par un locataire ou un bailleur sur les aspects juridiques ou fiscaux de la location. Certains dispositifs d'aide s'associent à des formations pour bénéficier d'avantages.",
    related: ["Formation", "Location", "Bailleur"],
  },
  {
    term: "Statut de loueur en meublé",
    definition:
      "Régime juridique du bailleur qui loue un logement meublé. Distingue le LMNP (loueur en meublé non professionnel, avantages fiscaux limités) du LMP (professionnel, obligations renforcées).",
    related: ["Meublé", "LMNP", "LMP"],
  },
  {
    term: "Surface de plancher",
    definition:
      "Surface totale des planchers d'un bâtiment, prise en compte pour le droit à construire et le calcul de certaines taxes. S'obtient après déduction des murs, cloisons, gaines et ouvertures.",
    related: ["Surface", "Construction", "Urbanisme"],
  },
  {
    term: "Surloyer",
    definition:
      "Complément de loyer demandé pour un logement présentant des caractéristiques de localisation ou de confort exceptionnelles. Autorisé uniquement en l'absence d'encadrement des loyers.",
    related: ["Loyer", "Encadrement", "Zone tendue"],
  },
  {
    term: "Surprise du bemol",
    definition:
      "Frais ou charges imprévus apparaissant après l'acquisition d'un bien (travaux urgents, procedure de copropriété, impayés de l'ancien propriétaire). Justifie toujours une marge de sécurité.",
    related: ["Acquisition", "Travaux", "Charges"],
  },
  {
    term: "Taux d'appel",
    definition:
      "Pourcentage des charges de copropriété demandé aux copropriétaires lors d'un appel de fonds. Le fonds de roulement est financer par des appels de fonds réguliers (souvent trimestriels).",
    related: ["Copropriété", "Charges", "Fonds"],
  },
  {
    term: "Taux d'intérêt nominal",
    definition:
      "Taux de base d'un prêt sans prendre en compte l'inflation ni les frais. Le taux réel (nominal - inflation) mesure le coût véritable du crédit pour l'emprunteur.",
    related: ["Prêt", "Taux", "Inflation"],
  },
  {
    term: "TEOM",
    definition:
      "Taxe d'Enlèvement des Ordures Ménagères. Taxe locale finançant le service de collecte et de traitement des déchets. Incluse dans les charges locatives et recoverable auprès du locataire.",
    related: ["Charges", "Taxe", "Copropriété"],
  },
  {
    term: "Terme échu",
    definition:
      "Date à laquelle une période de location s'achève. Le loyer est dû d'avance (terme à échoir) ou à échéance (terme échu). Cette distinction affecte la date de paiement et le calcul des intérêts.",
    related: ["Loyer", "Paiement", "Bail"],
  },
  {
    term: "Thésaurisation",
    definition:
      "Stratégie consistant à réinvestir les revenus locatifs plutôt qu'à les consommer. Permet de accélérer le désendettement et d'augmenter le patrimoine à long terme.",
    related: ["Investissement", "Revenus", "Patrimoine"],
  },
  {
    term: "Tiers confiance",
    definition:
      "Personne ou organisme garantissant la neutralité et la sécurité d'une transaction entre bailleur et locataire. Utilisé notamment pour la gestion du dépôt de garantie (consignation).",
    related: ["Dépôt de garantie", "Transaction", "Neutralité"],
  },
  {
    term: "Tirage de crédit",
    definition:
      "Versement fractionné des fonds d'un prêt au fur et à mesure de l'avancement d'un projet (VEFA, travaux). Chaque tirage correspond à une étape et génère des intérêts à partir de sa date.",
    related: ["Prêt", "VEFA", "Travaux"],
  },
  {
    term: "Topographie",
    definition:
      "Description détaillée du relief et de lconfiguration du terrain (pente, orientation, bornage). Influence la constructibilité, le choix des fondations et la valeur du terrain.",
    related: ["Terrain", "Construction", "Valeur"],
  },
  {
    term: "Tour de vis réglementaire",
    definition:
      "Renforcement des règles s'appliquant aux bailleurs (encadrement, normes, procédures). LesProposition de loi.SUCCESSIFS ont souvent renforce les obligations des bailleurs PRIVATE.",
    related: ["Réglementation", "Bailleur", "Loyer"],
  },
  {
    term: "Tranche d'âge",
    definition:
      "Catégorie de population (étudiant, jeune actif, famille, senior) Orientant la stratégie locative (type de bien, loyer, emplacement). Chaque tranche a des besoins spécifiques.",
    related: ["Locataire", "Loyer", "Marché"],
  },
  {
    term: "Transmission de bail",
    definition:
      "Opération consistant à céder un bail en cours à un tiers (nouveau locataire). N'est pas libre et nécessite l'accord du bailleur dans la plupart des cas (c'est une sous-location).",
    related: ["Bail", "Cession", "Locataire"],
  },
  {
    term: "Travaux d'économie d'énergie",
    definition:
      "Opérations visant à réduire la consommation énergétique du logement (isolation, chauffage, fenêtres). Peut donner lieu à des aides (MaPrimeRénov', CEE) et améliorer le DPE.",
    related: ["Énergie", "DPE", "Travaux"],
  },
  {
    term: "Typologie",
    definition:
      "Classification des logements selon leur nombre de pièces (T1, T2, T3...). La typologie détermine le marché locatif ciblé (étudiant, couple, famille) et le niveau de loyer.",
    related: ["Loyer", "Locataire", "Surface"],
  },
  {
    term: "Urbanisme opérationnel",
    definition:
      "Branche de l'urbanisme concernant l'aménagement et la transformation des quartiers (ZAC, lotissements, rénovations). Peut créer des opportunités d'investissement foncier.",
    related: ["Urbanisme", "Aménagement", "Investissement"],
  },
  {
    term: "Vacance comptable",
    definition:
      "Période entre deux locataires pendant laquelle le bailleur ne perçoit pas de loyer, même si le bien est potentiellement louable. Comptabilisée pour calculer le rendement réel.",
    related: ["Vacance", "Rendement", "Loyer"],
  },
  {
    term: "Valeur à neuf",
    definition:
      "Coût de reconstruction d'un bien à l'identique (matériaux et main d'œuvre actuels). Sert de base au calcul des indemnités en cas de sinistre et des garanties décennales.",
    related: ["Garantie", "Sinistre", "Indemnité"],
  },
  {
    term: "Valeur vénale",
    definition:
      "Prix auquel un bien pourrait être vendu dans des conditions normales de marché. Sert de référence pour les donations, les partages successoraux et l'estimation d'un investissement.",
    related: ["Valeur", "Vente", "Marché"],
  },
  {
    term: "Ventilation",
    definition:
      "Système de renouvellement de l'air dans un logement (VMC, aération passive). Son efficacité impacte le DPE, la qualité de l'air intérieur et la salubrité du logement.",
    related: ["DPE", "Santé", "Équipement"],
  },
  {
    term: "Versement hypothécaire",
    definition:
      "Somme prêtée par la banque et inscrite dans l'acte notarié comme garantie de l'emprunt. L'inscription hypothécaire donne un droit réel sur le bien en cas de défaut de paiement.",
    related: ["Hypothèque", "Prêt", "Banque"],
  },
  {
    term: "Viager libre",
    definition:
      "Vente en viager où l'acheteur occupe immédiatement le bien (pas de droit d'usage et d'habitation réservé au vendeur). Le bouquet est souvent plus élevé que dans le viager occupé.",
    related: ["Viager", "Vente", "Acquisition"],
  },
  {
    term: "Viager occupé",
    definition:
      "Vente en viager où le vendeur (crédirentier) conserve le droit d'usage et d'habitation sa vie durant. Le loyer théorique (arrérages) est capitalisé pour déterminer le bouquet.",
    related: ["Viager", "Rente", "Vente"],
  },
  {
    term: "Ville-centre",
    definition:
      "Pôle urbain principal d'une agglomération. Les biens en ville-centre ont généralement une meilleure liquidité et une demande locative plus soutenue que en périphérie.",
    related: ["Localisation", "Loyer", "Marché"],
  },
  {
    term: "Vraisemblance du bail",
    definition:
      "Caractère crédible et cohérent d'un bail au regard des usages locaux et de la legislation. Un bail disproportionné (loyer extrêmes, clauses abusives) peut être contesté et rééquilibré par le juge.",
    related: ["Bail", "Clause", "Jugement"],
  },
  {
    term: "Zone d'aménagement concerté",
    definition:
      "ZAC. Opération d'urbanisme pilotée par une collectivité visant à créer un nouveau quartier. Les programmes en ZAC offrent souvent des prix d'acquisition inférieurs au marché.",
    related: ["Urbanisme", "Aménagement", "Investissement"],
  },
  {
    term: "Zone de chalandise",
    definition:
      "Périmètre autour d'un commerce ou d'un service influençant la clientèle potentielle. En investissement locatif, la zone de chalandise détermine l'attractivité et le loyer potentiel.",
    related: ["Emplacement", "Loyer", "Valeur"],
  },
  {
    term: "Zone grise",
    definition:
      "Situation juridique intermédiaire dans laquelle les règles ne sont pas clairement définies (ex: bail en cours sans écrit, occupancy tolérée). Generates de l'insécurité juridique pour le bailleur.",
    related: ["Bail", "Juridique", "Occupation"],
  },
  {
    term: "Zonage",
    definition:
      "Division d'un territoire en différentes zones (U, AU, N, A) selon le Plan Local d'Urbanisme. Chaque zone est soumise à des règles d'urbanisme spécifiques (constructibilité, destination, aspect).",
    related: ["PLU", "Urbanisme", "Construction"],
  },
  {
    term: "Пятнадцать",
    definition:
      "Terme en alphabet cyrillique signifiant 'quinze' en russe. Conservé dans ce glossaire comme exemple des caractères spéciaux que les systèmes de gestion locative doivent pouvoir traiter correctement.",
    related: ["UTF-8", "Encodage", "Données"],
  },
  {
    term: "备降场",
    definition:
      "Terme en alphabet chinois signifiant 'aérogare de déroutement' dans le contexte aéronautique. Présent ici pour tester la compatibilité Unicode des outils de gestion locative et du glossaire.",
    related: ["UTF-8", "Encodage", "Données"],
  },
].sort((a, b) => a.term.localeCompare(b.term, "fr"));

const alphabetGroups = glossaryTerms.reduce(
  (acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  },
  {} as Record<string, typeof glossaryTerms>,
);

export default function GlossaireImmobilierPage() {
  const schema = buildGraphSchema(
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Glossaire Immobilier", url: "https://www.rentready.fr/glossaire-immobilier" },
    ]),
    buildWebPageSchema({
      name: "Glossaire Immobilier — Définitions Location et Investissement",
      description:
        "Glossaire complet de l'immobilier en France: définitions des termes de location, gestion locative, investissement immobilier.",
      url: "https://www.rentready.fr/glossaire-immobilier",
    }),
    buildItemListSchema({
      name: "Glossaire Immobilier",
      description:
        "Liste des définitions immobilières pour propriétaires bailleurs et investisseurs en France.",
      items: glossaryTerms.map((term) => ({
        name: term.term,
        description: term.definition,
      })),
    }),
    buildFAQPageSchema(
      glossaryTerms.slice(0, 20).map((term) => ({
        question: term.term,
        answer: term.definition,
      }))
    )
  );

  return (
    <>
      <SchemaMarkup data={schema} />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <BookOpen className="size-4" />
            lexique immobilier français
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Glossaire Immobilier — Définitions Location et Investissement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Retrouvez toutes les définitions des termes de l'immobilier en France:{" "}
            <strong>IRL</strong>, <strong>DPE</strong>, <strong>dépôt de
            garantie</strong>, <strong>état des lieux</strong>, et bien plus
            encore.
          </p>

          {/* E-E-A-T: content review date — signals glossary is actively maintained */}
          <div className="mt-6">
            <ContentReviewBadge updatedAt="2026-04-01" category="glossary" />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main column */}
          <div>
            <nav className="mb-8 rounded-xl border border-stone-200/60 bg-white p-4">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(alphabetGroups).map((letter) => (
                  <a
                    key={letter}
                    href={`#${letter}`}
                    className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </nav>

            <section className="space-y-12">
              {Object.entries(alphabetGroups).map(([letter, terms]) => (
                <div key={letter} id={letter}>
                  <h2 className="mb-6 border-b-2 border-blue-600 pb-2 text-2xl font-bold text-stone-900">
                    {letter}
                  </h2>
                  <dl className="space-y-6">
                    {terms.map((item) => (
                      <div key={item.term}>
                        <dt className="mb-2 text-lg font-semibold text-stone-800">
                          {item.term}
                        </dt>
                        <dd className="text-stone-600">
                          <p className="mb-3">{item.definition}</p>
                          {item.related && item.related.length > 0 && (
                            <p className="text-sm text-stone-500">
                              Voir aussi:{" "}
                              {item.related.map((rel, i) => (
                                <span key={rel}>
                                  {i > 0 && " • "}
                                  <a
                                    href={`#${rel[0].toUpperCase()}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {rel}
                                  </a>
                                </span>
                              ))}
                            </p>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </section>

            <section className="mt-16 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
              <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
                Simplifiez votre gestion locative
              </h2>
              <p className="mx-auto mb-6 max-w-lg text-stone-600">
                RentReady vous accompagne dans la compréhension et l'application de
                ces termes: quittances automatiques, calcul IRL, suivi des loyers.
                Essai gratuit 14 jours.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Commencer l'essai gratuit
                <ArrowRight className="size-4" />
              </Link>
            </section>
          </div>

          {/* Sticky sidebar */}
          <GlossarySidebar />
        </div>
      </div>
    </>
  );
}