"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FormState } from "@/lib/form-state";

interface FormStateAlertProps {
  state: FormState;
  title?: string;
}

export function FormStateAlert({ state, title }: FormStateAlertProps) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const fieldErrorMessages =
    state.fieldErrors &&
    Object.values(state.fieldErrors)
      .flatMap((value) => value ?? [])
      .filter(Boolean);

  return (
    <Alert variant={state.status === "error" ? "destructive" : "default"} className="mb-4">
      <AlertTitle>{title ?? (state.status === "error" ? "Validation failed" : "Saved")}</AlertTitle>
      <AlertDescription>
        <p>{state.message}</p>
        {fieldErrorMessages && fieldErrorMessages.length > 0 ? <p>{fieldErrorMessages.join(" · ")}</p> : null}
      </AlertDescription>
    </Alert>
  );
}
