"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { applyTheme } from "@/lib/apply-theme";
import type { ThemeTokens } from "@/lib/themes";
import { cn } from "@/lib/utils";

export type ThemeOption = {
  slug: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  tokens: ThemeTokens;
};

export function ThemeSwitcher({
  themes,
  current,
  compact = false,
  className,
}: {
  themes: ThemeOption[];
  current: string;
  compact?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(current);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(theme: ThemeOption) {
    applyTheme(theme);
    setSelected(theme.slug);
    setOpen(false);
  }

  const activeTheme = themes.find((theme) => theme.slug === selected) ?? themes[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Escolher tema de leitura"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent",
          compact && "size-9 justify-center p-0",
        )}
      >
        <Palette className="size-4" aria-hidden="true" />
        {!compact && <span>{activeTheme?.name ?? "Tema"}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[19rem] overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-[0_30px_70px_-30px_rgba(20,15,10,.45)]">
          <div className="px-3 pb-2 pt-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Tema de leitura</p>
            <p className="mt-1 text-xs text-muted">A escolha fica salva no seu navegador.</p>
          </div>
          <div className="space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.slug}
                type="button"
                onClick={() => choose(theme)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface2",
                  theme.slug === selected && "bg-surface2",
                )}
              >
                <span className="mt-0.5 flex shrink-0 overflow-hidden rounded-full border border-line">
                  <span className="size-4" style={{ background: theme.tokens.bg }} />
                  <span className="size-4" style={{ background: theme.tokens.accent }} />
                  <span className="size-4" style={{ background: theme.tokens.surface }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    {theme.name}
                    {theme.mode === "dark" ? (
                      <Moon className="size-3 text-muted" aria-hidden="true" />
                    ) : (
                      <Sun className="size-3 text-muted" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted">{theme.description}</span>
                </span>
                {theme.slug === selected && <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
