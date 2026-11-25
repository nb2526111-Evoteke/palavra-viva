import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { BIBLE_BOOKS } from "../../src/lib/bible-books";
import { getDb } from "../../src/lib/db";

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

export function importBible(options: { force?: boolean } = {}): ImportResult {
  const sourcePath = path.join(process.cwd(), "data", "source", "almeida-livre.sqlite");
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Arquivo de origem não encontrado em ${sourcePath}.\n` +
        "Baixe a Bíblia Livre em data/source/almeida-livre.sqlite antes de importar.",
    );
  }

  const app = getDb();
  const existing = app.prepare("SELECT COUNT(*) AS total FROM bible_verses").get() as { total: number };
  if (existing.total > 0 && !options.force) {
    return { books: BIBLE_BOOKS.length, verses: existing.total, source: sourcePath, skipped: true };
  }

  const source = new DatabaseSync(sourcePath, { readOnly: true });

  try {
    const count = source.prepare("SELECT COUNT(*) AS total FROM verses").get() as { total: number };
    if (!count || count.total === 0) {
      throw new Error("O arquivo de origem não contém versículos na tabela 'verses'.");
    }

    app.exec("BEGIN IMMEDIATE");
    try {
      app.exec("DELETE FROM bible_verses");
      app.exec("DELETE FROM bible_books");

      const insertBook = app.prepare(
        `INSERT INTO bible_books (id, name, slug, abbrev, testament, position, chapters)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const book of BIBLE_BOOKS) {
        insertBook.run(book.id, book.name, book.slug, book.abbrev, book.testament, book.position, book.chapters);
      }

      const insertVerse = app.prepare(
        `INSERT INTO bible_verses (book_id, chapter, verse, text, search_text)
         VALUES (?, ?, ?, ?, ?)`,
      );

      let inserted = 0;
      const rows = source
        .prepare("SELECT book_id, chapter, number, text FROM verses ORDER BY book_id, chapter, number")
        .iterate();
      for (const row of rows) {
        const text = String(row.text ?? "").trim();
        if (!text) continue;
        insertVerse.run(Number(row.book_id), Number(row.chapter), Number(row.number), text, normalize(text));
        inserted += 1;
      }

      app
        .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('bible_imported_at', ?)")
        .run(new Date().toISOString());
      app.exec("COMMIT");

      return {
        books: BIBLE_BOOKS.length,
        verses: inserted,
        source: sourcePath,
        skipped: false,
      };
    } catch (error) {
      app.exec("ROLLBACK");
      throw error;
    }
  } finally {
    source.close();
  }
}
