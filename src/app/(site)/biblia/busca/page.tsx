import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getBibleStats, searchBibleVerses } from "@/lib/queries";
import { escapeRegExp, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar na Bíblia",
  description: "Pesquise por palavras, temas e versículos na Bíblia completa em português.",
  alternates: { canonical: "/biblia/busca" },
};

type SearchParams = Promise<{ q?: string }>;

const POPULAR = ["amor", "esperança", "fé", "ansiedade", "perdão", "salvação", "sabedoria", "oração"];

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={index} className="rounded bg-accent-soft px-0.5 font-medium text-accent">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export default async function BibleSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const verses = query.length >= 2 ? await searchBibleVerses(query, 60) : [];
  const stats = await getBibleStats();

  return (
    <>
      <PageHero
        eyebrow="Busca bíblica"
        title="Procure e encontre."
        description="Digite uma palavra, um tema ou uma referência. A busca percorre os 31 mil versículos e ignora acentos."
      >
        <form action="/biblia/busca" method="get" className="relative mt-8 w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            name="q"
            defaultValue={query}
            required
            minLength={2}
            placeholder="Ex.: amor, esperança, Salmos 23…"
            className="field h-12 pl-10 pr-28"
            aria-label="Buscar na Bíblia"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-accent px-4 text-[11px] font-semibold text-accent-contrast">
            Buscar
          </button>
        </form>
      </PageHero>

      <section className="shell max-w-4xl py-12 md:py-16">
        {query.length >= 2 ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Resultados para</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-heading">“{query}”</h2>
              </div>
              <p className="text-xs text-muted">
                {verses.length} {verses.length === 1 ? "versículo" : "versículos"}
                {verses.length === 60 ? " (primeiros 60)" : ""}
              </p>
            </div>

            {verses.length > 0 ? (
              <div className="mt-6 space-y-3">
                {verses.map((verse) => (
                  <Link
                    key={verse.id}
                    href={`/biblia/${verse.book_slug}/${verse.chapter}#v${verse.verse}`}
                    className="card group block p-5 transition-colors hover:border-accent/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                        {verse.book_name} {verse.chapter}:{verse.verse}
                      </p>
                      <ArrowUpRight className="size-3.5 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                    </div>
                    <p className="mt-2 font-reading text-[15px] leading-relaxed text-ink">
                      <Highlight text={verse.text} term={query} />
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
                <p className="font-serif text-xl text-heading">Nenhum versículo encontrado.</p>
                <p className="mt-2 text-sm text-muted">Tente uma palavra mais curta ou um sinônimo.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {POPULAR.slice(0, 4).map((term) => (
                    <Link key={term} href={`/biblia/busca?q=${encodeURIComponent(term)}`} className="chip">
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-heading">Por onde começar</h2>
              <p className="mt-2 text-sm text-muted">
                A Bíblia tem {formatNumber(stats.verses)} versículos. Comece por uma palavra que esteja presente no seu dia.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <Link key={term} href={`/biblia/busca?q=${encodeURIComponent(term)}`} className="chip">
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Salmos 23", href: "/biblia/salmos/23", text: "O pastor que acompanha no vale." },
                { label: "João 1", href: "/biblia/joao/1", text: "A Palavra se fez carne." },
                { label: "Romanos 8", href: "/biblia/romanos/8", text: "Nenhuma condenação; esperança que não decepciona." },
                { label: "Filipenses 4", href: "/biblia/filipenses/4", text: "A paz que excede todo entendimento." },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="card group p-5 transition-colors hover:border-accent/40">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">{item.label}</p>
                  <p className="mt-1.5 font-serif text-base font-medium leading-snug text-heading group-hover:text-accent">
                    {item.text}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
