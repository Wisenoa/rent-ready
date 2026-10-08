export type B1ViewMode =
  // PRODUCT SURFACES
  | "dashboard_default_1440"
  | "dashboard_dense_1440"
  | "dashboard_exceptions_1440"
  | "dashboard_390"
  | "dashboard_360"
  | "home_base_1440"
  | "billing_1440"
  | "lease_detail_1440"
  | "lease_form_1440"
  | "lease_form_errors_390"
  // PUBLIC SURFACES
  | "homepage_1440"
  | "homepage_h1_1440"
  | "homepage_h2_1440"
  | "homepage_390"
  | "pricing_1440"
  | "pricing_390"
  | "free_tool_1440"
  | "free_tool_390"
  | "free_tool_quittance_1440"
  | "article_1440"
  | "article_390"
  | "city_page_1440"
  | "register_1440"
  | "register_390"
  // BRAND SURFACES
  | "wordmark_sheet"
  | "app_icon_sheet"
  | "color_sheet"
  | "typography_sheet"
  | "motion_storyboard";

export interface PropertyUnit {
  id: string;
  city: string;
  address: string;
  type: string;
  surface: number;
  tenantName: string;
  tenantPhone: string;
  rentExpected: number;
  rentReceived: number;
  charges: number;
  status: "calm" | "attention" | "danger" | "vacant";
  exceptionNote?: string;
  dueDate: string;
  receiptAvailable: boolean;
}

