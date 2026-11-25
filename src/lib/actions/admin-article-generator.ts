"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, formInt, formText } from "@/lib/admin";
import { generatedThemeToArticle } from "@/lib/article-generator";
import { logAudit } from "@/lib/queries";
import { buildThemeForInput } from "@/lib/reference-theme";
import { GENERATOR_THEMES } from "@/lib/theme-generator";
import { CATEGORY_IMAGES } from "@/lib/visuals";
import { slugify, uniqueSlug } from "@/lib/utils";

function inferTheme(title: string) {
  const text = title.toLowerCase();
  const matches: [RegExp, string][] = [
    [/perd[aã]o|perdoar|reconcilia/, "perdao"],
    [/ansiedade|medo|coragem|confian/, "coragem"],
    [/esperan[cç]a|sofrimento|luto|ex[ií]lio/, "esperanca"],
    [/justi[cç]a|pobre|oprimid/, "justica"],
    [/humildade|servi[cç]o|orgulho/, "humildade"],
    [/adora[cç][aã]o|louvor|ora[cç][aã]o/, "adoracao"],
    [/reino|messias|cristo rei/, "reino"],
    [/fidelidade|alian[cç]a/, "fidelidade"],
    [/miss[aã]o|evangelho|testemunho/, "missao"],
    [/santidade|santo|pureza/, "santidade"],
    [/f[eé]|confian[cç]a/, "fe"],
  ];
  for (const [pattern, slug] of matches) {
    if (pattern.test(text)) return slug;
  }
  return "fe";
}

async function syncTags(postId: number, tags: string[]) {
  for (const name of Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 12)) {
    const slug = slugify(name);
    if (!slug) continue;
    await execute("INSERT INTO tags (name, slug) VALUES (?, ?) ON CONFLICT(slug) DO NOTHING", [name, slug]);
    const tag = await queryOne<{ id: number }>("SELECT id FROM tags WHERE slug = ?", [slug]);
    if (tag) await execute("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)", [postId, tag.id]);
  }
}

export async function createGeneratedArticleAction(formData: FormData) {
  const user = await adminSession();
  const themeText = formText(formData, "tema", 180);
  const passage = formText(formData, "passagem", 120);
  const categoryId = formInt(formData, "categoria");
  const emphasis = formText(formData, "enfase", 20) || "ambos";
  const audience = formText(formData, "publico", 120) || "Leitores do blog";
  const requestedTheme = formText(formData, "tema_base", 80);
  const titleText = passage && !themeText.toLowerCase().includes(passage.toLowerCase())
    ? `${themeText} — ${passage}`
    : themeText;

  if (titleText.length < 3) {
    redirect("/admin/artigos/gerar?erro=Informe o tema do artigo.");
  }

  const themeSlug = requestedTheme && requestedTheme !== "auto" ? requestedTheme : inferTheme(titleText);
  const baseTheme = GENERATOR_THEMES.find((theme) => theme.slug === themeSlug) ?? GENERATOR_THEMES[0];
  const narrativeSlug = baseTheme.recommendedNarratives[0] ?? "davi";
  const category = categoryId
    ? await queryOne<{ id: number; slug: string; name: string }>(
        "SELECT id, slug, name FROM categories WHERE id = ?",
        [categoryId],
      )
    : null;

  const generated = await buildThemeForInput({
    themeSlug: baseTheme.slug,
    narrativeSlug,
    emphasis,
    audience,
    customTitle: titleText,
  });
  const article = generatedThemeToArticle(generated, category?.name);
  if (themeText) {
    article.title = themeText.slice(0, 180);
    article.seoTitle = themeText.slice(0, 180);
  }
  if (article.title.length > 180) article.title = article.title.slice(0, 180);
  const slug = await uniqueSlug(article.title, async (candidate) =>
    Boolean(await queryOne<{ id: number }>("SELECT id FROM posts WHERE slug = ?", [candidate])),
  );
  const coverImage = category?.slug ? CATEGORY_IMAGES[category.slug] ?? "" : "";

  const postId = await insert(
    `INSERT INTO posts
      (slug, title, subtitle, excerpt, content, cover_image, category_id, author_id, status,
       featured, reading_minutes, seo_title, seo_description, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 0, ?, ?, ?, NULL, datetime('now'), datetime('now'))`,
    [
      slug,
      article.title,
      article.subtitle,
      article.excerpt,
      article.content,
      coverImage,
      category?.id ?? null,
      user.id,
      article.readingMinutes,
      article.seoTitle,
      article.seoDescription,
    ],
  );

  await syncTags(postId, article.tags);
  await logAudit({
    userId: user.id,
    action: "article.generate",
    entity: "post",
    entityId: postId,
    details: article.title,
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/artigos");
  redirect(`/admin/artigos/${postId}?ok=Artigo gerado como rascunho. Revise e publique quando estiver pronto.`);
}
