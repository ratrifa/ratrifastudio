import { NextResponse } from "next/server";

import type { ApiErrorCode, ApiErrorResponse } from "@/types/api-error";

interface ApiErrorOptions {
  code: ApiErrorCode;
  message: string;
  status: number;
  details?: unknown;
}

export function apiErrorResponse({ code, message, status, details }: ApiErrorOptions) {
  const payload: ApiErrorResponse = {
    code,
    message,
    ...(typeof details === "undefined" ? {} : { details }),
  };

  return NextResponse.json(
    payload,
    { status },
  );
}

export function validationErrorResponse(details?: unknown) {
  return apiErrorResponse({
    code: "VALIDATION_ERROR",
    message: "Invalid payload",
    status: 400,
    details,
  });
}

export function internalServerErrorResponse(details?: unknown) {
  return apiErrorResponse({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    status: 500,
    details,
  });
}
