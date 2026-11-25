"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButtons({
  title,
  url,
  compact = false,
}: {
  title: string;
  url: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const buttonClass = cn(
    "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent",
    compact ? "size-9" : "h-9 px-3.5 text-[11px] font-medium",
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!compact && (
        <span className="mr-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:inline">Compartilhar</span>
      )}
      <button type="button" onClick={copy} className={buttonClass} aria-label="Copiar link">
        {copied ? <Check className="size-3.5 text-accent" /> : <Link2 className="size-3.5" />}
        {!compact && (copied ? "Copiado" : "Copiar link")}
      </button>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle className="size-3.5" />
        {!compact && "WhatsApp"}
      </a>
      <a
        href={x}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Compartilhar no X"
      >
        <Send className="size-3.5" />
        {!compact && "X"}
      </a>
    </div>
  );
}
