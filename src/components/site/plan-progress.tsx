"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw } from "lucide-react";
import { passageHref } from "@/lib/bible-books";
import { cn } from "@/lib/utils";

type PlanDay = {
  id: number;
  day: number;
  title: string;
  passage: string;
  reflection: string;
};

export function PlanProgress({ slug, days }: { slug: string; days: PlanDay[] }) {
  const storageKey = `pv_plan_${slug}`;
  const [done, setDone] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setDone(parsed.filter((value) => typeof value === "number"));
      }
    } catch {
      setDone([]);
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(storageKey, JSON.stringify(done));
  }, [done, loaded, storageKey]);

  const progress = useMemo(() => (days.length ? Math.round((done.length / days.length) * 100) : 0), [days.length, done.length]);

  function toggle(day: number) {
    setDone((current) => (current.includes(day) ? current.filter((value) => value !== day) : [...current, day]));
  }

  function reset() {
    setDone([]);
  }

  return (
    <div>
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Seu progresso</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-heading">
              {done.length} de {days.length} dias
            </p>
          </div>
          <div className="flex items-center gap-3">
            {done.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted hover:text-accent"
              >
                <RotateCcw className="size-3.5" /> Reiniciar
              </button>
            )}
            <span className="font-serif text-3xl font-semibold text-accent">{progress}%</span>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {days.map((day) => {
          const checked = done.includes(day.day);
          return (
            <li
              key={day.id}
              className={cn(
                "card flex gap-4 p-5 transition-colors",
                checked && "border-accent/35 bg-accent-soft/35",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(day.day)}
                aria-pressed={checked}
                aria-label={`Marcar dia ${day.day} como concluído`}
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors",
                  checked ? "border-accent bg-accent text-accent-contrast" : "border-line text-transparent hover:border-accent",
                )}
              >
                <Check className="size-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Dia {day.day}</p>
                  <Link
                    href={passageHref(day.passage)}
                    className="text-[10.5px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                  >
                    {day.passage}
                  </Link>
                </div>
                <h3 className={cn("mt-1 font-serif text-lg font-semibold leading-snug text-heading", checked && "line-through decoration-accent/40")}>
                  {day.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{day.reflection}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
