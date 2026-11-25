"use server";

import { revalidatePath } from "next/cache";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, backWith, formBool, formInt, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";
import { localInputToSql, slugify, uniqueSlug } from "@/lib/utils";

const LIBRARY_TYPES = new Set(["ebook", "estudo", "devocional", "podcast"]);

function cleanUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) return trimmed.slice(0, 600);
  return "";
}

function refreshLibrary() {
  revalidatePath("/biblioteca");
  revalidatePath("/admin/biblioteca");
  revalidatePath("/");
}

export async function saveLibraryItemAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const title = formText(formData, "title", 180);
  const subtitle = formText(formData, "subtitle", 220);
  const author = formText(formData, "author", 120);
  const type = formText(formData, "type", 30) || "ebook";
  const description = formText(formData, "description", 3000);
  const coverImage = cleanUrl(formText(formData, "cover_image", 600));
  const fileUrl = cleanUrl(formText(formData, "file_url", 600));
  const externalUrl = cleanUrl(formText(formData, "external_url", 600));
  const pages = Math.max(0, formInt(formData, "pages"));
  const featured = formBool(formData, "featured") ? 1 : 0;
  const publishedAt = localInputToSql(formText(formData, "published_at", 40));

  if (title.length < 3) backWith("/admin/biblioteca", { erro: "Informe o título do material." });
  if (!LIBRARY_TYPES.has(type)) backWith("/admin/biblioteca", { erro: "Tipo de material inválido." });

  const slug = await uniqueSlug(formText(formData, "slug", 120) || title, async (candidate) =>
    Boolean(
      await queryOne<{ id: number }>("SELECT id FROM library_items WHERE slug = ? AND id <> ?", [candidate, id || 0]),
    ),
  );

  if (id) {
    const exists = await queryOne<{ id: number }>("SELECT id FROM library_items WHERE id = ?", [id]);
    if (!exists) backWith("/admin/biblioteca", { erro: "Material não encontrado." });
    await execute(
      `UPDATE library_items SET slug = ?, title = ?, subtitle = ?, author = ?, type = ?, description = ?,
              cover_image = ?, file_url = ?, external_url = ?, pages = ?, featured = ?, published_at = ?
        WHERE id = ?`,
      [slug, title, subtitle, author, type, description, coverImage, fileUrl, externalUrl, pages, featured, publishedAt, id],
    );
    await logAudit({ userId: user.id, action: "library.update", entity: "library", entityId: id, details: title });
  } else {
    const newId = await insert(
      `INSERT INTO library_items
        (slug, title, subtitle, author, type, description, cover_image, file_url, external_url, pages, featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title, subtitle, author, type, description, coverImage, fileUrl, externalUrl, pages, featured, publishedAt],
    );
    await logAudit({ userId: user.id, action: "library.create", entity: "library", entityId: newId, details: title });
  }

  refreshLibrary();
  backWith("/admin/biblioteca", { ok: id ? "Material atualizado." : "Material adicionado à biblioteca." });
}

export async function deleteLibraryItemAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const item = await queryOne<{ id: number; title: string }>("SELECT id, title FROM library_items WHERE id = ?", [id]);
  if (!item) backWith("/admin/biblioteca", { erro: "Material não encontrado." });
  await execute("DELETE FROM library_items WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "library.delete", entity: "library", entityId: id, details: item.title });
  refreshLibrary();
  backWith("/admin/biblioteca", { ok: "Material excluído." });
}

/* ----------------------------------------------------------------- reading plans */

function refreshPlans() {
  revalidatePath("/biblioteca");
  revalidatePath("/biblioteca/planos");
  revalidatePath("/admin/planos");
  revalidatePath("/");
}

export async function savePlanAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const title = formText(formData, "title", 180);
  const description = formText(formData, "description", 3000);
  const featured = formBool(formData, "featured") ? 1 : 0;
  const coverImage = cleanUrl(formText(formData, "cover_image", 600));

  const titles = formData.getAll("day_title").map((value) => String(value).trim().slice(0, 160));
  const passages = formData.getAll("day_passage").map((value) => String(value).trim().slice(0, 160));
  const reflections = formData.getAll("day_reflection").map((value) => String(value).slice(0, 3000));

  const days = titles
    .map((dayTitle, index) => ({
      title: dayTitle,
      passage: passages[index] ?? "",
      reflection: reflections[index] ?? "",
    }))
    .filter((day) => day.title || day.passage || day.reflection);

  if (title.length < 3) backWith("/admin/planos", { erro: "Informe o título do plano." });
  if (days.length === 0) backWith("/admin/planos", { erro: "Adicione pelo menos um dia de leitura." });

  const slug = await uniqueSlug(formText(formData, "slug", 120) || title, async (candidate) =>
    Boolean(
      await queryOne<{ id: number }>("SELECT id FROM reading_plans WHERE slug = ? AND id <> ?", [candidate, id || 0]),
    ),
  );

  let planId = id;
  if (id) {
    const exists = await queryOne<{ id: number }>("SELECT id FROM reading_plans WHERE id = ?", [id]);
    if (!exists) backWith("/admin/planos", { erro: "Plano não encontrado." });
    await execute(
      "UPDATE reading_plans SET slug = ?, title = ?, description = ?, days_count = ?, cover_image = ?, featured = ? WHERE id = ?",
      [slug, title, description, days.length, coverImage, featured, id],
    );
    await execute("DELETE FROM reading_plan_days WHERE plan_id = ?", [id]);
    await logAudit({ userId: user.id, action: "plan.update", entity: "plan", entityId: id, details: title });
  } else {
    planId = await insert(
      "INSERT INTO reading_plans (slug, title, description, days_count, cover_image, featured) VALUES (?, ?, ?, ?, ?, ?)",
      [slug, title, description, days.length, coverImage, featured],
    );
    await logAudit({ userId: user.id, action: "plan.create", entity: "plan", entityId: planId, details: title });
  }

  for (let index = 0; index < days.length; index += 1) {
    const day = days[index];
    await execute(
      "INSERT INTO reading_plan_days (plan_id, day, title, passage, reflection) VALUES (?, ?, ?, ?, ?)",
      [planId, index + 1, day.title || `Dia ${index + 1}`, day.passage, day.reflection],
    );
  }

  refreshPlans();
  revalidatePath(`/biblioteca/planos/${slug}`);
  backWith("/admin/planos", { ok: id ? "Plano atualizado." : "Plano de leitura criado." });
}

export async function deletePlanAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const plan = await queryOne<{ id: number; title: string }>("SELECT id, title FROM reading_plans WHERE id = ?", [id]);
  if (!plan) backWith("/admin/planos", { erro: "Plano não encontrado." });
  await execute("DELETE FROM reading_plans WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "plan.delete", entity: "plan", entityId: id, details: plan.title });
  refreshPlans();
  backWith("/admin/planos", { ok: "Plano excluído." });
}
