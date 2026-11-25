import path from "node:path";
import { loadEnv } from "./lib/env";
import { isRemoteDatabase, queryOne, setupRemoteSchema, getDbUrl } from "../src/lib/db";
import { importBible, type ImportResult } from "./lib/import-bible";
import { BIBLE_BOOKS } from "../src/lib/bible-books";

loadEnv();

async function count(table: string) {
  const row = await queryOne<{ total: number }>(`SELECT COUNT(*) AS total FROM ${table}`);
  return Number(row?.total ?? 0);
}

async function main() {
  await setupRemoteSchema();

  let bibleVerses = await count("bible_verses");
  let bibleNote = "";

  if (bibleVerses === 0) {
    console.log("  Importando a Bíblia completa (isso pode levar alguns segundos)…");
    const result: ImportResult = await importBible({ force: true });
    bibleVerses = result.verses;
    bibleNote = " (importada agora)";
  }

  const admin = await queryOne<{ name: string; email: string }>(
    "SELECT name, email FROM users ORDER BY id LIMIT 1",
  );

  console.log("");
  console.log("  Palavra Viva — banco de dados pronto.");
  console.log("  ------------------------------------------------");
  console.log(`  Banco:        ${isRemoteDatabase() ? getDbUrl() : path.join(process.cwd(), "data", "app.db")}`);
  console.log(`  Administrador: ${admin ? `${admin.name} <${admin.email}>` : "não encontrado"}`);
  console.log(`  Artigos:      ${await count("posts")} (${await count("categories")} categorias)`);
  console.log(`  Temas:        ${await count("themes")}`);
  console.log(`  Biblioteca:   ${await count("library_items")} materiais · ${await count("reading_plans")} planos`);
  console.log(
    `  Bíblia:       ${(await count("bible_books")) || BIBLE_BOOKS.length} livros · ${bibleVerses.toLocaleString("pt-BR")} versículos${bibleNote}`,
  );
  console.log(`  Newsletter:   ${await count("newsletter_subscribers")} inscritos`);
  console.log("  ------------------------------------------------");
  console.log("  A senha do administrador está no arquivo .env.");
  console.log("  Próximo passo: npm run dev");
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("  Falha ao preparar o banco de dados.");
  console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
});
