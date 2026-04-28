"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { SampleDataDialog } from "@/components/sample-data-dialog";

interface SampleDataButtonProps {
  variant?: "link" | "button";
  className?: string;
}

export function SampleDataButton({ variant = "link", className = "" }: SampleDataButtonProps) {
  const [open, setOpen] = useState(false);

  if (variant === "button") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className={className}
        >
          <Database className="size-4 mr-2" />
          Essayer avec des données de démo
        </button>
        <SampleDataDialog open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors ${className}`}
      >
        <Database className="size-3 inline mr-1" />
        Essayer avec des données de démonstration
      </button>
      <SampleDataDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
