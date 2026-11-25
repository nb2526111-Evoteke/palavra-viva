import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getBibleBookBySlug, getBibleBooks } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ book: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { book: slug } = await params;
  const book = await getBibleBookBySlug(slug);
  if (!book) return { title: "Livro não encontrado" };
  return {
    title: `${book.name} — capítulos`,
    description: `Leia ${book.name}, com ${book.chapters} capítulos, na Bíblia Livre em português.`,
    alternates: { canonical: `/biblia/${book.slug}` },
  };
}

export default async function BookPage({ params }: { params: Params }) {
  const { book: slug } = await params;
  const book = await getBibleBookBySlug(slug);
  if (!book) notFound();

  const books = await getBibleBooks();
  const index = books.findIndex((item) => item.id === book.id);
  const previous = index > 0 ? books[index - 1] : null;
  const next = index >= 0 && index < books.length - 1 ? books[index + 1] : null;
  const chapters = Array.from({ length: book.chapters }, (_, position) => position + 1);

  return (
    <>
      <PageHero
        eyebrow={book.testament === "AT" ? "Antigo Testamento" : "Novo Testamento"}
        title={book.name}
        description={`${book.chapters} ${book.chapters === 1 ? "capítulo" : "capítulos"} · ${book.abbrev} · Bíblia Livre em português.`}
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={`/biblia/${book.slug}/1`} className="btn btn-primary h-11">
            <BookOpen className="size-4" aria-hidden="true" />
            Começar a ler
          </Link>
          <Link href="/biblia" className="btn btn-outline h-11">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Todos os livros
          </Link>
        </div>
      </PageHero>

      <section className="shell max-w-4xl py-12 md:py-16">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="font-serif text-xl font-semibold text-heading">Escolha um capítulo</h2>
          <span className="text-xs text-muted">{book.chapters} capítulos</span>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {chapters.map((chapter) => (
            <Link
              key={chapter}
              href={`/biblia/${book.slug}/${chapter}`}
              className="grid aspect-square place-items-center rounded-xl border border-line bg-surface text-sm font-medium text-ink transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
            >
              {chapter}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {previous ? (
            <Link href={`/biblia/${previous.slug}`} className="card group flex items-center gap-4 p-5 hover:border-accent/40">
              <ArrowLeft className="size-4 text-muted group-hover:text-accent" aria-hidden="true" />
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">Livro anterior</p>
                <p className="mt-0.5 font-serif text-lg font-semibold text-heading group-hover:text-accent">{previous.name}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link href={`/biblia/${next.slug}`} className="card group flex items-center justify-end gap-4 p-5 text-right hover:border-accent/40">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">Próximo livro</p>
                <p className="mt-0.5 font-serif text-lg font-semibold text-heading group-hover:text-accent">{next.name}</p>
              </div>
              <ArrowRight className="size-4 text-muted group-hover:text-accent" aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
