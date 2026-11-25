import { BIBLE_BOOKS } from "./bible-books";
import { queryAll } from "./db";

export type ResolvedVerseItem = {
  verse: number;
  text: string;
};

export type ResolvedVerse = {
  reference: string;
  text: string;
  href: string;
  bookSlug: string;
  bookName: string;
  chapter: number;
  found: boolean;
  items: ResolvedVerseItem[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const BOOK_ALIASES = new Map<string, { slug: string; name: string }>();

for (const book of BIBLE_BOOKS) {
  const entry = { slug: book.slug, name: book.name };
  BOOK_ALIASES.set(normalize(book.name), entry);
  BOOK_ALIASES.set(normalize(book.abbrev), entry);
  BOOK_ALIASES.set(normalize(book.slug.replace(/-/g, " ")), entry);
}

const EXTRA_ALIASES: Record<string, string> = {
  salmo: "salmos",
  "cantico dos canticos": "canticos",
  "canticos dos canticos": "canticos",
  "atos dos apostolos": "atos",
  "apocalipse de joao": "apocalipse",
  "1 samuel": "1-samuel",
  "2 samuel": "2-samuel",
  "1 reis": "1-reis",
  "2 reis": "2-reis",
  "1 corintios": "1-corintios",
  "2 corintios": "2-corintios",
  "1 tessalonicenses": "1-tessalonicenses",
  "2 tessalonicenses": "2-tessalonicenses",
  "1 timoteo": "1-timoteo",
  "2 timoteo": "2-timoteo",
  "1 pedro": "1-pedro",
  "2 pedro": "2-pedro",
  "1 joao": "1-joao",
  "2 joao": "2-joao",
  "3 joao": "3-joao",
};

for (const [alias, slug] of Object.entries(EXTRA_ALIASES)) {
  const book = BIBLE_BOOKS.find((item) => item.slug === slug);
  if (book) BOOK_ALIASES.set(normalize(alias), { slug: book.slug, name: book.name });
}

type ParsedReference = {
  book: { slug: string; name: string };
  chapter: number;
  start: number;
  end: number;
};

export function parseReference(input: string): ParsedReference | null {
  const cleaned = input.trim().replace(/\s+/g, " ");
  const match = /^(.+?)\s+(\d+)(?::(\d+)(?:\s*-\s*(\d+))?)?$/.exec(cleaned);
  if (!match) return null;

  const book = BOOK_ALIASES.get(normalize(match[1]));
  if (!book) return null;

  const chapter = Number.parseInt(match[2], 10);
  const start = match[3] ? Number.parseInt(match[3], 10) : 1;
  const end = match[4] ? Number.parseInt(match[4], 10) : start;
  if (!Number.isFinite(chapter) || chapter < 1 || !Number.isFinite(start) || start < 1 || end < start) {
    return null;
  }

  return { book, chapter, start, end };
}

const cache = new Map<string, ResolvedVerse>();

export async function resolveVerseReference(input: string): Promise<ResolvedVerse> {
  const key = input.trim().replace(/\s+/g, " ");
  const cached = cache.get(key);
  if (cached) return cached;

  const parsed = parseReference(key);
  if (!parsed) {
    const fallback: ResolvedVerse = {
      reference: key,
      text: "Referência não reconhecida.",
      href: "/biblia",
      bookSlug: "",
      bookName: "",
      chapter: 1,
      found: false,
      items: [],
    };
    cache.set(key, fallback);
    return fallback;
  }

  const rows = await queryAll<ResolvedVerseItem>(
    `SELECT v.verse, v.text
       FROM bible_verses v
       JOIN bible_books b ON b.id = v.book_id
      WHERE b.slug = ? AND v.chapter = ? AND v.verse >= ? AND v.verse <= ?
      ORDER BY v.verse ASC`,
    [parsed.book.slug, parsed.chapter, parsed.start, parsed.end],
  );

  const href = `/biblia/${parsed.book.slug}/${parsed.chapter}`;
  const reference =
    parsed.start === 1 && parsed.end === 1 && !key.includes(":")
      ? `${parsed.book.name} ${parsed.chapter}`
      : `${parsed.book.name} ${parsed.chapter}:${parsed.start}${
          parsed.end !== parsed.start ? `-${parsed.end}` : ""
        }`;

  const resolved: ResolvedVerse = {
    reference,
    text: rows.length ? rows.map((row) => row.text).join(" ") : "Texto bíblico não encontrado.",
    href,
    bookSlug: parsed.book.slug,
    bookName: parsed.book.name,
    chapter: parsed.chapter,
    found: rows.length > 0,
    items: rows,
  };

  cache.set(key, resolved);
  return resolved;
}

export async function resolveVerseReferences(inputs: string[]): Promise<ResolvedVerse[]> {
  const unique = Array.from(new Set(inputs.map((item) => item.trim()).filter(Boolean)));
  return Promise.all(unique.map(resolveVerseReference));
}

type AliasEntry = { alias: string; book: { slug: string; name: string } };

const EXTRACTION_ALIASES = new Map<string, { slug: string; name: string }>();

for (const book of BIBLE_BOOKS) {
  const entry = { slug: book.slug, name: book.name };
  for (const alias of [book.name, book.abbrev, book.slug.replace(/-/g, " ")]) {
    EXTRACTION_ALIASES.set(alias.toLowerCase(), entry);
  }
}

for (const [alias, slug] of Object.entries(EXTRA_ALIASES)) {
  const book = BIBLE_BOOKS.find((item) => item.slug === slug);
  if (book) EXTRACTION_ALIASES.set(alias.toLowerCase(), { slug: book.slug, name: book.name });
}

const ALIAS_ENTRIES: AliasEntry[] = [...EXTRACTION_ALIASES.entries()]
  .map(([alias, book]) => ({ alias, book }))
  .sort((a, b) => b.alias.length - a.alias.length);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Finds references written inside a free-form theme, such as
 * "A promessa de um lugar — João 14:1,3" and returns canonical ranges
 * ("João 14:1-3") that can be resolved by resolveVerseReference.
 */
export function findThemeReferences(text: string): string[] {
  if (!text.trim()) return [];
  const pattern = new RegExp(
    `(?:^|[^\\p{L}\\p{N}])(${ALIAS_ENTRIES.map((entry) => escapeRegex(entry.alias)).join("|")})\\s+(\\d{1,3})(?::(\\d{1,3}(?:\\s*[,;]\\s*\\d{1,3}|\\s*-\\s*\\d{1,3})*))?`,
    "giu",
  );
  const found = new Set<string>();

  for (const match of text.matchAll(pattern)) {
    const alias = match[1];
    const book = EXTRACTION_ALIASES.get(alias.toLowerCase());
    if (!book) continue;

    const chapter = Number.parseInt(match[2], 10);
    const verseExpression = match[3];
    if (!verseExpression) continue;

    const numbers: number[] = [];
    for (const part of verseExpression.split(/[,;]/)) {
      const range = /^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(part);
      if (!range) continue;
      const start = Number.parseInt(range[1], 10);
      const end = range[2] ? Number.parseInt(range[2], 10) : start;
      if (!Number.isFinite(start) || start < 1 || !Number.isFinite(end) || end < start) continue;
      numbers.push(start, end);
    }
    if (numbers.length === 0) continue;

    const start = Math.min(...numbers);
    const end = Math.max(...numbers);
    found.add(`${book.name} ${chapter}:${start}${end > start ? `-${end}` : ""}`);
    if (found.size >= 5) break;
  }

  return [...found];
}

