export type ApiErrorCode = "AUTH_UNAUTHORIZED" | "AUTH_FORBIDDEN" | "VALIDATION_ERROR" | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR";

export interface ApiErrorResponse<TDetails = unknown> {
  code: ApiErrorCode;
  message: string;
  details?: TDetails;
}
