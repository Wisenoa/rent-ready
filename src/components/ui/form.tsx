"use client";

import * as React from "react";
import { Slot } from "@base-ui/react/slot";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   FormField
   Wraps: label + description + input + error
   Usage: <FormField name="email" label="Email" error={errors.email}>
────────────────────────────────────────────── */
interface FormFieldProps extends React.ComponentProps<"div"> {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
}

function FormField({
  name,
  label,
  description,
  error,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div data-slot="form-field" className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}
      {description && <FormDescription>{description}</FormDescription>}
      {/* Clone children to inject id + aria-describedby */}
      {children}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FormLabel
   Styled label with required asterisk
────────────────────────────────────────────── */
interface FormLabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      data-slot="form-label"
      htmlFor={props.htmlFor}
      className={cn(
        "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

/* ─────────────────────────────────────────────
   FormDescription
   Helper text below an input
────────────────────────────────────────────── */
interface FormDescriptionProps extends React.ComponentProps<"div"> {}

const FormDescription = React.forwardRef<HTMLDivElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
);
FormDescription.displayName = "FormDescription";

/* ─────────────────────────────────────────────
   FormMessage
   Inline error message with icon
────────────────────────────────────────────── */
interface FormMessageProps extends React.ComponentProps<"div"> {}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        data-slot="form-message"
        role="alert"
        className={cn("flex items-center gap-1.5 text-xs text-destructive", className)}
        {...props}
      >
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.75" fill="currentColor" />
        </svg>
        {children}
      </div>
    );
  }
);
FormMessage.displayName = "FormMessage";

export { FormField, FormLabel, FormDescription, FormMessage };
