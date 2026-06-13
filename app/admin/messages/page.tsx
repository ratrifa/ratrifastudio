import { apiGet } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminMessagesPageClient, type MessageItem } from "@/components/admin/messages-page-client";

export default async function AdminMessagesPage() {
  await requireAdmin();

  const messages = (await apiGet<MessageItem[]>("/api/admin/messages")) ?? [];

  return <AdminMessagesPageClient messages={messages} />;
}
