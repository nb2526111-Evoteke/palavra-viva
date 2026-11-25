import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/lib/db";

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dir = path.join(process.cwd(), "backups");
fs.mkdirSync(dir, { recursive: true });

const target = path.join(dir, `app-${stamp}.db`);
const sqlPath = target.replace(/\\/g, "/").replace(/'/g, "''");

const db = getDb();
db.exec(`VACUUM INTO '${sqlPath}'`);
db.close();

console.log(`Backup do banco criado em: ${target}`);
console.log("Inclua também a pasta data/uploads em uma cópia separada.");
