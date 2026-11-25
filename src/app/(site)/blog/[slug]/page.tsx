import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Eye } from "lucide-react";
import { CoverArt } from "@/components/site/cover-art";
import { PostCard } from "@/components/site/post-card";
import { ShareButtons } from "@/components/site/share-buttons";
import { CommentSection } from "@/components/site/comment-section";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { ReadingProgress } from "@/components/site/reading-progress";
import { SectionHeading } from "@/components/site/section-heading";
import {
  getAdjacentPosts,
  getApprovedComments,
  getPostBySlug,
  getPostTags,
  getRelatedPosts,
  getSettings,
  getSiteAuthor,
  incrementPostViews,
} from "@/lib/queries";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { absoluteUrl, formatDate, formatNumber, initials, truncate } from "@/lib/utils";
import { categoryImage } from "@/lib/visuals";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };

  const cover = post.cover_image || categoryImage(post.category_slug);

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cover = post.cover_image || categoryImage(post.category_slug);

  await incrementPostViews(post.id);

  const settings = await getSettings();
  const comments = await getApprovedComments(post.id);
  const tags = await getPostTags(post.id);
  const headings = extractHeadings(post.content);
  const html = renderMarkdown(post.content);
  const related = await getRelatedPosts(post.id, post.category_id, 3);
  const { previous, next } = await getAdjacentPosts(post.published_at);
  const author = await getSiteAuthor();
  const commentsEnabled = settings.comments_enabled === "1";
  const newsletterEnabled = settings.newsletter_enabled === "1";
  const url = absoluteUrl(`/blog/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name || settings.site_name },
    publisher: { "@type": "Organization", name: settings.site_name || "Palavra Viva" },
    mainEntityOfPage: url,
    image: post.cover_image ? absoluteUrl(post.cover_image) : undefined,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      <header className="border-b border-line/60 bg-surface/30">
        <div className="shell max-w-4xl py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted" aria-label="Trilha de navegação">
            <Link href="/" className="hover:text-accent">
              Início
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
            {post.category_name ? (
              <>
                <span>/</span>
                <Link href={`/blog/categoria/${post.category_slug}`} className="hover:text-accent">
                  {post.category_name}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[10.5px] text-muted">
            {post.category_name ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: post.category_color || "var(--accent)",
                  background: `color-mix(in srgb, ${post.category_color || "var(--accent)"} 12%, transparent)`,
                }}
              >
                {post.category_name}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(post.published_at, "long")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {post.reading_minutes} min de leitura
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" aria-hidden="true" />
              {formatNumber(post.views)} leituras
            </span>
          </div>

          <h1 className="display mt-5 text-[clamp(2.15rem,4.6vw,3.9rem)]">{post.title}</h1>
          {post.subtitle && (
            <p className="mt-4 max-w-3xl font-serif text-[1.15rem] leading-relaxed text-muted md:text-[1.3rem]">
              {post.subtitle}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {initials(post.author_name || settings.site_name || "PV")}
              </span>
              <div>
                <p className="text-xs font-semibold text-heading">{post.author_name}</p>
                <p className="mt-0.5 text-[10.5px] text-muted">
                  {formatDate(post.published_at)} · {post.reading_minutes} min
                </p>
              </div>
            </div>
            <ShareButtons title={post.title} url={url} />
          </div>
        </div>
      </header>

      <div className="shell max-w-5xl pt-8 md:pt-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-line md:aspect-[21/8]">
          {cover ? (
            <img src={cover} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <>
              <CoverArt seed={post.slug} label={post.category_name} />
              <div className="absolute inset-0 z-20 flex items-center justify-center px-8 py-10 text-center md:px-16">
                <p className="max-w-2xl font-serif text-[clamp(1.1rem,2.6vw,1.9rem)] font-medium leading-snug text-white/90">
                  “{truncate(post.excerpt, 150)}”
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="shell max-w-6xl grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="min-w-0">
          <div className="prose prose-pv max-w-none" dangerouslySetInnerHTML={{ __html: html }} />

          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Tags</span>
              {tags.map((tag) => (
                <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="chip">
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft font-serif text-base font-semibold text-accent">
                {initials(author?.name || post.author_name || "PV")}
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Sobre o autor</p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-heading">{author?.name || post.author_name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  {author?.bio ||
                    "Leitor da Bíblia, editor do Palavra Viva. Escreve sobre fé, cultura e as pequenas decisões que formam uma vida."}
                </p>
                <Link href="/contato" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                  Falar com a equipe <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <ShareButtons title={post.title} url={url} />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link href={`/blog/${previous.slug}`} className="card group p-5 transition-colors hover:border-accent/40">
                <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <ArrowLeft className="size-3" /> Artigo anterior
                </p>
                <p className="mt-2 font-serif text-[15px] font-semibold leading-snug text-heading group-hover:text-accent">
                  {previous.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="card group p-5 text-right transition-colors hover:border-accent/40">
                <p className="flex items-center justify-end gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Próximo artigo <ArrowRight className="size-3" />
                </p>
                <p className="mt-2 font-serif text-[15px] font-semibold leading-snug text-heading group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            )}
          </div>

          <CommentSection postId={post.id} comments={comments} enabled={commentsEnabled} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-5">
            {headings.length > 0 && (
              <nav className="card p-5" aria-label="Índice do artigo">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">Neste artigo</p>
                <ul className="mt-3 space-y-2">
                  {headings.map((heading) => (
                    <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                      <a
                        href={`#${heading.id}`}
                        className="block text-[11.5px] leading-snug text-muted transition-colors hover:text-accent"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {newsletterEnabled && (
              <div className="rounded-2xl border border-line bg-accent-soft/60 p-5">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">Newsletter</p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-heading">
                  Receba uma leitura por semana.
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                  Reflexões curtas para começar o dia com as Escrituras.
                </p>
                <div className="mt-4">
                  <NewsletterForm source="post" buttonLabel="Assinar" />
                </div>
              </div>
            )}

            <div className="card p-5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">Leia também</p>
              <div className="mt-3 space-y-4">
                {related.slice(0, 2).map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="group block">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: item.category_color || "var(--accent)" }}>
                      {item.category_name}
                    </p>
                    <p className="mt-1 font-serif text-[13.5px] font-semibold leading-snug text-heading group-hover:text-accent">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line/70 bg-surface/40">
          <div className="shell max-w-6xl py-14 md:py-16">
            <SectionHeading eyebrow="Continue lendo" title="Textos relacionados" href="/blog" linkLabel="Ver o blog" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
