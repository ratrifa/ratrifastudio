"use client";

import { PageTransition } from "@/components/page-transition";
import { MessageInbox } from "@/components/admin/messages/message-inbox";

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  messages: MessageItem[];
}

export function AdminMessagesPageClient({ messages }: Props) {
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <h1 className="font-semibold text-xl text-foreground">Messages</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {unreadCount} baru
            </span>
          )}
        </div>
        <MessageInbox initialMessages={messages} />
      </div>
    </PageTransition>
  );
}
