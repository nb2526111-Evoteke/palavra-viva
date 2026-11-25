import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { BibleControls } from "@/components/site/bible-controls";
import { BibleReader } from "@/components/site/bible-reader";
import { RememberReading } from "@/components/site/remember-reading";
import { buildChapterInsights } from "@/lib/bible-insights";
import { getBibleBookBySlug, getBibleBooks, getChapterVerses, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ book: string; chapter: string }>;

async function resolveChapter(bookSlug: string, chapterParam: string) {
  const book = await getBibleBookBySlug(bookSlug);
  if (!book) return null;
  const chapter = Number.parseInt(chapterParam, 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters) return null;
  return { book, chapter };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { book: slug, chapter: chapterParam } = await params;
  const resolved = await resolveChapter(slug, chapterParam);
  if (!resolved) return { title: "Capítulo não encontrado" };
  return {
    title: `${resolved.book.name} ${resolved.chapter}`,
    description: `Leia ${resolved.book.name} ${resolved.chapter} na Bíblia Livre em português.`,
    alternates: { canonical: `/biblia/${resolved.book.slug}/${resolved.chapter}` },
  };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { book: slug, chapter: chapterParam } = await params;
  const resolved = await resolveChapter(slug, chapterParam);
  if (!resolved) notFound();

  const { book, chapter } = resolved;
  const verses = await getChapterVerses(book.id, chapter);
  const insights = buildChapterInsights(book.name, book.slug, chapter, verses);
  const settings = await getSettings();
  const books = await getBibleBooks();
  const index = books.findIndex((item) => item.id === book.id);

  let previous: { slug: string; name: string; chapter: number } | null = null;
  let next: { slug: string; name: string; chapter: number } | null = null;

  if (chapter > 1) {
    previous = { slug: book.slug, name: book.name, chapter: chapter - 1 };
  } else if (index > 0) {
    const prior = books[index - 1];
    previous = { slug: prior.slug, name: prior.name, chapter: prior.chapters };
  }

  if (chapter < book.chapters) {
    next = { slug: book.slug, name: book.name, chapter: chapter + 1 };
  } else if (index >= 0 && index < books.length - 1) {
    const following = books[index + 1];
    next = { slug: following.slug, name: following.name, chapter: 1 };
  }

  const chapters = Array.from({ length: book.chapters }, (_, position) => position + 1);

  return (
    <>
      <RememberReading slug={book.slug} name={book.name} chapter={chapter} />

      <header className="border-b border-line/60 bg-surface/30">
        <div className="shell max-w-4xl py-8 md:py-11">
          <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted" aria-label="Trilha de navegação">
            <Link href="/biblia" className="hover:text-accent">
              Bíblia
            </Link>
            <span>/</span>
            <Link href={`/biblia/${book.slug}`} className="hover:text-accent">
              {book.name}
            </Link>
            <span>/</span>
            <span className="text-ink">{chapter}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                {book.testament === "AT" ? "Antigo Testamento" : "Novo Testamento"} · {book.abbrev}
              </p>
              <h1 className="display mt-2 text-[clamp(2.1rem,4.5vw,3.2rem)]">
                {book.name} <span className="text-accent">{chapter}</span>
              </h1>
            </div>
            <BibleControls />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[11px]">
            {previous ? (
              <Link href={`/biblia/${previous.slug}/${previous.chapter}`} className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                <ArrowLeft className="size-3.5" />
                {previous.name} {previous.chapter}
              </Link>
            ) : (
              <span />
            )}
            <Link href={`/biblia/${book.slug}`} className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
              <BookOpen className="size-3.5" />
              Capítulos
            </Link>
            {next ? (
              <Link href={`/biblia/${next.slug}/${next.chapter}`} className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                {next.name} {next.chapter}
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </header>

      <main className="shell max-w-4xl py-10 md:py-14">
        <div className="card relative overflow-hidden px-6 py-8 md:px-12 md:py-12">
          <div className="pointer-events-none absolute right-0 top-0 size-40 rounded-bl-full bg-accent-soft/40" />
          <div className="relative">
            <p className="mb-7 font-serif text-sm italic text-muted">
              {book.name} {chapter} · Bíblia Livre
            </p>

            {verses.length > 0 ? (
              <BibleReader
                bookName={book.name}
                chapter={chapter}
                verses={insights.verseInsights}
                chapterSummary={insights.summary}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
                <p className="font-serif text-xl text-heading">Conteúdo bíblico em preparação.</p>
                <p className="mt-2 text-sm text-muted">
                  O texto deste capítulo ainda não foi importado. Rode <code className="rounded bg-surface2 px-1.5 py-0.5 text-xs">npm run db:setup</code> para importar a Bíblia completa.
                </p>
              </div>
            )}

            <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              {previous ? (
                <Link href={`/biblia/${previous.slug}/${previous.chapter}`} className="btn btn-outline h-10 text-[11px]">
                  <ArrowLeft className="size-3.5" /> {previous.name} {previous.chapter}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/biblia/${next.slug}/${next.chapter}`} className="btn btn-primary h-10 text-[11px]">
                  {next.name} {next.chapter} <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10.5px] leading-relaxed text-muted">{settings.bible_attribution}</p>

        <div className="mt-10 border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-heading">Todos os capítulos de {book.name}</h2>
            <span className="text-[10.5px] text-muted">{book.chapters} capítulos</span>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-10 md:grid-cols-12">
            {chapters.map((item) => (
              <Link
                key={item}
                href={`/biblia/${book.slug}/${item}`}
                className={
                  item === chapter
                    ? "grid aspect-square place-items-center rounded-lg bg-accent text-xs font-semibold text-accent-contrast"
                    : "grid aspect-square place-items-center rounded-lg border border-line bg-surface text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                }
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
