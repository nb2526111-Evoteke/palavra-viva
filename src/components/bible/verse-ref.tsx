import Link from "next/link";
import { BookOpen, ChevronDown } from "lucide-react";
import type { ResolvedVerseItem } from "@/lib/bible-reference";

export function VerseRef({
  reference,
  text,
  href,
  items,
  className = "",
}: {
  reference: string;
  text?: string;
  href?: string;
  items?: ResolvedVerseItem[];
  className?: string;
}) {
  return (
    <details className={`group verse-ref max-w-full align-top ${className}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[10.5px] font-semibold leading-none text-accent transition-colors hover:border-accent/50 [&::-webkit-details-marker]:hidden">
        <BookOpen className="size-3" aria-hidden="true" />
        {reference}
        <ChevronDown className="size-3 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-2 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
          Texto bíblico · {reference}
        </p>
        {items && items.length > 0 ? (
          <div className="mt-2.5 max-h-64 space-y-2 overflow-y-auto pr-2">
            {items.map((item) => (
              <p key={item.verse} className="font-serif text-[13.5px] leading-relaxed text-heading">
                <sup className="mr-1 font-sans text-[9px] font-semibold text-accent">{item.verse}</sup>
                {item.text}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-2.5 font-serif text-[13.5px] leading-relaxed text-heading">
            “{text || "Texto bíblico não encontrado."}”
          </p>
        )}
        <Link
          href={href || "/biblia"}
          className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-semibold text-accent hover:underline"
        >
          Abrir capítulo <BookOpen className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </details>
  );
}
