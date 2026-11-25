import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PlanProgress } from "@/components/site/plan-progress";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { getReadingPlan, getReadingPlanDays, getReadingPlans, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getReadingPlan(slug);
  if (!plan) return { title: "Plano não encontrado" };
  return {
    title: plan.title,
    description: plan.description,
    alternates: { canonical: `/biblioteca/planos/${plan.slug}` },
  };
}

export default async function ReadingPlanPage({ params }: { params: Params }) {
  const { slug } = await params;
  const plan = await getReadingPlan(slug);
  if (!plan) notFound();

  const days = await getReadingPlanDays(plan.id);
  const settings = await getSettings();
  const otherPlans = (await getReadingPlans()).filter((item) => item.id !== plan.id);

  return (
    <>
      <PageHero
        eyebrow="Plano de leitura"
        title={plan.title}
        description={plan.description}
      >
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <span className="chip">
            <CalendarDays className="size-3" /> {plan.days_count} dias
          </span>
          <span className="chip">
            <BookOpen className="size-3" /> Bíblia Livre
          </span>
          <Link href="/biblioteca" className="chip">
            <ArrowLeft className="size-3" /> Voltar à biblioteca
          </Link>
        </div>
      </PageHero>

      <section className="shell max-w-5xl py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div>
            <PlanProgress slug={plan.slug} days={days} />
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="font-serif text-lg font-semibold text-heading">Como funciona</h2>
              <ol className="mt-4 space-y-4">
                {[
                  "Leia o texto do dia, de preferência em um horário fixo.",
                  "Reserve alguns minutos de silêncio e responda à pergunta.",
                  "Marque o dia como concluído. Se falhar, recomece de onde parou.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3 text-[12.5px] leading-relaxed text-muted">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[9px] font-bold text-accent">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-4 text-[10.5px] text-muted">
                <CheckCircle2 className="size-3.5 text-accent" />
                O progresso fica salvo neste navegador.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-accent-soft/60 p-6">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">Antes de começar</p>
              <blockquote className="mt-3 font-serif text-[1.15rem] leading-snug text-heading">
                “Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.”
              </blockquote>
              <p className="mt-2 text-[10.5px] text-muted">Salmos 119:105</p>
            </div>

            {settings.newsletter_enabled === "1" && (
              <div className="card p-6">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">Newsletter</p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-heading">
                  Receba leituras como esta.
                </p>
                <div className="mt-4">
                  <NewsletterForm source="plan" buttonLabel="Assinar" />
                </div>
              </div>
            )}

            <Link
              href="/biblia"
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-medium text-heading transition-colors hover:border-accent/40 hover:text-accent"
            >
              Abrir a Bíblia
              <ArrowRight className="size-4" />
            </Link>
          </aside>
        </div>

        {otherPlans.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <h2 className="font-serif text-2xl font-semibold text-heading">Outros planos</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {otherPlans.map((item) => (
                <Link
                  key={item.id}
                  href={`/biblioteca/planos/${item.slug}`}
                  className="card group flex items-center justify-between gap-4 p-5 transition-colors hover:border-accent/40"
                >
                  <div>
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-accent">
                      {item.days_count} dias
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-heading group-hover:text-accent">{item.title}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
