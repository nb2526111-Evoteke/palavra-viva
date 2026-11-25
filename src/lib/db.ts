import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "./schema";
import { seedDatabase } from "./seed";

type DbGlobal = typeof globalThis & { __palavraVivaDb?: DatabaseSync };

export type DbParam = string | number | bigint | null | Uint8Array;

export function getDb(): DatabaseSync {
  const globalRef = globalThis as DbGlobal;
  if (globalRef.__palavraVivaDb) return globalRef.__palavraVivaDb;

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), "data", "uploads"), { recursive: true });

  const db = new DatabaseSync(path.join(dataDir, "app.db"));
  db.exec("PRAGMA busy_timeout = 8000;");
  db.exec(SCHEMA_SQL);
  db.exec("PRAGMA foreign_keys = ON;");
  seedDatabase(db);

  globalRef.__palavraVivaDb = db;
  return db;
}

/**
 * As funções de acesso são assíncronas para manter a mesma interface usada
 * pelas páginas e Server Actions. O SQLite local executa de forma síncrona.
 */
export async function queryAll<T>(sql: string, params: DbParam[] = []): Promise<T[]> {
  const rows = getDb()
    .prepare(sql)
    .all(...params);
  return rows.map((row) => ({ ...row })) as T[];
}

export async function queryOne<T>(sql: string, params: DbParam[] = []): Promise<T | null> {
  const row = getDb()
    .prepare(sql)
    .get(...params);
  return row ? ({ ...row } as T) : null;
}

export async function execute(sql: string, params: DbParam[] = []) {
  return getDb()
    .prepare(sql)
    .run(...params);
}

export async function insert(sql: string, params: DbParam[] = []) {
  const result = getDb()
    .prepare(sql)
    .run(...params);
  return Number(result.lastInsertRowid);
}

export function transaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
