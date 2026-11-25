"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";

const SUGGESTIONS = [
  { label: "Salmos 23", href: "/biblia/salmos/23" },
  { label: "O silêncio que ensina a orar", href: "/blog/o-silencio-que-ensina-a-orar" },
  { label: "Planos de leitura", href: "/biblioteca" },
  { label: "Ansiedade", href: "/biblia/busca?q=ansiedade" },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-accent"
        aria-label="Buscar no site"
      >
        <Search className="size-[18px]" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Fechar busca"
            className="absolute inset-0 bg-[#0c0a08]/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar no site"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,.55)]"
          >
            <form action="/buscar" method="get" onSubmit={() => setOpen(false)} className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <input
                ref={inputRef}
                name="q"
                required
                minLength={2}
                placeholder="Busque por artigos, versículos, temas…"
                className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
                autoComplete="off"
              />
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:block">ESC</kbd>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-surface2 hover:text-ink sm:hidden"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
            </form>
            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Sugestões</p>
              <ul className="mt-2 space-y-1">
                {SUGGESTIONS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-ink transition-colors hover:bg-surface2"
                    >
                      {item.label}
                      <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
