import { PageTransition } from "@/components/page-transition";
import { MessageInbox } from "@/components/admin/messages/message-inbox";
import { apiGet } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";

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

export default async function AdminMessagesPage() {
  await requireAdmin();

  const messages = await apiGet<MessageItem[]>("/api/admin/messages");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <h1 className="font-semibold text-xl text-foreground">Messages</h1>
          {messages && messages.filter((m) => !m.isRead).length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {messages.filter((m) => !m.isRead).length} baru
            </span>
          )}
        </div>
        <MessageInbox initialMessages={messages ?? []} />
      </div>
    </PageTransition>
  );
}
