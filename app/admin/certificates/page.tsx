import { revalidatePath } from "next/cache";

import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminCertificatesPageClient, type CertificateRecord } from "@/components/admin/certificates-page-client";
import type { FormState } from "@/lib/form-state";

function revalidateCertificates() {
  revalidatePath("/");
  revalidatePath("/admin/certificates");
}

async function createCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const res = await apiSubmit("/api/certificates", formData);
  const state = await toFormState(res, "Certificate created successfully.");
  if (state.status === "success") {
    revalidateCertificates();
  }
  return state;
}

async function updateCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const res = await apiSubmit(`/api/certificates/${id}`, formData, "PUT");
  const state = await toFormState(res, "Certificate berhasil diupdate.");
  if (state.status === "success") {
    revalidateCertificates();
  }
  return state;
}

async function deleteCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const res = await apiFetch(`/api/certificates/${id}`, { method: "DELETE", headers: { Accept: "application/json" } });
  const state = await toFormState(res, "Certificate berhasil dihapus.");
  if (state.status === "success") {
    revalidateCertificates();
  }
  return state;
}

export default async function AdminCertificatesPage() {
  await requireAdmin();

  const certificates = (await apiGet<CertificateRecord[]>("/api/certificates")) ?? [];

  return (
    <AdminCertificatesPageClient
      certificates={certificates}
      createAction={createCertificateAction}
      updateAction={updateCertificateAction}
      deleteAction={deleteCertificateAction}
    />
  );
}
