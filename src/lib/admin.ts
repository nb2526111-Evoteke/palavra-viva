import "server-only";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";
import type { Author } from "./types";

export async function adminSession(): Promise<Author> {
  return requireAdmin();
}

/** Redirects back to an admin page carrying a flash message in the query string. */
export function backWith(
  path: string,
  params: Record<string, string | number | undefined> = {},
): never {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  redirect(query ? `${path}?${query}` : path);
}

export function formText(formData: FormData, name: string, max = 5000) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

export function formRaw(formData: FormData, name: string, max = 200_000) {
  return String(formData.get(name) ?? "").slice(0, max);
}

export function formInt(formData: FormData, name: string) {
  const value = Number.parseInt(String(formData.get(name) ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

export function formBool(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "1" || value === "on" || value === "true";
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function adminTitle(value: string, fallback = "Painel") {
  return value.trim() || fallback;
}
