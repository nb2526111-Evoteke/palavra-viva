"use server";

import { revalidatePath } from "next/cache";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, backWith, formInt, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";
import { isHexColor, slugify, uniqueSlug } from "@/lib/utils";

function refresh() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/artigos");
}

export async function saveCategoryAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const name = formText(formData, "name", 80);
  const description = formText(formData, "description", 400);
  const color = formText(formData, "color", 20) || "#a4542f";
  const icon = formText(formData, "icon", 40) || "book-open";

  if (name.length < 2) backWith("/admin/categorias", { erro: "Informe o nome da categoria." });
  if (!isHexColor(color)) backWith("/admin/categorias", { erro: "Use uma cor no formato #a4542f." });

  const requested = formText(formData, "slug", 100);
  const slug = await uniqueSlug(requested || name, async (candidate) =>
    Boolean(
      await queryOne<{ id: number }>("SELECT id FROM categories WHERE slug = ? AND id <> ?", [candidate, id || 0]),
    ),
  );

  if (id) {
    const exists = await queryOne<{ id: number }>("SELECT id FROM categories WHERE id = ?", [id]);
    if (!exists) backWith("/admin/categorias", { erro: "Categoria não encontrada." });
    await execute("UPDATE categories SET name = ?, slug = ?, description = ?, color = ?, icon = ? WHERE id = ?", [
      name,
      slug,
      description,
      color,
      icon,
      id,
    ]);
    await logAudit({ userId: user.id, action: "category.update", entity: "category", entityId: id, details: name });
  } else {
    const newId = await insert(
      "INSERT INTO categories (name, slug, description, color, icon) VALUES (?, ?, ?, ?, ?)",
      [name, slug, description, color, icon],
    );
    await logAudit({ userId: user.id, action: "category.create", entity: "category", entityId: newId, details: name });
  }

  refresh();
  backWith("/admin/categorias", { ok: id ? "Categoria atualizada." : "Categoria criada." });
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const category = await queryOne<{ id: number; name: string }>("SELECT id, name FROM categories WHERE id = ?", [id]);
  if (!category) backWith("/admin/categorias", { erro: "Categoria não encontrada." });
  await execute("DELETE FROM categories WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "category.delete", entity: "category", entityId: id, details: category.name });
  refresh();
  backWith("/admin/categorias", { ok: "Categoria excluída. Os artigos ficaram sem categoria." });
}
