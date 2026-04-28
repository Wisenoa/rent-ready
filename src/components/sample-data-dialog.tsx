"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { insertSampleData } from "@/lib/actions/sample-data-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SampleDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SampleDataDialog({ open, onOpenChange }: SampleDataDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await insertSampleData();
      if (result.success) {
        setDone(true);
        toast.success("Données de démonstration ajoutées !");
        onOpenChange(false);
        // Give a moment for revalidation then redirect
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
      } else {
        toast.error(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) setDone(false);
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="size-5 text-indigo-600" />
            Données de démonstration
          </DialogTitle>
          <DialogDescription>
            {!done ? (
              <>
                Nous allons créer un bien, un locataire, un bail actif et 3 mois d'historique de paiements pour que vous puissiez explorer l'application.
                <br /><br />
                <span className="text-amber-600 font-medium">Cette action est irréversible.</span> Vous pourrez supprimer ces données à tout moment.
              </>
            ) : (
              <span className="flex items-center gap-2 text-emerald-600 font-medium">
                <CheckCircle2 className="size-4" />
                Données créées avec succès !
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {!done && (
          <>
            <div className="space-y-3 py-2">
              {[
                { label: "1 bien", desc: "Appartement 62m² à Paris" },
                { label: "1 locataire", desc: "Sophie Martin" },
                { label: "1 bail actif", desc: "Loyer 1 200 € + 150 € charges" },
                { label: "3 mois d'historique", desc: "Paiements effectués" },
                { label: "1 dépense", desc: "EDF - Électricité" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleConfirm} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    Créer les données
                    <CheckCircle2 className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
