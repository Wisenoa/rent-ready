import { Transaction, Lease, Property, Tenant } from "@prisma/client";

type TransactionWithRelations = Transaction & {
  lease: Lease & {
    tenant: Tenant;
    property: Property;
  };
};

export function transactionsToCSV(transactions: TransactionWithRelations[]): string {
  const headers = [
    "Date",
    "Période",
    "Locataire",
    "Bien",
    "Montant total",
    "Part loyer",
    "Part charges",
    "Statut",
    "Mode de paiement",
    "Date d'échéance",
  ];

  const rows = transactions.map((tx) => {
    const periodStr = `${tx.periodStart.toLocaleDateString("fr-FR")} - ${tx.periodEnd.toLocaleDateString("fr-FR")}`;
    const statusMap: Record<string, string> = {
      PAID: "Payé",
      PENDING: "En attente",
      PARTIAL: "Partiel",
      LATE: "En retard",
      CANCELLED: "Annulé",
    };

    const paymentMap: Record<string, string> = {
      TRANSFER: "Virement",
      CHECK: "Chèque",
      CASH: "Espèces",
      DIRECT_DEBIT: "Prélèvement",
      OTHER: "Autre",
    };

    return [
      tx.paidAt?.toLocaleDateString("fr-FR") ?? "",
      periodStr,
      `${tx.lease.tenant.firstName} ${tx.lease.tenant.lastName}`,
      tx.lease.property.name,
      tx.amount.toFixed(2),
      tx.rentPortion.toFixed(2),
      tx.chargesPortion.toFixed(2),
      statusMap[tx.status] ?? tx.status,
      tx.paymentMethod ? paymentMap[tx.paymentMethod] : "",
      tx.dueDate.toLocaleDateString("fr-FR"),
    ];
  });

  const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

  return csvContent;
}

export function expensesToCSV(expenses: Array<{
  date: Date;
  vendorName: string;
  description: string | null;
  amount: number;
  category: string;
  property: { name: string } | null;
}>): string {
  const headers = [
    "Date",
    "Fournisseur",
    "Description",
    "Montant",
    "Catégorie",
    "Bien",
  ];

  const categoryMap: Record<string, string> = {
    PLUMBING: "Plomberie",
    ELECTRICAL: "Électricité",
    GENERAL_MAINTENANCE: "Entretien général",
    INSURANCE: "Assurance",
    TAX: "Taxes / Impôts",
    CONDO_FEES: "Charges de copropriété",
    MANAGEMENT_FEES: "Frais de gestion",
    RENOVATION: "Rénovation / Travaux",
    OTHER: "Autre",
  };

  const rows = expenses.map((e) => [
    e.date.toLocaleDateString("fr-FR"),
    e.vendorName,
    e.description ?? "",
    e.amount.toFixed(2),
    categoryMap[e.category] ?? e.category,
    e.property?.name ?? "",
  ]);

  return [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}