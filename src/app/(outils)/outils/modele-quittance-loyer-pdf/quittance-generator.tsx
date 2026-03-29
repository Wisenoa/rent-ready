"use client";

import { useState, type FormEvent } from "react";
import { Download, Loader2, CheckCircle } from "lucide-react";

/* ─── Types ─── */

interface QuittanceData {
  bailleurNom: string;
  bailleurAdresse: string;
  bailleurCodePostal: string;
  bailleurVille: string;
  locataireNom: string;
  locataireAdresse: string;
  locataireCodePostal: string;
  locataireVille: string;
  loyer: number;
  charges: number;
  mois: number;
  annee: number;
  datePaiement: string;
}

/* ─── Helpers ─── */

const MOIS_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

function dernierJourDuMois(mois: number, annee: number): number {
  return new Date(annee, mois, 0).getDate();
}

function formatMontant(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── PDF Generation ─── */

async function generateQuittancePdf(data: QuittanceData) {
  const { Document, Page, View, Text, StyleSheet, pdf } = await import(
    "@react-pdf/renderer"
  );

  const total = data.loyer + data.charges;
  const moisLabel = MOIS_LABELS[data.mois - 1];
  const dernier = dernierJourDuMois(data.mois, data.annee);

  const styles = StyleSheet.create({
    page: {
      padding: 50,
      fontFamily: "Helvetica",
      fontSize: 11,
      color: "#1c1917",
      lineHeight: 1.6,
    },
    title: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      textAlign: "center",
      marginBottom: 6,
      color: "#1c1917",
    },
    period: {
      fontSize: 12,
      textAlign: "center",
      color: "#57534e",
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      marginBottom: 6,
      color: "#2563eb",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    block: {
      marginBottom: 20,
    },
    text: {
      marginBottom: 2,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: "#d6d3d1",
      marginVertical: 16,
    },
    table: {
      marginTop: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    rowAlt: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: "#f5f5f4",
    },
    rowTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: "#2563eb",
      borderRadius: 4,
      marginTop: 4,
    },
    rowLabel: {
      fontSize: 11,
    },
    rowValue: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
    },
    rowTotalLabel: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
    },
    rowTotalValue: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
    },
    legal: {
      marginTop: 28,
      fontSize: 10,
      lineHeight: 1.7,
      color: "#44403c",
    },
    signature: {
      marginTop: 40,
      fontSize: 10,
      color: "#57534e",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 50,
      right: 50,
      textAlign: "center",
      fontSize: 8,
      color: "#a8a29e",
    },
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>QUITTANCE DE LOYER</Text>
        <Text style={styles.period}>
          Pour la période du 1er {moisLabel} au {dernier} {moisLabel}{" "}
          {data.annee}
        </Text>

        <View style={styles.separator} />

        {/* Bailleur */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Bailleur</Text>
          <Text style={styles.text}>{data.bailleurNom}</Text>
          <Text style={styles.text}>{data.bailleurAdresse}</Text>
          <Text style={styles.text}>
            {data.bailleurCodePostal} {data.bailleurVille}
          </Text>
        </View>

        {/* Locataire */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Locataire</Text>
          <Text style={styles.text}>{data.locataireNom}</Text>
          <Text style={styles.text}>{data.locataireAdresse}</Text>
          <Text style={styles.text}>
            {data.locataireCodePostal} {data.locataireVille}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Détail du paiement */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Détail du paiement</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Loyer hors charges</Text>
              <Text style={styles.rowValue}>
                {formatMontant(data.loyer)} €
              </Text>
            </View>
            <View style={styles.rowAlt}>
              <Text style={styles.rowLabel}>Provisions pour charges</Text>
              <Text style={styles.rowValue}>
                {formatMontant(data.charges)} €
              </Text>
            </View>
            <View style={styles.rowTotal}>
              <Text style={styles.rowTotalLabel}>Total acquitté</Text>
              <Text style={styles.rowTotalValue}>
                {formatMontant(total)} €
              </Text>
            </View>
          </View>
        </View>

        {/* Mention légale */}
        <Text style={styles.legal}>
          Le bailleur soussigné, {data.bailleurNom}, reconnaît avoir reçu de{" "}
          {data.locataireNom} la somme de {formatMontant(total)} euros au titre
          du paiement du loyer et des charges pour la période du 1er {moisLabel}{" "}
          au {dernier} {moisLabel} {data.annee}.{"\n\n"}
          {"Conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989, cette quittance ne libère le locataire que pour la période mentionnée."}
          {"\n\n"}
          Date de paiement : {formatDate(data.datePaiement)}
        </Text>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Fait à {data.bailleurVille},</Text>
          <Text>le {formatDate(data.datePaiement)}</Text>
          <Text style={{ marginTop: 30 }}>Signature du bailleur :</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Document généré avec RentReady — www.rentready.fr
        </Text>
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quittance-${String(data.mois).padStart(2, "0")}-${data.annee}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Component ─── */

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

export function QuittanceGenerator() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [bailleurNom, setBailleurNom] = useState("");
  const [bailleurAdresse, setBailleurAdresse] = useState("");
  const [bailleurCodePostal, setBailleurCodePostal] = useState("");
  const [bailleurVille, setBailleurVille] = useState("");

  const [locataireNom, setLocataireNom] = useState("");
  const [locataireAdresse, setLocataireAdresse] = useState("");
  const [locataireCodePostal, setLocataireCodePostal] = useState("");
  const [locataireVille, setLocataireVille] = useState("");

  const [loyer, setLoyer] = useState("");
  const [charges, setCharges] = useState("");
  const [mois, setMois] = useState(currentMonth);
  const [annee, setAnnee] = useState(currentYear);
  const [datePaiement, setDatePaiement] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await generateQuittancePdf({
        bailleurNom,
        bailleurAdresse,
        bailleurCodePostal,
        bailleurVille,
        locataireNom,
        locataireAdresse,
        locataireCodePostal,
        locataireVille,
        loyer: parseFloat(loyer) || 0,
        charges: parseFloat(charges) || 0,
        mois,
        annee,
        datePaiement,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Erreur lors de la génération du PDF :", err);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-lg sm:p-8"
    >
      {/* Bailleur */}
      <fieldset>
        <legend className="mb-4 text-lg font-semibold text-stone-900">
          Bailleur
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bailleur-nom" className={labelClass}>
              Nom et prénom
            </label>
            <input
              id="bailleur-nom"
              type="text"
              required
              placeholder="Jean Dupont"
              value={bailleurNom}
              onChange={(e) => setBailleurNom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bailleur-adresse" className={labelClass}>
              Adresse
            </label>
            <input
              id="bailleur-adresse"
              type="text"
              required
              placeholder="12 rue de la Paix"
              value={bailleurAdresse}
              onChange={(e) => setBailleurAdresse(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="bailleur-cp" className={labelClass}>
              Code postal
            </label>
            <input
              id="bailleur-cp"
              type="text"
              required
              placeholder="75001"
              pattern="[0-9]{5}"
              value={bailleurCodePostal}
              onChange={(e) => setBailleurCodePostal(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="bailleur-ville" className={labelClass}>
              Ville
            </label>
            <input
              id="bailleur-ville"
              type="text"
              required
              placeholder="Paris"
              value={bailleurVille}
              onChange={(e) => setBailleurVille(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <hr className="my-6 border-stone-200" />

      {/* Locataire */}
      <fieldset>
        <legend className="mb-4 text-lg font-semibold text-stone-900">
          Locataire
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="locataire-nom" className={labelClass}>
              Nom et prénom
            </label>
            <input
              id="locataire-nom"
              type="text"
              required
              placeholder="Marie Martin"
              value={locataireNom}
              onChange={(e) => setLocataireNom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="locataire-adresse" className={labelClass}>
              Adresse du bien loué
            </label>
            <input
              id="locataire-adresse"
              type="text"
              required
              placeholder="5 avenue des Champs-Élysées"
              value={locataireAdresse}
              onChange={(e) => setLocataireAdresse(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="locataire-cp" className={labelClass}>
              Code postal
            </label>
            <input
              id="locataire-cp"
              type="text"
              required
              placeholder="75008"
              pattern="[0-9]{5}"
              value={locataireCodePostal}
              onChange={(e) => setLocataireCodePostal(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="locataire-ville" className={labelClass}>
              Ville
            </label>
            <input
              id="locataire-ville"
              type="text"
              required
              placeholder="Paris"
              value={locataireVille}
              onChange={(e) => setLocataireVille(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <hr className="my-6 border-stone-200" />

      {/* Paiement */}
      <fieldset>
        <legend className="mb-4 text-lg font-semibold text-stone-900">
          Paiement
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="loyer" className={labelClass}>
              Loyer hors charges (€)
            </label>
            <input
              id="loyer"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="750.00"
              value={loyer}
              onChange={(e) => setLoyer(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="charges" className={labelClass}>
              Provisions pour charges (€)
            </label>
            <input
              id="charges"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="50.00"
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="mois" className={labelClass}>
              Mois
            </label>
            <select
              id="mois"
              required
              value={mois}
              onChange={(e) => setMois(parseInt(e.target.value))}
              className={inputClass}
            >
              {MOIS_LABELS.map((label, i) => (
                <option key={label} value={i + 1}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="annee" className={labelClass}>
              Année
            </label>
            <select
              id="annee"
              required
              value={annee}
              onChange={(e) => setAnnee(parseInt(e.target.value))}
              className={inputClass}
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="date-paiement" className={labelClass}>
              Date de paiement
            </label>
            <input
              id="date-paiement"
              type="date"
              required
              value={datePaiement}
              onChange={(e) => setDatePaiement(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <hr className="my-6 border-stone-200" />

      {/* Total preview */}
      <div className="mb-6 rounded-xl bg-stone-50 p-4">
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>Loyer hors charges</span>
          <span>{formatMontant(parseFloat(loyer) || 0)} €</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm text-stone-600">
          <span>Provisions pour charges</span>
          <span>{formatMontant(parseFloat(charges) || 0)} €</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-900">
          <span>Total</span>
          <span>
            {formatMontant(
              (parseFloat(loyer) || 0) + (parseFloat(charges) || 0)
            )}{" "}
            €
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Génération en cours…
          </>
        ) : (
          <>
            <Download className="size-5" />
            Télécharger la quittance PDF
          </>
        )}
      </button>

      {/* Success toast */}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <CheckCircle className="size-4 shrink-0" />
          Quittance téléchargée avec succès !
        </div>
      )}
    </form>
  );
}
