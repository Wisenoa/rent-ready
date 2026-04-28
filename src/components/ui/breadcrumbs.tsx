"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Breadcrumbs
   Semantic nav with BreadcrumbList schema support.

   Usage:
   <Breadcrumbs
     items={[
       { label: "Accueil", href: "/" },
       { label: "Modèles", href: "/modeles" },
       { label: "Contrat de location" }, // current page — no href
     ]}
   />

   To emit JSON-LD schema, pass suppressSchema={false}
   and include <script type="application/ld+json"> in your page head.
────────────────────────────────────────────── */

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

interface BreadcrumbsProps extends React.ComponentProps<"nav"> {
  items: BreadcrumbItem[];
  suppressSchema?: boolean; // default false — schema IS emitted
  className?: string;
}

function Breadcrumbs({
  items,
  suppressSchema = false,
  className,
  ...props
}: BreadcrumbsProps) {
  const schemaItems = items.map((item) => ({
    "@type": "ListItem",
    name: typeof item.label === "string" ? item.label : String(item.label),
    item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${item.href}` : undefined,
  }));

  return (
    <>
      {!suppressSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: schemaItems.map((item, index) => ({
                ...item,
                position: index + 1,
              })),
            }),
          }}
        />
      )}
      <nav
        aria-label="Fil d'Ariane"
        data-slot="breadcrumbs"
        className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-border" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium text-foreground",
                    isLast && "truncate max-w-[200px]"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors focus-visible:border-ring focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {item.label}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}

export { Breadcrumbs };
export type { BreadcrumbItem };
