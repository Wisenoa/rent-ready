import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

/**
 * FormField — Primitif de formulaire B+ V2.1
 *
 * Établit la hiérarchie continue du formulaire éditorial :
 * - Label typographique épuré (majuscules calmes, espacement subtil)
 * - Liaison d'accessibilité native (htmlFor, aria-describedby, role=alert)
 * - Indication facultatif / requis discrète
 * - Message d'erreur sémantique et explicite sans saturation visuelle
 */
export function FormField({
  id,
  label,
  required,
  optional,
  badge,
  description,
  error,
  className,
  children,
}: FormFieldProps) {
  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-800 flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-red-600" title="Requis" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {badge}
        {optional && !badge && (
          <span className="text-xs text-neutral-400 font-normal">Facultatif</span>
        )}
      </div>

      {children}

      {description && !error && (
        <p id={descId} className="text-xs text-neutral-500 leading-relaxed">
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1 pt-0.5"
        >
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
