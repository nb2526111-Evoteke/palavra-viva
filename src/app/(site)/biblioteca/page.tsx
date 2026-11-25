import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookMarked, CalendarDays, Layers } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CoverArt } from "@/components/site/cover-art";
import { getLibraryItems, getReadingPlans } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { libraryImage, planImage } from "@/lib/visuals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Ebooks, estudos bíblicos, devocionais e planos de leitura para aprofundar a fé.",
  alternates: { canonical: "/biblioteca" },
};

type SearchParams = Promise<{ tipo?: string }>;

const TYPES = [
  { value: "all", label: "Tudo" },
  { value: "planos", label: "Planos de leitura" },
  { value: "ebook", label: "Ebooks" },
  { value: "estudo", label: "Estudos" },
  { value: "devocional", label: "Devocionais" },
];

const TYPE_LABEL: Record<string, string> = {
  ebook: "Ebook",
  estudo: "Estudo",
  devocional: "Devocional",
  podcast: "Podcast",
};

export default async function LibraryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const type = typeof params.tipo === "string" ? params.tipo : "all";
  const validType = TYPES.some((item) => item.value === type) ? type : "all";
  const showPlans = validType === "all" || validType === "planos";
  const showItems = validType !== "planos";

  const plans = showPlans ? await getReadingPlans() : [];
  const items = showItems ? await getLibraryItems(validType === "all" ? undefined : validType) : [];

  return (
    <>
      <PageHero
        eyebrow="Biblioteca"
        title="Recursos para a jornada."
        description="Materiais gratuitos para ler, estudar e praticar. Escolha um plano, baixe um ebook ou comece um estudo no seu ritmo."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {TYPES.map((item) => (
            <Link
              key={item.value}
              href={item.value === "all" ? "/biblioteca" : `/biblioteca?tipo=${item.value}`}
              className={validType === item.value ? "chip chip-active" : "chip"}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="shell py-12 md:py-16">
        {showPlans && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Planos de leitura</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-heading">Um caminho, um dia de cada vez</h2>
              </div>
              <span className="text-xs text-muted">{plans.length} planos disponíveis</span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {plans.map((plan, index) => (
                <Link
                  key={plan.id}
                  href={`/biblioteca/planos/${plan.slug}`}
                  className="card card-hover group flex flex-col overflow-hidden"
                >
                  <div className="relative h-36">
                    {planImage(plan.slug) ? (
                      <img src={planImage(plan.slug)} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <CoverArt seed={plan.slug} label="Plano de leitura" />
                    )}
                    <span className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                      <CalendarDays className="size-3" />
                      {plan.days_count} dias
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-serif text-[2rem] leading-none text-line transition-colors group-hover:text-accent/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-heading group-hover:text-accent">
                      {plan.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">{plan.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                      Ver plano <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {showItems && (
          <div className={showPlans ? "mt-16" : ""}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Acervo</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-heading">
                  {validType === "all" ? "Ebooks, estudos e devocionais" : TYPES.find((item) => item.value === validType)?.label}
                </h2>
              </div>
              <span className="text-xs text-muted">{items.length} materiais</span>
            </div>

            {items.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/biblioteca/${item.slug}`}
                    className="card card-hover group flex flex-col overflow-hidden"
                  >
                    <div className="relative h-44">
                      {item.cover_image || libraryImage(item.type, item.slug) ? (
                        <img
                          src={item.cover_image || libraryImage(item.type, item.slug)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <CoverArt seed={item.slug} label={TYPE_LABEL[item.type] || "Biblioteca"} />
                      )}
                      <span className="absolute right-4 top-4 z-20 rounded-full bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                        {TYPE_LABEL[item.type] || item.type}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-xl font-semibold leading-snug text-heading group-hover:text-accent">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11.5px] text-muted">{item.subtitle}</p>
                      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-5 text-[10.5px] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Layers className="size-3.5" />
                          {item.pages > 0 ? `${item.pages} páginas` : "Material digital"}
                        </span>
                        <ArrowUpRight className="size-4 transition-colors group-hover:text-accent" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
                <BookMarked className="mx-auto size-8 text-muted" />
                <p className="mt-3 font-serif text-xl text-heading">Ainda não há materiais neste formato.</p>
                <Link href="/biblioteca" className="btn btn-outline mt-6">
                  Ver toda a biblioteca
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-accent-soft/50 p-7 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-serif text-xl font-semibold text-heading">Sugestões para a biblioteca?</h3>
            <p className="mt-1 text-sm text-muted">Tem um tema, estudo ou plano que gostaria de ver aqui? Escreva para nós.</p>
          </div>
          <Link href="/contato" className={cn("btn btn-primary shrink-0")}>
            Enviar sugestão <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
