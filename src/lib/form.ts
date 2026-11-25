export type FormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
} | null;

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
