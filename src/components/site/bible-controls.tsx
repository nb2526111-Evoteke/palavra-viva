"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Minus, Plus, Printer } from "lucide-react";

export function BibleControls() {
  const [size, setSize] = useState(21);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem("pv_bible_size"));
    if (saved >= 16 && saved <= 34) setSize(saved);
  }, []);

  useEffect(() => {
    const reader = document.getElementById("bible-reader");
    if (reader) reader.style.fontSize = `${size}px`;
    window.localStorage.setItem("pv_bible_size", String(size));
  }, [size]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="hidden text-[10px] font-medium text-muted sm:inline">Texto</span>
      <div className="flex items-center rounded-full border border-line bg-surface">
        <button
          type="button"
          onClick={() => setSize((value) => Math.max(16, value - 1))}
          className="grid size-8 place-items-center rounded-l-full text-muted transition-colors hover:text-accent"
          aria-label="Diminuir texto"
          title="Diminuir texto"
        >
          <Minus className="size-3.5" />
        </button>
        <span
          className="px-1.5 text-[10px] font-medium tabular-nums text-muted"
          aria-live="polite"
          aria-label={`Tamanho do texto: ${size} pixels`}
        >
          Aa <span className="text-[9px]">{size}</span>
        </span>
        <button
          type="button"
          onClick={() => setSize((value) => Math.min(34, value + 1))}
          className="grid size-8 place-items-center rounded-r-full text-muted transition-colors hover:text-accent"
          aria-label="Aumentar texto"
          title="Aumentar texto"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[10.5px] font-medium text-muted transition-colors hover:text-accent"
      >
        {copied ? <Check className="size-3.5 text-accent" /> : <Link2 className="size-3.5" />}
        {copied ? "Copiado" : "Link"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[10.5px] font-medium text-muted transition-colors hover:text-accent"
      >
        <Printer className="size-3.5" />
        Imprimir
      </button>
    </div>
  );
}
