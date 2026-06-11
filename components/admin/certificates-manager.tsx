"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CreateCertificateForm } from "@/components/admin/create-certificate-form";
import { CertificateEditItem } from "@/components/admin/certificate-edit-item";
import type { FormState } from "@/lib/form-state";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string | null;
  issueDate: string;
  credentialUrl: string | null;
  featured: boolean;
}

interface CertificatesManagerProps {
  certificates: Certificate[];
  createAction: (state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function CertificatesManager({ certificates, createAction, updateAction, deleteAction }: CertificatesManagerProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()),
  );

  const editing = editingId ? certificates.find((c) => c.id === editingId) : null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setIsCreating(true)}>
            <Plus size={14} />
            New Certificate
          </Button>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No certificates found
            </p>
          ) : (
            filtered.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setEditingId(cert.id)}
                className="w-full rounded-lg border border-border p-4 text-left space-y-2 hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{cert.title}</p>
                  {cert.featured && (
                    <Badge variant="default" className="shrink-0 text-xs">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(cert.issueDate).toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Issuer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Issue Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Featured</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No certificates found
                    </td>
                  </tr>
                ) : (
                  filtered.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setEditingId(cert.id)}
                    >
                      <td className="px-4 py-3 font-medium text-sm">{cert.title}</td>
                      <td className="px-4 py-3 text-sm">{cert.issuer}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(cert.issueDate).toLocaleDateString("id-ID", { year: "numeric", month: "short" })}
                      </td>
                      <td className="px-4 py-3">
                        {cert.featured ? (
                          <Badge variant="default" className="text-xs">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); setEditingId(cert.id); }}
                          aria-label={`Edit ${cert.title}`}
                        >
                          <Pencil size={13} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {certificates.length} certificates
        </p>
      </div>

      {/* Create Sheet */}
      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base">New Certificate</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <CreateCertificateForm action={createAction} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(open) => !open && setEditingId(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base truncate">{editing?.title}</SheetTitle>
            {editing && (
              <p className="text-sm text-muted-foreground">{editing.issuer}</p>
            )}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {editing && (
              <CertificateEditItem
                certificate={editing}
                updateAction={updateAction}
                deleteAction={deleteAction}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
