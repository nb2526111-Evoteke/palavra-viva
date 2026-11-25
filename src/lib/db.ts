import fs from "node:fs";
import path from "node:path";
import { createClient, type Client, type InValue, type Transaction } from "@libsql/client";
import { SCHEMA_SQL } from "./schema";
import { seedDatabase } from "./seed";

type DbGlobal = typeof globalThis & {
  __palavraVivaClient?: Client;
  __palavraVivaReady?: Promise<void>;
};

export type DbParam = InValue;

function remoteUrl() {
  return (process.env.TURSO_DATABASE_URL || "").trim();
}

export function isRemoteDatabase() {
  return remoteUrl().length > 0;
}

export function getDbUrl() {
  return remoteUrl() || "file:data/app.db";
}

export function getDbAuthToken() {
  return process.env.TURSO_AUTH_TOKEN || "";
}

export function getDbClient() {
  return getClient();
}

function getClient(): Client {
  const globalRef = globalThis as DbGlobal;
  if (globalRef.__palavraVivaClient) return globalRef.__palavraVivaClient;

  const url = remoteUrl() || "file:data/app.db";
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    intMode: "number",
    timeout: 8000,
  });

  globalRef.__palavraVivaClient = client;
  return client;
}

async function ensureReady() {
  const globalRef = globalThis as DbGlobal;
  if (globalRef.__palavraVivaReady) return globalRef.__palavraVivaReady;

  globalRef.__palavraVivaReady = (async () => {
    const client = getClient();

    if (!isRemoteDatabase()) {
      fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
      fs.mkdirSync(path.join(process.cwd(), "data", "uploads"), { recursive: true });
      await client.execute("PRAGMA journal_mode = WAL");
      await client.execute("PRAGMA foreign_keys = ON");
    }

    await client.executeMultiple(SCHEMA_SQL);

    if (!isRemoteDatabase()) {
      await seedDatabase(client);
    }
  })();

  try {
    await globalRef.__palavraVivaReady;
  } catch (error) {
    globalRef.__palavraVivaReady = undefined;
    throw error;
  }
}

export async function queryAll<T>(sql: string, params: DbParam[] = []): Promise<T[]> {
  await ensureReady();
  const result = await getClient().execute({ sql, args: params });
  return result.rows.map((row) => ({ ...row })) as T[];
}

export async function queryOne<T>(sql: string, params: DbParam[] = []): Promise<T | null> {
  const rows = await queryAll<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: DbParam[] = []) {
  await ensureReady();
  return getClient().execute({ sql, args: params });
}

export async function insert(sql: string, params: DbParam[] = []) {
  const result = await execute(sql, params);
  return Number(result.lastInsertRowid ?? 0);
}

export async function transaction<T>(fn: (client: Transaction) => Promise<T>): Promise<T> {
  await ensureReady();
  const tx = await getClient().transaction("write");
  try {
    const result = await fn(tx);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}

export async function setupRemoteSchema() {
  const client = getClient();
  await client.executeMultiple(SCHEMA_SQL);
  if (process.env.SEED_REMOTE === "1") {
    await seedDatabase(client);
  }
}
