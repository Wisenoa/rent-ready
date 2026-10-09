import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BRAND = {
  name: "Locelio",
  color: "#1E3A2F",
  dark: "#15241F",
  muted: "#2C3E35",
  bg: "#F5F3EF",
  honey: "#C86D2C",
  blue: "#1E3A2F",
};

function BrandBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          backgroundColor: BRAND.dark,
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {BRAND.name}
      </div>
    </div>
  );
}

function ArticleOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BRAND.bg,
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#dbeafe",
            color: "#1d4ed8",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Article
        </div>
      </div>

      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 80 ? title.slice(0, 77) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: BRAND.color,
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Essai gratuit sans engagement
      </div>
    </div>
  );
}

function TemplateOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fefce8",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Modèle gratuit
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/* Document icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "2px solid #e5e7eb",
            fontSize: "36px",
            marginBottom: "8px",
          }}
        >
          📄
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: BRAND.dark,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          {title.length > 70 ? title.slice(0, 67) + "..." : title}
        </div>
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: BRAND.color,
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Télécharger gratuitement
      </div>
    </div>
  );
}

function FeatureOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0fdf4",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#dcfce7",
            color: "#166534",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Fonctionnalité
        </div>
      </div>

      <div
        style={{
          fontSize: "52px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 75 ? title.slice(0, 72) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: BRAND.color,
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Découvrir la fonctionnalité
      </div>
    </div>
  );
}

function PricingOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#eff6ff",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#dbeafe",
            color: "#1d4ed8",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Tarifs 2026
        </div>
      </div>

      <div
        style={{
          fontSize: "52px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 65 ? title.slice(0, 62) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: BRAND.blue,
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Essai gratuit — Sans carte bancaire
      </div>
    </div>
  );
}

function OutilOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f9ff",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Outil gratuit
        </div>
      </div>

      <div
        style={{
          fontSize: "52px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 65 ? title.slice(0, 62) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#0369a1",
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Utiliser gratuitement
      </div>
    </div>
  );
}

function LocationOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#faf5ff",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "auto",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ede9fe",
            color: "#6d28d9",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          📍 Ville
        </div>
      </div>

      <div
        style={{
          fontSize: "52px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 65 ? title.slice(0, 62) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "22px",
            color: BRAND.muted,
            lineHeight: 1.5,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {description.length > 120 ? description.slice(0, 117) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#6d28d9",
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          
        }}
      >
        Essai gratuit sans engagement
      </div>
    </div>
  );
}

function DefaultOG({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BRAND.bg,
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <BrandBadge />

      <div
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: BRAND.dark,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          marginTop: "auto",
          marginBottom: description ? "24px" : "48px",
        }}
      >
        {title.length > 60 ? title.slice(0, 57) + "..." : title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "26px",
            color: BRAND.muted,
            lineHeight: 1.45,
            maxWidth: "800px",
            marginBottom: "48px",
          }}
        >
          {description.length > 110 ? description.slice(0, 107) + "..." : description}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: BRAND.color,
          color: "#fff",
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: 600,
          
        }}
      >
        Essai gratuit sans engagement
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Locelio — Gestion locative";
  const description = searchParams.get("description") || undefined;
  const type = searchParams.get("type") || "default";

  let component: React.ReactNode;

  switch (type) {
    case "article":
      component = <ArticleOG title={title} description={description} />;
      break;
    case "template":
      component = <TemplateOG title={title} description={description} />;
      break;
    case "feature":
      component = <FeatureOG title={title} description={description} />;
      break;
    case "pricing":
      component = <PricingOG title={title} description={description} />;
      break;
    case "outil":
      component = <OutilOG title={title} description={description} />;
      break;
    case "location":
      component = <LocationOG title={title} description={description} />;
      break;
    default:
      component = <DefaultOG title={title} description={description} />;
  }

  return new ImageResponse(component, {
    width: 1200,
    height: 630,
  });
}
