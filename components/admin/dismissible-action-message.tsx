"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface DismissibleActionMessageProps {
  status?: string;
  message?: string;
}

export function DismissibleActionMessage({ status, message }: DismissibleActionMessageProps) {
  const [visible, setVisible] = useState(true);

  if (!message || !status || !visible) {
    return null;
  }

  const isSuccess = status === "success";

  return (
    <div
      className={`mt-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-destructive/40 bg-destructive/10 text-destructive"}`}
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setVisible(false)}>
        Close
      </Button>
    </div>
  );
}
