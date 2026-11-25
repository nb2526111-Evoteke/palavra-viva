import "server-only";
import { getDefaultTheme, getThemeBySlug, getThemes } from "./queries";
import { getThemeCookie } from "./auth";
import { parseTokens, type ThemeTokens } from "./themes";
import type { ThemeRow } from "./types";

export type ActiveTheme = {
  slug: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
  id: number;
};

export type ThemeOption = {
  slug: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
};

function toTheme(row: ThemeRow): ActiveTheme {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    mode: row.mode === "dark" ? "dark" : "light",
    tokens: parseTokens(row.tokens),
  };
}

export async function getActiveTheme(): Promise<ActiveTheme> {
  const cookieSlug = await getThemeCookie();
  const selected = cookieSlug ? await getThemeBySlug(cookieSlug) : null;
  const fallback = await getDefaultTheme();
  const row = selected ?? fallback;
  if (!row) {
    return {
      id: 0,
      slug: "alvorada",
      name: "Alvorada",
      description: "",
      mode: "light",
      tokens: parseTokens("{}"),
    };
  }
  return toTheme(row);
}

export async function getThemeOptions(): Promise<ThemeOption[]> {
  return (await getThemes()).map((row) => {
    const theme = toTheme(row);
    return {
      slug: theme.slug,
      name: theme.name,
      description: theme.description,
      mode: theme.mode,
      tokens: theme.tokens,
    };
  });
}
