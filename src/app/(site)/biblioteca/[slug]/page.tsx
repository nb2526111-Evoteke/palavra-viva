import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, Layers, Sparkles } from "lucide-react";
import { CoverArt } from "@/components/site/cover-art";
import { GeneratedThemeView } from "@/components/bible/generated-theme-view";
import { getGeneratedThemeByLibraryItem, getLibraryItem, getLibraryItems } from "@/lib/queries";
import { libraryImage } from "@/lib/visuals";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const TYPE_LABEL: Record<string, string> = {
  ebook: "Ebook",
  estudo: "Estudo bíblico",
  devocional: "Devocional",
  podcast: "Podcast",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getLibraryItem(slug);
  if (!item) return { title: "Material não encontrado" };
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/biblioteca/${item.slug}` },
  };
}

export default async function LibraryItemPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await getLibraryItem(slug);
  if (!item) notFound();

  const generated = await getGeneratedThemeByLibraryItem(item.id);
  const related = (await getLibraryItems(item.type))
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3);

  const actionHref = item.file_url || item.external_url;
  const actionLabel = item.file_url ? "Baixar material" : item.external_url ? "Acessar material" : "";
  const Icon = item.file_url ? Download : ExternalLink;
  const cover = item.cover_image || libraryImage(item.type, item.slug);

  return (
    <>
      <section className="border-b border-line/60 bg-surface/30">
        <div className="shell max-w-4xl py-8">
          <Link href="/biblioteca" className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-accent">
            <ArrowLeft className="size-3.5" /> Voltar à biblioteca
          </Link>
        </div>
      </section>

      <section className="shell max-w-5xl py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-soft)]">
              {cover ? (
                <img src={cover} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <CoverArt seed={item.slug} label={TYPE_LABEL[item.type] || "Biblioteca"} showTitle title={item.title} />
              )}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10.5px] text-muted">
              <span className="chip">{TYPE_LABEL[item.type] || item.type}</span>
              {item.pages > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-3.5" /> {item.pages} páginas
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="eyebrow">{TYPE_LABEL[item.type] || "Biblioteca"}</p>
            <h1 className="display mt-4 text-[clamp(2.1rem,4vw,3.3rem)]">{item.title}</h1>
            <p className="mt-3 font-serif text-lg text-muted">{item.subtitle}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">por {item.author}</p>

            {generated ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                <Sparkles className="size-3" aria-hidden="true" />
                Estudo com contexto histórico e referências
              </div>
            ) : null}

            <div className="prose prose-pv mt-7 max-w-none text-[15px]">
              {item.description.split(/\n\n+/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {!generated ? (
              <div className="mt-8">
                {actionHref ? (
                  <a href={actionHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary h-11">
                    <Icon className="size-4" aria-hidden="true" />
                    {actionLabel}
                  </a>
                ) : (
                  <div className="rounded-2xl border border-line bg-surface p-5">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-heading">
                      <FileText className="size-4 text-accent" />
                      Material em preparação
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      Este conteúdo está sendo finalizado. Assine a newsletter para ser avisado quando estiver disponível.
                    </p>
                    <Link href="/#newsletter" className="btn btn-outline mt-4 h-10">
                      Receber novidades <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {generated ? (
          <div className="mt-14 border-t border-line pt-10">
            <div className="mb-8 max-w-3xl">
              <p className="eyebrow">Estudo completo</p>
              <h2 className="display mt-3 text-[clamp(1.7rem,3.2vw,2.4rem)]">Do contexto histórico à vida prática</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Um roteiro para estudo, pregação ou encontro em grupo. Clique nas referências para ler o versículo sem
                sair da página.
              </p>
            </div>
            <GeneratedThemeView content={generated} dailyLabel="Mensagem para o seu dia" />
          </div>
        ) : null}

        {related.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-heading">Na mesma estante</h2>
              <Link href="/biblioteca" className="text-[11px] font-semibold text-accent">
                Ver tudo
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/biblioteca/${entry.slug}`}
                  className="card card-hover group overflow-hidden"
                >
                  <div className="relative h-32">
                    {entry.cover_image || libraryImage(entry.type, entry.slug) ? (
                      <img
                        src={entry.cover_image || libraryImage(entry.type, entry.slug)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <CoverArt seed={entry.slug} label={TYPE_LABEL[entry.type] || "Biblioteca"} />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-base font-semibold leading-snug text-heading group-hover:text-accent">
                      {entry.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">{entry.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
