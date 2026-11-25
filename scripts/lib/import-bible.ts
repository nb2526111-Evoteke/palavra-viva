import fs from "node:fs";
import path from "node:path";
import { createClient, type InStatement } from "@libsql/client";
import { BIBLE_BOOKS } from "../../src/lib/bible-books";
import { getDbClient, getDbUrl, getDbAuthToken, setupRemoteSchema } from "../../src/lib/db";

export type ImportResult = {
  books: number;
  verses: number;
  source: string;
  skipped: boolean;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function chunks<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

export async function importBible(options: { force?: boolean } = {}): Promise<ImportResult> {
  const sourcePath = path.join(process.cwd(), "data", "source", "almeida-livre.sqlite");
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Arquivo de origem não encontrado em ${sourcePath}.\n` +
        "Baixe a Bíblia Livre em data/source/almeida-livre.sqlite antes de importar.",
    );
  }

  await setupRemoteSchema();
  const target = getDbClient();
  const existing = await target.execute("SELECT COUNT(*) AS total FROM bible_verses");
  const existingTotal = Number(existing.rows[0]?.total ?? 0);
  if (existingTotal > 0 && !options.force) {
    return { books: BIBLE_BOOKS.length, verses: existingTotal, source: sourcePath, skipped: true };
  }

  const source = createClient({ url: `file:${sourcePath.replace(/\\/g, "/")}` });

  try {
    const count = await source.execute("SELECT COUNT(*) AS total FROM verses");
    if (Number(count.rows[0]?.total ?? 0) === 0) {
      throw new Error("O arquivo de origem não contém versículos na tabela 'verses'.");
    }

    await target.batch(["DELETE FROM bible_verses", "DELETE FROM bible_books"], "write");

    const bookStatements: InStatement[] = BIBLE_BOOKS.map((book) => ({
      sql: `INSERT INTO bible_books (id, name, slug, abbrev, testament, position, chapters)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [book.id, book.name, book.slug, book.abbrev, book.testament, book.position, book.chapters],
    }));
    for (const group of chunks(bookStatements, 300)) {
      await target.batch(group, "write");
    }

    const rows = await source.execute(
      "SELECT book_id, chapter, number, text FROM verses ORDER BY book_id, chapter, number",
    );

    let inserted = 0;
    const statements: InStatement[] = [];
    for (const row of rows.rows) {
      const text = String(row.text ?? "").trim();
      if (!text) continue;
      statements.push({
        sql: `INSERT INTO bible_verses (book_id, chapter, verse, text, search_text)
              VALUES (?, ?, ?, ?, ?)`,
        args: [Number(row.book_id), Number(row.chapter), Number(row.number), text, normalize(text)],
      });
      inserted += 1;
    }

    for (const group of chunks(statements, 400)) {
      await target.batch(group, "write");
    }

    await target.execute({
      sql: "INSERT OR REPLACE INTO settings (key, value) VALUES ('bible_imported_at', ?)",
      args: [new Date().toISOString()],
    });

    return {
      books: BIBLE_BOOKS.length,
      verses: inserted,
      source: sourcePath,
      skipped: false,
    };
  } finally {
    source.close();
  }
}

export async function describeTarget() {
  const url = getDbUrl();
  return getDbAuthToken() ? `${url} (autenticado)` : url;
}
