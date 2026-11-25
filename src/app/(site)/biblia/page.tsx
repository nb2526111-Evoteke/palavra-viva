import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContinueReading } from "@/components/site/continue-reading";
import { BIBLE_GROUPS } from "@/lib/bible-books";
import { getBibleBooks, getBibleStats, getSettings } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bíblia",
  description: "Leia a Bíblia completa em português: 66 livros, 1.189 capítulos e 31.102 versículos.",
  alternates: { canonical: "/biblia" },
};

export default async function BiblePage() {
  const books = await getBibleBooks();
  const stats = await getBibleStats();
  const settings = await getSettings();

  const oldTestament = books.filter((book) => book.testament === "AT");
  const newTestament = books.filter((book) => book.testament === "NT");
  const oldChapters = oldTestament.reduce((sum, book) => sum + book.chapters, 0);
  const newChapters = newTestament.reduce((sum, book) => sum + book.chapters, 0);

  return (
    <>
      <PageHero
        eyebrow="Bíblia"
        title="A Palavra para hoje."
        description="Leia a Escritura inteira no seu ritmo, pesquise por uma palavra ou volte ao capítulo onde parou. Sem pressa, sem ruído."
      >
        <div className="mt-9 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <form action="/biblia/busca" method="get" className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              name="q"
              required
              minLength={2}
              placeholder="Busque por uma palavra ou tema: amor, esperança, ansiedade…"
              className="field h-12 pl-10 pr-28"
              aria-label="Buscar na Bíblia"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-accent px-4 text-[11px] font-semibold text-accent-contrast">
              Buscar
            </button>
          </form>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="chip">{formatNumber(stats.verses)} versículos</span>
            <span className="chip">66 livros</span>
            <span className="chip">1.189 capítulos</span>
          </div>
        </div>
        <div className="mt-5 max-w-xl">
          <ContinueReading />
        </div>
      </PageHero>

      <section className="shell py-12 md:py-16">
        {[
          { key: "AT" as const, label: "Antigo Testamento", books: oldTestament, chapters: oldChapters, description: "A criação, a aliança, a sabedoria e a promessa." },
          { key: "NT" as const, label: "Novo Testamento", books: newTestament, chapters: newChapters, description: "Jesus, o Evangelho e a Igreja em missão." },
        ].map((testament) => (
          <div key={testament.key} className={testament.key === "NT" ? "mt-16" : ""}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{testament.key}</p>
                <h2 className="mt-1 font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-semibold text-heading">{testament.label}</h2>
                <p className="mt-1 text-sm text-muted">{testament.description}</p>
              </div>
              <p className="text-xs text-muted">
                {testament.books.length} livros · {testament.chapters} capítulos
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {BIBLE_GROUPS.filter((group) => group.testament === testament.key).map((group) => {
                const groupBooks = testament.books.filter((book) => book.id >= group.from && book.id <= group.to);
                return (
                  <div key={group.label} className="card p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-heading">{group.label}</h3>
                        <p className="mt-0.5 text-[11.5px] text-muted">{group.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface2 px-2 py-0.5 text-[9.5px] font-semibold text-muted">
                        {groupBooks.length}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-1.5">
                      {groupBooks.map((book) => (
                        <Link
                          key={book.id}
                          href={`/biblia/${book.slug}`}
                          className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-accent-soft/60"
                        >
                          <span className="text-[12.5px] font-medium text-ink group-hover:text-accent">{book.name}</span>
                          <span className="text-[9.5px] text-muted">{book.chapters}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="shell pb-16 md:pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Comece por um Evangelho", text: "Se é sua primeira leitura, comece por Marcos ou João. Conheça Jesus antes de tentar entender tudo." },
            { icon: Search, title: "Use a busca com liberdade", text: "Procure por uma palavra, um tema ou uma dor. A busca ignora acentos e mostra o versículo no contexto." },
            { icon: ArrowRight, title: "Volte sempre", text: "Quinze minutos por dia são suficientes. O importante não é terminar rápido, é permanecer." },
          ].map((tip) => (
            <div key={tip.title} className="card p-6">
              <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                <tip.icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-heading">{tip.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{tip.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-[10.5px] leading-relaxed text-muted">{settings.bible_attribution}</p>
      </section>
    </>
  );
}
