import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { Pagination } from "@/components/site/pagination";
import {
  countPublishedPosts,
  getAllTags,
  getCategories,
  getFeaturedPosts,
  getSettings,
  listPublishedPosts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artigos",
  description: "Devocionais, estudos bíblicos, teologia e reflexões sobre a vida cristã.",
  alternates: { canonical: "/blog" },
};

type SearchParams = Promise<{ page?: string; q?: string; categoria?: string; tag?: string }>;

function value(input: string | undefined) {
  return typeof input === "string" ? input.trim() : "";
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = value(params.q);
  const category = value(params.categoria);
  const tag = value(params.tag);
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const settings = await getSettings();
  const perPage = Math.max(3, Number.parseInt(settings.posts_per_page || "9", 10) || 9);

  const categories = await getCategories();
  const activeCategory = categories.find((item) => item.slug === category);
  const activeTag = tag ? (await getAllTags()).find((item) => item.slug === tag) : null;
  const posts = await listPublishedPosts({
    limit: perPage,
    offset: (page - 1) * perPage,
    search: query || undefined,
    category: category || undefined,
    tag: tag || undefined,
  });
  const total = await countPublishedPosts({
    search: query || undefined,
    category: category || undefined,
    tag: tag || undefined,
  });
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const showFeatured = page === 1 && !query && !category && !tag;
  const featured = showFeatured ? (await getFeaturedPosts(1))[0] : null;
  const gridPosts = featured ? posts.filter((post) => post.id !== featured.id) : posts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Fé que pensa. Esperança que age."
        description="Devocionais, estudos bíblicos e reflexões que aproximam as Escrituras da vida real. Leia com calma, pergunte sem medo e volte sempre."
      >
        <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form action="/blog" method="get" className="relative w-full max-w-md">
            {category && <input type="hidden" name="categoria" value={category} />}
            {tag && <input type="hidden" name="tag" value={tag} />}
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar artigos…"
              className="field h-11 pl-10 pr-24"
              aria-label="Buscar artigos"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full bg-accent px-3.5 text-[11px] font-semibold text-accent-contrast">
              Buscar
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className={!category ? "chip chip-active" : "chip"}>
              Todos os temas
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/blog/categoria/${item.slug}`}
                className={category === item.slug ? "chip chip-active" : "chip"}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="shell py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              {query ? "Resultado da busca" : activeTag ? "Assunto" : activeCategory ? "Tema" : "Arquivo"}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-heading">
              {query ? `“${query}”` : activeTag ? `#${activeTag.name}` : activeCategory?.name || "Todos os artigos"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeTag && (
              <Link
                href={category ? `/blog?categoria=${category}` : "/blog"}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Remover filtro
              </Link>
            )}
            <p className="text-xs text-muted">
              {total} {total === 1 ? "artigo encontrado" : "artigos encontrados"}
            </p>
          </div>
        </div>

        {featured && (
          <div className="mt-8">
            <PostCard post={featured} variant="wide" />
          </div>
        )}

        {gridPosts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-serif text-xl text-heading">Nada encontrado por aqui.</p>
            <p className="mt-2 text-sm text-muted">Tente outra palavra ou explore todos os temas.</p>
            <Link href="/blog" className="btn btn-outline mt-6">
              Ver todos os artigos
            </Link>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/blog"
          params={{ q: query || undefined, categoria: category || undefined, tag: tag || undefined }}
        />
      </section>
    </>
  );
}
