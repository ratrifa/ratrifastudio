"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CollapsibleCreateProps {
  label: string;
  children: React.ReactNode;
}

export function CollapsibleCreate({ label, children }: CollapsibleCreateProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant={open ? "outline" : "default"}
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="gap-1.5"
      >
        {open ? <X size={14} /> : <Plus size={14} />}
        {open ? "Cancel" : label}
      </Button>

      {open && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          {children}
        </div>
      )}
    </div>
  );
}
