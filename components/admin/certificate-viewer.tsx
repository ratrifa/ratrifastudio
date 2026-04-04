"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CertificateViewerProps {
  certificates: any[];
}

export function CertificateViewer({ certificates }: CertificateViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = certificates.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.issuer.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search certificates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-sm" />
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No certificates found</div>
        ) : (
          filtered.map((cert) => {
            const issueDate = new Date(cert.issueDate).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
            });

            return (
              <div key={cert.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{cert.title}</p>
                  <Badge variant={cert.featured ? "default" : "outline"}>{cert.featured ? "Featured" : "Not Featured"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground">{issueDate}</p>
                {cert.imageUrl ? (
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                    <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover" />
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Certificate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Issuer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Issue Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Featured</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No certificates found
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => {
                  const issueDate = new Date(cert.issueDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                  });

                  return (
                    <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm">{cert.title}</td>
                      <td className="px-4 py-3 text-sm">{cert.issuer}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{issueDate}</td>
                      <td className="px-4 py-3">
                        <Badge variant={cert.featured ? "default" : "outline"}>{cert.featured ? "Featured" : "Not Featured"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {cert.imageUrl ? (
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                            <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {certificates.length} certificates
      </div>
    </div>
  );
}
