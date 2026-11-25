"use client";

import { useActionState, useState } from "react";
import { Check, LoaderCircle, Palette, RotateCcw, Save } from "lucide-react";
import { saveThemeAction } from "@/lib/actions/admin-themes";
import { THEME_PRESETS, type ThemeTokens } from "@/lib/themes";
import { slugify } from "@/lib/utils";

const TOKEN_FIELDS: { key: keyof ThemeTokens; label: string }[] = [
  { key: "bg", label: "Fundo" },
  { key: "surface", label: "Superfície" },
  { key: "surface2", label: "Superfície 2" },
  { key: "ink", label: "Texto" },
  { key: "muted", label: "Texto suave" },
  { key: "line", label: "Linhas" },
  { key: "accent", label: "Destaque" },
  { key: "accentHover", label: "Destaque hover" },
  { key: "accentSoft", label: "Destaque suave" },
  { key: "accentContrast", label: "Contraste" },
  { key: "gold", label: "Dourado" },
  { key: "heading", label: "Títulos" },
];

export type ThemeDraft = {
  id: number;
  name: string;
  slug: string;
  description: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
};

export function ThemeForm({ initial }: { initial: ThemeDraft }) {
  const [state, action, pending] = useActionState(saveThemeAction, null);
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [mode, setMode] = useState<"light" | "dark">(initial.mode);
  const [tokens, setTokens] = useState<ThemeTokens>(initial.tokens);

  function setToken(key: keyof ThemeTokens, value: string) {
    setTokens((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(presetSlug: string) {
    const preset = THEME_PRESETS.find((item) => item.slug === presetSlug);
    if (!preset) return;
    setTokens(preset.tokens);
    setMode(preset.mode);
    if (!initial.id) {
      setName(preset.name);
      setSlug(preset.slug);
      setDescription(preset.description);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
      <form action={action} className="a-card order-2 lg:order-1">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">{initial.id ? `Editar tema: ${initial.name}` : "Criar novo tema"}</h2>
            <p className="a-card-desc">As cores são aplicadas em todo o site público.</p>
          </div>
        </div>

        <div className="a-card-body">
          {state && !state.ok ? (
            <div className="a-alert a-alert-error" role="alert">
              <span>{state.message}</span>
            </div>
          ) : null}
          {state?.ok ? (
            <div className="a-alert a-alert-ok" role="status">
              <Check aria-hidden="true" />
              <span>{state.message}</span>
            </div>
          ) : null}

          {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

          <div className="a-grid-2">
            <div className="a-field !mt-0">
              <label className="a-label" htmlFor="theme-name">Nome</label>
              <input
                id="theme-name"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!initial.id) setSlug(slugify(event.target.value));
                }}
                className="a-input"
                placeholder="Aurora"
                required
                maxLength={80}
              />
            </div>
            <div className="a-field !mt-0">
              <label className="a-label" htmlFor="theme-slug">Identificador</label>
              <input
                id="theme-slug"
                name="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="a-input a-mono"
                placeholder="aurora"
                maxLength={80}
              />
            </div>
          </div>

          <div className="a-field">
            <label className="a-label" htmlFor="theme-description">Descrição</label>
            <input
              id="theme-description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="a-input"
              placeholder="Uma atmosfera de luz suave e madeira clara."
              maxLength={300}
            />
          </div>

          <div className="a-field">
            <span className="a-label">Modo de cor</span>
            <div className="flex gap-2">
              <label className={`a-btn ${mode === "light" ? "a-btn-dark" : "a-btn-outline"} cursor-pointer`}>
                <input
                  type="radio"
                  name="mode"
                  value="light"
                  checked={mode === "light"}
                  onChange={() => setMode("light")}
                  className="sr-only"
                />
                Claro
              </label>
              <label className={`a-btn ${mode === "dark" ? "a-btn-dark" : "a-btn-outline"} cursor-pointer`}>
                <input
                  type="radio"
                  name="mode"
                  value="dark"
                  checked={mode === "dark"}
                  onChange={() => setMode("dark")}
                  className="sr-only"
                />
                Escuro
              </label>
            </div>
          </div>

          <div className="a-mt-4 border-t border-slate-100 pt-4">
            <div className="a-flex-between a-mb-4">
              <span className="a-label !mb-0">Paleta de cores</span>
              <div className="a-actions">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.slug}
                    type="button"
                    className="a-btn a-btn-outline a-btn-sm"
                    onClick={() => applyPreset(preset.slug)}
                    title={`Aplicar as cores do tema ${preset.name}`}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: preset.tokens.accent }}
                    />
                    {preset.name}
                  </button>
                ))}
                <button
                  type="button"
                  className="a-btn a-btn-ghost a-btn-sm"
                  onClick={() => {
                    setTokens(initial.tokens);
                    setMode(initial.mode);
                  }}
                  title="Voltar às cores originais"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Reverter
                </button>
              </div>
            </div>

            <div className="a-token-grid">
              {TOKEN_FIELDS.map((field) => (
                <div className="a-token" key={field.key}>
                  <input
                    type="color"
                    value={tokens[field.key]}
                    onChange={(event) => setToken(field.key, event.target.value)}
                    aria-label={`Cor: ${field.label}`}
                  />
                  <div className="min-w-0 flex-1">
                    <label>{field.label}</label>
                    <input
                      type="text"
                      name={`token_${field.key}`}
                      value={tokens[field.key]}
                      onChange={(event) => setToken(field.key, event.target.value)}
                      maxLength={7}
                      spellCheck={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="a-actions a-mt-4 border-t border-slate-100 pt-4">
            <button type="submit" className="a-btn a-btn-primary" disabled={pending}>
              {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {pending ? "Salvando…" : initial.id ? "Salvar tema" : "Criar tema"}
            </button>
          </div>
        </div>
      </form>

      <aside className="order-1 lg:order-2">
        <div className="a-card overflow-hidden lg:sticky lg:top-[84px]">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Prévia ao vivo</h2>
              <p className="a-card-desc">Como o site se sente com estas cores.</p>
            </div>
            <Palette className="size-4 text-slate-300" aria-hidden="true" />
          </div>
          <div style={{ background: tokens.bg, color: tokens.ink }} className="p-5">
            <div
              className="rounded-xl border p-5"
              style={{ background: tokens.surface, borderColor: tokens.line }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em]"
                style={{ color: tokens.accent }}
              >
                <span className="block h-px w-4" style={{ background: tokens.accent }} />
                Fé que pensa
              </span>
              <p
                className="mt-3 text-[1.45rem] font-semibold leading-[1.15]"
                style={{ fontFamily: "Fraunces, Georgia, serif", color: tokens.heading }}
              >
                A Palavra que transforma o ordinário em propósito.
              </p>
              <p className="mt-2.5 text-[11.5px] leading-relaxed" style={{ color: tokens.muted }}>
                Leituras bíblicas e devocionais para acompanhar a vida real, com profundidade e esperança.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
                  style={{ background: tokens.accent, color: tokens.accentContrast }}
                >
                  Começar a ler
                </span>
                <span
                  className="rounded-full border px-3 py-1.5 text-[10px] font-semibold"
                  style={{ borderColor: tokens.line, color: tokens.ink }}
                >
                  Abrir a Bíblia
                </span>
              </div>
              <div className="mt-4 rounded-lg border-l-2 p-3" style={{ borderColor: tokens.accent, background: tokens.accentSoft }}>
                <p className="text-[11px] leading-snug" style={{ fontFamily: "Fraunces, Georgia, serif", color: tokens.heading }}>
                  “Lâmpada para os meus pés é a tua palavra.”
                </p>
                <p className="mt-1 text-[9px]" style={{ color: tokens.gold }}>Salmos 119:105</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border px-3 py-2.5" style={{ borderColor: tokens.line, background: tokens.surface2 }}>
              <span className="text-[10px]" style={{ color: tokens.muted }}>Versículo do dia</span>
              <span className="text-[10px] font-semibold" style={{ color: tokens.accent }}>Ler agora →</span>
            </div>
          </div>
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-1.5">
              {[tokens.bg, tokens.surface, tokens.surface2, tokens.ink, tokens.muted, tokens.line, tokens.accent, tokens.accentHover, tokens.accentSoft, tokens.gold, tokens.heading].map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="h-6 flex-1 rounded border border-black/5"
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
