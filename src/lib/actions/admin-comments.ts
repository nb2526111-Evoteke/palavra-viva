"use server";

import { revalidatePath } from "next/cache";
import { execute, queryOne } from "@/lib/db";
import { adminSession, backWith, formInt, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";

const STATUSES = new Set(["pending", "approved", "spam"]);

export async function setCommentStatusAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const status = formText(formData, "status", 20);
  if (!STATUSES.has(status)) backWith("/admin/comentarios", { erro: "Situação inválida." });

  const comment = await queryOne<{ id: number; post_id: number; name: string; post_slug: string }>(
    `SELECT cm.id, cm.post_id, cm.name, p.slug AS post_slug
       FROM comments cm JOIN posts p ON p.id = cm.post_id WHERE cm.id = ?`,
    [id],
  );
  if (!comment) backWith("/admin/comentarios", { erro: "Comentário não encontrado." });

  await execute("UPDATE comments SET status = ? WHERE id = ?", [status, id]);
  await logAudit({
    userId: user.id,
    action: `comment.${status}`,
    entity: "comment",
    entityId: id,
    details: `Comentário de ${comment.name}`,
  });
  revalidatePath(`/blog/${comment.post_slug}`);
  revalidatePath("/admin/comentarios");
  revalidatePath("/admin");

  const labels: Record<string, string> = {
    approved: "Comentário aprovado e publicado.",
    pending: "Comentário devolvido para moderação.",
    spam: "Comentário marcado como spam.",
  };
  backWith("/admin/comentarios", { ok: labels[status] ?? "Comentário atualizado." });
}

export async function deleteCommentAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const comment = await queryOne<{ id: number; name: string; post_slug: string }>(
    `SELECT cm.id, cm.name, p.slug AS post_slug
       FROM comments cm JOIN posts p ON p.id = cm.post_id WHERE cm.id = ?`,
    [id],
  );
  if (!comment) backWith("/admin/comentarios", { erro: "Comentário não encontrado." });

  await execute("DELETE FROM comments WHERE id = ?", [id]);
  await logAudit({
    userId: user.id,
    action: "comment.delete",
    entity: "comment",
    entityId: id,
    details: `Comentário de ${comment.name}`,
  });
  revalidatePath(`/blog/${comment.post_slug}`);
  revalidatePath("/admin/comentarios");
  backWith("/admin/comentarios", { ok: "Comentário excluído." });
}
