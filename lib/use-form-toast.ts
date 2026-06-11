"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/form-state";

export function useFormToast(state: FormState) {
  const prevStatusRef = useRef<string>(state.status);

  useEffect(() => {
    const prev = prevStatusRef.current;
    const curr = state.status;
    prevStatusRef.current = curr;

    if (curr === "success" && prev !== "success" && state.message) {
      toast.success(state.message);
    } else if (curr === "error" && prev !== "error" && state.message) {
      toast.error(state.message);
    }
  }, [state.status, state.message]);
}
