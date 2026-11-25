import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";

export function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    loadEnvFile(envPath);
    return true;
  }
  return false;
}
