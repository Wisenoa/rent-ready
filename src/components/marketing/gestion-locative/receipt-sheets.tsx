import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { exampleRow, type ExampleRow } from "./example-month";

/**
 * The two documents a month can produce, abridged from the PDF Lokna generates
 * (`src/lib/quittance-generator.tsx`): same titles, same lines, same legal
 * distinction. Values come from the example month, so the reçu shows exactly the
 * balance the ledger above reports.
 */

const LANDLORD = "Claire Martin";

function Line({
  label,
  value,
  strong,
  alert,
}: {
  label: string;
  value: string;
  strong?: boolean;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-1.5",
        strong && "border-t border-[#15241F] pt-2 font-semibold text-[#15241F]",
        alert && "font-semibold text-[#A63F17]"
      )}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function Sheet({
  row,
  className,
}: {
  row: ExampleRow;
  className?: string;
}) {
  const full = row.document === "QUITTANCE";
  const title = full ? "Quittance de loyer" : "Reçu de paiement partiel";

  return (
    <article
      aria-label={`${title}, exemple fictif`}
      className={cn(
        "relative border border-[#D9D5CC] bg-[#FFFEFB] px-5 pb-6 pt-5 text-[12.5px] leading-5 text-[#4F5D56] shadow-[0_1px_0_#D9D5CC,0_18px_30px_-28px_rgba(21,36,31,0.45)] sm:px-7 sm:pt-7",
        className
      )}
    >
      <header className="border-b border-[#D9D5CC] pb-4">
        <h3 className="font-[family-name:var(--font-serif)] text-[1.45rem] leading-tight text-[#15241F] sm:text-[1.6rem]">
          {title}
        </h3>
        <p className="mt-1">Période : du 1er au 31 octobre 2026</p>
      </header>

      {!full ? (
        <p className="mt-4 border-l-2 border-[#A63F17] bg-[#F6EADF] px-3 py-2 text-[12px] leading-5 text-[#6E2B10]">
          Ce document est un reçu de paiement partiel et non une quittance de
          loyer.
        </p>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5C6560]">
            Bailleur
          </dt>
          <dd className="text-[#15241F]">{LANDLORD}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5C6560]">
            Locataire
          </dt>
          <dd className="text-[#15241F]">{row.tenant}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5C6560]">
            Bien concerné
          </dt>
          <dd className="text-[#15241F]">
            {row.home}, {row.street}
          </dd>
        </div>
      </dl>

      <dl className="mt-5">
        <Line label="Loyer de base (hors charges)" value={formatCurrency(row.rent)} />
        <Line label="Provisions pour charges" value={formatCurrency(row.charges)} />
        <Line label="Total dû pour la période" value={formatCurrency(row.due)} />
        <Line
          strong
          label={full ? "Total acquitté" : "Montant reçu"}
          value={formatCurrency(row.paid)}
        />
        {!full ? (
          <Line alert label="Solde restant dû" value={formatCurrency(row.outstanding)} />
        ) : null}
      </dl>

      <p className="mt-5 text-[11.5px] leading-5 text-[#5C6560]">
        {full
          ? "Délivrée conformément à l'article 21 de la loi n°\u00a089\u2011462 du 6 juillet 1989."
          : "Une quittance ne peut être délivrée que pour un paiement intégral du loyer et des charges (art. 21, loi du 6 juillet 1989)."}
      </p>
    </article>
  );
}

export function ReceiptSheets() {
  return (
    <div className="grid items-start gap-5 sm:grid-cols-2 sm:gap-6">
      <Sheet row={exampleRow("t2")} />
      <Sheet row={exampleRow("t3")} className="sm:mt-10" />
    </div>
  );
}
