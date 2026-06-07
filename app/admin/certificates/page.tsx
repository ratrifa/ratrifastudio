import { revalidatePath } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { CertificateViewer } from "@/components/admin/certificate-viewer";
import { CreateCertificateForm } from "@/components/admin/create-certificate-form";
import { CertificateEditItem } from "@/components/admin/certificate-edit-item";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Manage Certificates</h1>
        <p className="text-sm text-muted-foreground">CRUD sertifikat dan badge unggulan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCertificateForm action={createCertificateAction} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificates Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <CertificateViewer certificates={certificates} />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-3">
        {certificates.map((cert) => (
          <AccordionItem key={cert.id} value={cert.id} className="rounded-lg border border-border px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="min-w-0 text-left">
                <p className="text-sm sm:text-base font-semibold truncate">{cert.title}</p>
                <p className="text-xs text-muted-foreground">Tap to edit certificate</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <CertificateEditItem certificate={cert} updateAction={updateCertificateAction} deleteAction={deleteCertificateAction} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    </PageTransition>
  );
}
