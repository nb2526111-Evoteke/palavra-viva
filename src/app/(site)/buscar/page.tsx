import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { searchSite } from "@/lib/queries";
import { escapeRegExp } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busque por artigos, versículos e temas no Palavra Viva.",
};

type SearchParams = Promise<{ q?: string }>;

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

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const results = query.length >= 2 ? await searchSite(query, 12) : { posts: [], verses: [] };
  const total = results.posts.length + results.verses.length;

  return (
    <>
      <PageHero
        eyebrow="Busca"
        title="Encontre o que procura."
        description="Procure por artigos, versículos ou temas. A busca percorre o blog e a Bíblia completa."
      >
        <form action="/buscar" method="get" className="relative mt-8 w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            name="q"
            defaultValue={query}
            required
            minLength={2}
            placeholder="Busque por uma palavra, tema ou referência…"
            className="field h-12 pl-10 pr-28"
            aria-label="Buscar no site"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-accent px-4 text-[11px] font-semibold text-accent-contrast">
            Buscar
          </button>
        </form>
      </PageHero>

      <section className="shell max-w-5xl py-12 md:py-16">
        {query.length >= 2 ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Resultados para</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-heading">“{query}”</h2>
              </div>
              <p className="text-xs text-muted">{total} resultados</p>
            </div>

            {results.posts.length > 0 && (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold text-heading">Artigos</h3>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {results.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {results.verses.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-semibold text-heading">Na Bíblia</h3>
                  <Link href={`/biblia/busca?q=${encodeURIComponent(query)}`} className="text-[11px] font-semibold text-accent">
                    Buscar só na Bíblia
                  </Link>
                </div>
                <div className="mt-5 space-y-3">
                  {results.verses.map((verse) => (
                    <Link
                      key={verse.id}
                      href={`/biblia/${verse.book_slug}/${verse.chapter}#v${verse.verse}`}
                      className="card group block p-5 transition-colors hover:border-accent/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                          {verse.book_name} {verse.chapter}:{verse.verse}
                        </p>
                        <ArrowUpRight className="size-3.5 text-muted group-hover:text-accent" />
                      </div>
                      <p className="mt-2 font-reading text-[15px] leading-relaxed text-ink">
                        <Highlight text={verse.text} term={query} />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {total === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
                <p className="font-serif text-xl text-heading">Nada encontrado.</p>
                <p className="mt-2 text-sm text-muted">Tente outra palavra ou explore o blog e a Bíblia.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link href="/blog" className="btn btn-outline h-10">
                    Ver artigos
                  </Link>
                  <Link href="/biblia" className="btn btn-outline h-10">
                    Abrir a Bíblia
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-semibold text-heading">Explore o blog</h2>
              <p className="mt-2 text-sm text-muted">Devocionais, estudos e reflexões sobre a vida cristã.</p>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                Ver artigos <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="card p-6">
              <h2 className="font-serif text-xl font-semibold text-heading">Busque na Bíblia</h2>
              <p className="mt-2 text-sm text-muted">Pesquise entre os 31.102 versículos por palavra ou tema.</p>
              <Link href="/biblia/busca" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                Busca bíblica <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
