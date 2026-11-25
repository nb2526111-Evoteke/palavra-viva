"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";

export type PlanDayDraft = {
  title: string;
  passage: string;
  reflection: string;
};

function emptyDay(index: number): PlanDayDraft {
  return { title: `Dia ${index + 1}`, passage: "", reflection: "" };
}

export function PlanDaysEditor({ initialDays }: { initialDays: PlanDayDraft[] }) {
  const [days, setDays] = useState<PlanDayDraft[]>(
    initialDays.length > 0 ? initialDays : [emptyDay(0), emptyDay(1), emptyDay(2)],
  );

  function update(index: number, field: keyof PlanDayDraft, value: string) {
    setDays((current) => current.map((day, position) => (position === index ? { ...day, [field]: value } : day)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= days.length) return;
    setDays((current) => {
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  function remove(index: number) {
    setDays((current) => current.filter((_, position) => position !== index));
  }

  function add() {
    setDays((current) => [...current, emptyDay(current.length)]);
  }

  return (
    <div>
      <div className="a-flex-between a-mb-4">
        <div>
          <h3 className="a-card-title">Dias de leitura</h3>
          <p className="a-card-desc">{days.length} {days.length === 1 ? "dia configurado" : "dias configurados"}</p>
        </div>
        <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={add}>
          <Plus className="size-3.5" aria-hidden="true" />
          Adicionar dia
        </button>
      </div>

      <div className="space-y-3">
        {days.map((day, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="a-flex-between a-mb-4">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                <GripVertical className="size-3.5 text-slate-300" aria-hidden="true" />
                Dia {index + 1}
              </span>
              <div className="a-actions">
                <button
                  type="button"
                  className="a-btn a-btn-ghost a-btn-icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Mover para cima"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="a-btn a-btn-ghost a-btn-icon"
                  onClick={() => move(index, 1)}
                  disabled={index === days.length - 1}
                  title="Mover para baixo"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="a-btn a-btn-danger a-btn-icon"
                  onClick={() => remove(index)}
                  disabled={days.length === 1}
                  title="Remover dia"
                  aria-label="Remover dia"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="a-grid-2">
              <div className="a-field !mt-0">
                <label className="a-label" htmlFor={`day-title-${index}`}>Título do dia</label>
                <input
                  id={`day-title-${index}`}
                  name="day_title"
                  value={day.title}
                  onChange={(event) => update(index, "title", event.target.value)}
                  className="a-input"
                  placeholder="O silêncio que escuta"
                  maxLength={160}
                />
              </div>
              <div className="a-field !mt-0">
                <label className="a-label" htmlFor={`day-passage-${index}`}>Passagem</label>
                <input
                  id={`day-passage-${index}`}
                  name="day_passage"
                  value={day.passage}
                  onChange={(event) => update(index, "passage", event.target.value)}
                  className="a-input"
                  placeholder="Salmos 46:10"
                  maxLength={160}
                />
              </div>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor={`day-reflection-${index}`}>Reflexão</label>
              <textarea
                id={`day-reflection-${index}`}
                name="day_reflection"
                value={day.reflection}
                onChange={(event) => update(index, "reflection", event.target.value)}
                className="a-textarea min-h-[84px]"
                placeholder="Um comentário curto para acompanhar a leitura."
                maxLength={3000}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="a-btn a-btn-outline a-w-full a-mt-3" onClick={add}>
        <Plus className="size-3.5" aria-hidden="true" />
        Adicionar outro dia
      </button>
    </div>
  );
}
