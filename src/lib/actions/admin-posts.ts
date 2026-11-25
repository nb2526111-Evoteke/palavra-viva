"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, backWith, formBool, formInt, formRaw, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";
import type { FormState } from "@/lib/form";
import { excerptFrom, localInputToSql, readingTime, slugify, uniqueSlug } from "@/lib/utils";

const STATUSES = new Set(["draft", "published", "scheduled"]);

function cleanUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) return trimmed.slice(0, 500);
  return "";
}

function revalidatePost(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/artigos");
}

async function syncTags(postId: number, raw: string) {
  const names = Array.from(
    new Set(
      raw
        .split(/[,\n]/)
        .map((tag) => tag.trim().slice(0, 50))
        .filter(Boolean),
    ),
  ).slice(0, 15);

  await execute("DELETE FROM post_tags WHERE post_id = ?", [postId]);
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    await execute("INSERT INTO tags (name, slug) VALUES (?, ?) ON CONFLICT(slug) DO NOTHING", [name, slug]);
    const tag = await queryOne<{ id: number }>("SELECT id FROM tags WHERE slug = ?", [slug]);
    if (tag) await execute("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)", [postId, tag.id]);
  }
}

export async function savePostAction(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const title = formText(formData, "title", 180);
  const content = formRaw(formData, "content", 250_000);
  const subtitle = formText(formData, "subtitle", 220);
  const status = formText(formData, "status", 20) || "draft";

  if (title.length < 3) {
    return { ok: false, message: "Informe um título com pelo menos 3 caracteres.", fieldErrors: { title: "Título muito curto." } };
  }
  if (content.trim().length < 20) {
    return { ok: false, message: "O conteúdo do artigo está muito curto.", fieldErrors: { content: "Escreva pelo menos algumas linhas." } };
  }
  if (!STATUSES.has(status)) {
    return { ok: false, message: "Situação inválida." };
  }

  const publishedInput = formText(formData, "published_at", 40);
  let publishedAt = localInputToSql(publishedInput);
  if (status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
  if (status === "scheduled" && !publishedAt) {
    return {
      ok: false,
      message: "Escolha a data e a hora da publicação para agendar o artigo.",
      fieldErrors: { published_at: "Data obrigatória para agendamento." },
    };
  }

  const requestedSlug = formText(formData, "slug", 120);
  const slugExists = async (candidate: string) =>
    Boolean(
      await queryOne<{ id: number }>("SELECT id FROM posts WHERE slug = ? AND id <> ?", [candidate, id || 0]),
    );
  const slug = await uniqueSlug(requestedSlug || title, slugExists);

  const categoryId = formInt(formData, "category_id");
  const category = categoryId
    ? await queryOne<{ id: number; slug: string }>("SELECT id, slug FROM categories WHERE id = ?", [categoryId])
    : null;

  const excerpt = formText(formData, "excerpt", 400) || excerptFrom(content, 190);
  const coverImage = cleanUrl(formText(formData, "cover_image", 500));
  const seoTitle = formText(formData, "seo_title", 190) || title;
  const seoDescription = formText(formData, "seo_description", 320) || excerpt;
  const featured = formBool(formData, "featured") ? 1 : 0;
  const minutes = readingTime(content);
  const tags = formText(formData, "tags", 600);
  const previous = id ? await queryOne<{ slug: string }>("SELECT slug FROM posts WHERE id = ?", [id]) : null;

  if (id) {
    const exists = await queryOne<{ id: number }>("SELECT id FROM posts WHERE id = ?", [id]);
    if (!exists) return { ok: false, message: "Artigo não encontrado." };
    await execute(
      `UPDATE posts SET slug = ?, title = ?, subtitle = ?, excerpt = ?, content = ?, cover_image = ?,
              category_id = ?, status = ?, featured = ?, reading_minutes = ?, seo_title = ?,
              seo_description = ?, published_at = ?, updated_at = datetime('now')
        WHERE id = ?`,
      [
        slug,
        title,
        subtitle,
        excerpt,
        content,
        coverImage,
        category?.id ?? null,
        status,
        featured,
        minutes,
        seoTitle,
        seoDescription,
        publishedAt,
        id,
      ],
    );
    await syncTags(id, tags);
    await logAudit({
      userId: user.id,
      action: "post.update",
      entity: "post",
      entityId: id,
      details: title,
    });
    if (previous && previous.slug !== slug) revalidatePath(`/blog/${previous.slug}`);
    revalidatePost(slug);
    if (category?.slug) revalidatePath(`/blog/categoria/${category.slug}`);
    redirect(`/admin/artigos/${id}?ok=${encodeURIComponent("Artigo salvo com sucesso.")}`);
  }

  const newId = await insert(
    `INSERT INTO posts
      (slug, title, subtitle, excerpt, content, cover_image, category_id, author_id, status,
       featured, reading_minutes, seo_title, seo_description, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      slug,
      title,
      subtitle,
      excerpt,
      content,
      coverImage,
      category?.id ?? null,
      user.id,
      status,
      featured,
      minutes,
      seoTitle,
      seoDescription,
      publishedAt,
    ],
  );
  await syncTags(newId, tags);
  await logAudit({ userId: user.id, action: "post.create", entity: "post", entityId: newId, details: title });
  revalidatePost(slug);
  if (category?.slug) revalidatePath(`/blog/categoria/${category.slug}`);
  redirect(`/admin/artigos/${newId}?ok=${encodeURIComponent("Artigo criado. Você já pode revisar e publicar.")}`);
}

export async function deletePostAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const post = await queryOne<{ id: number; slug: string; title: string }>(
    "SELECT id, slug, title FROM posts WHERE id = ?",
    [id],
  );
  if (!post) backWith("/admin/artigos", { erro: "Artigo não encontrado." });

  await execute("DELETE FROM posts WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "post.delete", entity: "post", entityId: id, details: post.title });
  revalidatePost(post.slug);
  backWith("/admin/artigos", { ok: "Artigo excluído definitivamente." });
}

export async function quickPostStatusAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const status = formText(formData, "status", 20);
  if (!STATUSES.has(status)) backWith("/admin/artigos", { erro: "Situação inválida." });

  const post = await queryOne<{ id: number; slug: string; title: string; published_at: string | null }>(
    "SELECT id, slug, title, published_at FROM posts WHERE id = ?",
    [id],
  );
  if (!post) backWith("/admin/artigos", { erro: "Artigo não encontrado." });

  const publishedAt =
    status === "published"
      ? post.published_at ?? new Date().toISOString().slice(0, 19).replace("T", " ")
      : post.published_at;
  await execute("UPDATE posts SET status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?", [
    status,
    publishedAt,
    id,
  ]);
  await logAudit({ userId: user.id, action: `post.${status}`, entity: "post", entityId: id, details: post.title });
  revalidatePost(post.slug);
  const labels: Record<string, string> = {
    published: "Artigo publicado.",
    draft: "Artigo movido para rascunhos.",
    scheduled: "Artigo agendado.",
  };
  backWith("/admin/artigos", { ok: labels[status] ?? "Situação atualizada." });
}

export async function toggleFeaturedAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const post = await queryOne<{ id: number; slug: string; title: string; featured: number }>(
    "SELECT id, slug, title, featured FROM posts WHERE id = ?",
    [id],
  );
  if (!post) backWith("/admin/artigos", { erro: "Artigo não encontrado." });
  await execute("UPDATE posts SET featured = ?, updated_at = datetime('now') WHERE id = ?", [
    post.featured ? 0 : 1,
    id,
  ]);
  await logAudit({
    userId: user.id,
    action: "post.feature",
    entity: "post",
    entityId: id,
    details: `${post.featured ? "Removeu" : "Marcou"} destaque: ${post.title}`,
  });
  revalidatePost(post.slug);
  backWith("/admin/artigos", { ok: post.featured ? "Artigo removido dos destaques." : "Artigo marcado como destaque." });
}

export async function duplicatePostAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const post = await queryOne<{
    slug: string;
    title: string;
    subtitle: string;
    excerpt: string;
    content: string;
    cover_image: string;
    category_id: number | null;
    seo_title: string;
    seo_description: string;
    reading_minutes: number;
  }>("SELECT * FROM posts WHERE id = ?", [id]);
  if (!post) backWith("/admin/artigos", { erro: "Artigo não encontrado." });

  const slug = await uniqueSlug(`${post.slug}-copia`, async (candidate) =>
    Boolean(await queryOne<{ id: number }>("SELECT id FROM posts WHERE slug = ?", [candidate])),
  );
  const newId = await insert(
    `INSERT INTO posts
      (slug, title, subtitle, excerpt, content, cover_image, category_id, author_id, status,
       featured, reading_minutes, seo_title, seo_description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 0, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      slug,
      `${post.title} (cópia)`,
      post.subtitle,
      post.excerpt,
      post.content,
      post.cover_image,
      post.category_id,
      user.id,
      post.reading_minutes,
      post.seo_title,
      post.seo_description,
    ],
  );
  await execute(
    "INSERT OR IGNORE INTO post_tags (post_id, tag_id) SELECT ?, tag_id FROM post_tags WHERE post_id = ?",
    [newId, id],
  );
  await logAudit({ userId: user.id, action: "post.duplicate", entity: "post", entityId: newId, details: post.title });
  redirect(`/admin/artigos/${newId}?ok=${encodeURIComponent("Cópia criada como rascunho.")}`);
}
