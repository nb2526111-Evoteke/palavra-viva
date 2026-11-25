import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";

/**
 * Carrega .env e, se existir, .env.turso.
 * Útil para scripts de setup e migração.
 */
export function loadEnv() {
  let loaded = false;
  for (const filename of [".env", ".env.turso"]) {
    const envPath = path.join(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      loadEnvFile(envPath);
      loaded = true;
    }
  }
  return loaded;
}
