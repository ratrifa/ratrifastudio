"use client";

import { PageTransition } from "@/components/page-transition";
import { CertificatesManager } from "@/components/admin/certificates-manager";
import type { FormState } from "@/lib/form-state";

export interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string | null;
  issueDate: string;
  credentialUrl: string | null;
  featured: boolean;
}

interface Props {
  certificates: CertificateRecord[];
  createAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (_state: FormState, formData: FormData) => Promise<FormState>;
}

export function AdminCertificatesPageClient({ certificates, createAction, updateAction, deleteAction }: Props) {
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
          createAction={createAction}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      </div>
    </PageTransition>
  );
}
