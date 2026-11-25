import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { Pagination } from "@/components/site/pagination";
import {
  countPublishedPosts,
  getCategories,
  getCategoryBySlug,
  getSettings,
  listPublishedPosts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string; q?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Tema não encontrado" };
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/blog/categoria/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const query = typeof queryParams.q === "string" ? queryParams.q.trim() : "";
  const page = Math.max(1, Number.parseInt(queryParams.page || "1", 10) || 1);
  const settings = await getSettings();
  const perPage = Math.max(3, Number.parseInt(settings.posts_per_page || "9", 10) || 9);
  const categories = await getCategories();
  const posts = await listPublishedPosts({
    category: slug,
    search: query || undefined,
    limit: perPage,
    offset: (page - 1) * perPage,
  });
  const total = await countPublishedPosts({ category: slug, search: query || undefined });
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <>
      <PageHero eyebrow="Tema" title={category.name} description={category.description}>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Link href="/blog" className="chip">
            <ArrowLeft className="size-3" /> Todos os temas
          </Link>
          {categories
            .filter((item) => item.slug !== slug)
            .map((item) => (
              <Link key={item.id} href={`/blog/categoria/${item.slug}`} className="chip">
                {item.name}
              </Link>
            ))}
        </div>
        <form action={`/blog/categoria/${slug}`} method="get" className="relative mt-6 w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input name="q" defaultValue={query} placeholder={`Buscar em ${category.name}…`} className="field h-11 pl-10" />
        </form>
      </PageHero>

      <section className="shell py-12 md:py-16">
        <div className="flex items-center justify-between border-b border-line pb-5">
          <p className="text-xs text-muted">
            {total} {total === 1 ? "artigo" : "artigos"} em {category.name}
          </p>
          <span className="size-2.5 rounded-full" style={{ background: category.color }} />
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-serif text-xl text-heading">Ainda não há artigos neste tema.</p>
            <Link href="/blog" className="btn btn-outline mt-6">
              Explorar todos os artigos
            </Link>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath={`/blog/categoria/${slug}`}
          params={{ q: query || undefined }}
        />
      </section>
    </>
  );
}
