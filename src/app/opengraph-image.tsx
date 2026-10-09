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
          backgroundColor: "#F5F3EF",
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
              backgroundColor: "#15241F",
              color: "#F5F3EF",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Locelio
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#15241F",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Gérez vos locations{"\n"}sans tableur.
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "26px",
            color: "#2C3E35",
            lineHeight: 1.45,
            maxWidth: "850px",
            marginBottom: "48px",
          }}
        >
          Suivi des encaissements, quittances conformes à la loi de 1989 et rappels de révision de loyer IRL.
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#1E3A2F",
            color: "#F5F3EF",
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Essai gratuit sans engagement
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
