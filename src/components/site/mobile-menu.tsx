"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LockKeyhole, Menu, Search, X } from "lucide-react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { ThemeSwitcher, type ThemeOption } from "./theme-switcher";

export function MobileMenu({
  siteName,
  tagline,
  themes,
  currentTheme,
}: {
  siteName: string;
  tagline: string;
  themes: ThemeOption[];
  currentTheme: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface2"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[65] lg:hidden">
              <button
                type="button"
                aria-label="Fechar menu"
                className="absolute inset-0 bg-[#0c0a08]/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 flex w-[min(90vw,380px)] flex-col overflow-y-auto border-l border-line bg-bg px-6 pb-8 pt-5">
                <div className="flex items-center justify-between">
                  <Logo name={siteName} tagline={tagline} />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-line p-2 text-muted hover:text-ink"
                    aria-label="Fechar menu"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form action="/buscar" method="get" className="mt-7 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5">
                  <Search className="size-4 text-muted" aria-hidden="true" />
                  <input
                    name="q"
                    required
                    minLength={2}
                    placeholder="Buscar no site…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
                  />
                </form>

                <nav className="mt-6">
                  <NavLinks mobile onNavigate={() => setOpen(false)} />
                </nav>

                <div className="mt-6 border-t border-line pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Tema de leitura</p>
                    <ThemeSwitcher themes={themes} current={currentTheme} />
                  </div>
                </div>

                <div className="mt-auto space-y-3 pt-8">
                  <Link href="/#newsletter" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                    Assinar a newsletter
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-xs font-medium text-muted hover:text-accent"
                  >
                    <LockKeyhole className="size-3.5" aria-hidden="true" />
                    Área do autor
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
