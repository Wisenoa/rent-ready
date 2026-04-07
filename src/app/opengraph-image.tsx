import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#f8f7f4",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            RentReady
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          La gestion locative{"\n"}simplifiée pour les bailleurs
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "28px",
            color: "#6b6b6b",
            lineHeight: 1.4,
            maxWidth: "800px",
            marginBottom: "48px",
          }}
        >
          Quittances conformes, détection des virements, révision IRL automatique.
          Gérez vos biens en toute sérénité.
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#16a34a",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          Essai gratuit 14 jours
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
