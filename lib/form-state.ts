export type FormStatus = "idle" | "success" | "error";

export interface FormState {
  status: FormStatus;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export const initialFormState: FormState = {
  status: "idle",
  message: "",
};
