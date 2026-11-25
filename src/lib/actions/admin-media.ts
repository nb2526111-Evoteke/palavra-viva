"use server";

import { revalidatePath } from "next/cache";
import { execute, queryOne } from "@/lib/db";
import { adminSession, backWith, formInt, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";
import { removeUpload, saveUpload } from "@/lib/uploads";

export async function uploadMediaAction(formData: FormData) {
  const user = await adminSession();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length === 0) backWith("/admin/midia", { erro: "Selecione pelo menos um arquivo." });
  const totalBytes = files.reduce((total, file) => total + file.size, 0);
  if (totalBytes > 4.5 * 1024 * 1024) {
    backWith("/admin/midia", { erro: "Envie no máximo 4,5 MB por vez." });
  }

  let uploaded = 0;
  const failures: string[] = [];
  for (const file of files.slice(0, 12)) {
    try {
      await saveUpload(file, formText(formData, "alt", 240));
      uploaded += 1;
    } catch (error) {
      failures.push(`${file.name}: ${error instanceof Error ? error.message : "falha no envio"}`);
    }
  }

  if (uploaded > 0) {
    await logAudit({ userId: user.id, action: "media.upload", entity: "media", details: `${uploaded} arquivo(s)` });
  }
  revalidatePath("/admin/midia");
  if (uploaded === 0) {
    backWith("/admin/midia", { erro: failures[0] ?? "Não foi possível enviar os arquivos." });
  }
  backWith("/admin/midia", {
    ok: `${uploaded} ${uploaded === 1 ? "arquivo enviado" : "arquivos enviados"}.${failures.length ? ` ${failures.length} falhou.` : ""}`,
  });
}

export async function deleteMediaAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const item = await queryOne<{ id: number; filename: string; original_name: string }>(
    "SELECT id, filename, original_name FROM media WHERE id = ?",
    [id],
  );
  if (!item) backWith("/admin/midia", { erro: "Arquivo não encontrado." });

  await removeUpload(item.filename);
  await execute("DELETE FROM media WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "media.delete", entity: "media", entityId: id, details: item.original_name });
  revalidatePath("/admin/midia");
  backWith("/admin/midia", { ok: "Arquivo excluído." });
}

export async function updateMediaAltAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const alt = formText(formData, "alt", 240);
  await execute("UPDATE media SET alt = ? WHERE id = ?", [alt, id]);
  await logAudit({ userId: user.id, action: "media.alt", entity: "media", entityId: id, details: alt });
  revalidatePath("/admin/midia");
  backWith("/admin/midia", { ok: "Texto alternativo atualizado." });
}
