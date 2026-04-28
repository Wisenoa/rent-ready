"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   EmptyState
   Dashboard empty state with illustration, title, description, and CTA.

   Usage:
   <EmptyState
     title="Aucun bien enregistré"
     description="Ajoutez votre premier bien pour commencer à gérer vos locations."
     action={{ label: "Ajouter un bien", href: "/properties/new" }}
     icon={<Home className="size-8 text-muted-foreground" />}
   />
────────────────────────────────────────────── */

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: {
    label: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  };
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-16 px-6 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex items-center justify-center rounded-full bg-muted/30 p-4 text-muted-foreground">
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <h3
          data-slot="empty-state-title"
          className="text-base font-medium leading-snug text-foreground"
        >
          {title}
        </h3>
        {description && (
          <p
            data-slot="empty-state-description"
            className="text-sm text-muted-foreground max-w-xs mx-auto"
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        action.href ? (
          <Button
            asChild
            variant={action.variant ?? "default"}
            size="sm"
            className="mt-1"
          >
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button
            variant={action.variant ?? "default"}
            size="sm"
            className="mt-1"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}

export { EmptyState };
