import type { ThemeTokens } from "./themes";

const TOKEN_VARS: Record<keyof ThemeTokens, string> = {
  bg: "--bg",
  surface: "--surface",
  surface2: "--surface-2",
  ink: "--ink",
  muted: "--muted",
  line: "--line",
  accent: "--accent",
  accentHover: "--accent-hover",
  accentSoft: "--accent-soft",
  accentContrast: "--accent-contrast",
  gold: "--gold",
  heading: "--heading",
};

export function applyTheme(theme: { slug: string; mode: "light" | "dark"; tokens: ThemeTokens }) {
  const root = document.documentElement;
  root.dataset.theme = theme.slug;
  for (const [key, cssVar] of Object.entries(TOKEN_VARS)) {
    root.style.setProperty(cssVar, theme.tokens[key as keyof ThemeTokens]);
  }
  root.style.colorScheme = theme.mode;
  document.cookie = `pv_theme=${theme.slug}; path=/; max-age=31536000; samesite=lax`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.tokens.bg);
}
