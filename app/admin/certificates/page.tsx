import { revalidatePath } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { deleteLocalUpload, saveImageUpload } from "@/lib/storage";
import { certificateFormSchema, certificateUpdateSchema, safeDate } from "@/lib/validation";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { CertificateViewer } from "@/components/admin/certificate-viewer";
import { CreateCertificateForm } from "@/components/admin/create-certificate-form";
import { CertificateEditItem } from "@/components/admin/certificate-edit-item";
import type { FormState } from "@/lib/form-state";

const errorState = (message: string, fieldErrors?: Record<string, string[] | undefined>): FormState => ({
  status: "error",
  message,
  fieldErrors,
});

const successState = (message: string): FormState => ({
  status: "success",
  message,
});

async function createCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const parsed = certificateFormSchema.safeParse({
      title: String(formData.get("title") ?? ""),
      issuer: String(formData.get("issuer") ?? ""),
      issueDate: String(formData.get("issueDate") ?? ""),
      credentialUrl: String(formData.get("credentialUrl") ?? ""),
      featured: formData.get("featured") === "on",
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted certificate fields.", parsed.error.flatten().fieldErrors);
    }

    const { title, issuer, issueDate, credentialUrl, featured } = parsed.data;
    const uploadedImage = await saveImageUpload(formData.get("imageFile"), "certificates");

    if (featured) {
      await prisma.certificate.updateMany({ data: { featured: false } });
    }

    await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate: safeDate(issueDate),
        imageUrl: uploadedImage,
        credentialUrl,
        featured,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");
    return successState("Certificate created successfully.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create certificate.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function updateCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const parsed = certificateUpdateSchema.safeParse({
      id: String(formData.get("id") ?? ""),
      title: String(formData.get("title") ?? ""),
      issuer: String(formData.get("issuer") ?? ""),
      issueDate: String(formData.get("issueDate") ?? ""),
      credentialUrl: String(formData.get("credentialUrl") ?? ""),
      featured: formData.get("featured") === "on",
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted certificate fields.", parsed.error.flatten().fieldErrors);
    }

    const { id, title, issuer, issueDate, credentialUrl, featured } = parsed.data;
    const current = await prisma.certificate.findUnique({ where: { id } });
    if (!current) {
      return errorState("Certificate tidak ditemukan.");
    }

    const uploadedImage = await saveImageUpload(formData.get("imageFile"), "certificates");
    const nextImage = uploadedImage ?? current.imageUrl;

    if (uploadedImage && current.imageUrl !== uploadedImage) {
      await deleteLocalUpload(current.imageUrl);
    }

    if (featured) {
      await prisma.certificate.updateMany({
        where: { id: { not: id } },
        data: { featured: false },
      });
    }

    await prisma.certificate.update({
      where: { id },
      data: {
        title,
        issuer,
        issueDate: safeDate(issueDate),
        imageUrl: nextImage,
        credentialUrl,
        featured,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");
    return successState("Certificate berhasil diupdate.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update certificate gagal.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function deleteCertificateAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const current = await prisma.certificate.findUnique({ where: { id } });
    if (!current) {
      return errorState("Certificate tidak ditemukan.");
    }

    await deleteLocalUpload(current.imageUrl);
    await prisma.certificate.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/certificates");
    return successState("Certificate berhasil dihapus.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete certificate gagal.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

export default async function AdminCertificatesPage() {
  await requireAdmin();

  try {
    const certificates: Awaited<ReturnType<typeof prisma.certificate.findMany>> = await prisma.certificate.findMany({
      orderBy: [{ featured: "desc" }, { issueDate: "desc" }],
    });

    return (
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
          {certificates.map((cert: (typeof certificates)[number]) => (
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
    );
  } finally {
    await cleanupPrisma();
  }
}
