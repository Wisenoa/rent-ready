"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface PortalMessage {
  id: string;
  content: string;
  senderType: "TENANT" | "LANDLORD";
  senderName: string;
  isRead: boolean;
  createdAt: string;
}

export interface PortalConversation {
  id: string;
  messages: PortalMessage[];
  unreadCount: number;
}

function MessageBubble({ message, isMine }: { message: PortalMessage; isMine: boolean }) {
  return (
    <div className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      {!isMine && (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isMine
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        }`}
      >
        {!isMine && (
          <p className="text-xs font-medium opacity-70 mb-1">{message.senderName}</p>
        )}
        <p className="whitespace-pre-line">{message.content}</p>
        <p
          className={`text-[10px] mt-1 opacity-60 ${
            isMine ? "text-right" : ""
          }`}
        >
          {format(new Date(message.createdAt), "dd/MM/yyyy 'à' HH:mm")}
        </p>
      </div>
    </div>
  );
}

export function PortalMessages({
  conversation,
  tenantId,
}: {
  conversation: PortalConversation | null;
  tenantId: string;
}) {
  const [messages, setMessages] = useState<PortalMessage[]>(
    conversation?.messages ?? []
  );
  const [unreadCount, setUnreadCount] = useState(conversation?.unreadCount ?? 0);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [unreadCount]);

  function handleSend() {
    if (!content.trim()) return;

    const optimisticMsg: PortalMessage = {
      id: `optimistic-${Date.now()}`,
      content: content.trim(),
      senderType: "TENANT",
      senderName: "Vous",
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const savedContent = content;
    setContent("");

    startTransition(async () => {
      try {
        const { sendMessage } = await import("@/lib/actions/portal-actions");
        const result = await sendMessage(tenantId, savedContent);

        if (!result.success) {
          // Remove optimistic message on failure
          setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
          toast.error(result.error ?? "Erreur lors de l'envoi du message");
        }
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        toast.error("Erreur lors de l'envoi du message");
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">Pas encore de messages</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Envoyez un message à votre propriétaire via le formulaire ci-dessous.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[560px]">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="size-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun message encore. Démarrez la conversation !
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={message.senderType === "TENANT"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="border-t pt-4 mt-2">
          {unreadCount > 0 && (
          <Badge variant="secondary" className="mb-2 text-xs">
            {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} message{unreadCount > 1 ? "s" : ""}
          </Badge>
        )}
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre message... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
            rows={2}
            className="resize-none flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isPending || !content.trim()}
            size="icon"
            className="shrink-0 h-[unset] aspect-square"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Les messages sont envoyés à votre propriétaire. Réponse sous 24-48h.
        </p>
      </div>
    </div>
  );
}
