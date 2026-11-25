import { loadEnv } from "./lib/env";
import { execute, insert, queryOne, setupRemoteSchema } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

loadEnv();

async function main() {
  await setupRemoteSchema();

  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "Administrador").trim();

  if (!email || !password) {
    console.error("");
    console.error("  Defina ADMIN_EMAIL e ADMIN_PASSWORD no arquivo .env antes de rodar este comando.");
    console.error("");
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("");
    console.error("  A senha em ADMIN_PASSWORD precisa ter pelo menos 10 caracteres.");
    console.error("");
    process.exit(1);
  }

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM users WHERE email = ? COLLATE NOCASE LIMIT 1",
    [email],
  );

  const fallbackAdmin = existing
    ? null
    : await queryOne<{ id: number }>("SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1");

  const hash = hashPassword(password);

  if (existing || fallbackAdmin) {
    const userId = existing?.id ?? fallbackAdmin!.id;
    await execute("UPDATE users SET name = ?, email = ?, password_hash = ?, role = 'admin' WHERE id = ?", [
      name,
      email,
      hash,
      userId,
    ]);
    await execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
    await execute(
      "INSERT INTO audit_logs (user_id, action, entity, details) VALUES (?, 'admin.reset', 'user', 'Credenciais redefinidas pelo script')",
      [userId],
    );
    console.log("");
    console.log("  Credenciais do administrador redefinidas.");
    console.log(`  E-mail: ${email}`);
    console.log("  Senha:  a definida em ADMIN_PASSWORD no .env");
    console.log("  Sessões antigas encerradas.");
    console.log("");
  } else {
    const id = await insert("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [
      name,
      email,
      hash,
    ]);
    await execute(
      "INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES (?, 'admin.create', 'user', ?, 'Administrador criado pelo script')",
      [id, String(id)],
    );
    console.log("");
    console.log("  Novo administrador criado.");
    console.log(`  E-mail: ${email}`);
    console.log("  Senha:  a definida em ADMIN_PASSWORD no .env");
    console.log("");
  }
}

main().catch((error) => {
  console.error("");
  console.error("  Falha ao redefinir o administrador.");
  console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
});
