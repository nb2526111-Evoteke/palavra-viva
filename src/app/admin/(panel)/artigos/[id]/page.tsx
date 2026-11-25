import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCategories, getPostById, getPostTags } from "@/lib/queries";
import { PostEditor } from "@/components/admin/post-editor";
import { Flash } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(Number(id));
  return { title: post ? `Editar: ${post.title}` : "Artigo não encontrado" };
}

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  const categories = (await getCategories()).map((category) => ({ id: category.id, name: category.name }));
  const tags = (await getPostTags(post.id)).map((tag) => tag.name).join(", ");

  return (
    <>
      <Flash ok={ok} erro={erro} />
      <PostEditor
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          subtitle: post.subtitle,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.cover_image,
          category_id: post.category_id,
          status: post.status,
          featured: post.featured,
          published_at: post.published_at,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          reading_minutes: post.reading_minutes,
          updated_at: post.updated_at,
          tags,
        }}
        categories={categories}
      />
    </>
  );
}
