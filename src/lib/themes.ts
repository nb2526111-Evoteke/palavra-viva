import type { CSSProperties } from "react";

export type ThemeTokens = {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentContrast: string;
  gold: string;
  heading: string;
};

export type ThemePreset = {
  name: string;
  slug: string;
  description: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Alvorada",
    slug: "alvorada",
    description: "Marfim quente, terracota e dourado. A luz suave do amanhecer.",
    mode: "light",
    tokens: {
      bg: "#f6f1e8",
      surface: "#fffdf8",
      surface2: "#efe7d9",
      ink: "#26221c",
      muted: "#6d6559",
      line: "#e3d9c9",
      accent: "#a4542e",
      accentHover: "#87401f",
      accentSoft: "#f2e1d3",
      accentContrast: "#fffaf4",
      gold: "#b0843f",
      heading: "#1d1a15",
    },
  },
  {
    name: "Getsêmani",
    slug: "getsemani",
    description: "Azul profundo e ouro velho. Leitura contemplativa no silêncio da noite.",
    mode: "dark",
    tokens: {
      bg: "#0c121d",
      surface: "#121a28",
      surface2: "#182234",
      ink: "#e9e4d8",
      muted: "#98a2b3",
      line: "#263246",
      accent: "#d7a95c",
      accentHover: "#e5bc77",
      accentSoft: "#2a2318",
      accentContrast: "#1a1308",
      gold: "#d7a95c",
      heading: "#f6f1e5",
    },
  },
  {
    name: "Pergaminho",
    slug: "pergaminho",
    description: "Papel envelhecido e tinta sépia. Como ler um manuscrito antigo.",
    mode: "light",
    tokens: {
      bg: "#f1e7d3",
      surface: "#f9f1e1",
      surface2: "#e8dbc2",
      ink: "#3a3023",
      muted: "#776a55",
      line: "#d9c9ab",
      accent: "#7c5a2c",
      accentHover: "#65481f",
      accentSoft: "#eadcc3",
      accentContrast: "#fff9ee",
      gold: "#a17c3d",
      heading: "#2c2419",
    },
  },
  {
    name: "Galileia",
    slug: "galileia",
    description: "Azul-turquesa e brisa de lago. Clareza para estudar e ensinar.",
    mode: "light",
    tokens: {
      bg: "#eef5f5",
      surface: "#fbfefe",
      surface2: "#dfecec",
      ink: "#173033",
      muted: "#5c7376",
      line: "#cfe2e2",
      accent: "#0e6b70",
      accentHover: "#0a5357",
      accentSoft: "#d9eeef",
      accentContrast: "#f7ffff",
      gold: "#b08a45",
      heading: "#0d272a",
    },
  },
  {
    name: "Vinha",
    slug: "vinha",
    description: "Bordô e creme. A dignidade do fruto que amadurece com o tempo.",
    mode: "light",
    tokens: {
      bg: "#faf4ef",
      surface: "#fffdfa",
      surface2: "#f2e6e2",
      ink: "#2e2224",
      muted: "#76636a",
      line: "#e7d5d2",
      accent: "#7b2f3f",
      accentHover: "#63222f",
      accentSoft: "#f3dfe2",
      accentContrast: "#fff8f7",
      gold: "#a97f43",
      heading: "#241619",
    },
  },
];

export function themeStyle(tokens: ThemeTokens, mode: "light" | "dark" = "light"): CSSProperties {
  return {
    "--bg": tokens.bg,
    "--surface": tokens.surface,
    "--surface-2": tokens.surface2,
    "--ink": tokens.ink,
    "--muted": tokens.muted,
    "--line": tokens.line,
    "--accent": tokens.accent,
    "--accent-hover": tokens.accentHover,
    "--accent-soft": tokens.accentSoft,
    "--accent-contrast": tokens.accentContrast,
    "--gold": tokens.gold,
    "--heading": tokens.heading,
    colorScheme: mode,
  } as CSSProperties;
}

export function parseTokens(value: string): ThemeTokens {
  try {
    const parsed = JSON.parse(value) as Partial<ThemeTokens>;
    const fallback = THEME_PRESETS[0].tokens;
    return { ...fallback, ...parsed };
  } catch {
    return THEME_PRESETS[0].tokens;
  }
}
