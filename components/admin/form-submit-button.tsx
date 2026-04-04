"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface FormSubmitButtonProps extends ButtonProps {
  pendingLabel: string;
  children?: ReactNode;
  className?: string;
}

export function FormSubmitButton({ children, pendingLabel, ...props }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner className="size-4" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
