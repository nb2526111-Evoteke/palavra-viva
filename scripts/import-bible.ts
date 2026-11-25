import { loadEnv } from "./lib/env";
import { importBible } from "./lib/import-bible";

loadEnv();

try {
  const result = importBible({ force: true });
  console.log("");
  console.log("  Bíblia importada com sucesso.");
  console.log(`  Livros:     ${result.books}`);
  console.log(`  Versículos: ${result.verses.toLocaleString("pt-BR")}`);
  console.log(`  Origem:     ${result.source}`);
  console.log("");
  console.log("  Abra /biblia no site para conferir.");
  console.log("");
} catch (error) {
  console.error("");
  console.error("  Não foi possível importar a Bíblia.");
  console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
}
