"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { sendReplyAction } from "@/app/admin/messages/actions";
import type { ReplyItem } from "@/app/admin/messages/actions";

interface ReplyFormProps {
  messageId: string;
  onReplySent: (reply: ReplyItem) => void;
}

export function ReplyForm({ messageId, onReplySent }: ReplyFormProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await sendReplyAction(messageId, body);
      if (result.status === "success" && result.reply) {
        onReplySent(result.reply);
        setBody("");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Gagal mengirim balasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border px-6 py-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tulis balasan..."
        rows={3}
        className="w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting && <Spinner className="size-4" />}
          Kirim Balasan
        </button>
      </div>
    </form>
  );
}