export const FIXTURE_10_UNITS: PropertyUnit[] = [
  {
    id: "unit-1",
    city: "Nantes",
    address: "14 bis, avenue du Maréchal de Lattre de Tassigny, Bât. 4",
    type: "T2",
    surface: 54,
    tenantName: "M. Alexandre de La Tour-du-Pin",
    tenantPhone: "06 42 19 88 02",
    rentExpected: 850,
    rentReceived: 450,
    charges: 70,
    status: "attention",
    exceptionNote: "Virement partiel reçu le 03/10 · Reste 400,00 € à percevoir",
    dueDate: "05/10/2026",
    receiptAvailable: false,
  },
  {
    id: "unit-2",
    city: "Paris 11e",
    address: "28 rue de la Roquette",
    type: "Studio",
    surface: 24,
    tenantName: "Camille Renoir",
    tenantPhone: "06 11 87 45 32",
    rentExpected: 680,
    rentReceived: 680,
    charges: 50,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-3",
    city: "Lyon 3e",
    address: "104 cours Lafayette",
    type: "T3",
    surface: 68,
    tenantName: "Élodie & Thomas Vasseur",
    tenantPhone: "06 98 23 11 40",
    rentExpected: 1150,
    rentReceived: 1150,
    charges: 90,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-4",
    city: "Bordeaux",
    address: "45 rue Notre-Dame (Chartrons)",
    type: "T2",
    surface: 48,
    tenantName: "Julien Mercier",
    tenantPhone: "06 34 56 78 90",
    rentExpected: 820,
    rentReceived: 820,
    charges: 60,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-5",
    city: "Rennes",
    address: "12 place Sainte-Anne",
    type: "T1 bis",
    surface: 32,
    tenantName: "Margaux Lambert",
    tenantPhone: "06 78 90 12 34",
    rentExpected: 490,
    rentReceived: 490,
    charges: 40,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-6",
    city: "Lille",
    address: "78 rue Solférino (Vauban)",
    type: "T2",
    surface: 42,
    tenantName: "Antoine Desmet",
    tenantPhone: "06 23 45 67 89",
    rentExpected: 650,
    rentReceived: 650,
    charges: 55,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-7",
    city: "Marseille",
    address: "18 quai du Port",
    type: "T3",
    surface: 72,
    tenantName: "Karim Benzemour",
    tenantPhone: "06 89 01 23 45",
    rentExpected: 980,
    rentReceived: 980,
    charges: 80,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-8",
    city: "Strasbourg",
    address: "5 rue des Veaux (Krutenau)",
    type: "T2",
    surface: 46,
    tenantName: "Sophie Klein",
    tenantPhone: "06 67 89 01 23",
    rentExpected: 710,
    rentReceived: 710,
    charges: 65,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-9",
    city: "Toulouse",
    address: "22 rue des Filatiers (Carmes)",
    type: "Studio",
    surface: 26,
    tenantName: "Lucas Boyer",
    tenantPhone: "06 56 78 90 12",
    rentExpected: 540,
    rentReceived: 540,
    charges: 45,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-10",
    city: "Montpellier",
    address: "9 rue Foch (Écusson)",
    type: "T2",
    surface: 50,
    tenantName: "Clara Fabre",
    tenantPhone: "06 12 34 56 78",
    rentExpected: 730,
    rentReceived: 730,
    charges: 60,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
];

export const FIXTURE_3_EXCEPTIONS: PropertyUnit[] = [
  {
    id: "unit-1",
    city: "Nantes",
    address: "14 bis, avenue du Maréchal de Lattre de Tassigny",
    type: "T2",
    surface: 54,
    tenantName: "M. Alexandre de La Tour-du-Pin",
    tenantPhone: "06 42 19 88 02",
    rentExpected: 850,
    rentReceived: 450,
    charges: 70,
    status: "attention",
    exceptionNote: "Solde partiel dû : 400,00 € (virement reçu le 03/10 de 450 €)",
    dueDate: "05/10/2026",
    receiptAvailable: false,
  },
  {
    id: "unit-3",
    city: "Lyon 3e",
    address: "104 cours Lafayette",
    type: "T3",
    surface: 68,
    tenantName: "Élodie & Thomas Vasseur",
    tenantPhone: "06 98 23 11 40",
    rentExpected: 1150,
    rentReceived: 0,
    charges: 90,
    status: "danger",
    exceptionNote: "Impayé intégral : 1 150,00 € · Retard 12 jours sans accusé",
    dueDate: "05/10/2026",
    receiptAvailable: false,
  },
  {
    id: "unit-2",
    city: "Paris 11e",
    address: "28 rue de la Roquette",
    type: "Studio",
    surface: 24,
    tenantName: "Camille Renoir",
    tenantPhone: "06 11 87 45 32",
    rentExpected: 680,
    rentReceived: 680,
    charges: 50,
    status: "attention",
    exceptionNote: "Régularisation annuelle des charges en attente : +180,00 € à ventiler",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-4",
    city: "Bordeaux",
    address: "45 rue Notre-Dame",
    type: "T2",
    surface: 48,
    tenantName: "Julien Mercier",
    tenantPhone: "06 34 56 78 90",
    rentExpected: 820,
    rentReceived: 820,
    charges: 60,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
  {
    id: "unit-5",
    city: "Rennes",
    address: "12 place Sainte-Anne",
    type: "T1 bis",
    surface: 32,
    tenantName: "Margaux Lambert",
    tenantPhone: "06 78 90 12 34",
    rentExpected: 490,
    rentReceived: 490,
    charges: 40,
    status: "calm",
    dueDate: "05/10/2026",
    receiptAvailable: true,
  },
];

export const OFFICIAL_IRL_DATA = [
  { quarter: "T2 2026", value: 148.37, change: "+2.20%", date: "Juillet 2026" },
  { quarter: "T1 2026", value: 146.60, change: "+2.19%", date: "Avril 2026" },
  { quarter: "T4 2025", value: 145.78, change: "+0.79%", date: "Janvier 2026" },
  { quarter: "T3 2025", value: 145.77, change: "+0.87%", date: "Octobre 2025" },
  { quarter: "T2 2025", value: 146.68, change: "+1.04%", date: "Juillet 2025" },
  { quarter: "T1 2025", value: 145.47, change: "+1.40%", date: "Avril 2025" },
  { quarter: "T4 2024", value: 144.64, change: "+1.82%", date: "Janvier 2025" },
  { quarter: "T3 2024", value: 144.51, change: "+2.47%", date: "Octobre 2024" },
];
