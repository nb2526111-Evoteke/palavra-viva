import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  LibraryBig,
  Sparkles,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { SectionHeading } from "@/components/site/section-heading";
import { CoverArt } from "@/components/site/cover-art";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { VerseRef } from "@/components/bible/verse-ref";
import { categoryImage, planImage } from "@/lib/visuals";
import {
  countPublishedPosts,
  getBibleStats,
  getCategories,
  getDailyMessage,
  getDailyVerse,
  getFeaturedPosts,
  getPopularPosts,
  getReadingPlans,
  getSettings,
  listPublishedPosts,
} from "@/lib/queries";
import { resolveVerseReference } from "@/lib/bible-reference";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const BIBLE_SHORTCUTS = [
  { name: "Gênesis", slug: "genesis" },
  { name: "Salmos", slug: "salmos" },
  { name: "Provérbios", slug: "proverbios" },
  { name: "João", slug: "joao" },
  { name: "Romanos", slug: "romanos" },
  { name: "Apocalipse", slug: "apocalipse" },
];

export default async function HomePage() {
  const settings = await getSettings();
  const categories = await getCategories();
  const dailyVerse = await getDailyVerse();
  const dailyMessage = await getDailyMessage();
  const dailyMessageVerse = dailyMessage ? await resolveVerseReference(dailyMessage.reference) : null;
  const bibleStats = await getBibleStats();
  const publishedCount = await countPublishedPosts();

  const featured = await getFeaturedPosts(4);
  const allPosts = await listPublishedPosts({ limit: 14 });
  const hero = featured[0] ?? allPosts[0] ?? null;
  const withoutHero = allPosts.filter((post) => post.id !== hero?.id);
  const featuredStrip = (featured.slice(1, 4).length >= 2 ? featured.slice(1, 4) : withoutHero.slice(0, 3)).filter(
    (post) => post.id !== hero?.id,
  );
  const featuredIds = new Set(featuredStrip.map((post) => post.id));
  const latest = withoutHero.filter((post) => !featuredIds.has(post.id)).slice(0, 6);
  const popular = (await getPopularPosts(4)).filter((post) => post.id !== hero?.id).slice(0, 4);
  const plans = (await getReadingPlans()).slice(0, 3);
  const showNewsletter = settings.newsletter_enabled === "1";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name || "Palavra Viva",
    description: settings.description,
    url: process.env.SITE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.SITE_URL || "http://localhost:3000"}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero-glow relative overflow-hidden border-b border-line/60">
        <div className="shell grid items-center gap-14 py-14 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
          <div className="rise">
            <span className="eyebrow">{settings.hero_eyebrow || "Bíblia · Fé · Vida"}</span>
            <h1 className="display mt-6 text-[clamp(2.7rem,5.6vw,4.5rem)]">
              {settings.hero_title || "A Palavra que transforma o ordinário em propósito."}
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted md:text-[17px]">
              {settings.hero_subtitle ||
                "Leituras bíblicas, devocionais e estudos que aproximam as Escrituras da vida real — sem atalhos, sem clichês."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/blog" className="btn btn-primary h-12 px-6 text-[13px]">
                Começar a ler
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/biblia" className="btn btn-outline h-12 px-6 text-[13px]">
                <BookOpen className="size-4" aria-hidden="true" />
                Abrir a Bíblia
              </Link>
            </div>
            <dl className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4 border-t border-line/70 pt-6">
              <div>
                <dd className="font-serif text-[1.65rem] font-semibold leading-none text-heading">66</dd>
                <dt className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">livros</dt>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <dd className="font-serif text-[1.65rem] font-semibold leading-none text-heading">
                  {formatNumber(bibleStats.verses)}
                </dd>
                <dt className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">versículos</dt>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <dd className="font-serif text-[1.65rem] font-semibold leading-none text-heading">{publishedCount}</dd>
                <dt className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">artigos</dt>
              </div>
              <div className="hidden h-8 w-px bg-line sm:block" />
              <div className="hidden sm:block">
                <dd className="font-serif text-[1.65rem] font-semibold leading-none text-heading">100%</dd>
                <dt className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">gratuito</dt>
              </div>
            </dl>
          </div>

          <div className="rise relative" style={{ animationDelay: "120ms" }}>
            {hero ? (
              <div className="relative mx-auto max-w-[440px] lg:max-w-none">
                <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-line/80" aria-hidden="true" />
                <Link
                  href={`/blog/${hero.slug}`}
                  className="group relative block aspect-[4/4.7] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-soft)]"
                >
                  {hero.cover_image || categoryImage(hero.category_slug) ? (
                    <>
                      <img
                        src={hero.cover_image || categoryImage(hero.category_slug)}
                        alt={hero.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                        <span className="size-1 rounded-full bg-white/80" />
                        {hero.category_name || "Palavra Viva"}
                      </span>
                    </>
                  ) : (
                    <CoverArt seed={hero.slug} label={hero.category_name} />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0d0b08]/90 via-[#0d0b08]/45 to-transparent p-6 pt-24">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                      Em destaque
                    </p>
                    <h2 className="mt-2.5 font-serif text-[1.6rem] font-medium leading-[1.15] text-white">
                      {hero.title}
                    </h2>
                    <p className="mt-3 flex items-center gap-2 text-[10.5px] text-white/60">
                      {hero.author_name} <span className="size-1 rounded-full bg-white/40" />
                      {formatDate(hero.published_at)} <span className="size-1 rounded-full bg-white/40" />
                      {hero.reading_minutes} min
                    </p>
                  </div>
                </Link>
                <div className="relative z-30 mx-5 mt-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-lift)] sm:mx-7 sm:mt-5">
                  <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Versículo do dia
                  </div>
                  <p className="mt-2.5 font-serif text-[13.5px] leading-snug text-heading">“{dailyVerse.text}”</p>
                  <p className="mt-2 text-[10px] text-muted">{dailyVerse.reference}</p>
                </div>
              </div>
            ) : (
              <div className="card flex aspect-[4/4.7] items-center justify-center p-10 text-center text-sm text-muted">
                Publique o primeiro artigo no painel para vê-lo aqui.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {featuredStrip.length > 0 && (
        <section className="shell py-16 md:py-20">
          <SectionHeading
            eyebrow="Seleção editorial"
            title="Leituras para começar bem"
            description="Textos que unem profundidade bíblica e vida cotidiana — escolhidos para acompanhar você nesta semana."
            href="/blog"
            linkLabel="Ver todos os artigos"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStrip.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Mensagem do dia */}
      {dailyMessage && dailyMessageVerse ? (
        <section className="shell py-12 md:py-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] md:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full border border-accent/10" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    Mensagem do dia
                  </span>
                  <span className="text-muted/70">{formatDate(dailyMessage.day, "long")}</span>
                </div>
                <h2 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)]">{dailyMessage.title}</h2>
                <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-muted">
                  {dailyMessage.body
                    .split(/\n\n+/)
                    .slice(0, 2)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {dailyMessage.library_slug ? (
                    <Link href={`/biblioteca/${dailyMessage.library_slug}`} className="btn btn-primary h-10">
                      Ler o estudo completo
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <Link href="/biblioteca" className="text-[11px] font-semibold text-accent">
                    Explorar a biblioteca
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-accent-soft/50 p-5 md:p-6">
                <VerseRef
                  reference={dailyMessage.reference}
                  text={dailyMessageVerse.text}
                  href={dailyMessageVerse.href}
                  items={dailyMessageVerse.items}
                />
                <div className="mt-4 border-t border-line/70 pt-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">Prática de hoje</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{dailyMessage.practice}</p>
                </div>
                {dailyMessage.prayer ? (
                  <p className="mt-4 font-serif text-[12.5px] leading-relaxed text-heading">“{dailyMessage.prayer}”</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Últimos artigos + sidebar */}
      <section className="border-y border-line/70 bg-surface/40">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_320px] lg:py-20">
          <div>
            <SectionHeading
              eyebrow="Recém-publicados"
              title="Do blog"
              description="Reflexões, estudos e devocionais publicados recentemente."
              href="/blog"
              linkLabel="Arquivo completo"
            />
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {latest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {latest.length === 0 && (
              <p className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
                Nenhum artigo publicado ainda.
              </p>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                <span className="h-px w-5 bg-accent" />
                Mais lidos
              </div>
              <div className="mt-5 space-y-5">
                {popular.map((post, index) => (
                  <div key={post.id} className="group flex gap-4">
                    <span className="font-serif text-[1.6rem] leading-none text-line transition-colors group-hover:text-accent/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-[14.5px] font-semibold leading-snug text-heading">
                        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[10px] text-muted">
                        {formatNumber(post.views)} leituras
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="relative h-32">
                <img
                  src="/images/temas/estudos-biblicos.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold leading-snug text-heading">Recursos para a jornada</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Ebooks, estudos e planos de leitura para aprofundar a fé no seu ritmo.
                </p>
                <Link
                  href="/biblioteca"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent"
                >
                  Explorar biblioteca <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-accent-soft/60 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Pausa do dia</p>
              <blockquote className="mt-3 font-serif text-[1.15rem] leading-snug text-heading">
                “{dailyVerse.text}”
              </blockquote>
              <p className="mt-3 text-[11px] font-medium text-muted">{dailyVerse.reference}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Bíblia */}
      <section className="shell py-16 md:py-20">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-[#14110d] px-6 py-12 text-white md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_85%_0%,rgba(176,132,63,0.22),transparent_65%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="eyebrow text-[var(--gold)]">Bíblia completa</span>
              <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4vw,3.15rem)] text-white">
                A Escritura inteira, sempre à mão.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                Leia os 66 livros, pesquise por palavra ou referência e continue de onde parou. Uma leitura sem pressa,
                feita para acompanhar a sua vida.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/biblia"
                  className="btn bg-[var(--gold)] text-[#1a1308] hover:brightness-110"
                >
                  Começar a ler
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/biblia/busca"
                  className="btn border border-white/20 bg-white/[0.04] text-white hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Buscar um versículo
                </Link>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-white/10 pt-6">
                <div>
                  <p className="font-serif text-2xl font-semibold text-white">66</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/40">livros</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-white">1.189</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/40">capítulos</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-white">{formatNumber(bibleStats.verses)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/40">versículos</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                <BookOpen className="size-3.5" aria-hidden="true" />
                Versículo do dia
              </div>
              <blockquote className="mt-4 font-serif text-[clamp(1.3rem,2.2vw,1.65rem)] leading-[1.45] text-white/90">
                “{dailyVerse.text}”
              </blockquote>
              <p className="mt-4 text-[11px] font-medium tracking-wide text-[var(--gold)]">{dailyVerse.reference}</p>
              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">Atalhos de leitura</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BIBLE_SHORTCUTS.map((book) => (
                    <Link
                      key={book.slug}
                      href={`/biblia/${book.slug}`}
                      className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      {book.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="border-y border-line/70 bg-surface/40">
        <div className="shell py-16 md:py-20">
          <SectionHeading
            eyebrow="Biblioteca"
            title="Um caminho para cada ritmo"
            description="Planos de leitura curtos e profundos, com reflexões diárias para transformar a leitura em prática."
            href="/biblioteca"
            linkLabel="Ver toda a biblioteca"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan, index) => (
              <Link
                key={plan.id}
                href={`/biblioteca/planos/${plan.slug}`}
                className="card card-hover group relative flex flex-col overflow-hidden p-7"
              >
                <div className="relative -mx-7 -mt-7 mb-6 h-28 overflow-hidden">
                  <img src={planImage(plan.slug)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-serif text-[2.6rem] leading-none text-line transition-colors group-hover:text-accent/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-accent">
                    <CalendarDays className="size-3" aria-hidden="true" />
                    {plan.days_count} dias
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-[1.4rem] font-semibold leading-snug text-heading">{plan.title}</h3>
                <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-muted">{plan.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                  Ver plano <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Temas */}
      <section className="shell py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Explore por tema</span>
            <h2 className="display mt-3 text-[clamp(1.9rem,3.5vw,2.75rem)]">Uma fé que dialoga com a vida.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Do silêncio da oração às perguntas mais difíceis, cada tema reúne leituras para diferentes estações.
            </p>
            <Link href="/blog" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              <LibraryBig className="size-3.5" aria-hidden="true" />
              Ver todos os artigos
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/categoria/${category.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="flex items-center gap-3">
                  {categoryImage(category.slug) ? (
                    <img
                      src={categoryImage(category.slug)}
                      alt=""
                      className="size-11 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="size-2.5 rounded-full" style={{ background: category.color }} />
                  )}
                  <span>
                    <span className="block text-sm font-semibold text-heading transition-colors group-hover:text-accent">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted">
                      {category.post_count ?? 0} {category.post_count === 1 ? "artigo" : "artigos"}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      {showNewsletter && (
        <section id="newsletter" className="shell scroll-mt-28 pb-20">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-accent-soft px-6 py-12 md:px-12 md:py-14">
            <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-accent/15" />
            <div className="pointer-events-none absolute -right-8 -top-10 size-44 rounded-full border border-accent/15" />
            <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <span className="eyebrow">Newsletter</span>
                <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)]">
                  Uma carta por semana para começar o dia com as Escrituras.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                  Um texto bíblico, uma reflexão curta e uma pergunta para levar consigo. Sem ruído, sem spam.
                </p>
              </div>
              <div>
                <NewsletterForm source="home" buttonLabel="Quero receber" />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
