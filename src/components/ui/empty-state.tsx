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

/**
 * `title` here is the heading of the empty state, not the HTML title attribute,
 * so the inherited div title is omitted before redeclaring it as a ReactNode.
 */
interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
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
          // `render`, not `asChild`: Button is @base-ui/react, which composes via
          // `render`. With `asChild` the prop is ignored and the anchor inside is
          // never rendered as a link, so the call-to-action does not navigate.
          <Button
            variant={action.variant ?? "default"}
            size="sm"
            className="mt-1"
            render={<a href={action.href} />}
          >
            {action.label}
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
