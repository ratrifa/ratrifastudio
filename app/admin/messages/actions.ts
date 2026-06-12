"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import type { FormState } from "@/lib/form-state";

export interface ReplyItem {
  id: string;
  messageId: string;
  body: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function sendReplyAction(
  messageId: string,
  body: string,
): Promise<{ status: FormState["status"]; message: string; reply?: ReplyItem }> {
  await requireAdmin();

  const res = await apiFetch(`/api/admin/messages/${messageId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ body }),
  });

  if (res.ok) {
    const reply = (await res.json()) as ReplyItem;
    revalidatePath("/admin/messages");
    return { status: "success", message: "Balasan berhasil dikirim.", reply };
  }

  const state = await toFormState(res, "Balasan berhasil dikirim.");
  return { status: state.status, message: state.message ?? "Gagal mengirim balasan." };
}

export async function toggleReadAction(messageId: string): Promise<void> {
  await requireAdmin();
  await apiFetch(`/api/admin/messages/${messageId}/read`, {
    method: "PATCH",
    headers: { Accept: "application/json" },
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(messageId: string): Promise<void> {
  await requireAdmin();
  await apiFetch(`/api/admin/messages/${messageId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  revalidatePath("/admin/messages");
}
