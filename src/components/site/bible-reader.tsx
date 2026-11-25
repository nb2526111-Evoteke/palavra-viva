"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Sparkles, X } from "lucide-react";

export type BibleInsightVerse = {
  id: number;
  verse: number;
  text: string;
  meaning: string;
  reflection: string;
};

export function BibleReader({
  bookName,
  chapter,
  verses,
  chapterSummary,
}: {
  bookName: string;
  chapter: number;
  verses: BibleInsightVerse[];
  chapterSummary: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [position, setPosition] = useState({ top: 100, left: 100, maxHeight: 520 });
  const hideTimer = useRef<number | null>(null);

  function cancelHide() {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  function scheduleHide() {
    cancelHide();
    hideTimer.current = window.setTimeout(() => setActive(null), 220);
  }

  function show(verse: number, element: HTMLElement, clientX?: number) {
    cancelHide();
    const rect = element.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    const mobile = window.innerWidth < 640;
    let left: number;
    let top: number;
    let maxHeight: number;

    if (mobile) {
      left = 16;
      maxHeight = Math.min(560, window.innerHeight - 32);
      top = Math.max(16, window.innerHeight - maxHeight - 16);
    } else {
      const anchorX = clientX ?? rect.left + rect.width / 2;
      const opensLeft = anchorX < window.innerWidth / 2;
      const gap = 14;
      left = opensLeft
        ? Math.max(16, Math.min(anchorX - width - gap, window.innerWidth - width - 16))
        : Math.min(window.innerWidth - width - 16, Math.max(anchorX + gap, 16));

      const spaceBelow = window.innerHeight - rect.bottom - 26;
      if (spaceBelow >= 260) {
        top = rect.bottom + 10;
        maxHeight = Math.min(520, spaceBelow);
      } else {
        maxHeight = Math.min(520, Math.max(240, rect.top - 26));
        top = Math.max(16, rect.top - maxHeight - 10);
      }
    }

    setPosition({ top, left, maxHeight });
    setActive(verse);
  }

  useEffect(() => () => cancelHide(), []);

  const activeVerse = verses.find((verse) => verse.verse === active) ?? null;

  return (
    <div id="bible-reader" className="bible-text">
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-line bg-accent-soft/40 px-4 py-3 font-sans text-[11.5px] leading-relaxed text-muted">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
        <p>
          Passe o mouse ou toque em um versículo para abrir uma nota de estudo com o sentido do texto, uma pergunta
          para refletir e o tema do capítulo.
        </p>
      </div>

      {verses.map((verse) => (
        <div
          key={verse.id}
          id={`v${verse.verse}`}
          tabIndex={0}
          role="group"
          aria-label={`${bookName} ${chapter}:${verse.verse}. Passe o mouse para ver a nota de estudo.`}
          className="group -mx-2 scroll-mt-28 cursor-help rounded-lg px-2 py-1 transition-colors hover:bg-accent-soft/40 focus:bg-accent-soft/50 focus:outline-none"
          onMouseEnter={(event) => show(verse.verse, event.currentTarget, event.clientX)}
          onMouseLeave={scheduleHide}
          onFocus={(event) => show(verse.verse, event.currentTarget)}
          onBlur={scheduleHide}
          onClick={(event) => show(verse.verse, event.currentTarget, event.clientX)}
        >
          <span className="verse-number">{verse.verse}</span>
          {verse.text}
        </div>
      ))}

      {activeVerse ? (
        <div
          id="verse-insight-card"
          role="dialog"
          aria-label={`Nota de estudo de ${bookName} ${chapter}:${activeVerse.verse}`}
          className="fixed z-[90] w-[min(22.5rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 text-ink shadow-[0_28px_70px_-22px_rgba(20,15,10,.45)]"
          style={{ top: position.top, left: position.left, maxHeight: position.maxHeight }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">Nota de estudo</p>
              <p className="mt-1 font-serif text-lg font-semibold leading-tight text-heading">
                {bookName} {chapter}:{activeVerse.verse}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:text-accent"
              aria-label="Fechar nota"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <p className="mt-3 rounded-lg bg-accent-soft/45 px-3 py-2 font-serif text-[12.5px] leading-relaxed text-muted">
            “{activeVerse.text}”
          </p>

          <div className="mt-4">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="size-3" aria-hidden="true" /> Sentido do versículo
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{activeVerse.meaning}</p>
          </div>

          <div className="mt-3 rounded-xl border border-line bg-bg/60 px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">Para refletir</p>
            <p className="mt-1 text-[12px] leading-relaxed text-heading">{activeVerse.reflection}</p>
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              <BookOpen className="size-3" aria-hidden="true" /> Sobre {bookName} {chapter}
            </p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{chapterSummary}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
