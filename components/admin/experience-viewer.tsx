"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ExperienceViewerProps {
  experiences: any[];
}

export function ExperienceViewer({ experiences }: ExperienceViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = experiences.filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.company.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search experiences..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-sm" />
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No experiences found</div>
        ) : (
          filtered.map((exp) => {
            const isPresent = !exp.periodEnd;
            const startDate = new Date(exp.periodStart).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
            });
            const endDate = exp.periodEnd
              ? new Date(exp.periodEnd).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                })
              : null;

            return (
              <div key={exp.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{exp.title}</p>
                  <Badge variant={isPresent ? "default" : "outline"}>{isPresent ? "Ongoing" : "Completed"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground">
                  {startDate} {endDate ? `- ${endDate}` : "- Present"}
                </p>
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
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No experiences found
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => {
                  const isPresent = !exp.periodEnd;
                  const startDate = new Date(exp.periodStart).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                  });
                  const endDate = exp.periodEnd
                    ? new Date(exp.periodEnd).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                      })
                    : null;

                  return (
                    <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm">{exp.title}</td>
                      <td className="px-4 py-3 text-sm">{exp.company}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {startDate} {endDate ? `- ${endDate}` : "- Present"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={isPresent ? "default" : "outline"}>{isPresent ? "Ongoing" : "Completed"}</Badge>
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
        Showing {filtered.length} of {experiences.length} experiences
      </div>
    </div>
  );
}
