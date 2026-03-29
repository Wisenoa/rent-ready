"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Upload,
  X,
  Loader2,
  Send,
  ImageIcon,
  Video,
} from "lucide-react";
import { createMaintenanceTicket } from "@/lib/actions/portal-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
] as const;

export function MaintenanceForm({ tenantId }: { tenantId: string }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [priority, setPriority] = useState("MEDIUM");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const newFiles = [...files, ...selected];
    setFiles(newFiles);

    const newPreviews = [...previews];
    for (const file of selected) {
      if (file.type.startsWith("image/")) {
        newPreviews.push(URL.createObjectURL(file));
      } else {
        newPreviews.push("");
      }
    }
    setPreviews(newPreviews);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updated);
    setPreviews(updatedPreviews);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("tenantId", tenantId);
    formData.set("priority", priority);
    formData.delete("files");
    for (const file of files) {
      formData.append("files", file);
    }

    startTransition(async () => {
      const result = await createMaintenanceTicket(formData);
      if (result.success) {
        toast.success("Demande envoyée avec succès");
        formRef.current?.reset();
        previews.forEach((p) => { if (p) URL.revokeObjectURL(p); });
        setFiles([]);
        setPreviews([]);
        setPriority("MEDIUM");
      } else {
        toast.error(result.error ?? "Impossible d'envoyer la demande");
      }
    });
  }

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Nouvelle demande</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Fuite robinet cuisine"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez le problème en détail..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Priorité</Label>
            <Select value={priority} onValueChange={(v) => { if (v) setPriority(v); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Photos / Vidéos</Label>
            <div
              className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter des fichiers
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Images et vidéos acceptées
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="files"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="relative group rounded-lg border border-border/50 overflow-hidden"
                >
                  {previews[i] ? (
                    <img
                      src={previews[i]}
                      alt={file.name}
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 flex flex-col items-center justify-center bg-muted/30">
                      {file.type.startsWith("video/") ? (
                        <Video className="size-6 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground" />
                      )}
                      <span className="text-[10px] text-muted-foreground mt-1 px-1 truncate max-w-[76px]">
                        {file.name.split(".").pop()}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-0.5 right-0.5 size-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Send className="size-4 mr-2" />
            )}
            Envoyer la demande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
