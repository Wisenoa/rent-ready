"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
  pageItemId?: string;
}

export function breadcrumbListSchema(
  items: BreadcrumbItem[],
  pageItemId?: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Fil d'Ariane",
    itemListElement: items.map((item, index) => {
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (!item.isCurrentPage) {
        entry.item = `https://www.rentready.fr${item.href}`;
      }
      return entry;
    }),
  };
}

const LABEL_MAP: Record<string, string> = {
  "gestion-locative": "Fonctionnalites",
  locations: "Gestion locative",
  bail: "Baux",
  quittances: "Quittances",
  features: "Fonctionnalites",
  pricing: "Tarifs",
  blog: "Blog",
  templates: "Modeles",
  outils: "Outils",
  glossaire: "Glossaire",
  "glossaire-immobilier": "Glossaire",
  "bail-vide": "Bail vide",
  "bail-meuble": "Bail meuble",
  "bail-mobilite": "Bail mobilite",
  "bail-commercial": "Bail commercial",
  "recu-loyer": "Recu de loyer",
  colocation: "Colocation",
  "etat-des-lieux": "Etat des lieux",
  "conge-locataire": "Conge locataire",
  "conge-proprietaire": "Conge proprietaire",
  "calculateur-rendement-locatif": "Calculateur de rendement",
  "calculateur-irl-2026": "Calculateur IRL 2026",
  "calculateur-depot-garantie": "Calculateur depot garantie",
  "lettre-relance-loyer": "Lettre de relance",
  "modele-bail-location": "Modele bail",
  "modele-quittance-loyer-pdf": "Quittance PDF",
  "simulateur-loi-jeanbrun": "Simulateur Loi Jean-Brun",
  demo: "Demo",
  register: "Inscription",
  login: "Connexion",
  portal: "Portail",
  properties: "Biens",
  tenants: "Locataires",
  leases: "Baux",
  dashboard: "Tableau de bord",
  maintenance: "Maintenance",
  billing: "Facturation",
  fiscal: "Fiscal",
  expenses: "Depenses",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function autoBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [
    { label: "Accueil", href: "/", isCurrentPage: false },
  ];

  let currentHref = "";
  for (const segment of segments) {
    if (segment.startsWith("(") && segment.endsWith(")")) continue;
    currentHref += `/${segment}`;
    const label = LABEL_MAP[segment] ??
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (label) {
      const isCurrent = segment === segments[segments.length - 1];
      crumbs.push({ label, href: currentHref, isCurrentPage: isCurrent });
    }
  }

  return crumbs;
}

export function Breadcrumb({ items, showHomeIcon = true, className = "", pageItemId }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = items ?? autoBreadcrumbs(pathname);

  const schemaJson = JSON.stringify(breadcrumbListSchema(crumbs, pageItemId));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />

      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center gap-1 text-sm text-stone-500 ${className}`}
      >
        {crumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {index === 0 && showHomeIcon ? (
              <Link href="/" className="flex items-center hover:text-stone-700 transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Accueil</span>
              </Link>
            ) : index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-stone-300" aria-hidden="true" />
            )}
            {crumb.isCurrentPage ? (
              <span className="font-medium text-stone-700" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-stone-700 transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

export function BreadcrumbInline({ items, className }: { items?: BreadcrumbItem[]; className?: string }) {
  const pathname = usePathname();
  const crumbs = items ?? autoBreadcrumbs(pathname);
  return (
    <Breadcrumb
      items={crumbs}
      showHomeIcon={true}
      className={`text-xs ${className ?? ""}`}
    />
  );
}