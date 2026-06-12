"use client";

import { cn } from "@/lib/utils";
import type { MessageItem } from "@/app/admin/messages/page";

interface MessageListProps {
  messages: MessageItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${Math.max(1, mins)}m`;
  if (hours < 24) return `${hours}j`;
  if (days === 1) return "kemarin";
  return `${days}h`;
}

export function MessageList({ messages, selectedId, onSelect }: MessageListProps) {
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex w-72 shrink-0 flex-col border-r border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Inbox</span>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Belum ada pesan</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              type="button"
              onClick={() => onSelect(msg.id)}
              className={cn(
                "w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                selectedId === msg.id && "bg-secondary",
                !msg.isRead && "border-l-2 border-l-primary bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={cn("truncate text-sm", !msg.isRead ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  {msg.name}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{relativeTime(msg.createdAt)}</span>
              </div>
              <p className={cn("mt-0.5 truncate text-xs", !msg.isRead ? "text-foreground/80" : "text-muted-foreground")}>
                {msg.subject}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground/60">{msg.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
