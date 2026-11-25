import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, LibraryBig, Mail } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { getBibleStats, getSettings, getSiteAuthor } from "@/lib/queries";
import { formatNumber, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história, a missão e os valores do Palavra Viva.",
  alternates: { canonical: "/sobre" },
};

export default async function AboutPage() {
  const settings = await getSettings();
  const author = await getSiteAuthor();
  const stats = await getBibleStats();
  const paragraphs = (settings.about_text || "").split(/\n\n+/).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title={settings.about_title || "Uma mesa posta para quem quer ler a Bíblia com profundidade."}
        description={settings.tagline}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="chip">{formatNumber(stats.verses)} versículos</span>
          <span className="chip">66 livros</span>
          <span className="chip">Leitura gratuita</span>
        </div>
      </PageHero>

      <section className="shell max-w-5xl py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="eyebrow">Nossa história</span>
            <div className="prose prose-pv mt-5 max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Escritura no centro",
                  text: "Não substituímos o texto por opinião. Abrimos o contexto, lemos devagar e deixamos a Palavra falar primeiro.",
                },
                {
                  icon: HeartHandshake,
                  title: "Honestidade pastoral",
                  text: "Há espaço para dúvidas, luto e perguntas difíceis. A fé madura não precisa fingir que está tudo bem.",
                },
                {
                  icon: LibraryBig,
                  title: "Recursos acessíveis",
                  text: "Bíblia completa, planos e estudos gratuitos. O conhecimento não deve ser uma porta trancada.",
                },
              ].map((value) => (
                <div key={value.title} className="card p-5">
                  <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                    <value.icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-serif text-base font-semibold text-heading">{value.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{value.text}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card p-6 text-center">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-accent-soft font-serif text-2xl font-semibold text-accent">
                {initials(author?.name || "Palavra Viva")}
              </span>
              <p className="mt-4 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">Quem escreve</p>
              <h2 className="mt-1.5 font-serif text-xl font-semibold text-heading">{author?.name}</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {author?.bio ||
                  "Leitor da Bíblia, editor do Palavra Viva. Escreve sobre fé, cultura e as pequenas decisões que formam uma vida."}
              </p>
              <Link href="/contato" className="btn btn-outline mt-5 h-10 w-full">
                <Mail className="size-3.5" /> Falar com a equipe
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-accent-soft/60 p-6">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">Nosso compromisso</p>
              <blockquote className="mt-3 font-serif text-[1.2rem] leading-snug text-heading">
                “A Palavra não foi escrita para ficar distante da vida.”
              </blockquote>
              <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
                Cada texto nasce de leitura, oração e conversa. Nada aqui é escrito com pressa.
              </p>
            </div>

            {settings.newsletter_enabled === "1" && (
              <div className="card p-6">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">Fique perto</p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-heading">
                  Uma leitura por semana no seu e-mail.
                </p>
                <div className="mt-4">
                  <NewsletterForm source="about" buttonLabel="Assinar" />
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-line bg-surface p-7 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-heading">Comece pela Palavra.</h2>
            <p className="mt-1 text-sm text-muted">Abra um capítulo, escolha um plano ou leia o artigo mais recente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/biblia" className="btn btn-primary h-11">
              Abrir a Bíblia <ArrowRight className="size-4" />
            </Link>
            <Link href="/blog" className="btn btn-outline h-11">
              Ler o blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
