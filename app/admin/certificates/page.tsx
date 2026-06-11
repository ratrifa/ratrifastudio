import { revalidatePath } from "next/cache";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { CollapsibleCreate } from "@/components/admin/collapsible-create";
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
          <h1 className="text-xl sm:text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""}
            {" · "}
            {certificates.filter((c) => c.featured).length === 1
              ? "1 featured"
              : "none featured"}
          </p>
        </div>

        <CollapsibleCreate label="New Certificate">
          <CreateCertificateForm action={createCertificateAction} />
        </CollapsibleCreate>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificateViewer certificates={certificates} />
          </CardContent>
        </Card>

        {certificates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <p className="text-xs font-medium text-muted-foreground shrink-0">Edit items</p>
              <Separator className="flex-1" />
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {certificates.map((cert) => (
                <AccordionItem
                  key={cert.id}
                  value={cert.id}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5 mr-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{cert.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cert.issuer} ·{" "}
                          {new Date(cert.issueDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      {cert.featured && (
                        <Badge variant="default" className="shrink-0 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <CertificateEditItem
                      certificate={cert}
                      updateAction={updateCertificateAction}
                      deleteAction={deleteCertificateAction}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
