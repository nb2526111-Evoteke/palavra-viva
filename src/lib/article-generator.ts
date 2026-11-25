import { parseReference } from "./bible-reference";
import type { GeneratedThemeContent } from "./theme-generator";
import { readingTime } from "./utils";

function linkFor(content: GeneratedThemeContent, reference: string) {
  const found = content.references.find((item) => item.reference === reference);
  if (found?.href) return `[${reference}](${found.href})`;
  const parsed = parseReference(reference);
  const href = parsed ? `/biblia/${parsed.book.slug}/${parsed.chapter}#v${parsed.start}` : "/biblia";
  return `[${reference}](${href})`;
}

function referenceLine(content: GeneratedThemeContent, references: string[]) {
  if (references.length === 0) return "";
  return `**Leituras:** ${references.map((reference) => linkFor(content, reference)).join(" · ")}`;
}

export type GeneratedArticle = {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  readingMinutes: number;
  tags: string[];
};

export function generatedThemeToArticle(
  theme: GeneratedThemeContent,
  categoryName = "Estudos Bíblicos",
): GeneratedArticle {
  const sections: string[] = [];

  if (theme.subtitle) sections.push(`*${theme.subtitle}*`);

  sections.push(
    [
      "## Contexto histórico",
      ...theme.historicalContext,
      referenceLine(theme, theme.contextReferences),
    ]
      .filter(Boolean)
      .join("\n\n"),
  );

  sections.push(
    [
      "## A narrativa bíblica",
      ...theme.narrative,
      referenceLine(theme, theme.narrativeReferences),
    ]
      .filter(Boolean)
      .join("\n\n"),
  );

  sections.push(
    [
      "## O que Deus ensinou",
      ...theme.god.paragraphs,
      referenceLine(theme, theme.god.references),
    ]
      .filter(Boolean)
      .join("\n\n"),
  );

  sections.push(
    [
      "## O que Jesus revelou",
      ...theme.jesus.paragraphs,
      referenceLine(theme, theme.jesus.references),
    ]
      .filter(Boolean)
      .join("\n\n"),
  );

  const outline = theme.outline
    .map((point, index) =>
      [
        `### ${index + 1}. ${point.title}`,
        point.body,
        referenceLine(theme, point.references),
      ]
        .filter(Boolean)
        .join("\n\n"),
    )
    .join("\n\n");
  sections.push(`## Esboço do estudo\n\n${outline}`);

  sections.push(`## Aplicações\n\n${theme.applications.map((item) => `- ${item}`).join("\n")}`);

  sections.push(`## Oração\n\n> ${theme.prayer}`);

  sections.push(
    [
      `## Mensagem para o seu dia`,
      `### ${theme.dailyMessage.title}`,
      `> ${theme.dailyMessage.verseText} — ${linkFor(theme, theme.dailyMessage.reference)}`,
      ...theme.dailyMessage.body,
      `**Prática de hoje:** ${theme.dailyMessage.practice}`,
      `**Oração:** ${theme.dailyMessage.prayer}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  );

  const references = theme.references
    .map((reference) => `- ${linkFor(theme, reference.reference)} — ${reference.text.slice(0, 170)}${reference.text.length > 170 ? "…" : ""}`)
    .join("\n");
  sections.push(`## Referências bíblicas\n\n${references}`);

  const content = sections.filter(Boolean).join("\n\n");
  const excerpt = theme.historicalContext[1] || theme.dailyMessage.body[0] || theme.subtitle;
  const tags = Array.from(
    new Set([
      theme.themeName,
      categoryName,
      theme.narrativeName.replace(/:.+$/, "").trim(),
      "estudo bíblico",
      "gerador de temas",
    ]),
  )
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);

  return {
    title: theme.title,
    subtitle: theme.subtitle,
    excerpt: excerpt.slice(0, 220),
    content,
    seoTitle: theme.title,
    seoDescription: excerpt.slice(0, 300),
    readingMinutes: readingTime(content),
    tags,
  };
}
