"use client";

import { useTransition, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Send, Loader2, Lock } from "lucide-react";
import { addMaintenanceNote } from "@/lib/actions/portal-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
}

interface InternalNotesThreadProps {
  ticketId: string;
  notes: Note[];
}

export function InternalNotesThread({ ticketId, notes }: InternalNotesThreadProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await addMaintenanceNote(ticketId, content);
      if (result.success) {
        toast.success("Note ajoutée");
        setContent("");
      } else {
        toast.error(result.error ?? "Erreur");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Privacy notice */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <Lock className="size-3.5 shrink-0" />
        <span>Ces notes sont privées — uniquement visibles par vous et votre équipe.</span>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-4 text-center">
          Aucune note interne pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="border-amber-200/50 bg-amber-50/30">
              <CardContent className="pt-3">
                <p className="text-sm whitespace-pre-line">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(note.createdAt), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter une note interne (invisible pour le locataire)..."
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !content.trim()}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Send className="size-4 mr-2" />
            )}
            Ajouter la note
          </Button>
        </div>
      </form>
    </div>
  );
}
