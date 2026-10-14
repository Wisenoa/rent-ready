"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Download, Loader2, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

/* ─── Types ─── */

interface QuittanceFormData {
  bailleurNom: string;
  bailleurAdresse: string;
  bailleurCodePostal: string;
  bailleurVille: string;
  locataireNom: string;
  locataireAdresse: string;
  loyer: number;
  charges: number;
  mois: number;
  annee: number;
  email: string;
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

function formatMontant(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ─── PDF Generation ─── */

async function generateQuittancePdf(data: QuittanceFormData) {
  const { Document, Page, View, Text, StyleSheet, pdf } = await import(
    "@react-pdf/renderer"
  );

  const total = data.loyer + data.charges;
  const moisLabel = MOIS_LABELS[data.mois - 1];
  const dernierJour = new Date(data.annee, data.mois, 0).getDate();

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
      color: "#1E3A2F",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    block: { marginBottom: 20 },
    text: { marginBottom: 2 },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: "#d6d3d1",
      marginVertical: 16,
    },
    table: { marginTop: 8 },
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
      backgroundColor: "#1E3A2F",
      borderRadius: 4,
      marginTop: 4,
    },
    rowLabel: { fontSize: 11 },
    rowValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
    rowTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    rowTotalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    legal: {
      marginTop: 28,
      fontSize: 10,
      lineHeight: 1.7,
      color: "#44403c",
    },
    signature: { marginTop: 40, fontSize: 10, color: "#57534e" },
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
          Période du 1er {moisLabel} au {dernierJour} {moisLabel} {data.annee}
        </Text>

        <View style={styles.separator} />

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Bailleur</Text>
          <Text style={styles.text}>{data.bailleurNom}</Text>
          <Text style={styles.text}>{data.bailleurAdresse}</Text>
          <Text style={styles.text}>
            {data.bailleurCodePostal} {data.bailleurVille}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Locataire</Text>
          <Text style={styles.text}>{data.locataireNom}</Text>
          <Text style={styles.text}>{data.locataireAdresse}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Détail du paiement</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Loyer hors charges</Text>
              <Text style={styles.rowValue}>{formatMontant(data.loyer)} €</Text>
            </View>
            <View style={styles.rowAlt}>
              <Text style={styles.rowLabel}>Provisions pour charges</Text>
              <Text style={styles.rowValue}>{formatMontant(data.charges)} €</Text>
            </View>
            <View style={styles.rowTotal}>
              <Text style={styles.rowTotalLabel}>Total acquitté</Text>
              <Text style={styles.rowTotalValue}>{formatMontant(total)} €</Text>
            </View>
          </View>
        </View>

        <Text style={styles.legal}>
          Le bailleur soussigné, {data.bailleurNom}, reconnaît avoir reçu de{" "}
          {data.locataireNom} la somme de {formatMontant(total)} euros au titre du
          paiement du loyer et des charges pour la période du 1er {moisLabel} au{" "}
          {dernierJour} {moisLabel} {data.annee}.{"\n\n"}
          Conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989,
          cette quittance ne libère le locataire que pour la période mentionnée.
          {"\n\n"}Date de paiement : {dernierJour} {moisLabel} {data.annee}
        </Text>

        <View style={styles.signature}>
          <Text>Fait à {data.bailleurVille},</Text>
          <Text>le {dernierJour} {moisLabel} {data.annee}</Text>
          <Text style={{ marginTop: 30 }}>Signature du bailleur :</Text>
        </View>

        <Text style={styles.footer}>
          Document généré avec Lokna — lokna.fr
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

export function QuittanceGeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [bailleurNom, setBailleurNom] = useState("");
  const [bailleurAdresse, setBailleurAdresse] = useState("");
  const [bailleurCodePostal, setBailleurCodePostal] = useState("");
  const [bailleurVille, setBailleurVille] = useState("");
  const [locataireNom, setLocataireNom] = useState("");
  const [locataireAdresse, setLocataireAdresse] = useState("");
  const [loyer, setLoyer] = useState("");
  const [charges, setCharges] = useState("");
  const [mois, setMois] = useState(currentMonth);
  const [annee, setAnnee] = useState(currentYear);

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
        loyer: parseFloat(loyer) || 0,
        charges: parseFloat(charges) || 0,
        mois,
        annee,
        email,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Erreur lors de la génération :", err);
    } finally {
      setLoading(false);
    }
  }

  const total = (parseFloat(loyer) || 0) + (parseFloat(charges) || 0);

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-stone-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email capture */}
      <div>
        <label htmlFor="q-email" className={labelClass}>
          Email du bailleur
        </label>
        <input
          id="q-email"
          type="email"
          required
          placeholder="contact@votredomaine.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-bailleur-nom" className={labelClass}>
            Nom du bailleur
          </label>
          <input
            id="q-bailleur-nom"
            type="text"
            required
            placeholder="Jean Dupont"
            value={bailleurNom}
            onChange={(e) => setBailleurNom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-locataire-nom" className={labelClass}>
            Nom du locataire
          </label>
          <input
            id="q-locataire-nom"
            type="text"
            required
            placeholder="Marie Martin"
            value={locataireNom}
            onChange={(e) => setLocataireNom(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="q-bailleur-adresse" className={labelClass}>
          Adresse du bien loué
        </label>
        <input
          id="q-bailleur-adresse"
          type="text"
          required
          placeholder="12 rue de la Paix, 75001 Paris"
          value={locataireAdresse}
          onChange={(e) => setLocataireAdresse(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="q-loyer" className={labelClass}>
            Loyer (€)
          </label>
          <input
            id="q-loyer"
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
          <label htmlFor="q-charges" className={labelClass}>
            Charges (€)
          </label>
          <input
            id="q-charges"
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
          <label htmlFor="q-mois" className={labelClass}>
            Mois / Année
          </label>
          <select
            id="q-mois"
            value={`${annee}-${mois}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              setAnnee(parseInt(y));
              setMois(parseInt(m));
            }}
            className={inputClass}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const m = currentMonth - 11 + i;
              const adjustedMonth = m <= 0 ? m + 12 : m;
              const adjustedYear = m <= 0 ? currentYear - 1 : currentYear;
              const label = MOIS_LABELS[adjustedMonth - 1];
              return (
                <option key={`${adjustedYear}-${adjustedMonth}`} value={`${adjustedYear}-${adjustedMonth}`}>
                  {label.charAt(0).toUpperCase() + label.slice(1)} {adjustedYear}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Total preview */}
      {total > 0 && (
        <div className="rounded-lg bg-stone-50 p-3 text-center">
          <span className="text-sm text-stone-600">Total à acquitter : </span>
          <span className="text-base font-semibold text-ink">
            {formatMontant(total)} €
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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

      {success && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
            <CheckCircle className="size-5 shrink-0 text-emerald-600" />
            <span>Votre quittance de loyer PDF a été téléchargée avec succès.</span>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-white p-5 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="size-3.5" />
              <span>Automatisation Lokna</span>
            </div>
            <h3 className="text-base font-bold text-ink">
              Automatisez vos quittances pour le mois prochain
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Une fois le loyer intégralement payé et enregistré, Lokna génère votre quittance et la met à disposition de votre locataire.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900"
              >
                <span>Essayer gratuitement 14 jours sans CB</span>
                <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
              >
                Modifier ou créer une autre quittance
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
