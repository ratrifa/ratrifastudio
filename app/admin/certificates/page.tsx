import { revalidatePath } from "next/cache";

import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { CertificatesManager } from "@/components/admin/certificates-manager";
import type { FormState } from "@/lib/form-state";

interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string | null;
  issueDate: string;
  credentialUrl: string | null;
  featured: boolean;
}

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
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""}
            {" · "}
            {certificates.filter((c) => c.featured).length === 1 ? "1 featured" : "none featured"}
          </p>
        </div>

        <CertificatesManager
          certificates={certificates}
          createAction={createCertificateAction}
          updateAction={updateCertificateAction}
          deleteAction={deleteCertificateAction}
        />
      </div>
    </PageTransition>
  );
}
