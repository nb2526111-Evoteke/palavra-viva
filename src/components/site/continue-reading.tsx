"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

type LastRead = { slug: string; name: string; chapter: number };

export function ContinueReading() {
  const [last, setLast] = useState<LastRead | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("pv_last_read");
      if (!raw) return;
      const parsed = JSON.parse(raw) as LastRead;
      if (parsed?.slug && parsed?.chapter) setLast(parsed);
    } catch {
      setLast(null);
    }
  }, []);

  if (!last) {
    return (
      <Link
        href="/biblia/salmos/23"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-accent/40"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
            <BookOpen className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Comece por aqui</span>
            <span className="mt-0.5 block text-sm font-medium text-heading">Salmos 23 — o pastor que acompanha</span>
          </span>
        </span>
        <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
      </Link>
    );
  }

  return (
    <Link
      href={`/biblia/${last.slug}/${last.chapter}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-accent/40"
    >
      <span className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Continuar leitura</span>
          <span className="mt-0.5 block text-sm font-medium text-heading">
            {last.name} {last.chapter}
          </span>
        </span>
      </span>
      <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}
