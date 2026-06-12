"use client";

import { useState } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { deleteMessageAction, toggleReadAction } from "@/app/admin/messages/actions";
import { ReplyForm } from "./reply-form";
import type { MessageDetailData } from "./message-inbox";
import type { ReplyItem } from "@/app/admin/messages/actions";

interface MessageDetailProps {
  detail: MessageDetailData | null;
  isLoading: boolean;
  onDeleted: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onReplySent: (reply: ReplyItem) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

export function MessageDetail({ detail, isLoading, onDeleted, onToggleRead, onReplySent }: MessageDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingRead, setIsTogglingRead] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Pilih pesan untuk dibaca</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus pesan dari ${detail.name}?`)) return;
    setIsDeleting(true);
    try {
      await deleteMessageAction(detail.id);
      onDeleted(detail.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleRead = async () => {
    setIsTogglingRead(true);
    try {
      await toggleReadAction(detail.id);
      onToggleRead(detail.id, !detail.isRead);
    } finally {
      setIsTogglingRead(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-foreground">{detail.subject}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {detail.name} &lt;{detail.email}&gt;
            </p>
            <p className="text-xs text-muted-foreground/60">{formatDate(detail.createdAt)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={detail.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
              disabled={isTogglingRead}
              onClick={handleToggleRead}
            >
              {detail.isRead ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Hapus pesan"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Body + replies */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{detail.message}</p>

        {detail.replies.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Balasan ({detail.replies.length})
            </p>
            {detail.replies.map((reply) => (
              <div key={reply.id} className="rounded-md border border-border bg-secondary/30 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{reply.body}</p>
                <p className="mt-2 text-[11px] text-muted-foreground/60">Dikirim {formatDate(reply.sentAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      <ReplyForm messageId={detail.id} onReplySent={onReplySent} />
    </div>
  );
}
