import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "./utils";

marked.setOptions({ gfm: true, breaks: false });

export type Heading = { id: string; text: string; level: 2 | 3 };

function stripInline(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const lines = markdown.split(/\r?\n/);
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1] === "##" ? 2 : 3;
    const text = stripInline(match[2]);
    const base = slugify(text) || "secao";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    headings.push({ id: count === 0 ? base : `${base}-${count + 1}`, text, level });
  }
  return headings;
}

function addHeadingIds(html: string) {
  const used = new Map<string, number>();
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (_full, level: string, inner: string) => {
    const text = stripInline(inner);
    const base = slugify(text) || "secao";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

const ALLOWED_TAGS = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "figure",
  "figcaption",
  "span",
  "del",
  "ins",
]);

export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown || "", { async: false }) as string;
  const withIds = addHeadingIds(raw);
  return sanitizeHtml(withIds, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      code: ["class"],
      span: ["class"],
      blockquote: ["cite"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

export function renderInline(markdown: string) {
  return sanitizeHtml(marked.parseInline(markdown || "", { async: false }) as string, {
    allowedTags: ["strong", "em", "del", "code", "a"],
    allowedAttributes: { a: ["href", "rel", "target"] },
  });
}
