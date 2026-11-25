import fs from "node:fs";
import { createClient, type Client, type InStatement } from "@libsql/client";
import { loadEnv } from "./lib/env";
import { SCHEMA_SQL } from "../src/lib/schema";

loadEnv();

const TABLES = [
  "settings",
  "users",
  "categories",
  "posts",
  "tags",
  "post_tags",
  "comments",
  "library_items",
  "reading_plans",
  "reading_plan_days",
  "bible_books",
  "bible_verses",
  "daily_verses",
  "generated_themes",
  "daily_messages",
  "newsletter_subscribers",
  "contact_messages",
  "media",
  "themes",
  "post_views",
  "audit_logs",
];

const DROP_ORDER = [
  "audit_logs",
  "post_views",
  "daily_messages",
  "generated_themes",
  "reading_plan_days",
  "reading_plans",
  "media",
  "contact_messages",
  "newsletter_subscribers",
  "daily_verses",
  "bible_verses",
  "bible_books",
  "themes",
  "library_items",
  "comments",
  "post_tags",
  "tags",
  "posts",
  "categories",
  "sessions",
  "users",
  "settings",
];

const SKIP_TABLES = new Set(["sessions"]);

function chunks<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

async function tableColumns(client: Client, table: string) {
  const result = await client.execute(`PRAGMA table_info("${table}")`);
  return result.rows.map((row) => String(row.name));
}

async function countRows(client: Client, table: string) {
  const result = await client.execute(`SELECT COUNT(*) AS total FROM "${table}"`);
  return Number(result.rows[0]?.total ?? 0);
}

async function main() {
  const url = (process.env.TURSO_DATABASE_URL || "").trim();
  const token = (process.env.TURSO_AUTH_TOKEN || "").trim();
  if (!url) throw new Error("Defina TURSO_DATABASE_URL com a URL do banco Turso.");
  if (!url.startsWith("libsql://") && !url.startsWith("https://")) {
    throw new Error("TURSO_DATABASE_URL deve ser uma URL libsql:// ou https://.");
  }
  if (!token) throw new Error("Defina TURSO_AUTH_TOKEN com o token do Turso.");

  const localPath = "data/app.db";
  if (!fs.existsSync(localPath)) throw new Error("Banco local data/app.db não encontrado.");

  const local = createClient({ url: "file:data/app.db" });
  const remote = createClient({ url, authToken: token });
  const force = process.env.FORCE_MIGRATION === "1";

  const remoteUsers = await countRows(remote, "users").catch(() => 0);
  if (remoteUsers > 0 && !force) {
    throw new Error(
      `O banco remoto já tem ${remoteUsers} usuário(s). Use FORCE_MIGRATION=1 para apagar e recriar.`,
    );
  }

  if (force) {
    console.log("Apagando tabelas do banco remoto…");
    for (const table of DROP_ORDER) {
      await remote.execute(`DROP TABLE IF EXISTS "${table}"`);
    }
  }

  console.log("Criando schema no banco remoto…");
  await remote.executeMultiple(SCHEMA_SQL);

  for (const table of TABLES) {
    if (SKIP_TABLES.has(table)) continue;
    const columns = await tableColumns(local, table);
    if (columns.length === 0) {
      console.log(`- ${table}: tabela local ausente, ignorada`);
      continue;
    }

    const all = await local.execute(`SELECT * FROM "${table}"`);
    const statements: InStatement[] = all.rows.map((row) => ({
      sql: `INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(", ")})
            VALUES (${columns.map(() => "?").join(", ")})`,
      args: columns.map((column) => {
        const value = row[column];
        if (value === undefined) return null;
        if (typeof value === "bigint") return Number(value);
        return value as string | number | null | Uint8Array;
      }),
    }));

    for (const group of chunks(statements, 400)) {
      await remote.batch(group, "write");
    }
    console.log(`- ${table}: ${all.rows.length} linha(s) copiada(s)`);
  }

  console.log("\nVerificação:");
  for (const table of TABLES) {
    if (SKIP_TABLES.has(table)) continue;
    const localTotal = await countRows(local, table);
    const remoteTotal = await countRows(remote, table);
    const status = localTotal === remoteTotal ? "OK" : "DIFERENTE";
    console.log(`${status.padEnd(9)} ${table}: local ${localTotal} / remoto ${remoteTotal}`);
  }

  local.close();
  remote.close();
  console.log("\nMigração concluída.");
}

main().catch((error) => {
  console.error("Falha na migração:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
