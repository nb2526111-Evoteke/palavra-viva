import { CalendarDays, Crown, Landmark, ListChecks, ScrollText, Sparkles } from "lucide-react";
import { VerseRef } from "@/components/bible/verse-ref";
import type { GeneratedThemeContent } from "@/lib/theme-generator";

function referenceMap(content: GeneratedThemeContent) {
  const map = new Map(content.references.map((item) => [item.reference, item]));
  return (reference: string) => {
    const found = map.get(reference);
    return (
      <VerseRef
        key={reference}
        reference={reference}
        text={found?.text}
        href={found?.href}
        items={found?.items}
      />
    );
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-accent">{children}</p>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-muted">
      {items.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function TeachingCard({
  title,
  paragraphs,
  references,
  getRef,
  icon,
}: {
  title: string;
  paragraphs: string[];
  references: string[];
  getRef: (reference: string) => React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">{icon}</span>
        <h3 className="font-serif text-xl font-semibold text-heading">{title}</h3>
      </div>
      <Paragraphs items={paragraphs} />
      <div className="mt-4 flex flex-wrap gap-1.5">{references.map(getRef)}</div>
    </section>
  );
}

export function GeneratedThemeView({
  content,
  dailyLabel = "Mensagem para o seu dia",
}: {
  content: GeneratedThemeContent;
  dailyLabel?: string;
}) {
  const getRef = referenceMap(content);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
            <CalendarDays className="size-3" aria-hidden="true" /> Período histórico
          </p>
          <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-heading">{content.period}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
            <Crown className="size-3" aria-hidden="true" /> Reis e autoridades
          </p>
          <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-heading">{content.king}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
            <Sparkles className="size-3" aria-hidden="true" /> Ênfase do estudo
          </p>
          <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-heading">{content.emphasisLabel}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6 md:p-7">
        <SectionLabel>Contexto histórico</SectionLabel>
        <h3 className="mt-1.5 font-serif text-xl font-semibold text-heading">O chão em que a história acontece</h3>
        <Paragraphs items={content.historicalContext} />
        <div className="mt-4 flex flex-wrap gap-1.5">{content.contextReferences.map(getRef)}</div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6 md:p-7">
        <SectionLabel>Narrativa bíblica</SectionLabel>
        <h3 className="mt-1.5 font-serif text-xl font-semibold text-heading">{content.narrativeName}</h3>
        <Paragraphs items={content.narrative} />
        <div className="mt-4 flex flex-wrap gap-1.5">{content.narrativeReferences.map(getRef)}</div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <TeachingCard
          title="O que Deus ensinou"
          paragraphs={content.god.paragraphs}
          references={content.god.references}
          getRef={getRef}
          icon={<Landmark className="size-4" aria-hidden="true" />}
        />
        <TeachingCard
          title="O que Jesus revelou"
          paragraphs={content.jesus.paragraphs}
          references={content.jesus.references}
          getRef={getRef}
          icon={<Sparkles className="size-4" aria-hidden="true" />}
        />
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6 md:p-7">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
            <ListChecks className="size-4" aria-hidden="true" />
          </span>
          <div>
            <SectionLabel>Esboço</SectionLabel>
            <h3 className="font-serif text-xl font-semibold text-heading">Cinco movimentos para a mensagem</h3>
          </div>
        </div>
        <ol className="mt-6 space-y-5">
          {content.outline.map((point, index) => (
            <li key={`${point.title}-${index}`} className="grid gap-3 sm:grid-cols-[42px_1fr]">
              <span className="font-serif text-[2rem] leading-none text-line">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-serif text-[1.05rem] font-semibold leading-snug text-heading">{point.title}</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{point.body}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">{point.references.map(getRef)}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <SectionLabel>Aplicações</SectionLabel>
          <h3 className="mt-1.5 font-serif text-xl font-semibold text-heading">Da Escritura para a vida</h3>
          <ul className="mt-4 space-y-3">
            {content.applications.map((application, index) => (
              <li key={index} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {application}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-accent-soft/60 p-6">
          <SectionLabel>Oração</SectionLabel>
          <p className="mt-2.5 font-serif text-[15px] leading-relaxed text-heading">“{content.prayer}”</p>
        </section>
      </div>

      <section className="rounded-[1.5rem] border border-line bg-surface p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionLabel>{dailyLabel}</SectionLabel>
            <h3 className="mt-1.5 font-serif text-2xl font-semibold text-heading">{content.dailyMessage.title}</h3>
          </div>
          <VerseRef
            reference={content.dailyMessage.reference}
            text={content.dailyMessage.verseText}
            href={content.dailyMessage.href}
          />
        </div>
        <Paragraphs items={content.dailyMessage.body} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-bg/50 p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">Prática de hoje</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{content.dailyMessage.practice}</p>
          </div>
          <div className="rounded-xl border border-line bg-bg/50 p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">Oração</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{content.dailyMessage.prayer}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-2">
          <ScrollText className="size-4 text-accent" aria-hidden="true" />
          <SectionLabel>Todas as referências</SectionLabel>
        </div>
        <p className="mt-2 text-[12px] text-muted">
          Clique em qualquer referência para abrir o texto bíblico aqui mesmo.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {content.references.map((reference) => (
            <VerseRef
              key={reference.reference}
              reference={reference.reference}
              text={reference.text}
              href={reference.href}
              items={reference.items}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
