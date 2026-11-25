import path from "node:path";
import { loadEnv } from "./lib/env";
import { getDb } from "../src/lib/db";
import { importBible } from "./lib/import-bible";
import { BIBLE_BOOKS } from "../src/lib/bible-books";

loadEnv();

try {
  const db = getDb();
  const count = (table: string) => {
    const row = db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as { total: number };
    return row?.total ?? 0;
  };

  let bibleVerses = count("bible_verses");
  let bibleNote = "";

  if (bibleVerses === 0) {
    console.log("  Importando a Bíblia completa (isso pode levar alguns segundos)…");
    const result = importBible({ force: true });
    bibleVerses = result.verses;
    bibleNote = " (importada agora)";
  }

  const admin = db.prepare("SELECT name, email FROM users ORDER BY id LIMIT 1").get() as
    | { name: string; email: string }
    | undefined;

  console.log("");
  console.log("  Palavra Viva — banco de dados pronto.");
  console.log("  ------------------------------------------------");
  console.log(`  Banco:        ${path.join(process.cwd(), "data", "app.db")}`);
  console.log(`  Administrador: ${admin ? `${admin.name} <${admin.email}>` : "não encontrado"}`);
  console.log(`  Artigos:      ${count("posts")} (${count("categories")} categorias)`);
  console.log(`  Temas:        ${count("themes")}`);
  console.log(`  Biblioteca:   ${count("library_items")} materiais · ${count("reading_plans")} planos`);
  console.log(`  Bíblia:       ${count("bible_books") || BIBLE_BOOKS.length} livros · ${bibleVerses.toLocaleString("pt-BR")} versículos${bibleNote}`);
  console.log(`  Newsletter:   ${count("newsletter_subscribers")} inscritos`);
  console.log("  ------------------------------------------------");
  console.log("  A senha do administrador está no arquivo .env.");
  console.log("  Próximo passo: npm run dev");
  console.log("");
} catch (error) {
  console.error("");
  console.error("  Falha ao preparar o banco de dados.");
  console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
}
