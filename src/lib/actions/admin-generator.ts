"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, formInt, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";
import { resolveVerseReference } from "@/lib/bible-reference";
import { buildThemeForInput } from "@/lib/reference-theme";
import type { GeneratedOutlinePoint, GeneratedThemeContent } from "@/lib/theme-generator";
import { uniqueSlug } from "@/lib/utils";

function generatorPath(
  values: { themeSlug: string; narrativeSlug: string; emphasis: string; audience: string; customTitle: string },
  extra: Record<string, string | number | undefined> = {},
) {
  const search = new URLSearchParams({
    tema: values.themeSlug,
    narrativa: values.narrativeSlug,
    enfase: values.emphasis,
    publico: values.audience,
    titulo: values.customTitle,
  });
  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return `/admin/gerador?${search.toString()}`;
}

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function descriptionFor(content: GeneratedThemeContent) {
  return [
    content.subtitle,
    content.historicalContext[1],
    `${content.period} · ${content.king}`,
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 3000);
}

function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function lines(value: string) {
  return value
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function saoPauloDay() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function saveGeneratedThemeAction(formData: FormData) {
  const user = await adminSession();
  const values = {
    themeSlug: formText(formData, "tema", 80),
    narrativeSlug: formText(formData, "narrativa", 80),
    emphasis: formText(formData, "enfase", 20) || "ambos",
    audience: formText(formData, "publico", 120),
    customTitle: formText(formData, "titulo", 180),
  };

  const generated = await buildThemeForInput(values);
  const slug = await uniqueSlug(generated.title, async (candidate) =>
    Boolean(await queryOne<{ id: number }>("SELECT id FROM library_items WHERE slug = ?", [candidate])),
  );

  const description = [
    generated.subtitle,
    generated.historicalContext[1],
    `${generated.period} · ${generated.king}`,
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 3000);

  const libraryId = await insert(
    `INSERT INTO library_items
      (slug, title, subtitle, author, type, description, cover_image, file_url, external_url, pages, featured, published_at)
     VALUES (?, ?, ?, ?, 'estudo', ?, '', '', '', ?, 0, ?)`,
    [
      slug,
      generated.title,
      generated.subtitle,
      user.name,
      description,
      Math.max(10, generated.outline.length * 2 + 4),
      nowSql(),
    ],
  );

  const generatedId = await insert(
    `INSERT INTO generated_themes
      (library_item_id, theme_slug, narrative_slug, emphasis, audience, content)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      libraryId,
      generated.themeSlug,
      generated.narrativeSlug,
      generated.emphasis,
      generated.audience,
      JSON.stringify(generated),
    ],
  );

  await logAudit({
    userId: user.id,
    action: "theme.generate",
    entity: "library",
    entityId: libraryId,
    details: generated.title,
  });

  revalidatePath("/");
  revalidatePath("/biblioteca");
  revalidatePath("/admin/biblioteca");
  revalidatePath("/admin/gerador");
  revalidatePath(`/biblioteca/${slug}`);

  redirect(
    generatorPath(values, {
      ok: `Tema salvo na biblioteca como “${generated.title}”.`,
      salvo: slug,
      geradoId: generatedId,
    }),
  );
}

export async function publishDailyMessageAction(formData: FormData) {
  const user = await adminSession();
  const values = {
    themeSlug: formText(formData, "tema", 80),
    narrativeSlug: formText(formData, "narrativa", 80),
    emphasis: formText(formData, "enfase", 20) || "ambos",
    audience: formText(formData, "publico", 120),
    customTitle: formText(formData, "titulo", 180),
  };
  const generatedBase = await buildThemeForInput(values);
  const requestedThemeId = formInt(formData, "geradoId");
  const linkedRow = requestedThemeId
    ? await queryOne<{ id: number; content: string }>(
        "SELECT id, content FROM generated_themes WHERE id = ?",
        [requestedThemeId],
      )
    : null;
  let generated = generatedBase;
  if (linkedRow) {
    try {
      generated = JSON.parse(linkedRow.content) as typeof generatedBase;
    } catch {
      generated = generatedBase;
    }
  }
  const linkedTheme = linkedRow ? { id: linkedRow.id } : null;
  const message = generated.dailyMessage;
  const day = saoPauloDay();

  await execute(
    `INSERT INTO daily_messages (day, title, reference, verse_text, body, practice, prayer, theme_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(day) DO UPDATE SET
       title = excluded.title,
       reference = excluded.reference,
       verse_text = excluded.verse_text,
       body = excluded.body,
       practice = excluded.practice,
       prayer = excluded.prayer,
       theme_id = excluded.theme_id`,
    [
      day,
      message.title,
      message.reference,
      message.verseText,
      message.body.join("\n\n"),
      message.practice,
      message.prayer,
      linkedTheme?.id ?? null,
    ],
  );

  await logAudit({
    userId: user.id,
    action: "daily_message.publish",
    entity: "daily_message",
    details: `${message.title} (${day})`,
  });

  revalidatePath("/");
  revalidatePath("/admin/gerador");
  redirect(generatorPath(values, { ok: "Mensagem do dia publicada na página inicial.", mensagem: "1" }));
}

export async function unpublishDailyMessageAction() {
  const user = await adminSession();
  const current = await queryOne<{ id: number; title: string; day: string }>(
    "SELECT id, title, day FROM daily_messages ORDER BY day DESC, id DESC LIMIT 1",
  );

  if (!current) {
    redirect("/admin/gerador?erro=Nenhuma mensagem do dia está publicada.");
  }

  await execute("DELETE FROM daily_messages WHERE id = ?", [current.id]);
  await logAudit({
    userId: user.id,
    action: "daily_message.delete",
    entity: "daily_message",
    entityId: current.id,
    details: `${current.title} (${current.day})`,
  });
  revalidatePath("/");
  revalidatePath("/admin/gerador");
  redirect("/admin/gerador?ok=Mensagem do dia removida da página inicial.");
}

export async function saveEditedThemeAction(formData: FormData) {
  const user = await adminSession();
  const generatedId = formInt(formData, "geradoId");
  const stored = generatedId
    ? await queryOne<{ id: number; library_item_id: number; content: string; library_slug: string }>(
        `SELECT gt.id, gt.library_item_id, gt.content, li.slug AS library_slug
           FROM generated_themes gt
           JOIN library_items li ON li.id = gt.library_item_id
          WHERE gt.id = ? LIMIT 1`,
        [generatedId],
      )
    : null;

  let base: GeneratedThemeContent;
  if (stored) {
    try {
      base = JSON.parse(stored.content) as GeneratedThemeContent;
    } catch {
      base = await buildThemeForInput({
        themeSlug: formText(formData, "tema", 80),
        narrativeSlug: formText(formData, "narrativa", 80),
        emphasis: formText(formData, "enfase", 20) || "ambos",
        audience: formText(formData, "publico", 120),
        customTitle: formText(formData, "titulo", 180),
      });
    }
  } else {
    base = await buildThemeForInput({
      themeSlug: formText(formData, "tema", 80),
      narrativeSlug: formText(formData, "narrativa", 80),
      emphasis: formText(formData, "enfase", 20) || "ambos",
      audience: formText(formData, "publico", 120),
      customTitle: formText(formData, "titulo", 180),
    });
  }

  const title = formText(formData, "titulo_editado", 180);
  const subtitle = formText(formData, "subtitulo_editado", 400);
  if (title.length < 3) {
    redirect(`/admin/gerador?erro=${encodeURIComponent("Informe um título com pelo menos 3 caracteres.")}`);
  }

  const contextParagraphs = paragraphs(formText(formData, "contexto_editado", 12_000));
  const narrativeParagraphs = paragraphs(formText(formData, "narrativa_editada", 12_000));
  const godParagraphs = paragraphs(formText(formData, "deus_editado", 12_000));
  const jesusParagraphs = paragraphs(formText(formData, "jesus_editado", 12_000));
  const applications = lines(formText(formData, "aplicacoes_editadas", 6000));
  const prayer = formText(formData, "oracao_editada", 3000);
  const outlineCount = Math.min(10, Math.max(1, formInt(formData, "ponto_count") || base.outline.length));

  const outline = [] as GeneratedOutlinePoint[];
  for (let index = 0; index < outlineCount; index += 1) {
    const pointTitle = formText(formData, `ponto_${index}_titulo`, 220);
    const pointBody = formText(formData, `ponto_${index}_texto`, 6000);
    if (!pointTitle && !pointBody) continue;
    outline.push({
      title: pointTitle || `Ponto ${index + 1}`,
      body: pointBody,
      references: base.outline[index]?.references ?? [],
    });
  }

  const messageTitle = formText(formData, "mensagem_titulo", 220) || base.dailyMessage.title;
  const messageReference =
    formText(formData, "mensagem_referencia", 120) || base.dailyMessage.reference;
  const dailyVerse = await resolveVerseReference(messageReference);
  const messageBody = paragraphs(formText(formData, "mensagem_corpo", 12_000));
  const messagePractice = formText(formData, "mensagem_pratica", 2000);
  const messagePrayer = formText(formData, "mensagem_oracao", 3000);

  const references = new Map(base.references.map((reference) => [reference.reference, reference]));
  for (const reference of [...outline.flatMap((point) => point.references), dailyVerse.reference]) {
    if (!references.has(reference)) references.set(reference, await resolveVerseReference(reference));
  }

  const content: GeneratedThemeContent = {
    ...base,
    title,
    subtitle: subtitle || base.subtitle,
    historicalContext: contextParagraphs.length > 0 ? contextParagraphs : base.historicalContext,
    narrative: narrativeParagraphs.length > 0 ? narrativeParagraphs : base.narrative,
    god: {
      ...base.god,
      paragraphs: godParagraphs.length > 0 ? godParagraphs : base.god.paragraphs,
    },
    jesus: {
      ...base.jesus,
      paragraphs: jesusParagraphs.length > 0 ? jesusParagraphs : base.jesus.paragraphs,
    },
    outline: outline.length > 0 ? outline : base.outline,
    applications: applications.length > 0 ? applications : base.applications,
    prayer: prayer || base.prayer,
    references: [...references.values()],
    dailyMessage: {
      ...base.dailyMessage,
      title: messageTitle,
      reference: dailyVerse.reference,
      verseText: dailyVerse.text,
      href: dailyVerse.href,
      body: messageBody.length > 0 ? messageBody : base.dailyMessage.body,
      practice: messagePractice || base.dailyMessage.practice,
      prayer: messagePrayer || base.dailyMessage.prayer,
    },
  };

  const description = descriptionFor(content);
  const pages = Math.max(10, content.outline.length * 2 + 4);
  let libraryId: number;
  let slug: string;
  let recordId: number;

  if (stored) {
    libraryId = stored.library_item_id;
    slug = stored.library_slug;
    recordId = stored.id;
    await execute(
      "UPDATE library_items SET title = ?, subtitle = ?, description = ?, pages = ? WHERE id = ?",
      [content.title, content.subtitle, description, pages, libraryId],
    );
    await execute("UPDATE generated_themes SET content = ?, audience = ? WHERE id = ?", [
      JSON.stringify(content),
      content.audience,
      recordId,
    ]);
    await logAudit({
      userId: user.id,
      action: "theme.edit",
      entity: "library",
      entityId: libraryId,
      details: content.title,
    });
  } else {
    slug = await uniqueSlug(content.title, async (candidate) =>
      Boolean(await queryOne<{ id: number }>("SELECT id FROM library_items WHERE slug = ?", [candidate])),
    );
    libraryId = await insert(
      `INSERT INTO library_items
        (slug, title, subtitle, author, type, description, cover_image, file_url, external_url, pages, featured, published_at)
       VALUES (?, ?, ?, ?, 'estudo', ?, '', '', '', ?, 0, ?)`,
      [slug, content.title, content.subtitle, user.name, description, pages, nowSql()],
    );
    recordId = await insert(
      `INSERT INTO generated_themes
        (library_item_id, theme_slug, narrative_slug, emphasis, audience, content)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        libraryId,
        content.themeSlug,
        content.narrativeSlug,
        content.emphasis,
        content.audience,
        JSON.stringify(content),
      ],
    );
    await logAudit({
      userId: user.id,
      action: "theme.generate",
      entity: "library",
      entityId: libraryId,
      details: content.title,
    });
  }

  revalidatePath("/");
  revalidatePath("/biblioteca");
  revalidatePath(`/biblioteca/${slug}`);
  revalidatePath("/admin/biblioteca");
  revalidatePath("/admin/gerador");

  const search = new URLSearchParams({
    tema: content.themeSlug,
    narrativa: content.narrativeSlug,
    enfase: content.emphasis,
    publico: content.audience,
    titulo: content.title,
    geradoId: String(recordId),
    salvo: slug,
    ok: "Conteúdo do tema atualizado com sucesso.",
  });
  redirect(`/admin/gerador?${search.toString()}`);
}
