"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { MessageList } from "./message-list";
import { MessageDetail } from "./message-detail";
import type { MessageItem } from "@/app/admin/messages/page";
import type { ReplyItem } from "@/app/admin/messages/actions";

export interface MessageDetailData extends MessageItem {
  replies: ReplyItem[];
}

interface MessageInboxProps {
  initialMessages: MessageItem[];
}

export function MessageInbox({ initialMessages }: MessageInboxProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MessageDetailData | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleSelect = async (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${id}`), {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = (await res.json()) as MessageDetailData;
        setDetail(data);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDeleted = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDetail(null);
    setSelectedId(null);
  };

  const handleToggleRead = (id: string, isRead: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));
    if (detail?.id === id) setDetail((prev) => (prev ? { ...prev, isRead } : null));
  };

  const handleReplySent = (reply: ReplyItem) => {
    if (detail) setDetail({ ...detail, replies: [...detail.replies, reply] });
  };

  return (
    <div className="flex overflow-hidden rounded-lg border border-border" style={{ height: "calc(100vh - 12rem)" }}>
      <MessageList messages={messages} selectedId={selectedId} onSelect={handleSelect} />
      <MessageDetail
        detail={detail}
        isLoading={isLoadingDetail}
        onDeleted={handleDeleted}
        onToggleRead={handleToggleRead}
        onReplySent={handleReplySent}
      />
    </div>
  );
}
