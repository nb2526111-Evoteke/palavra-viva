"use server";

import { revalidatePath } from "next/cache";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, backWith, formInt, formText, isValidEmail } from "@/lib/admin";
import { logAudit } from "@/lib/queries";

/* --------------------------------------------------------------- newsletter */

export async function addSubscriberAction(formData: FormData) {
  const user = await adminSession();
  const email = formText(formData, "email", 160).toLowerCase();
  const name = formText(formData, "name", 100);
  if (!isValidEmail(email)) backWith("/admin/newsletter", { erro: "Informe um e-mail válido." });

  const existing = await queryOne<{ id: number }>("SELECT id FROM newsletter_subscribers WHERE email = ? COLLATE NOCASE", [email]);
  if (existing) {
    await execute("UPDATE newsletter_subscribers SET status = 'active', name = CASE WHEN ? <> '' THEN ? ELSE name END WHERE id = ?", [
      name,
      name,
      existing.id,
    ]);
    backWith("/admin/newsletter", { ok: "Inscrito reativado." });
  }

  await insert("INSERT INTO newsletter_subscribers (email, name, source, status) VALUES (?, ?, 'manual', 'active')", [
    email,
    name,
  ]);
  await logAudit({ userId: user.id, action: "newsletter.add", entity: "subscriber", details: email });
  revalidatePath("/admin/newsletter");
  backWith("/admin/newsletter", { ok: "Inscrito adicionado." });
}

export async function toggleSubscriberAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const subscriber = await queryOne<{ id: number; email: string; status: string }>(
    "SELECT id, email, status FROM newsletter_subscribers WHERE id = ?",
    [id],
  );
  if (!subscriber) backWith("/admin/newsletter", { erro: "Inscrito não encontrado." });
  const next = subscriber.status === "active" ? "unsubscribed" : "active";
  await execute("UPDATE newsletter_subscribers SET status = ? WHERE id = ?", [next, id]);
  await logAudit({ userId: user.id, action: `newsletter.${next}`, entity: "subscriber", entityId: id, details: subscriber.email });
  revalidatePath("/admin/newsletter");
  backWith("/admin/newsletter", { ok: next === "active" ? "Inscrito reativado." : "Inscrito descadastrado." });
}

export async function deleteSubscriberAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const subscriber = await queryOne<{ id: number; email: string }>(
    "SELECT id, email FROM newsletter_subscribers WHERE id = ?",
    [id],
  );
  if (!subscriber) backWith("/admin/newsletter", { erro: "Inscrito não encontrado." });
  await execute("DELETE FROM newsletter_subscribers WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "newsletter.delete", entity: "subscriber", entityId: id, details: subscriber.email });
  revalidatePath("/admin/newsletter");
  backWith("/admin/newsletter", { ok: "Inscrito excluído." });
}

/* ------------------------------------------------------------------ messages */

const MESSAGE_STATUSES = new Set(["new", "read", "archived"]);

export async function setMessageStatusAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const status = formText(formData, "status", 20);
  if (!MESSAGE_STATUSES.has(status)) backWith("/admin/mensagens", { erro: "Situação inválida." });
  await execute("UPDATE contact_messages SET status = ? WHERE id = ?", [status, id]);
  await logAudit({ userId: user.id, action: `message.${status}`, entity: "message", entityId: id });
  revalidatePath("/admin/mensagens");
  backWith("/admin/mensagens", { ok: "Mensagem atualizada." });
}

export async function deleteMessageAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  await execute("DELETE FROM contact_messages WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "message.delete", entity: "message", entityId: id });
  revalidatePath("/admin/mensagens");
  backWith("/admin/mensagens", { ok: "Mensagem excluída." });
}

/* -------------------------------------------------------------- daily verses */

export async function saveDailyVerseAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const reference = formText(formData, "reference", 120);
  const text = formText(formData, "text", 1000);

  if (!reference || text.length < 5) backWith("/admin/biblia", { erro: "Informe a referência e o texto do versículo." });

  if (id) {
    await execute("UPDATE daily_verses SET reference = ?, text = ? WHERE id = ?", [reference, text, id]);
    await logAudit({ userId: user.id, action: "verse.update", entity: "daily_verse", entityId: id, details: reference });
  } else {
    const newId = await insert("INSERT INTO daily_verses (reference, text) VALUES (?, ?)", [reference, text]);
    await logAudit({ userId: user.id, action: "verse.create", entity: "daily_verse", entityId: newId, details: reference });
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/biblia");
  backWith("/admin/biblia", { ok: id ? "Versículo atualizado." : "Versículo adicionado à rotação diária." });
}

export async function deleteDailyVerseAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const verse = await queryOne<{ id: number; reference: string }>("SELECT id, reference FROM daily_verses WHERE id = ?", [id]);
  if (!verse) backWith("/admin/biblia", { erro: "Versículo não encontrado." });
  await execute("DELETE FROM daily_verses WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "verse.delete", entity: "daily_verse", entityId: id, details: verse.reference });
  revalidatePath("/", "layout");
  revalidatePath("/admin/biblia");
  backWith("/admin/biblia", { ok: "Versículo removido." });
}

/* --------------------------------------------------------------------- audit */

export async function clearAuditAction(formData: FormData) {
  const user = await adminSession();
  const days = Math.max(1, formInt(formData, "days") || 90);
  await execute("DELETE FROM audit_logs WHERE datetime(created_at) < datetime('now', ?)", [`-${days} days`]);
  await logAudit({
    userId: user.id,
    action: "audit.clear",
    entity: "audit",
    details: `Registros com mais de ${days} dias removidos`,
  });
  revalidatePath("/admin/auditoria");
  backWith("/admin/auditoria", { ok: `Registros com mais de ${days} dias removidos.` });
}
